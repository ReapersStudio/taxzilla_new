"use server";

import { serverEnv } from "@/lib/env";
import {
  contactSchema,
  newsletterSchema,
  careerSchema,
  flattenZodErrors,
  type ActionState,
} from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/security/rate-limit";
import { verifyCaptcha } from "@/lib/security/captcha";
import { validateUpload } from "@/lib/security/upload";
import { sendMail } from "@/lib/mailer";
import { addSubmission, addEnquiry, addSubscriber, saveUpload } from "@/lib/store";
import { company } from "@/lib/site";

const GENERIC_ERROR = "Something went wrong. Please try again.";

const ATTACHMENT_CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

function attachmentContentType(ext: string): string {
  return ATTACHMENT_CONTENT_TYPES[ext.toLowerCase()] ?? "application/octet-stream";
}

function safeAttachmentName(uploadedName: string, fallbackBase: string, ext: string): string {
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "") || "file";
  const base =
    uploadedName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || fallbackBase;

  return `${base}.${safeExt}`;
}

function submissionNameSlug(name: string): string {
  return (
    name
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "candidate"
  );
}

function honeypotTripped(formData: FormData): boolean {
  return String(formData.get("company_website") ?? "").trim() !== "";
}

async function limited(scope: string): Promise<ActionState | null> {
  const ip = await clientIp();
  const r = rateLimit(`${scope}:${ip}`, serverEnv.rate.max, serverEnv.rate.windowSeconds);
  if (!r.allowed) {
    return {
      ok: false,
      message: `Too many requests. Please wait ${Math.ceil(r.retryAfter / 60)} minute(s) and try again.`,
    };
  }
  return null;
}

/* ───────────────────────── Contact ───────────────────────── */
export async function submitContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (honeypotTripped(formData)) return { ok: true, message: "Thank you. We'll be in touch." };

    const blocked = await limited("contact");
    if (blocked) return blocked;

    const parsed = contactSchema.safeParse({
      fullname: formData.get("fullname"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      about: formData.get("about"),
      message: formData.get("message"),
    });
    if (!parsed.success) {
      return { ok: false, message: "Please correct the highlighted fields.", errors: flattenZodErrors(parsed.error) };
    }

    if (!(await verifyCaptcha(String(formData.get("captcha") ?? "")))) {
      return { ok: false, message: "Incorrect captcha code. Please try again.", errors: { captcha: "Incorrect code." } };
    }

    const d = parsed.data;

    // Persist first (durable).
    await addEnquiry({
      fullname: d.fullname,
      contact: d.contact,
      email: d.email,
      about: d.about ?? "",
      message: d.message ?? "",
    });

    // Notify by email (best-effort — never block the user).
    try {
      await sendMail({
        to: serverEnv.mail.contactRecipient,
        replyTo: d.email,
        subject: `New enquiry — ${d.about || "General"}`,
        text: [
          "New enquiry from the Taxzilla website contact form.",
          "",
          `Name:    ${d.fullname}`,
          `Phone:   ${d.contact}`,
          `Email:   ${d.email}`,
          `Topic:   ${d.about || "Not specified"}`,
          "",
          "Message:",
          d.message || "(none)",
        ].join("\n"),
      });
    } catch (mailErr) {
      console.error("[contact] email failed:", mailErr);
    }

    return { ok: true, message: "Thank you! Your enquiry has been sent — we'll reach out shortly." };
  } catch (err) {
    console.error("[contact] action error:", err);
    return { ok: false, message: GENERIC_ERROR };
  }
}

/* ──────────────────────── Newsletter ──────────────────────── */
export async function subscribeNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (honeypotTripped(formData)) return { ok: true, message: "Subscribed!" };

    const blocked = await limited("newsletter");
    if (blocked) return blocked;

    const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
    if (!parsed.success) {
      return { ok: false, message: "Please enter a valid email.", errors: flattenZodErrors(parsed.error) };
    }

    await addSubscriber(parsed.data.email);

    try {
      await sendMail({
        to: serverEnv.mail.newsletterRecipient,
        replyTo: parsed.data.email,
        subject: "New newsletter subscription",
        text: `New newsletter subscription request.\n\nEmail: ${parsed.data.email}`,
      });
    } catch (mailErr) {
      console.error("[newsletter] email failed:", mailErr);
    }

    return { ok: true, message: "You're subscribed. Thank you!" };
  } catch (err) {
    console.error("[newsletter] action error:", err);
    return { ok: false, message: GENERIC_ERROR };
  }
}

