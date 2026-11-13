# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Lucy Storefront.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Shop.co Student Marketplace Redesign` project files (HTML prototypes, assets, components)

---

## Implementation (Vite + React + TypeScript)

```bash
npm install
npm run dev      # storefront at /, Admin Studio at /admin/ (no login locally)
npm run build
```

- `src/pages/Storefront.tsx` — responsive catalogue (desktop layout > 900px, mobile layout ≤ 900px)
- `src/pages/Admin.tsx` — Admin Studio product list, served as its own page at `/admin/` (`admin/index.html` → `src/admin.tsx`); edits persist to localStorage and update the storefront (also across tabs)
- `middleware.ts` — Vercel Routing Middleware that password-protects everything under `/admin`

### Deploying to Vercel (Admin login)

1. Import the project in Vercel (framework preset: **Vite**).
2. In **Project → Settings → Environment Variables**, add for **Production** (and Preview if used):
   - `ADMIN_USER` — e.g. `lucy`
   - `ADMIN_PASSWORD` — a long, unique password (e.g. four random words)
3. Redeploy (env var changes only apply to new deployments).
4. Visit `https://<your-site>/admin/` — the browser asks for the username and password.

If the variables are missing, `/admin` returns 503 for everyone (fails closed). The storefront has no link to Admin; bookmark `/admin/`. To "log out", close the browser (Basic Auth is remembered until then); to revoke access, change `ADMIN_PASSWORD` and redeploy.
- `src/config.ts` — the design's tweak toggles (banner colour, card style, badge accent, marquee) and Lucy's WhatsApp number
- `src/data.ts` — sample catalogue, categories, budgets, badges
