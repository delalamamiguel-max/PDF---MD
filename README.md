# DocToMD Vault

Calm PDF -> Markdown ingestion vault with strict user scoping, invite-only access, folder sharing, and public/unlisted LLM-ready retrieval endpoints.

## Stack

- Next.js App Router + TypeScript
- Tailwind + shadcn-style UI primitives
- NextAuth (credentials, invite-only account creation)
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
ADMIN_EMAILS=admin@example.com
```

Notes:

- Keep `ENABLE_GOOGLE_AUTH` and `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` as `false` unless Google OAuth is configured.
- `DATABASE_URL` should point to your Vercel Marketplace Postgres integration (for example Neon).
- `ADMIN_EMAILS` is a comma-separated bootstrap list for admin-only invite tooling.

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

## Invite-only flow check

1. Admin generates an invite from `/admin/invites`.
2. User opens invite URL and completes account creation.
3. User uploads a PDF from `/upload` into a folder.
3. Watch progress update through processing stages.
4. See status become `Ready` in `/dashboard`.
5. Open `/docs/[id]` -> Markdown tab -> copy/download `.md`.

## Folder sharing and public RAG endpoints

- Folder visibility types:
  - `private`: owner only
  - `unlisted`: requires secure share token URL
  - `public`: also exposed via secure share token URL
- Share URLs:
  - Human page: `/shared/f/{folder_access_token}`
  - LLM folder metadata/list: `GET /api/public/folders/{folder_access_token}`
  - LLM document retrieval: `GET /api/public/folders/{folder_access_token}/documents/{document_public_token}`
- Public endpoints include:
  - server-side visibility enforcement
  - non-enumerable tokenized access
  - CORS headers (`GET`, `OPTIONS`)
  - request rate limiting
  - access logging

## Architecture notes

- Invite tokens are generated cryptographically, stored hashed, single-use, expiring, revocable, and consumed atomically during signup to prevent race-condition reuse.
- Public folder/document APIs never expose internal numeric/UUID IDs as public identifiers.
- Raw PDFs are stored in Blob; extracted text is persisted in `document_text_contents`; structured chunks are stored in `doc_chunks` for retrieval/embedding readiness.

## Admin how-to

1. Set `ADMIN_EMAILS` (or mark `users.is_admin = true` directly in DB).
2. Sign in as admin and open `/admin/invites`.
3. Generate invite links, revoke unused invites, and review invite requests.

## Folder sharing how-to

1. Create folder in `/dashboard`.
2. Set visibility to `unlisted` or `public`.
3. Click `Share` to generate URLs.
4. Use the returned human link or LLM API link.

## Example output

A reference artifact is included at:

- `examples/sample-output.md`
