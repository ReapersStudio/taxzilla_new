import type { Metadata } from "next";
import { Inbox, Trash2 } from "lucide-react";
import { listEnquiries } from "@/lib/store";
import { getSession } from "@/lib/auth/session";
import { formatAdminDateTime } from "@/lib/dates";
import { deleteEnquiryAction } from "../candidate-actions";
import { SetupNotice } from "../SetupNotice";
import { Forbidden } from "../Forbidden";
import { EnquiryModalButton } from "./EnquiryModalButton";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const session = await getSession();
  if (!session || session.role !== "super") return <Forbidden />;

  let enquiries;
  try {
    enquiries = await listEnquiries();
  } catch (e) {
    console.error("[admin/enquiries] load error:", e);
    return <SetupNotice />;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-ink-900">Contact enquiries</h1>
      <p className="mt-1 text-ink-500">Messages submitted through the contact form.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Inbox className="h-10 w-10 text-ink-300" />
            <p className="mt-4 font-medium text-ink-700">No enquiries yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Topic</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {enquiries.map((e, i) => {
                  const refId = String(enquiries.length - i).padStart(3, "0");
                  const receivedAt = formatAdminDateTime(e.createdAt);
                  return (
                    <tr key={e.id} className="transition hover:bg-ink-50/60">
                      <td className="px-5 py-4 font-mono font-semibold text-brand-700">{refId}</td>
                      <td className="px-5 py-4 font-medium text-ink-900">{e.fullname}</td>
                      <td className="px-5 py-4">
                        {e.about ? (
                          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                            {e.about}
                          </span>
                        ) : (
                          <span className="text-ink-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-ink-600">
                        <a href={`mailto:${e.email}`} className="block hover:text-brand-700">{e.email}</a>
                        <a href={`tel:${e.contact}`} className="text-xs text-ink-400 hover:text-brand-700">{e.contact}</a>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-500">{receivedAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <EnquiryModalButton
                            refId={refId}
                            name={e.fullname}
                            about={e.about}
                            email={e.email}
                            contact={e.contact}
                            message={e.message}
                            received={receivedAt}
                          />
                          <form action={deleteEnquiryAction}>
                            <input type="hidden" name="id" value={e.id} />
                            <button
                              type="submit"
                              title="Delete enquiry"
                              className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
