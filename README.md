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
| `S3_BUCKET` | No | S3-compatible bucket for media uploads. Setting it activates the S3 adapter; with no S3 vars set, uploads stay on local disk. |
| `S3_REGION` | No | Bucket region (e.g. `us-east-1` for AWS S3, `auto` for R2). Required when S3 is enabled. |
| `S3_ACCESS_KEY_ID` | No | Access key ID with read/write access to the bucket. Required when S3 is enabled. |
| `S3_SECRET_ACCESS_KEY` | No | Secret access key for the access key ID. Required when S3 is enabled. |
| `S3_ENDPOINT` | No | Custom S3-compatible endpoint URL (R2, MinIO). Omit for AWS S3. |
| `S3_FORCE_PATH_STYLE` | No | Set to `true` for path-style URLs (needed by MinIO). Defaults to `false`. |
| `S3_PUBLIC_URL` | No | Public base URL for serving files (e.g. an R2 custom domain). Omit for plain AWS S3. |
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
- **Media** — images. With S3 configured, uploads go to the bucket; otherwise use external URLs in production (Vercel's filesystem is read-only).
- **Contact Submissions** — messages sent from the contact form.

## Useful scripts

- `npm run dev` — start the development server.
- `npx next build` — production build without running migrations (equivalent to the build step only).
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
`PAYLOAD_SECRET`. For media uploads, set the `S3_*` variables to an S3-compatible store
such as AWS S3 or Cloudflare R2: `S3_BUCKET` activates the adapter, with `S3_REGION`,
`S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` required. Add `S3_ENDPOINT`,
`S3_FORCE_PATH_STYLE` and `S3_PUBLIC_URL` for R2/MinIO-style setups. Without these
variables, media stays on local disk — Vercel's filesystem is read-only, so production
needs S3 or external URLs for uploads to persist.

Migrations run automatically as part of `npm run build` (`payload migrate && next build`), so
Vercel applies them on every deploy. The initial schema lives in `src/migrations/`. When you
change a collection or global, generate and commit a new migration with
`npx payload migrate:create --name <name>` before pushing. If a database was previously
schema-pushed in dev mode, the first `payload migrate` against it asks about data loss — answer
yes once, then future deploys are non-interactive.

## Why `type: module`

Payload 3.94's CLI crashes in CommonJS projects due to upstream issue #19475 (undici
double-loading through tsx). `package.json` declares `"type": "module"` as the
maintainer-confirmed workaround. Do not remove it.
