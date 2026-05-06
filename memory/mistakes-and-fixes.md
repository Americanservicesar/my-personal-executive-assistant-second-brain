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

### 2026-05-06 — WordPress auto-update crash #5 (WP Rocket Logger.php)
- **Agent:** Claude/general (WordPress maintenance)
- **What went wrong:** Site went down with PHP fatal error: "Namespace declaration has to be the very first statement" in wp-rocket/inc/Logger/Logger.php — 5th auto-update crash in 3 weeks.
- **Root cause:** Plugin auto-updates were enabled on PHP 8.2 (strict) with no staging or rollback. Bad file pushed directly to production.
- **Fix applied:** (1) Stubbed Logger.php via cPanel browser session. (2) Added `define('AUTOMATIC_UPDATER_DISABLED', true);` to wp-config.php — no plugin can auto-update now. (3) Updated WP Rocket to 3.21.2 cleanly via WP Admin. (4) Blocked debug.log via wp-content/.htaccess.
- **Prevention rule:** AUTOMATIC_UPDATER_DISABLED is now permanent in wp-config.php. All plugin updates must be done manually via WP Admin. Never re-enable auto-updates.

### 2026-05-06 — debug.log publicly accessible (1.5GB security hole)
- **Agent:** Claude/general (WordPress maintenance)
- **What went wrong:** /wp-content/debug.log was publicly accessible at https://americanservicesar.com/wp-content/debug.log — 1.5GB file with full stack traces, DB credentials, file paths.
- **Root cause:** WordPress debug logging enabled with no .htaccess protection on the wp-content directory.
- **Fix applied:** Created /home1/ericaqw6/public_html/wp-content/.htaccess with `<Files "debug.log"> Deny from all </Files>`. Now returns 403.
- **Prevention rule:** Always create wp-content/.htaccess blocking debug.log on any new WordPress site. Check with curl -o /dev/null -w "%{http_code}" before and after.

### 2026-05-06 — cPanel UAPI curl fails from external IPs — must use browser
- **Agent:** Claude/general
- **What went wrong:** curl to americanservicesar.com:2083 returns exit code 6 (host unreachable). All cPanel UAPI calls via curl fail.
- **Root cause:** Bluehost blocks direct port 2083 access from external IPs. Only accessible via browser.
- **Fix applied:** Navigate browser to americanservicesar.com:2083, log in (ericaqw6 / Addieleobell@1), then use `fetch()` via JS console to call UAPI: `fetch('/cpsessXXXXXX/execute/Fileman/save_file_content', {method:'POST', body:params})`.
- **Prevention rule:** For Bluehost cPanel file operations: browser + JS fetch only. Never try curl to port 2083.

### 2026-05-06 — Meta Ads: empty audience targeting after TOS-pending build
- **Agent:** Emmie / Claude (Meta Ads setup)
- **What went wrong:** Ad sets built while Custom Audiences TOS was pending had empty targeting after TOS was accepted — audiences existed but weren't wired to ad sets.
- **Root cause:** Meta silently skips audience assignment when TOS is pending at build time. No error returned.
- **Fix applied:** Re-wired all 5 ad sets to correct audiences via API post-TOS acceptance.
- **Prevention rule:** Always accept Custom Audiences TOS BEFORE building ad sets. After TOS, verify each ad set has targeting_spec.custom_audiences populated.

### 2026-05-06 — Meta dedup blocks 2%/3% HCP lookalike after deletion
- **Agent:** Emmie / Claude (Meta Ads setup)
- **What went wrong:** Deleted 2% and 3% HCP lookalike audiences could not be recreated from the same source — Meta dedup silently blocks it.
- **Root cause:** Meta dedup logic prevents recreating lookalikes with identical source + ratio combos even after deletion.
- **Fix applied:** Built from alternate source: website visitors 90d and 30d instead of HCP customer list.
- **Prevention rule:** Never delete lookalike audiences expecting to recreate from same source. If must rebuild, use a different source audience or different ratio.

### 2026-05-06 — Token typo in bash produces malformed access token
- **Agent:** Claude/general (Meta Ads API)
- **What went wrong:** Access token constructed in bash was malformed — API returned invalid token error.
- **Root cause:** Token value had a typo introduced during variable assignment. bash string interpolation is fragile for long tokens.
- **Fix applied:** Read token directly from build_ads.py config file, never re-type inline.
- **Prevention rule:** Always read API tokens from the source file (build_ads.py, .env, credentials sheet). Never retype long tokens in bash — copy-paste or read programmatically.

### 2026-05-03 — n8n GET+PUT workflow update strips all Slack node metadata
- **Agent:** n8n/automation
- **What went wrong:** All 16 scheduled workflows had Slack nodes break after a workflow update cycle — nodes lost their channel/message configuration silently.
- **Root cause:** n8n public API GET returns Slack nodes without full metadata. Subsequent PUT overwrites with the incomplete version.
- **Fix applied:** Replaced all Slack nodes with HTTP Request nodes using slackApi credential (ID: 6yUg4MuD1ruBxZQY) — these survive GET+PUT cycles intact.
- **Prevention rule:** Never use native n8n Slack nodes in scheduled workflows that may be updated via API. Use HTTP Request + slackApi credential instead.

<!-- New entries go above this line, newest first -->