/* ───────────────────────── Careers ───────────────────────── */
export async function submitCareer(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (honeypotTripped(formData)) return { ok: true, message: "Application received." };

    const blocked = await limited("career");
    if (blocked) return blocked;

    const parsed = careerSchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      position: formData.get("position"),
      message: formData.get("message"),
    });
    if (!parsed.success) {
      return { ok: false, message: "Please correct the highlighted fields.", errors: flattenZodErrors(parsed.error) };
    }

    if (!(await verifyCaptcha(String(formData.get("captcha") ?? "")))) {
      return { ok: false, message: "Incorrect captcha code. Please try again.", errors: { captcha: "Incorrect code." } };
    }

    const resume = formData.get("resume");
    const photo = formData.get("photo");
    if (!(resume instanceof File) || !(photo instanceof File)) {
      return { ok: false, message: "Please attach both your resume and a photo." };
    }

    const resumeCheck = await validateUpload(resume, "resume", serverEnv.uploadMaxBytes);
    if (!resumeCheck.ok) return { ok: false, message: resumeCheck.error, errors: { resume: resumeCheck.error } };

    const photoCheck = await validateUpload(photo, "photo", serverEnv.uploadMaxBytes);
    if (!photoCheck.ok) return { ok: false, message: photoCheck.error, errors: { photo: photoCheck.error } };

    const d = parsed.data;

    const resumeFile = await saveUpload(resumeCheck.buffer, resumeCheck.ext);
    const photoFile = await saveUpload(photoCheck.buffer, photoCheck.ext);
    const resumeAttachmentName = safeAttachmentName(resume.name, `${submissionNameSlug(d.name)}-resume`, resumeCheck.ext);
    const photoAttachmentName = safeAttachmentName(photo.name, `${submissionNameSlug(d.name)}-photo`, photoCheck.ext);

    const submission = await addSubmission({
      name: d.name,
      phone: d.phone,
      email: d.email,
      message: [`Applying for: ${d.position}`, d.message].filter(Boolean).join("\n\n"),
      resumeFile,
      photoFile,
    });

    try {
      await sendMail({
        to: serverEnv.mail.careersRecipient,
        replyTo: d.email,
        subject: `New job application — ${d.name}`,
        text: [
          "A new candidate applied through the Taxzilla careers page.",
          "",
          `Ref:     ${submission.ref}`,
          `Name:    ${d.name}`,
          `Phone:   ${d.phone}`,
          `Email:   ${d.email}`,
          `Applying: ${d.position}`,
          "",
          "Message:",
          d.message || "(none)",
          "",
          "Attachments:",
          `- Resume: ${resumeAttachmentName}`,
          `- Photo:  ${photoAttachmentName}`,
        ].join("\n"),
        attachments: [
          {
            filename: resumeAttachmentName,
            content: resumeCheck.buffer,
            contentType: attachmentContentType(resumeCheck.ext),
          },
          {
            filename: photoAttachmentName,
            content: photoCheck.buffer,
            contentType: attachmentContentType(photoCheck.ext),
          },
        ],
      });
    } catch (mailErr) {
      console.error("[career] HR email failed:", mailErr);
    }

    // Acknowledgement email to the applicant.
    try {
      await sendMail({
        to: d.email,
        replyTo: company.email,
        subject: `We received your application — ${company.name}`,
        text: [
          `Hi ${d.name},`,
          "",
          `Thank you for applying to ${company.legalName}. We've received your application and our team will review it shortly.`,
          "",
          `Reference: ${submission.ref}`,
          `Applying for: ${d.position}`,
          "",
          "If your profile matches our requirements, we'll be in touch. We appreciate your interest in joining us.",
          "",
          "Warm regards,",
          `${company.name} Team`,
          company.phone,
          company.email,
        ].join("\n"),
      });
    } catch (mailErr) {
      console.error("[career] applicant email failed:", mailErr);
    }

    return { ok: true, message: "Thank you! Your application has been submitted successfully." };
  } catch (err) {
    console.error("[career] action error:", err);
    return { ok: false, message: GENERIC_ERROR };
  }
}
