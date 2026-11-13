/**
 * Vercel Routing Middleware: password-protects the Admin Studio.
 *
 * Runs on Vercel's servers before anything under /admin is sent — the admin page, its scripts and
 * styles — so the browser never receives them without valid credentials. No database: the login
 * is read from Vercel environment variables (Project → Settings → Environment Variables):
 *
 *   ADMIN_USER       e.g. lucy
 *   ADMIN_PASSWORD   a long, unique password
 *
 * If either is missing, Admin is locked for everyone (fail closed).
 * Not active under `npm run dev` — Vite's dev server doesn't run Vercel middleware.
 */
import { next } from '@vercel/functions/middleware';

declare const process: { env: Record<string, string | undefined> };

export const config = { matcher: ['/admin', '/admin/:path*'] };

const REALM = 'Lucy Admin Studio';

/** Compare without exiting early, so response timing doesn't leak how much of a guess was right. */
function safeEqual(a: string, b: string) {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

/** Parse an `Authorization: Basic …` header into user/password (UTF-8 safe). */
function readBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header?.startsWith('Basic ')) return null;
  try {
    const bytes = Uint8Array.from(atob(header.slice(6).trim()), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const i = decoded.indexOf(':');
    return i < 0 ? null : { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
  } catch {
    return null;
  }
}

const noStore = { 'Cache-Control': 'no-store' };

export default function middleware(request: Request) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) {
    return new Response('Admin login is not configured. Set ADMIN_USER and ADMIN_PASSWORD in Vercel.', {
      status: 503,
      headers: noStore,
    });
  }

  const creds = readBasicAuth(request.headers.get('authorization'));
  // Evaluate both comparisons every time (no short-circuit) to keep timing uniform.
  const userOk = creds ? safeEqual(creds.user, user) : false;
  const passOk = creds ? safeEqual(creds.pass, pass) : false;
  if (userOk && passOk) {
    // Keep admin pages out of shared caches and search engines.
    return next({ headers: { ...noStore, 'X-Robots-Tag': 'noindex, nofollow' } });
  }

  return new Response('Login required.', {
    status: 401,
    headers: { ...noStore, 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
  });
}
