"use client";

import { Trash2 } from "lucide-react";

type Props = {
  /** Server action that performs the delete (reads `id` from FormData). */
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  /** Confirmation prompt shown before the delete runs. */
  confirmMessage: string;
  /** Tooltip / accessible title for the button. */
  title?: string;
  /** Button label. */
  label?: string;
};

/**
 * Delete button that asks for confirmation before submitting. If the admin
 * cancels the native dialog, the form submission is prevented and nothing is
 * deleted.
 */
export function ConfirmDeleteForm({
  action,
  id,
  confirmMessage,
  title = "Delete",
  label = "Delete",
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={title}
        className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
      >
        <Trash2 className="h-3.5 w-3.5" /> {label}
      </button>
    </form>
  );
}
