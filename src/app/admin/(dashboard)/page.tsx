import type { Metadata } from "next";
import Link from "next/link";
import { Users, Mail, Inbox, ArrowRight } from "lucide-react";
import { listSubmissions, listEnquiries, listSubscribers } from "@/lib/store";
import { getSession } from "@/lib/auth/session";
import { formatAdminDateTime } from "@/lib/dates";
import { StatusBadge } from "./StatusBadge";
import { SetupNotice } from "./SetupNotice";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const isSuper = session?.role === "super";

  let submissions, enquiries, subscribers;
  try {
    submissions = await listSubmissions();
    // Enquiries & subscribers are super-admin only.
    [enquiries, subscribers] = isSuper
      ? await Promise.all([listEnquiries(), listSubscribers()])
      : [[], []];
  } catch (e) {
    console.error("[admin/dashboard] load error:", e);
    return <SetupNotice />;
  }

  const stats = [
    { Icon: Users, label: "Total candidates", value: submissions.length, href: "/admin/candidates" },
    ...(isSuper
      ? [
          { Icon: Inbox, label: "Contact enquiries", value: enquiries.length, href: "/admin/enquiries" },
          { Icon: Mail, label: "Subscribers", value: subscribers.length, href: "/admin/subscribers" },
        ]
      : []),
  ];

  const recent = submissions.slice(0, 5);

  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="mt-1 text-ink-500">Overview of activity across the site.</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ Icon, label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-ink-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-bold text-ink-900">{value}</p>
            <p className="text-sm text-ink-500">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent candidates preview */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <div className="flex items-center justify-between border-b border-ink-200 px-6 py-4">
          <h2 className="font-semibold text-ink-900">Recent applications</h2>
          <Link
            href="/admin/candidates"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Inbox className="h-10 w-10 text-ink-300" />
            <p className="mt-4 font-medium text-ink-700">No applications yet</p>
            <p className="mt-1 text-sm text-ink-500">
              New submissions from the careers page will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {recent.map((s) => (
              <Link
                key={s.id}
                href={`/admin/candidates/${s.id}`}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-ink-50/60"
              >
                <div>
                  <p className="font-medium text-ink-900">{s.name}</p>
                  <p className="text-xs text-ink-400">{s.email} · {s.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={s.status} />
                  <span className="hidden text-sm text-ink-500 sm:inline">
                    {formatAdminDateTime(s.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
