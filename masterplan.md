

30-second elevator pitch
	•	DocToMD Vault turns PDFs into clean, consistent Markdown plus section-level embeddings.
	•	Teams get a searchable library and an AI chat that answers with Doc → Heading citations.
	•	It feels like a calm research studio: clear progress, gentle errors, zero intimidation.

Problem & mission
	•	Problem
	•	PDFs trap knowledge in messy layouts.
	•	Teams can’t reliably search, cite, or reuse what’s inside.
	•	Ingestion tools feel “pipeline-y” and stressful.
	•	Mission
	•	Convert every PDF into a single, structured Markdown artifact.
	•	Make it AI-queryable with repeatable citations.
	•	Keep the experience calm, confident, and kind.

Target audience
	•	Product + ops teams building internal knowledge bases from PDFs
	•	Researchers / analysts ingesting reports and needing recall
	•	Founders building RAG assistants on top of document libraries

Core features
	•	Landing (logged out)
	•	Primary CTA: Upload a PDF
	•	Secondary: See the Markdown schema
	•	Show a small real example (frontmatter + headings)
	•	Auth
	•	Email/password
	•	Optional: Google OAuth
	•	Onboarding line: “Bring a document. We’ll structure it into usable knowledge.”
	•	Dashboard / Library
	•	List: title, upload date, status, tags/topics
	•	Actions: view, download .md, reprocess, delete
	•	Filters: tags, status, date range
	•	Search: title + content
	•	Upload flow (core moment)
	•	Drag-drop + picker
	•	Visible checklist:
	1.	Upload PDF
	2.	Extract text
	3.	Normalize structure
	4.	Generate Markdown
	5.	Create embeddings
	•	Errors that guide, don’t scold (fix + retry)
	•	Document detail
	•	Tabs: Overview / Markdown / Chat
	•	Reprocess with reason: bad scan, missing headings, etc.
	•	Global AI search / chat
	•	“Ask your library”
	•	Always shows which doc + which heading supported the answer
	•	Click → jump to the cited Markdown heading

High-level tech stack
	•	Frontend: Next.js (App Router) + TypeScript + React
	•	Fits: fast iteration, server components where helpful, clean routing for app flows
	•	UI: shadcn/ui + Tailwind
	•	Fits: calm, consistent components; easy to keep layout minimal and readable
	•	API: Vercel Functions (Route Handlers)
	•	Fits: ingestion endpoints close to the app; straightforward deploy
	•	Storage: Vercel Blob
	•	Fits: native storage for PDFs and generated .md downloads
	•	Database: Vercel Marketplace Postgres (e.g., Neon)
	•	Fits: stable metadata store; familiar relational model
	•	Vector search: Marketplace vector integration or Postgres-based embeddings
	•	Fits: section-level retrieval for Doc → Heading citations
	•	Auth: Auth.js / NextAuth (email/password; Google optional)
	•	Fits: proven patterns, session handling, flexible providers
	•	Build agent: Codex
	•	Fits: structured refactors, PR-style iterations, test scaffolding, repetitive plumbing

Conceptual data model (ERD in words)
	•	User
	•	has many Documents
	•	Document
	•	belongs to User
	•	has one DocMetadata
	•	has many DocChunks (optional but recommended for citations)
	•	DocMetadata
	•	belongs to Document
	•	fields: topics[], tags[], summary, schema_version, embedding_version, page_count
	•	DocChunk
	•	belongs to Document
	•	fields: heading, chunk_text, embedding_vector or embedding_ref

Markdown artifact schema (one .md per PDF)
	•	Frontmatter (stable keys)
	•	doc_id, title, source_filename, uploaded_at
	•	topics[], tags[], summary
	•	schema_version, embedding_version
	•	Body (predictable anchors for citations)
	•	Summary
	•	Key Topics
	•	Section-by-Section Outline
	•	Heading 1
	•	Heading 2
	•	Notable Quotes
	•	Entities (People / Orgs / Products)
	•	Actionable Takeaways

Rule: embeddings are generated per heading section so citations remain consistent.

UI design principles (Krug-first)
	•	Don’t make me think
	•	One primary action per screen (Upload / Ask / Download).
	•	Design for scanning
	•	Short labels, predictable placement, minimal UI chrome.
	•	Scenes, not screens
	•	Users see “I’m safe” moments: upload succeeds, progress is clear, output is trustworthy.
	•	Motion as kindness (subtle)
	•	Progress updates feel steady, not frantic.
	•	Errors guide gently
	•	Explain what happened + what to try next (retry, reprocess reason, tips).

Security & compliance notes
	•	Data handling
	•	Treat PDFs as sensitive by default.
	•	Encrypt in transit (HTTPS) and rely on provider encryption at rest where available.
	•	Access control
	•	Document access is user-scoped (and later org-scoped).
	•	Signed download URLs or authenticated fetch for Blob assets.
	•	Auditability
	•	Store processing status + timestamps.
	•	Keep schema_version + embedding_version to reproduce results.
	•	Privacy
	•	Clear user messaging about what’s stored (PDF, Markdown, embeddings).
	•	Optional: retention controls (delete PDF after processing, keep only Markdown).

Phased roadmap
	•	MVP (prove the core loop)
	•	Auth (email/password)
	•	Upload PDF → generate Markdown → store in Blob
	•	Dashboard list + status
	•	Document detail: Overview + Markdown tab (copy + download)
	•	Basic search (title + metadata)
	•	V1 (make it feel “vault-like”)
	•	Section-level chunking + embeddings
	•	Doc chat with citations (Doc → Heading)
	•	Global “Ask your library” with citations + jump-to-heading
	•	Tags/topics: AI-suggested + user-editable
	•	Reprocess reasons + improved error guidance
	•	V2 (team-ready knowledge platform)
	•	Org/workspace support + shared libraries
	•	Role-based access (viewer/editor/admin)
	•	Advanced filters + saved searches
	•	Connectors (optional): drive uploads, email ingestion, web clipping
	•	Quality controls: compare runs, diff Markdown versions, confidence signals

Risks & mitigations
	•	Bad scans / OCR noise
	•	Mitigation: detect low-quality text, offer “OCR mode” reprocess reason, show tips.
	•	Heading detection inconsistencies
	•	Mitigation: stable normalization rules, schema_versioning, allow manual title edits.
	•	Citation trust
	•	Mitigation: enforce “Doc → Heading” references, show quoted snippet on hover/click.
	•	Cost creep (embeddings + storage)
	•	Mitigation: chunk caps, batching, rate limits, optional “embed on demand”.
	•	Latency in ingestion
	•	Mitigation: background-style processing via queued steps (still surfaced as simple statuses).

Future expansion ideas
	•	Schema templates (e.g., “Report,” “Policy,” “Research paper”)
	•	Versioned artifacts
	•	Track multiple Markdown generations per doc with diffs
	•	Export formats
	•	Notion / Confluence / Markdown bundle / JSON
	•	Library analytics
	•	“What topics are we ingesting most?” / “What’s most queried?”
	•	Human-in-the-loop editing
	•	Light corrections that improve the next reprocess

⸻



