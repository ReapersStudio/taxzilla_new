import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Eye, Check, X, Download } from "lucide-react";
import { listSubmissions } from "@/lib/store";
import { getSession } from "@/lib/auth/session";
import { formatAdminShortDateTime } from "@/lib/dates";
import { StatusBadge } from "../StatusBadge";
import { SetupNotice } from "../SetupNotice";
import { setCandidateStatus, deleteCandidate } from "../candidate-actions";
import { ConfirmDeleteForm } from "../ConfirmDeleteForm";

export const metadata: Metadata = { title: "Candidates", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const session = await getSession();
  const isSuper = session?.role === "super";

  let submissions;
  try {
    submissions = await listSubmissions();
  } catch (e) {
    console.error("[admin/candidates] load error:", e);
    return <SetupNotice />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Candidates</h1>
          <p className="mt-1 text-ink-500">Job applications submitted through the careers page.</p>
        </div>
        {submissions.length > 0 && (
          // Download endpoints (route handlers), not pages — plain anchors are correct here.
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/candidates/export?format=csv"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </a>
            <a
              href="/admin/candidates/export"
              download
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Download className="h-4 w-4" /> Export ZIP (with files)
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Inbox className="h-10 w-10 text-ink-300" />
            <p className="mt-4 font-medium text-ink-700">No applications yet</p>
            <p className="mt-1 text-sm text-ink-500">
              New submissions from the careers page will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto xl:overflow-visible">
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[8%]" />
                <col className="w-[13%]" />
                <col className="w-[20%]" />
                <col className="w-[10%]" />
                <col className="w-[17%]" />
                <col className="w-[32%]" />
              </colgroup>
              <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Activity (IST)</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {submissions.map((s) => (
                  <tr key={s.id} className="transition hover:bg-ink-50/60">
                    <td className="px-4 py-4">
                      <span className="font-mono font-semibold text-brand-700">{s.ref}</span>
                    </td>
                    <td className="break-words px-4 py-4 font-medium text-ink-900">{s.name}</td>
                    <td className="px-4 py-4 text-ink-600">
                      <div className="break-all">{s.email}</div>
                      <div className="text-xs text-ink-400">{s.phone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-ink-500">
                      <div className="whitespace-nowrap">
                        <span className="font-semibold text-ink-600">Applied:</span>{" "}
                        {formatAdminShortDateTime(s.createdAt)}
                      </div>
                      <div className="mt-1 whitespace-nowrap">
                        <span className="font-semibold text-ink-600">Updated:</span>{" "}
                        {formatAdminShortDateTime(s.updatedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {s.status !== "shortlisted" && (
                          <form action={setCandidateStatus}>
                            <input type="hidden" name="id" value={s.id} />
                            <input type="hidden" name="status" value="shortlisted" />
                            <button
                              type="submit"
                              title="Approve & email candidate"
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </button>
                          </form>
                        )}
                        {s.status !== "rejected" && (
                          <form action={setCandidateStatus}>
                            <input type="hidden" name="id" value={s.id} />
                            <input type="hidden" name="status" value="rejected" />
                            <button
                              type="submit"
                              title="Reject & email candidate"
                              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </button>
                          </form>
                        )}
                        <Link
                          href={`/admin/candidates/${s.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-200"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                        {isSuper && (
                          <ConfirmDeleteForm
                            action={deleteCandidate}
                            id={s.id}
                            title="Delete application"
                            label="Delete"
                            confirmMessage={`Delete application ${s.ref} from ${s.name}? This permanently removes the record and their uploaded files. This cannot be undone.`}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-ink-400">
        Approving or rejecting automatically emails the candidate their decision.
      </p>
    </div>
  );
}
