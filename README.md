# Portfolio

## What this is

A Next.js 16 + Payload 3 portfolio for a Fullstack AI Engineer / AI Automation Specialist.
All visible copy and every content entity live in Payload and are editable at `/admin`.
The site is light theme only. Notion was removed — content comes from the CMS.

## Prerequisites

- Node 24+
- npm
- Docker with Compose

Note: local Node 24.19.0 emits an `EBADENGINE` warning from Payload (which declares
`^24.22.3`). Everything works regardless; upgrade Node to clear the warning.

## Local setup

Run these commands in order from the repo root:

```
npm install
cp .env.example .env.local
docker compose up -d --wait postgres
npx payload seed
npm run dev
```

- `npm install` — install dependencies.
- `cp .env.example .env.local` — create your local environment file from the template.
- `docker compose up -d --wait postgres` — start Postgres 17 on `localhost:5432`
  (database `portfolio`, user `postgres`, password `postgres`) and block until healthy.
- `npx payload seed` — populate the database. This is idempotent and safe to run repeatedly:
  it upserts the `site` global and projects by slug, and creates the admin only if absent.
- `npm run dev` — start the site and admin at `http://localhost:3000`.

## Environment variables

Configure these in `.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URI` | Yes | Postgres connection string. Local value is in `.env.example`: `postgresql://postgres:postgres@localhost:5432/portfolio`. |
| `PAYLOAD_SECRET` | Yes | Payload encryption secret. Generate with `openssl rand -base64 32`. The value in `.env.example` is dev-only. |
| `NEXT_PUBLIC_SERVER_URL` | No | Public site URL used for absolute links/metadata. Defaults to `https://zdnemz.vercel.app`. |
| `BLOB_READ_WRITE_TOKEN` | No | Enables Vercel Blob uploads. Without it Payload uses local disk, and project media should use external URLs. |
| `GITHUB_TOKEN` | No | Raises the GitHub API rate limit for live activity data. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | No | Dev-only credentials used by `npx payload seed` for the initial admin account. |

No Notion credentials are needed. All `NOTION_*` variables were removed; do not re-add them.

## Accessing the CMS

Open `http://localhost:3000/admin` and sign in with the seeded credentials:

- Email: `admin@zdnemz.dev`
- Password: `portfolio-dev-2026`

These are **development-only** credentials. Change them before any deployment, and never
reuse that password in production.

Where to edit what:

- **Site** (global) — every section's copy, labels, navigation, footer, SEO, FAQ, services,
  process, and stats.
- **Projects** — case studies: problem, role, outcome + metric, timeline, media, and links.
  Slugs drive `/projects/<slug>`.
- **Media** — images. Use external URLs in production (Vercel's filesystem is read-only).
- **Contact Submissions** — messages sent from the contact form.

## Useful scripts

- `npm run dev` — start the development server.
- `npx next build` — production build (equivalent to `npm run build`).
- `npm start` — serve the production build.
- `npm run lint` — run ESLint.
- `npx payload seed` — seed/upsert content (idempotent).
- `npx payload generate:types` — regenerate Payload TypeScript types.
- `npm run goal:check` — run the goal verification check.
- `bash scripts/integration-gate.sh` — run the full integration gate.

The gates build with `npx next build --webpack` to work around a worktree-only Turbopack artifact;
the standard build command is `npx next build`.

## Production notes

Deploy to Vercel. Set `DATABASE_URI` to a Neon Postgres connection string and a real
`PAYLOAD_SECRET`. Add `BLOB_READ_WRITE_TOKEN` if you need uploads beyond local disk.

## Why `type: module`

Payload 3.94's CLI crashes in CommonJS projects due to upstream issue #19475 (undici
double-loading through tsx). `package.json` declares `"type": "module"` as the
maintainer-confirmed workaround. Do not remove it.
