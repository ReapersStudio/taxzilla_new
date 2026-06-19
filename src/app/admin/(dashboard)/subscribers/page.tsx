import type { Metadata } from "next";
import { Mail, Trash2 } from "lucide-react";
import { listSubscribers } from "@/lib/store";
import { getSession } from "@/lib/auth/session";
import { formatAdminDate } from "@/lib/dates";
import { deleteSubscriberAction } from "../candidate-actions";
import { SetupNotice } from "../SetupNotice";
import { Forbidden } from "../Forbidden";

export const metadata: Metadata = { title: "Subscribers", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const session = await getSession();
  if (!session || session.role !== "super") return <Forbidden />;

  let subscribers;
  try {
    subscribers = await listSubscribers();
  } catch (e) {
    console.error("[admin/subscribers] load error:", e);
    return <SetupNotice />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Newsletter subscribers</h1>
          <p className="mt-1 text-ink-500">{subscribers.length} total</p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`mailto:?bcc=${subscribers.map((s) => s.email).join(",")}`}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Email all (BCC)
          </a>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Mail className="h-10 w-10 text-ink-300" />
            <p className="mt-4 font-medium text-ink-700">No subscribers yet</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-6 py-4">
                <div>
                  <a href={`mailto:${s.email}`} className="font-medium text-ink-900 hover:text-brand-700">
                    {s.email}
                  </a>
                  <p className="text-xs text-ink-400">Subscribed {formatAdminDate(s.createdAt)}</p>
                </div>
                <form action={deleteSubscriberAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
