# Mistakes & Fixes Log

> Every time Claude gets something wrong or finds a better way, it logs it here.
> This is how Claude "learns" across sessions — by never making the same mistake twice.

---

## Format

- **Date:** When it happened
- **Agent:** Which agent made the mistake (Vizzy, Milli, Penn, Emmie, Soshie, Buddy, Cassie, Seomi, Scouty, Gigi, Commet, Dexter, or Claude/general)
- **What went wrong:** Description of the mistake
- **Root cause:** Why it happened
- **Fix applied:** What was changed
- **Prevention rule:** How to avoid it next time

---

## Log

### 2026-03-31 — Gave instructions instead of executing
- **Agent:** Claude/general
- **What went wrong:** Anthony asked to fix Claude Desktop. Claude gave him a list of PowerShell commands instead of executing them directly.
- **Root cause:** Defaulted to advisory mode instead of action mode.
- **Fix applied:** None — Claude Cowork can't access the Windows file system directly.
- **Prevention rule:** Always check if Claude can execute directly before giving manual instructions. If execution isn't possible, explain WHY and offer the closest alternative. Anthony wants action, not homework.

### 2026-03-31 — Created duplicate files instead of reading existing repo first
- **Agent:** Claude/general
- **What went wrong:** Built a full new repo structure (CLAUDE.md, memory files, etc.) without first checking that Anthony already had a well-structured second-brain repo on GitHub.
- **Root cause:** Didn't ask or check for existing infrastructure before building.
- **Fix applied:** Read the existing repo via Chrome, analyzed the structure, and built complementary files that slot into the existing layout.
- **Prevention rule:** ALWAYS check what already exists before creating anything new. Search GitHub, Google Drive, and connected platforms first. Build on what's there — don't duplicate.

---

### 2026-05-03 — n8n IF node boolean.equal never matches
- **Agent:** n8n/automation
- **What went wrong:** IF nodes with `boolean.equal` + `rightValue: true` silently route to false path even when value is clearly true.
- **Root cause:** n8n v2 bug — `boolean.equal` doesn't correctly match JS booleans from Code nodes.
- **Fix applied:** Changed operator to `{"type":"boolean","operation":"true"}` with no rightValue.
- **Prevention rule:** Always use `boolean.true` in n8n v2 IF nodes. Never `boolean.equal`.

### 2026-05-03 — n8n HTTP Request jsonBody expressions not evaluating (422 errors)
- **Agent:** n8n/automation
- **What went wrong:** GHL API calls returning 422 — dynamic fields sent as literal strings.
- **Root cause:** `jsonBody` must start with `=` for n8n to evaluate expressions inside.
- **Fix applied:** Prefixed all jsonBody values with `=`, changed `={{ expr }}` to `{{ expr }}` inside.
- **Prevention rule:** Always start jsonBody with `=`. Without it, `{{ }}` are literal strings.

### 2026-05-03 — HCP approval_status nested at options[0] not entity top level
- **Agent:** HCP Webhook Router
- **What went wrong:** Approved estimates never moved GHL stage to "Estimate Approved."
- **Root cause:** `approval_status` lives at `entity.options[0].approval_status` for `estimate.option.approval_status_changed` events.
- **Fix applied:** Added `options[0]` fallback to lookup chain.
- **Prevention rule:** For HCP estimate events, always check the `options` array for approval_status.

### 2026-05-01 — Vizzy chatInput.trim() crash on every Telegram execution
- **Agent:** Vizzy
- **What went wrong:** Every Telegram message crashed the orchestrator.
- **Root cause:** `={{ .chatInput.trim() }}` — missing `$json.` prefix.
- **Fix applied:** Changed to `={{ $json.chatInput.trim() }}` + looseTypeValidation.
- **Prevention rule:** Always `$json.fieldName` not `.fieldName` in n8n expressions.

