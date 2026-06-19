import type { Metadata } from "next";
import { ShieldAlert, Trash2, UserCog } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { listAdminUsers } from "@/lib/store";
import { formatAdminDate } from "@/lib/dates";
import { CreateUserForm } from "./CreateUserForm";
import { deleteUserAction } from "../user-actions";
import { SetupNotice } from "../SetupNotice";

export const metadata: Metadata = { title: "Users", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSession();

  // Only super-admins manage users.
  if (!session || session.role !== "super") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-red-900">Not authorised</h2>
        <p className="mt-2 text-sm text-red-800">Only a super-admin can manage users.</p>
      </div>
    );
  }

  let users;
  try {
    users = await listAdminUsers();
  } catch (e) {
    console.error("[admin/users] load error:", e);
    return <SetupNotice />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <UserCog className="h-6 w-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Users</h1>
          <p className="mt-0.5 text-sm text-ink-500">Create and manage admin / employee logins.</p>
        </div>
      </div>

      {/* Create */}
      <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-semibold text-ink-900">Add a new user</h2>
        <p className="mb-4 mt-1 text-sm text-ink-500">
          Share the username and temporary password with the employee; they can use it to sign in.
        </p>
        <CreateUserForm />
      </div>

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <div className="border-b border-ink-200 px-6 py-4">
          <h2 className="font-semibold text-ink-900">Existing users</h2>
        </div>

        <div className="divide-y divide-ink-100">
          {/* The bootstrap super-admin from env (cannot be deleted here) */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <span className="font-medium text-ink-900">{session.sub}</span>
              <span className="ml-2 rounded-full bg-gold-400/15 px-2.5 py-0.5 text-xs font-semibold text-gold-600 ring-1 ring-inset ring-gold-300">
                super · built-in
              </span>
              <p className="text-xs text-ink-400">You (configured in environment)</p>
            </div>
          </div>

          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <span className="font-medium text-ink-900">{u.username}</span>
                <span
                  className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                    u.role === "super"
                      ? "bg-gold-400/15 text-gold-600 ring-gold-300"
                      : "bg-brand-50 text-brand-700 ring-brand-200"
                  }`}
                >
                  {u.role}
                </span>
                <p className="text-xs text-ink-400">Added {formatAdminDate(u.createdAt)}</p>
              </div>
              <form action={deleteUserAction}>
                <input type="hidden" name="id" value={u.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </form>
            </div>
          ))}

          {users.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-ink-500">
              No additional users yet. Create one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
