import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, Trash2 } from "lucide-react";
import { getSubmission } from "@/lib/store";
import { getSession } from "@/lib/auth/session";
import { formatAdminDateTime } from "@/lib/dates";
import { StatusBadge } from "../../StatusBadge";
import { deleteCandidate } from "../../candidate-actions";

export const metadata: Metadata = { title: "Candidate", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [candidate, session] = await Promise.all([getSubmission(id), getSession()]);
  if (!candidate) notFound();
  const isSuper = session?.role === "super";

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/candidates"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to candidates
      </Link>

      <div className="mt-5 rounded-2xl border border-ink-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="font-mono text-sm font-semibold text-brand-600">{candidate.ref}</span>
            <h1 className="mt-1 text-2xl font-bold text-ink-900">{candidate.name}</h1>
            <p className="mt-1 text-sm text-ink-500">
              Applied {formatAdminDateTime(candidate.createdAt)}
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Last updated {formatAdminDateTime(candidate.updatedAt)}
            </p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <Mail className="h-4 w-4" /> Email
            </dt>
            <dd className="mt-1 break-all text-ink-900">
              <a href={`mailto:${candidate.email}`} className="hover:text-brand-700">{candidate.email}</a>
            </dd>
          </div>
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <Phone className="h-4 w-4" /> Phone
            </dt>
            <dd className="mt-1 text-ink-900">
              <a href={`tel:${candidate.phone}`} className="hover:text-brand-700">{candidate.phone}</a>
            </dd>
          </div>
        </dl>

        {candidate.message && (
          <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Cover note</p>
            <p className="mt-2 whitespace-pre-wrap text-ink-700">{candidate.message}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {candidate.resumeFile && (
            <a
              href={`/admin/files/resume/${candidate.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Download className="h-4 w-4" /> Download resume
            </a>
          )}
          {candidate.photoFile && (
            <a
              href={`/admin/files/photo/${candidate.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-ink-200 transition hover:ring-brand-300"
            >
              <Download className="h-4 w-4" /> Download photo
            </a>
          )}
        </div>

        {isSuper && (
          <form action={deleteCandidate} className="mt-8 border-t border-ink-200 pt-6">
            <input type="hidden" name="id" value={candidate.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete application
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
