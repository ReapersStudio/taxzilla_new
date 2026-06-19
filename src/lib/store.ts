import "server-only";
import crypto from "crypto";
import { supabaseAdmin, uploadBucket } from "@/lib/supabase";

/** Thrown when the Supabase tables haven't been created yet (PGRST205). */
export class TablesNotReadyError extends Error {}

/** Translate a Supabase error: missing-table → TablesNotReadyError. */
function check(error: { code?: string; message: string } | null): void {
  if (!error) return;
  if (error.code === "PGRST205" || /schema cache/i.test(error.message)) {
    throw new TablesNotReadyError(error.message);
  }
  throw new Error(error.message);
}

/**
 * Data-access layer backed by Supabase.
 *  - Structured records live in Postgres tables (candidates, contact_enquiries,
 *    newsletter_subscribers).
 *  - Uploaded files (résumé / photo) live in a PRIVATE Supabase Storage bucket;
 *    the DB only stores their object path.
 *
 * Everything goes through the service-role client, so RLS blocks all direct
 * public access to these tables and to the bucket.
 */

/* ───────────────────────── File uploads (Storage) ───────────────────────── */

/** Upload a file under a random name; returns the storage object path. */
export async function saveUpload(buffer: Buffer, ext: string): Promise<string> {
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  const objectPath = `${crypto.randomBytes(16).toString("hex")}.${safeExt}`;
  const { error } = await supabaseAdmin()
    .storage.from(uploadBucket())
    .upload(objectPath, buffer, { contentType: "application/octet-stream", upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return objectPath;
}

/** Download a stored object. Guards against path traversal. */
export async function readUpload(objectPath: string): Promise<Buffer | null> {
  const safe = objectPath.replace(/^\/+/, "");
  if (safe.includes("..") || safe.includes("/")) return null;
  const { data, error } = await supabaseAdmin().storage.from(uploadBucket()).download(safe);
  if (error || !data) return null;
  return Buffer.from(await data.arrayBuffer());
}

async function removeUpload(objectPath: string | null): Promise<void> {
  if (!objectPath) return;
  await supabaseAdmin().storage.from(uploadBucket()).remove([objectPath]).catch(() => {});
}

/* ───────────────────────── Candidates (careers) ───────────────────────── */

export type SubmissionStatus = "new" | "reviewed" | "shortlisted" | "rejected";

export type Submission = {
  id: string;
  /** Sequential reference number → displayed as TZ0001, TZ0002, … */
  refNo: number;
  ref: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  resumeFile: string | null;
  photoFile: string | null;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

type CandidateRow = {
  id: string;
  ref_no?: number | string | null;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  resume_file: string | null;
  photo_file: string | null;
  status: string;
  created_at: string;
  updated_at?: string | null;
};

/** Format a numeric ref into the public TZ#### code. */
export function formatRef(refNo: number): string {
  return `TZ${String(refNo).padStart(4, "0")}`;
}

function candidateRefNo(r: CandidateRow, fallbackRefNo = 0): number {
  const refNo = Number(r.ref_no);
  return Number.isInteger(refNo) && refNo > 0 ? refNo : fallbackRefNo;
}

function fallbackRefNoMap(rows: CandidateRow[]): Map<string, number> {
  return new Map(
    [...rows]
      .sort((a, b) => {
        const byDate = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return byDate || a.id.localeCompare(b.id);
      })
      .map((row, index) => [row.id, index + 1]),
  );
}

function toSubmission(r: CandidateRow, fallbackRefNo = 0): Submission {
  const refNo = candidateRefNo(r, fallbackRefNo);
  return {
    id: r.id,
    refNo,
    ref: formatRef(refNo),
    name: r.name,
    phone: r.phone,
    email: r.email,
    message: r.message ?? "",
    resumeFile: r.resume_file,
    photoFile: r.photo_file,
    status: (r.status as SubmissionStatus) ?? "new",
    createdAt: r.created_at,
    updatedAt: r.updated_at ?? r.created_at,
  };
}

export async function addSubmission(
  data: Omit<Submission, "id" | "refNo" | "ref" | "status" | "createdAt" | "updatedAt">,
): Promise<Submission> {
  const { data: row, error } = await supabaseAdmin()
    .from("candidates")
    .insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      resume_file: data.resumeFile,
      photo_file: data.photoFile,
      status: "new",
    })
    .select()
    .single();
  check(error);
  const candidateRow = row as CandidateRow;
  if (candidateRefNo(candidateRow) > 0) return toSubmission(candidateRow);
  return toSubmission(candidateRow, await fallbackRefNoForCandidate(candidateRow.id));
}

export async function listSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabaseAdmin()
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });
  check(error);
  const rows = data as CandidateRow[];
  const fallbackRefs = fallbackRefNoMap(rows);
  return rows.map((row) => toSubmission(row, fallbackRefs.get(row.id)));
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const { data, error } = await supabaseAdmin().from("candidates").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  const row = data as CandidateRow;
  if (candidateRefNo(row) > 0) return toSubmission(row);
  return toSubmission(row, await fallbackRefNoForCandidate(row.id));
}

