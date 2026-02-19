
Site Map (Top-Level Pages Only)
	•	/ – Landing (logged out)
	•	/login – Sign in
	•	/signup – Create account
	•	/dashboard – Library overview
	•	/upload – Upload flow
	•	/docs/[id] – Document detail
	•	/search – Global AI search / chat
	•	/settings – Account + preferences

⸻

Purpose of Each Page

/ – Landing
	•	Explain value in one screen.
	•	Primary CTA: Upload a PDF
	•	Secondary: See the Markdown schema example

/login
	•	Email/password sign-in.
	•	Optional Google OAuth.
	•	Calm reassurance copy.

/signup
	•	Minimal fields.
	•	Explain what happens next in one sentence.

/dashboard
	•	See all uploaded documents.
	•	Filter, search, act (View / Download / Reprocess / Delete).
	•	Clear system status visibility.

/upload
	•	Core moment.
	•	Drag-and-drop + file picker.
	•	Visible 5-step checklist:
	1.	Upload PDF
	2.	Extract text
	3.	Normalize structure
	4.	Generate Markdown
	5.	Create embeddings

/docs/[id]

Tabs:
	•	Overview – Summary, topics, metadata.
	•	Markdown – Rendered Markdown + copy + download.
	•	Chat – Q&A grounded in this document.

/search
	•	“Ask your library.”
	•	Returns cited answers.
	•	Click citation → jump to document heading.

/settings
	•	Profile info.
	•	Delete account.
	•	Data retention preferences (future-ready).

⸻

User Roles and Access Levels

1) User (MVP Default)
	•	Upload PDFs.
	•	View, download, delete own documents.
	•	Chat with own documents.
	•	Search own library.

2) Workspace Member (V2)
	•	Access shared library.
	•	Upload to shared space.
	•	Chat across team documents.

3) Admin (V2)
	•	Manage members.
	•	Set retention rules.
	•	View usage metrics.

Rule:
Users only see documents they own (or are granted access to).
No cross-user visibility by default.

⸻

Primary User Journeys (3 Steps Max Each)

Journey 1: First Upload
	1.	Sign up → land on empty dashboard.
	2.	Click Upload a PDF → drag file.
	3.	Watch checklist complete → document becomes “Ready.”

Success moment:

“Your document is ready. Structured and searchable.”

⸻

Journey 2: Download Structured Markdown
	1.	Open document from dashboard.
	2.	Click Markdown tab.
	3.	Click Download .md.

Outcome:
Clean, consistent artifact ready for reuse.

⸻

Journey 3: Ask One Document a Question
	1.	Open document.
	2.	Go to Chat tab.
	3.	Ask question → receive cited answer (Doc → Heading).

Trust signal:
User can click citation and see exact section.

⸻

Journey 4: Ask the Whole Library
	1.	Open /search.
	2.	Ask question.
	3.	View cited results across documents.

Follow-up:
“Do you want this answer from one document or across the whole library?”

⸻

Journey 5: Fix a Bad Extraction
	1.	Open document.
	2.	Click Reprocess.
	3.	Select reason → confirm.

System response:
Clear explanation of what will change.

⸻

Navigation Logic (Simple Rules)
	•	One dominant CTA per screen.
	•	Dashboard always reachable via top-left logo.
	•	Upload always visible in top navigation.
	•	Document pages never require more than 2 clicks from dashboard.

⸻

System States (Visible and Reassuring)

Every document clearly shows:
	•	Processing
	•	Ready
	•	Failed

If Failed:
	•	Explain why.
	•	Offer retry.
	•	Suggest reprocess reason.

⸻

Final Flow Integrity Check
	•	Can a new user upload in under 60 seconds?
	•	Can they download Markdown without confusion?
	•	Are citations always clickable?
	•	Is there ever more than one primary action competing?

If yes to all → flow is aligned with the calm studio mission.

⸻


