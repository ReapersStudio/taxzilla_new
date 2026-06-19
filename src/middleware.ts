import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "tz_admin_session";

/** Edge-safe session check (jose works on the Edge runtime). */
async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: "taxzilla-admin",
      audience: "taxzilla-admin",
    });
    return true;
  } catch {
    return false;
  }
}

function buildCsp(): string {
  const dev = process.env.NODE_ENV !== "production";
  // Next.js injects inline bootstrap/RSC scripts that have no nonce on
  // statically-generated pages, so a nonce + 'strict-dynamic' policy blocks the
  // whole app on a CDN (Vercel). We allow 'unsafe-inline' for scripts — React
  // still auto-escapes all output and there is no user-rendered HTML, so XSS
  // risk stays low — while keeping every other directive strict.
  const scriptSrc = ["'self'", "'unsafe-inline'", dev ? "'unsafe-eval'" : ""]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com",
    "media-src 'self' https://cdn.coverr.co",
    "font-src 'self' data:",
    "connect-src 'self'",
    // Google Maps embed on the contact page.
    "frame-src 'self' https://www.google.com",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Guard the admin area (login page stays public) ──
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!(await hasValidSession(req))) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // ── Security headers ──
  const csp = buildCsp();

  const res = NextResponse.next();
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("X-DNS-Prefetch-Control", "off");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  );
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
  return res;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
