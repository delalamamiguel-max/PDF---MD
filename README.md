# DocToMD Vault (MVP)

Calm PDF -> Markdown ingestion vault with strict user scoping and retrieval scaffolding.

## Stack

- Next.js App Router + TypeScript
- Tailwind + shadcn-style UI primitives
- NextAuth (credentials + optional Google provider)
- Vercel Blob for PDF + Markdown artifacts
- Marketplace Postgres (Neon) for metadata and status tracking
- Vercel Route Handlers for ingestion and API endpoints

## Environment variables

Create `.env.local`:

```bash
DATABASE_URL=postgres://...
AUTH_SECRET=replace-with-random-string
NEXTAUTH_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token
ENABLE_GOOGLE_AUTH=false
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

Notes:

- Keep `ENABLE_GOOGLE_AUTH` and `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` as `false` unless Google OAuth is configured.
- `DATABASE_URL` should point to your Vercel Marketplace Postgres integration (for example Neon).

## Install and run

```bash
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

## Migrations

`db/schema.sql` is the source of truth for the MVP schema.

```bash
npm run db:migrate
```

## Test

```bash
npm run test
npm run lint
```

## Deploy (Vercel)

1. Create a Vercel project from this repo.
2. Add a Marketplace Postgres integration and copy `DATABASE_URL`.
3. Enable Vercel Blob and copy `BLOB_READ_WRITE_TOKEN`.
4. Set env vars from this README in Vercel Project Settings.
5. Run migration once against production DB:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

6. Deploy.

## MVP flow check

1. Sign up with email/password.
2. Upload a PDF from `/upload`.
3. Watch progress update through processing stages.
4. See status become `Ready` in `/dashboard`.
5. Open `/docs/[id]` -> Markdown tab -> copy/download `.md`.

## V1 scaffolding included

- `doc_chunks` generation per heading in ingestion pipeline
- retrieval endpoint: `POST /api/retrieval` returns citations (`doc_id`, `heading`, `snippet`, `stable_anchor`)
- chat placeholders:
  - `POST /api/chat/doc/[id]`
  - `POST /api/chat/library`

## Example output

A reference artifact is included at:

- `examples/sample-output.md`
