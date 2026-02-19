

Emotional Tone

Feels like a quiet research studio—calm, precise, and quietly powerful.

Not a dashboard.
Not a console.
A place where messy documents become clean knowledge.

Inspired by the emotional clarity principles in design-tips.md:
	•	Calm > flashy
	•	Structured > dense
	•	Supportive > clinical

⸻

Typography

Emotional intent
	•	Readable, breathable, long-form friendly
	•	Trustworthy, not technical
	•	Precise when needed (Markdown view)

Font system
	•	Primary UI font: Clean geometric sans (e.g., Inter-style)
	•	Markdown body: Same sans for prose
	•	Code blocks only: Monospace (for schema examples, anchors)

Type scale (modular, 1.25 ratio)

Role	Size	Weight	Usage
H1	32px	600	Page titles
H2	24px	600	Section headers
H3	20px	600	Subsections
H4	16px	600	Minor headings
Body	16px	400	Default text
Caption	14px	400	Metadata, timestamps

Rules:
	•	Line-height ≥ 1.5× for body text
	•	Generous paragraph spacing (1.25–1.5em)
	•	Markdown tab:
	•	No visual clutter
	•	Wide reading column (65–75ch max width)

⸻

Color System

Emotional goal

Muted. Trustworthy. Soft contrast. No alarm fatigue.

Light Mode

Primary
	•	Deep Ink: #1F2937 (rgb(31,41,55))
	•	Studio White: #F9FAFB (rgb(249,250,251))

Secondary
	•	Soft Slate: #E5E7EB (rgb(229,231,235))
	•	Calm Gray: #6B7280 (rgb(107,114,128))

Accent
	•	Studio Blue: #2563EB (rgb(37,99,235))

Semantic
	•	Success: #16A34A
	•	Warning: #D97706
	•	Error: #DC2626

Dark Mode
	•	Background: #0F172A
	•	Surface: #1E293B
	•	Text Primary: #F1F5F9
	•	Accent Blue slightly softened

Contrast:
	•	Maintain ≥ 4.5:1 for body text
	•	≥ 3:1 for large headings

⸻

Spacing & Layout

Grid
	•	8pt spacing system
	•	Base unit: 8px
	•	Section spacing: 32–64px vertical rhythm

Layout logic
	•	Mobile-first
	•	Max content width: 1100px
	•	Markdown reading width capped at ~70ch
	•	Sidebar optional for desktop library filters

Component spacing
	•	Card padding: 24px
	•	Button padding: 12px 16px
	•	Form field vertical spacing: 16px
	•	Upload dropzone: large, centered, visually calm

Whitespace reduces “pipeline anxiety.”

⸻

Motion & Interaction

Emotional tone of motion

Gentle. Assured. Never twitchy.

Timing
	•	Standard transitions: 150–200ms
	•	Modal open/close: 200–250ms
	•	Progress animations: smooth, steady (no bounce)

Microinteractions
	•	Upload checklist:
	•	Each step fades into “Ready” with soft checkmark
	•	“Processing…” state:
	•	Subtle animated ellipsis
	•	Success state:
	•	Small color shift + calm confirmation line
	•	Errors:
	•	No shaking
	•	Inline explanation + actionable fix

Hover / Tap
	•	Slight elevation or background tint
	•	No aggressive color shifts

⸻

Voice & Tone

Personality keywords

Calm. Precise. Supportive. Intelligent.

Microcopy examples

Onboarding

“Bring a document. We’ll structure it into usable knowledge.”

Upload success

“Your document is ready. Structured and searchable.”

Error (bad scan)

“We couldn’t extract clean text. This might be a scan. Try reprocessing with OCR mode.”

Never blame the user.
Never use exclamation marks in system states.

⸻

System Consistency

Recurring metaphors
	•	Studio
	•	Vault
	•	Library
	•	Sections as “rooms of knowledge”

Visual anchors
	•	shadcn/ui for base components
	•	Linear-level clarity in spacing
	•	Apple-like restraint in motion
	•	No heavy gradients
	•	No unnecessary shadows

Every page should:
	•	Have one dominant action
	•	Clearly show system state
	•	Feel visually breathable

⸻

Accessibility
	•	Semantic HTML structure
	•	H1 once per page
	•	Logical heading hierarchy
	•	ARIA roles for tabs and dialogs
	•	Strong visible focus states
	•	Keyboard navigable library + filters
	•	Error messages programmatically associated with inputs
	•	AA+ contrast everywhere
	•	No information conveyed by color alone

⸻

Emotional Audit Checklist

Before shipping a screen:
	•	Does this feel calm within 3 seconds?
	•	Is the primary action obvious?
	•	Are errors guiding, not alarming?
	•	Is whitespace doing real work?
	•	Would a non-technical founder feel safe here?

⸻

Technical QA Checklist
	•	Type scale aligns to modular rhythm
	•	Spacing follows 8pt system
	•	Contrast ratios ≥ WCAG AA
	•	Motion durations 150–300ms
	•	Interactive states distinct (hover, focus, active)
	•	Markdown rendering preserves semantic heading anchors

⸻

Adaptive System Memory

If you create future tools under the same brand:
	•	Reuse the deep ink + studio blue palette
	•	Preserve the calm microcopy tone
	•	Keep the “knowledge studio” metaphor consistent

Would you like to retain this emotional tone for future apps in your ecosystem?

⸻

Design Snapshot

Color Palette

Deep Ink: #1F2937
Studio White: #F9FAFB
Soft Slate: #E5E7EB
Calm Gray: #6B7280
Studio Blue: #2563EB
Success: #16A34A
Warning: #D97706
Error: #DC2626

Typography Scale
	•	H1 – 32px / 600
	•	H2 – 24px / 600
	•	H3 – 20px / 600
	•	H4 – 16px / 600
	•	Body – 16px / 400
	•	Caption – 14px / 400

Spacing System
	•	Base: 8px grid
	•	Card padding: 24px
	•	Section spacing: 32–64px
	•	Max content width: 1100px
	•	Markdown width: 65–75ch

Emotional Thesis

A calm, trustworthy ingestion studio—quietly powerful, never intimidating.

⸻

Design Integrity Review

The emotional goal (calm knowledge studio) aligns with the structural decisions: restrained color, breathable spacing, steady motion, and citation-first clarity.

One improvement: introduce subtle visual “anchoring” in the Markdown view (e.g., soft left border for headings) to reinforce section-level embeddings and make citations feel tangible.

⸻