async function fallbackRefNoForCandidate(id: string): Promise<number> {
  const { data, error } = await supabaseAdmin()
    .from("candidates")
    .select("id, created_at")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error || !data) return 0;
  return fallbackRefNoMap(data as CandidateRow[]).get(id) ?? 0;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const existing = await getSubmission(id);
  if (!existing) return false;
  await removeUpload(existing.resumeFile);
  await removeUpload(existing.photoFile);
  const { error } = await supabaseAdmin().from("candidates").delete().eq("id", id);
  return !error;
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<Submission | null> {
  const timestampedUpdate = await supabaseAdmin()
    .from("candidates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  const missingUpdatedAt =
    timestampedUpdate.error &&
    /updated_at/i.test(`${timestampedUpdate.error.message} ${timestampedUpdate.error.details ?? ""}`);

  if (missingUpdatedAt) {
    const fallbackUpdate = await supabaseAdmin()
      .from("candidates")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (fallbackUpdate.error || !fallbackUpdate.data) return null;
    const row = fallbackUpdate.data as CandidateRow;
    if (candidateRefNo(row) > 0) return toSubmission(row);
    return toSubmission(row, await fallbackRefNoForCandidate(row.id));
  }

  const { data, error } = timestampedUpdate;
  if (error || !data) return null;
  const row = data as CandidateRow;
  if (candidateRefNo(row) > 0) return toSubmission(row);
  return toSubmission(row, await fallbackRefNoForCandidate(row.id));
}

/* ───────────────────────── Contact enquiries ───────────────────────── */

export type Enquiry = {
  id: string;
  fullname: string;
  contact: string;
  email: string;
  about: string;
  message: string;
  createdAt: string;
};

type EnquiryRow = {
  id: string;
  fullname: string;
  contact: string;
  email: string;
  about: string | null;
  message: string | null;
  created_at: string;
};

function toEnquiry(r: EnquiryRow): Enquiry {
  return {
    id: r.id,
    fullname: r.fullname,
    contact: r.contact,
    email: r.email,
    about: r.about ?? "",
    message: r.message ?? "",
    createdAt: r.created_at,
  };
}

export async function addEnquiry(data: Omit<Enquiry, "id" | "createdAt">): Promise<void> {
  const { error } = await supabaseAdmin().from("contact_enquiries").insert({
    fullname: data.fullname,
    contact: data.contact,
    email: data.email,
    about: data.about,
    message: data.message,
  });
  check(error);
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabaseAdmin()
    .from("contact_enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  check(error);
  return (data as EnquiryRow[]).map(toEnquiry);
}

export async function deleteEnquiry(id: string): Promise<void> {
  await supabaseAdmin().from("contact_enquiries").delete().eq("id", id);
}

/* ───────────────────────── Newsletter subscribers ───────────────────────── */

export type Subscriber = { id: string; email: string; createdAt: string };

type SubscriberRow = { id: string; email: string; created_at: string };

/** Idempotent — re-subscribing an existing email is a no-op. */
export async function addSubscriber(email: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  check(error);
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabaseAdmin()
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  check(error);
  return (data as SubscriberRow[]).map((r) => ({ id: r.id, email: r.email, createdAt: r.created_at }));
}

export async function deleteSubscriber(id: string): Promise<void> {
  await supabaseAdmin().from("newsletter_subscribers").delete().eq("id", id);
}

/* ───────────────────────── Admin users ───────────────────────── */

export type AdminRole = "super" | "admin";

/** Safe view of an admin user — never includes the password hash. */
export type AdminUser = {
  id: string;
  username: string;
  role: AdminRole;
  createdAt: string;
};

/** Internal view including the hash — only for the login flow. */
export type AdminUserWithHash = AdminUser & { passwordHash: string };

export async function getAdminUserByUsername(
  username: string,
): Promise<AdminUserWithHash | null> {
  const { data, error } = await supabaseAdmin()
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    username: data.username,
    role: (data.role as AdminRole) ?? "admin",
    createdAt: data.created_at,
    passwordHash: data.password_hash,
  };
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabaseAdmin()
    .from("admin_users")
    .select("id, username, role, created_at")
    .order("created_at", { ascending: false });
  check(error);
  return (data as { id: string; username: string; role: string; created_at: string }[]).map((r) => ({
    id: r.id,
    username: r.username,
    role: (r.role as AdminRole) ?? "admin",
    createdAt: r.created_at,
  }));
}

export async function createAdminUser(
  username: string,
  passwordHash: string,
  role: AdminRole,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabaseAdmin()
    .from("admin_users")
    .insert({ username, password_hash: passwordHash, role });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "That username already exists." };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function updateAdminUserPassword(id: string, passwordHash: string): Promise<void> {
  await supabaseAdmin().from("admin_users").update({ password_hash: passwordHash }).eq("id", id);
}

export async function deleteAdminUser(id: string): Promise<void> {
  await supabaseAdmin().from("admin_users").delete().eq("id", id);
}