### 2026-05-01 — HCP estimate.option.created wrongly mapped to estimate_sent
- **Agent:** HCP Webhook Router
- **What went wrong:** Leads moved to "Estimate Sent" stage when options were merely created.
- **Root cause:** `estimate.option.created` fires on creation, not when sent to customer.
- **Fix applied:** Mapped to null. Only `estimate.sent` triggers "Estimate Sent" stage.
- **Prevention rule:** Creating options ≠ sending estimate. Map by actual business event.

### 2026-05-01 — HCP Router summing all 3 G/B/B option totals for deal value
- **Agent:** HCP Webhook Router
- **What went wrong:** Deal value in GHL pipeline was 3× actual.
- **Fix applied:** Use "Better" (middle) option only. HCP stores amounts in cents — divide by 100.
- **Prevention rule:** For G/B/B estimates, pipeline value = Better option only. HCP amounts are in cents.

### 2026-04-28 — GHL contact search email-first misses contacts with no email
- **Agent:** All n8n GHL contact lookup workflows
- **What went wrong:** Contacts from HCP with no email triggered duplicate Creates.
- **Fix applied:** Phone-first search: `$json.phone || $json.email`.
- **Prevention rule:** Always phone-first in GHL lookups. Email-first only when email is guaranteed.

### 2026-04-26 — Milli fabricating @example.com email addresses
- **Agent:** Milli
- **What went wrong:** Milli sent emails to hallucinated addresses like `carolyn.kennedy@example.com`.
- **Root cause:** No instruction on how to find a real email — AI filled the gap from contact name.
- **Fix applied:** CRITICAL EMAIL SAFETY block added to Format Email Query node + Milli SM.
- **Prevention rule:** Always look up GHL contact email first. If no verified email: post to Slack requesting it. NEVER send to @example.com or any placeholder domain.

### 2026-04-15 — GHL "Tag Added" trigger does NOT fire from API
- **Agent:** All n8n workflows relying on GHL tag triggers
- **What went wrong:** Tags added via REST API never fired GHL "Tag Added" workflow automations.
- **Root cause:** GHL tag triggers only fire from UI actions, not API calls.
- **Fix applied:** Use GHL Workflow Enrollment API: `POST /contacts/{id}/workflow/{workflowId}`.
- **Prevention rule:** Never rely on tag triggers from n8n. Always use enrollment API to trigger GHL workflows.

### 2026-04-17 — n8n public API strips credential bindings on PUT
- **Agent:** n8n/automation
- **What went wrong:** Updating workflows via `/api/v1/workflows/:id` wiped all credential assignments.
- **Root cause:** Public API GET returns `credentials: {}` and PUT overwrites stored credentials.
- **Fix applied:** Use internal API: `PATCH /rest/workflows/:id` via browser with session cookies.
- **Prevention rule:** NEVER use n8n public API to update workflows that have credentials.

### 2026-04 — WordPress wpautop breaks CSS in REST API pushes
- **Agent:** Seomi / Penn
- **What went wrong:** Blank lines in `<style>` blocks caused wpautop to inject `<p>` tags, breaking all CSS.
- **Fix applied:** Minify all style blocks to a single line before pushing via REST API.
- **Prevention rule:** No blank lines inside `<style>` blocks in WP REST API content.

### 2026-04 — RankMath meta silently ignored via standard WP REST API
- **Agent:** Seomi
- **What went wrong:** Setting RankMath fields via `wp/v2/pages meta` appeared to succeed but nothing saved.
- **Fix applied:** Use `POST /wp-json/rankmath/v1/updateMeta` with `rank_math_` prefixed keys.
- **Prevention rule:** RankMath has its own endpoint. Standard WP meta API silently ignores RankMath fields.

### 2026-04 — n8n fan-in: Code node runs N times when N branches feed it
- **Agent:** n8n/automation
- **What went wrong:** Code node downstream of multiple HTTP nodes executed once per branch = duplicate rows/Slack messages.
- **Root cause:** n8n fan-in triggers downstream nodes once per incoming batch, not once total.
- **Fix applied:** Consolidated HTTP calls inside Code node, or inserted Merge node (mode: append) before Code.
- **Prevention rule:** Never connect N branches directly to one Code node. Always Merge first.

<!-- New entries go above this line, newest first -->
