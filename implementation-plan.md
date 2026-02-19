

Step-by-step build sequence

0) Repo + baseline
	•	Create Next.js App Router project (TypeScript).
	•	Add Tailwind + shadcn/ui.
	•	Add linting + formatting (ESLint + Prettier).
	•	Create basic layout shell:
	•	Logged-out landing
	•	Logged-in app frame (top nav + content)

1) Auth (so everything can be user-scoped)
	•	Add Auth.js / NextAuth.
	•	Implement email/password sign-up + sign-in.
	•	Add optional Google provider (feature-flagged).
	•	Add route protection:
	•	Redirect logged-out users to /login for app pages.
	•	Add “calm onboarding” copy on first login.

2) Database + core tables
	•	Provision Marketplace Postgres (e.g., Neon).
	•	Create schema:
	•	users
	•	documents
	•	doc_metadata
	•	doc_chunks (optional for MVP; recommended for V1)
	•	Add server-side DB access layer (thin, typed).
	•	Add document status enum:
	•	Processing / Ready / Failed

3) Blob storage plumbing (PDF + Markdown artifacts)
	•	Enable Vercel Blob.
	•	Create helpers:
	•	Upload PDF to Blob (returns blob_pdf_url)
	•	Upload generated Markdown to Blob (returns blob_md_url)
	•	Enforce access:
	•	Authenticated download (or signed URLs) for user-owned assets.

4) Upload flow (the core moment)
	•	Build Upload page UI:
	•	Drag/drop + picker
	•	File validation (PDF only; size limit messaging)
	•	Progress checklist UI (5 steps)
	•	On upload:
	•	Create document record with status = Processing
	•	Upload PDF to Blob
	•	Kick off ingestion via Vercel Function endpoint
	•	Status handling:
	•	Poll or refresh status until Ready/Failed
	•	Show calming “what’s happening” microcopy per step

5) Ingestion pipeline (Vercel Functions)
	•	Create ingestion API route:
	•	Input: document_id, blob_pdf_url
	•	Output: updates status + metadata + md url
	•	Implement pipeline stages:
	1.	Extract text
	2.	Normalize structure (detect headings/sections)
	3.	Generate Markdown (frontmatter + sections)
	4.	Persist Markdown to Blob
	5.	Update DB (processed_at, blob_md_url, metadata)
	•	Failure mode:
	•	Set status = Failed
	•	Store error_code + human-readable message
	•	Offer “Retry” and “Reprocess reason” later

6) Dashboard / Library
	•	Build documents list:
	•	Title, created_at, status, tags/topics
	•	Actions: View / Download .md / Reprocess / Delete
	•	Add filters:
	•	Status, tags/topics, date range
	•	Add search (MVP):
	•	Title + summary + tags/topics (DB text search)
	•	Empty state:
	•	One clear CTA: Upload a PDF

7) Document detail
	•	Route: /docs/[id]
	•	Tabs:
	•	Overview: summary, topics, tags, metadata, timestamps
	•	Markdown: render markdown, copy, download
	•	Chat: placeholder in MVP (coming in V1)
	•	Add Reprocess button:
	•	Select reason (bad scan, missing headings, etc.)
	•	Re-run ingestion with that hint

8) V1: Chunking + embeddings (for reliable citations)
	•	Add doc_chunks generation:
	•	One chunk per heading section
	•	Store heading + chunk_text + stable anchor
	•	Generate embeddings per chunk:
	•	Store in vector integration OR Postgres (depending on choice)
	•	Add retrieval API:
	•	Query → top chunks → return citations (doc_id + heading + snippet)

9) V1: Chat (doc-scoped) + Global “Ask your library”
	•	Doc chat:
	•	Restrict retrieval to selected doc’s chunks
	•	Always cite: Doc → Heading
	•	Add “show sources” UI with jump-to-heading
	•	Global chat:
	•	Retrieval across library
	•	Ask: “One doc or across the whole library?”
	•	Click citation → opens doc detail at heading

10) V1 polish: calm, kind, confident
	•	Microcopy pass:
	•	Upload steps: reassuring, plain-language
	•	Errors: explain + fix + retry
	•	Visual pass:
	•	More whitespace, steady progress states, clear statuses
	•	Accessibility pass:
	•	Keyboard nav, focus rings, semantic headings, AA contrast

Timeline with checkpoints (suggested)
	•	Checkpoint A (end of week 1): Auth + DB schema + app shell
	•	Checkpoint B (end of week 2): Upload → PDF stored → status updates
	•	Checkpoint C (end of week 3): Markdown generated + stored + downloadable
	•	Checkpoint D (end of week 4): Dashboard + doc detail complete (MVP shippable)
	•	Checkpoint E (weeks 5–6): Chunking + embeddings + cited retrieval (V1 core)
	•	Checkpoint F (weeks 7–8): Doc chat + global chat + polish

Team roles & recommended rituals
	•	Product/UX (or you wearing the hat)
	•	Owns “calm studio” feel + copy
	•	Full-stack engineer
	•	App Router, auth, DB, Blob, ingestion endpoints
	•	AI/retrieval engineer (part-time)
	•	Chunking rules, embeddings, retrieval, citation UX

Rituals
	•	Weekly “3-mindless-clicks” review:
	•	Can a new user upload → get .md → download in under 60 seconds?
	•	Monthly 30-minute usability test (3 users):
	•	Log top 3 confusions; fix those first
	•	PR-style iterations with Codex:
	•	Small changes, quick review loops, regression checks

Optional integrations & stretch goals
	•	Vector DB integration from Vercel Marketplace (preferred for scale)
	•	Postgres embeddings for a simpler single-DB setup (start here if needed)
	•	Connectors
	•	Google Drive / Dropbox import
	•	Exports
	•	Notion / Confluence publish
	•	Artifact versioning
	•	Track multiple generations + diffs
	•	Admin tools
	•	Usage stats, cost controls, rate limiting
	•	Retention controls
	•	Option to delete source PDFs after Markdown is produced


