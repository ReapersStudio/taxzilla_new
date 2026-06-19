import { getSession } from "@/lib/auth/session";
import { listSubmissions, readUpload, type Submission } from "@/lib/store";
import { formatAdminDateTime } from "@/lib/dates";
import { buildZip, type ZipEntry } from "@/lib/zip";
import { publicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Escape a value for CSV (RFC 4180): wrap in quotes, double internal quotes. */
function cell(value: unknown): string {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

/** Authenticated download URL for a candidate's résumé / photo (blank if none). */
function fileUrl(s: Submission, type: "resume" | "photo"): string {
  const has = type === "resume" ? s.resumeFile : s.photoFile;
  return has ? `${publicEnv.siteUrl}/admin/files/${type}/${s.id}` : "";
}

/**
 * Build the candidates CSV. Includes Resume / Photo columns with authenticated
 * download links — open them while signed in to fetch the actual files.
 */
function buildCsv(rows: Submission[]): string {
  const header = [
    "ID", "Name", "Email", "Phone", "Status", "Message", "Applied", "Updated", "Resume", "Photo",
  ];
  const lines = [
    header.map(cell).join(","),
    ...rows.map((r) =>
      [
        r.ref,
        r.name,
        r.email,
        r.phone,
        r.status,
        r.message,
        formatAdminDateTime(r.createdAt),
        formatAdminDateTime(r.updatedAt),
        fileUrl(r, "resume"),
        fileUrl(r, "photo"),
      ].map(cell).join(","),
    ),
  ];
  // Prepend a UTF-8 BOM so Excel reads accents/unicode correctly.
  return "﻿" + lines.join("\r\n");
}

/** Filesystem-safe folder name for a candidate's files inside the archive. */
function candidateFolder(s: Submission): string {
  const slug =
    s.name
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "candidate";
  return `${s.ref}-${slug}`;
}

/** Extension of a stored object path, e.g. "abc123.pdf" → "pdf". */
function extOf(objectPath: string): string {
  const ext = objectPath.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]+$/.test(ext) ? ext : "bin";
}

/**
 * Authenticated export. Two formats:
 *  - default → a ZIP with the CSV + each candidate's résumé and photo
 *  - ?format=csv → just the CSV (with download links to the files)
 */
export async function GET(req: Request) {
  if (!(await getSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await listSubmissions();
  const csv = buildCsv(rows);
  const date = new Date().toISOString().slice(0, 10);

  // Plain CSV export.
  if (new URL(req.url).searchParams.get("format") === "csv") {
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="candidates-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // ZIP export: CSV + actual files, one folder per candidate.
  const entries: ZipEntry[] = [{ name: "candidates.csv", data: Buffer.from(csv, "utf8") }];
  await Promise.all(
    rows.map(async (r) => {
      const folder = candidateFolder(r);
      const files: Array<[string | null, string]> = [
        [r.resumeFile, "resume"],
        [r.photoFile, "photo"],
      ];
      for (const [objectPath, label] of files) {
        if (!objectPath) continue;
        const data = await readUpload(objectPath);
        if (!data) continue;
        entries.push({ name: `${folder}/${label}.${extOf(objectPath)}`, data });
      }
    }),
  );

  const zip = buildZip(entries);
  // Copy into a fresh Uint8Array (backed by a plain ArrayBuffer) so it's a valid
  // Response BodyInit.
  const body = new Uint8Array(zip);

  return new Response(body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="candidates-${date}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
