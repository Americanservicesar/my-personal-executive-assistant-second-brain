---
name: Technical Fixes - n8n and Agent System
description: All confirmed bugs, root causes, and fixes across all sessions through 2026-04-22
last_updated: 2026-04-22
type: reference
---
# Technical Fixes and Confirmed Patterns

## n8n API - Critical Rules

### PUT Workflow - settings stripping required
When doing PUT /workflows/{id} via REST API, the settings object MUST be stripped.
Extra fields cause HTTP 400 "request/body/settings must NOT have additional properties".
CORRECT: {"executionOrder": "v1"}
WRONG: {"executionOrder": "v1", "binaryMode": true, "availableInMCP": true, ...}
Fix: always pull only settings.executionOrder from the existing workflow when building PUT payload.

### GET strips credentials - must re-apply on every PUT
n8n API GET responses do NOT include credential bindings on nodes.
When you PUT a workflow back, you must manually re-add credentials to every node.
Pull credential IDs from agent reference docs, not from GET response.

### Agent standalones use json.query (NOT json.chatInput)
All 12 agent standalone workflows use the field name "query" as their input.
Set node must output: {"query": "your prompt here"}
Confirmed by checking agent node parameters: promptType: "define", text: "={{ $json.query }}"

### executeWorkflow settings
Correct pattern for calling a standalone agent:
  workflowId: {__rl: true, value: "WORKFLOW_ID", mode: "id"}
  options: {waitForSubWorkflow: false}
waitForSubWorkflow: false = fire and forget (async, posts results to Slack)

### Gmail trigger credential type
Gmail triggers use type: gmailOAuth2 (NOT googleOAuth2Api, NOT googleApi)
Credential IDs:
  sales@americanservicesar.com: BzBgoySpZrWPcE09
  office@americanservicesar.com: lNp29NoMUGUSPSt1
  asons@americanservicesar.com: HxTcQpOYcTO7tvAe
  sonsfamily2012@gmail.com: 4v4ouylgr4wKQRRo

### Slack Error Log node - unguarded expression crash (fixed 2026-04-21)
Orchestrator node "Slack Error Log" had unguarded: $('Format for Vizzy').item.json.chatInput
Crashed when triggered via Chat or MCP (those nodes don't exist in that path).
Fix: Guard with try/catch or use $input.item.json.chatInput with fallback.

### Regex for extracting SM from markdown - DO NOT USE
Pattern: re.search(r'## System Message...') FAILS when SM contains triple-backtick code blocks.
Fix: Pull SM directly from n8n workflow via API instead of parsing markdown.

---

## QuickBooks Integration

### Root cause of QB disconnects (RESOLVED 2026-04-17)
Intuit Developer portal: Development apps can ONLY authorize Intuit Sandbox company.
American Services AR is a real QB account, not sandbox.
Fix: Complete Intuit Go Live compliance -> Production mode.
Add Production redirect URI: https://oauth.n8n.cloud/oauth2/callback
Re-auth n8n credential with Production Client ID/Secret.
QB OAuth2 tokens auto-refresh in n8n. Should not need manual reconnect.

### QB credential (PRODUCTION - WORKING)
Credential ID: T1Uyc7utOiuqYJWO
Connected to: American Services AR (realmId 123146373988304)
Test webhook: https://americanservicesar.app.n8n.cloud/webhook/dexter-qb

### QB IDS query syntax
The > operator is NOT supported in QB IDS.
WRONG: SELECT * FROM Invoice WHERE Balance > 0
CORRECT: SELECT * FROM Invoice ORDER BY DueDate DESC MAXRESULTS 100
Filter balance > 0 in a Code node after the query.

---

## Vizzy Architecture

### Vizzy has NO separate standalone workflow
Stale agent file shows standalone_workflow_id: IRW7bAYVlhIa3WDi (returns 404).
Vizzy IS the orchestrator JAYrzGWR8A0tCBzB. No separate standalone.
Vizzy operates via: Telegram trigger + Chat Interface trigger + Slack-to-Vizzy workflow.

### Orchestrator cannot be called via executeWorkflow
JAYrzGWR8A0tCBzB has Chat Interface + Telegram triggers, NOT executeWorkflowTrigger.
For scheduled tasks: call each agent STANDALONE directly.

### Penn orchestrator SM truncation (fixed 2026-04-22)
Penn's orchestrator SM was truncated to 6,592 chars due to regex hitting inner backtick block.
Fix: Pulled SM from Penn standalone via n8n API, then PUT to orchestrator. Both now 8,322 chars.

---

## Instantly Integration

### API key format - raw base64 string as Bearer token
Instantly v2 API: send the BASE64 string directly, do NOT decode to UUID:secret format.
Token stored in master credentials sheet.

### Webhook URL (n8n listening)
Workflow: x0Ir8Oq39MLnHYta (Instantly Reply Intake) - ACTIVE
Webhook path: /instantly-reply
Full URL: https://americanservicesar.app.n8n.cloud/webhook/instantly-reply
Register this in Instantly.ai > Settings > Webhooks > Reply event.

### Sending accounts (as of 2026-04-22)
cleanmycommercialproperty@gmail.com: 40/day (active)
commercialwashingpros@gmail.com: 40/day (active)
cleanpropertyexperts@gmail.com: 20/day (active)
Total: 100 emails/day - target already achieved

---

## GitHub Brain Push Pattern

Script: C:/Users/sales/OneDrive/Documents/CLAUDE/push_brain.py
Auth: PAT stored in n8n-env-template.txt line 43
CRITICAL: NEVER put PAT token directly in file content pushed to GitHub.
Secret scanning will block the push with HTTP 409.
Must GET sha before PUT to update existing files (PUT without sha = error on existing files).

### Windows emoji encoding issue
Python print() on Windows uses cp1252 by default. Emoji = UnicodeEncodeError.
Fix: Remove all non-ASCII from print statements, or run with PYTHONIOENCODING=utf-8.

---

## Workflow Activation Issues

### ASAR Master Data Sync cannot activate (ID: no1R0fVxStQuJxNT)
8 nodes with missing required parameters (url, fieldToSplitOut, application/table).
Never properly configured. Requires manual rebuild in n8n UI. Leave inactive.

### Webhook workflows need UI toggle to register
Some webhook workflows show ACTIVE via API but path is not registered until
workflow is opened in n8n UI and toggle is flipped on.
Affected: Commet-Dexter router (kAyZtGcsJ9biWh6I).

### LinkedIn OAuth expiry
LinkedIn in GHL expires approximately every 60 days.
Current expiry: May 12, 2026. Reconnect by May 5 to avoid posting blackout.
GHL sends Pre-Expiry email alerts (already enabled).
---

## 2026-04-28 — HCP Webhook Router Full Repair (4XY3iZmgB6jm4YlD)

**Problem:** Zero HCP events (estimate sent, approvals, job completion) were ever moving GHL stages. The entire pipeline tracker was silent from day one.

**Root causes (4 bugs):**

1. **n8n v2 boolean.equal never matches** — All 5 IF nodes (Has Contact Info, Contact Found, Opportunity Found, Is Job Completed x2) used `boolean.equal + rightValue: true`. In n8n v2, this NEVER matches boolean `true` from Code nodes. Every event silently dropped at the first IF node. Fix: changed all 5 to `boolean.true` (no rightValue).

2. **HCP approval_status nested at `options[0]`** — Parser was checking `entity.approval_status` (undefined). Actual path: `entity.options[0].approval_status`. Fix: added options[0] as 3rd fallback in lookup chain. Without this, approvals always mapped as 'declined'.

3. **GHL contact search email-first** — Many GHL contacts (created from HCP) have null email. Phone-first search (`$json.phone || $json.email`) finds them; email-first misses them and creates duplicate contacts. Fix: swapped order.

4. **HTTP node jsonBody expressions not evaluating** — `specifyBody: "json"` only evaluates `{{ expr }}` inside `jsonBody` when the string starts with `=`. Without the `=` prefix, GHL receives literal `={{ $json.firstName }}` strings and returns 422. Fix: prefixed all 5 HTTP node jsonBody values with `=` and replaced `={{ }}` with `{{ }}` inside.

**Verification:** Replayed real Michael King events (estimate.sent + estimate.option.approval_status_changed). Both returned `{"success":true,"action":"stage_updated","stage":"estimate_approved"}`. GHL opportunity confirmed at pipelineStageId `69428a6a` (Estimate Approved). ✅

---

## 2026-04-28 — Address Processor boolean.equal Bug (d8xiKaMU7rZ0Ldxp)

**Problem:** Address Processor executions completed in 1-2 seconds instead of 49+ seconds — Has Valid Input node was always routing to false path even when `success: true`.

**Root cause:** Same n8n v2 boolean.equal bug. `{"type":"boolean","operation":"equal","rightValue":true}` never matches boolean `true` from Code node output.

**Fix:** Changed Has Valid Input IF node operator to `{"type":"boolean","operation":"true"}` with no rightValue.

**Verification:** Execution 2080 — 49-second run, full pipeline executed through Wait node, SMS sent, stage moved to Estimate Scheduled, tags updated. ✅

---

## 2026-04-28 — HCP Placeholder Is a Stub (Address Processor)

**Finding:** The "HCP Placeholder" Code node in d8xiKaMU7rZ0Ldxp contains only:
```
// Pass all data through — HCP creation bypassed until API access confirmed
return items;
```
No HCP customer is ever created automatically. Every address-collected lead needs manual HCP customer creation via API (POST /customers + POST /customers/{id}/addresses, Token 13317c556f61472e8a57c60e0bea930f) until this is replaced with real integration.

---

## 2026-05-01 — Vizzy Orchestrator "Has Input?" Node Broken Expression (JAYrzGWR8A0tCBzB)

**Problem:** Every Telegram message sent to Vizzy errored immediately — no leads were being processed.

**Root cause:** "Has Input?" IF node (id: `has-input-guard-001`) had `leftValue: "={{ .chatInput.trim() }}"`. n8n expression syntax requires `$json.fieldName` — bare `.fieldName` without the `$json.` prefix is invalid and throws `invalid syntax` at renderExpression.

**Fix:** Changed `leftValue` to `={{ $json.chatInput.trim() }}` and added `looseTypeValidation: true`. Pushed via n8n REST API PUT.

**How to apply:** In any n8n IF/Switch node condition `leftValue` field, always use `$json.fieldName`. Never use bare `.fieldName` shorthand.

---

## 2026-05-01 — Estimate Engine new_gutter_install Routing Bug — Root Cause of HCP Never Creating Estimates (KffILLHBKDAG4RYf)

**Problem:** HCP estimates were never automatically created for new gutter installation leads. The "HCP Placeholder" node was unreachable. Leads went to SMS-only custom quote branch instead.

**Root cause:** `new_gutter_install` was hardcoded in the `CUSTOM_QUOTE_SERVICES` array in the Estimate Engine's Calculate Price node. This caused the engine to return `{success:false, needsCustomQuote:true}` with no `price` field for all gutter install jobs. The downstream `Estimate Calculable` IF node checks `$json.price` not empty — always false — so it always routed to the custom quote (SMS-only) branch, completely skipping HCP Placeholder.

**Fix:** Removed `new_gutter_install` and `new_gutter_installation` from `CUSTOM_QUOTE_SERVICES`. Added LF-based G/B/B pricing block:
```javascript
if (service === 'new_gutter_install' || service === 'new_gutter_installation') {
  const lf = linearFt || 150;
  const goodPrice   = Math.round(lf * 7.50 / 5) * 5;
  const betterPrice = Math.round(lf * 9.00 / 5) * 5;
  const bestPrice   = Math.round(lf * 11.00 / 5) * 5;
  return [{json:{
    success: true, serviceName: '6" Seamless Gutter Installation',
    price: betterPrice, priceLow: goodPrice, priceHigh: bestPrice,
    goodPrice, betterPrice, bestPrice, linearFt: lf, isGBB: true,
    contactId: inp.contactId||null, opportunityId: inp.opportunityId||null
  }}];
}
```

Pricing: Good = LF x $7.50, Better = LF x $9.00, Best = LF x $11.00 (rounded to nearest $5).

---

## 2026-05-01 — HCP Placeholder Upgraded to Full G/B/B Estimate Creation + Slack Alert (d8xiKaMU7rZ0Ldxp)

**Problem:** HCP Placeholder Code node was a pass-through stub (`return items;`). No HCP estimates were ever created automatically.

**Fix:** Replaced stub with full implementation:
1. Search HCP for existing customer by name, match on phone or email
2. Create HCP customer if not found (with service address)
3. Build G/B/B estimate options array when `est.isGBB` is true, single option otherwise
4. POST estimate to HCP (status: needs scheduling = pending Anthony review)
5. PUT GHL contact custom fields: HCP ID, address, AI Handled=Yes, good/better/best prices
6. PUT GHL opportunity monetary value to betterPrice
7. POST Slack alert to #milli-sales (C0AQN7QDEP7) via `$env.SLACK_BOT_TOKEN`

**G/B/B option name format:** `6" Seamless Gutter Installation - Good/$X`, `- Better (Recommended)/$X`, `- Best/$X`

**Note:** Slack alert requires `SLACK_BOT_TOKEN` env var to be set in n8n instance settings. Verify this is configured.

---

## 2026-05-01 — Commercial Pipeline Routing Rule Added

**Rule:** Any lead that includes a company/business name must be routed to the Commercial Master Pipeline (`OyuNwhoc79Lb8YS7h3kg`), starting at stage "New Commercial Lead" (`deb10121-eaa4-49ac-be06-7aa266a0bd0b`). Tag contact with `commercial`.

**Residential pipeline** (`STK7CNhP5z1pNmtMckPM`) is for individuals with no company affiliation.

**Why:** Commercial jobs (churches, apartments, businesses) have a different sales process — site walk, tier identification, proposal — vs. residential estimate flow.

**How to apply:** This rule must be enforced in the Vizzy orchestrator lead intake logic and documented in Vizzy's system message. Examples: "Central Baptist Church" → commercial. Individual homeowner → residential.

---

## 2026-05-01 — HCP Webhook Router: estimate.option.created Prematurely Moving Stage to "Estimate Sent" (4XY3iZmgB6jm4YlD)

**Problem:** When the automation created a G/B/B estimate in HCP (3 options), HCP fired `estimate.option.created` three times. The HCP Webhook Router had this mapped to `'estimate_sent'` stage, so GHL contacts were automatically moved to "Estimate Sent" immediately after estimate creation — before Anthony ever reviewed or sent the estimate.

**Root cause:** In `Parse HCP Event` Code node, EVENT_STAGE_MAP had:
```javascript
'estimate.option.created': 'estimate_sent',
```
Options being created on an estimate is NOT the same as the estimate being sent to the customer.

**Fix:** Changed mapping to `null` (value sync only, no stage change):
```javascript
'estimate.option.created': null, // options created ≠ estimate sent; stage set only on estimate.sent
```

**Correct pipeline flow:**
1. `estimate.created` → Estimate Scheduled (estimate exists, pending Anthony review)
2. `estimate.option.created` → null (no stage change — just building options)
3. `estimate.sent` → Estimate Sent (Anthony clicked Send in HCP)
4. `estimate.option.approval_status_changed` (approved) → Estimate Approved
5. `estimate.copy_to_job` → Job Scheduled

**How to apply:** Never map option-creation events to pipeline stages. Only `estimate.sent` should trigger "Estimate Sent" stage.

---

## 2026-05-01 — G/B/B Gutter Option Names Updated — Good/Better/Best Now Reflect Guard Tiers (d8xiKaMU7rZ0Ldxp)

**Change:** HCP Placeholder G/B/B estimate options for new gutter installation updated to reflect actual product tiers:

| Tier | Name | What's Included |
|---|---|---|
| Good | 6" Seamless Gutter Installation - Good | Basic K-style aluminum + downspouts |
| Better | 6" Seamless Gutter Installation - Better | Gutters + GutterRX gutter guards |
| Best | 6" Seamless Gutter Installation - Best | Gutters + Leafblaster Pro gutter guards |

Better and Best now have 2 line items each: one for gutters (at Good price) + one for guards (at the upgrade delta).

**Why:** Guards are a separate upsell product with a specific brand name. "Micro-mesh guards" was too generic — customer needs to see exactly what they're getting.

---

## 2026-05-01 — HCP Estimate Chain Fixes (Multiple Workflows)

### Fix 1: n8n Code Node — No Outbound HTTP Allowed

**Problem:** n8n cloud Code nodes cannot make ANY outbound HTTP calls. All of these fail silently or with errors:
- `$http.request()`
- `fetch()`
- `$helpers.httpRequest()`
- `require('https')`

**Root cause:** n8n cloud sandboxes Code nodes and blocks all network access.

**Rule:** Code nodes = data transformation ONLY. HTTP Request nodes = all API calls.

**Correct pattern:**
```
Code (transform/prepare) → HTTP Request (API call) → Code (parse response) → HTTP Request (next call)
```
Never attempt HTTP inside a Code node. Refactor any existing Code nodes that make HTTP calls into separate HTTP Request nodes.

**Affected workflow:** `d8xiKaMU7rZ0Ldxp` (ASAR Lead Address Processor) — HCP Placeholder node was attempting HTTP calls, fixed by splitting into 8 proper nodes.

---

### Fix 2: HCP Webhook Router — G/B/B Value Calculation Using Wrong Total

**Problem:** Router was summing ALL 3 option `total_amount` values for G/B/B estimates (Good+Better+Best ≈ $5,364 instead of the correct ~$1,755).

**Root cause:** `Parse HCP Event` Code node used `.reduce((s, opt) => s + opt.total_amount, 0)` which summed all options.

**Fix:** Find the "Better" option by name match (or middle index as fallback); use that option's `total_amount` only.

**Additional note:** HCP stores `total_amount` in **cents** — always divide by 100 to get dollar value for GHL.

**Workflow:** `4XY3iZmgB6jm4YlD` (HCP Webhook Router), node: `Parse HCP Event`

---

### Fix 3: Address Processor — HCP Placeholder Restructured into 8 Proper Nodes

**Problem:** A single `HCP Placeholder` Code node attempted to make HTTP calls to both HCP and GHL APIs. This fails completely in n8n cloud (see Fix 1 above).

**Fix:** Replaced `HCP Placeholder` with 8 properly separated nodes:

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | Prepare HCP Data | Code | Transform/format input data |
| 2 | HCP Search Customer | HTTP GET | Search for existing HCP customer by email/phone |
| 3 | HCP Create Customer | HTTP POST (continueOnFail) | Create new HCP customer if not found |
| 4 | Resolve HCP Customer ID | Code | Pick existing or newly created customer ID |
| 5 | Build Estimate Body | Code | Assemble G/B/B estimate payload |
| 6 | HCP Create Estimate | HTTP POST | Create estimate with 3 options in HCP |
| 7 | GHL Update Contact | HTTP PUT | Update GHL contact with HCP customer ID |
| 8 | GHL Update Opportunity | HTTP PUT | Move opportunity to correct pipeline stage |

**Workflow:** `d8xiKaMU7rZ0Ldxp` (ASAR Lead Address Processor)

---

### Fix 4: Send Ack SMS — Stale Node Reference After Rename

**Problem:** After deleting `HCP Placeholder` and replacing it with the 8-node chain, the `Send Ack SMS` node still referenced `$('HCP Placeholder').first().json.goodPrice` — causing a "referenced node not found" error.

**Fix:** Updated all references to point to the new node:
- `$('HCP Placeholder').first().json.goodPrice` → `$('Prepare HCP Data').first().json.goodPrice`
- `$('HCP Placeholder').first().json.bestPrice` → `$('Prepare HCP Data').first().json.bestPrice`

**Lesson:** Whenever you rename or replace a node, search ALL other nodes in the workflow for references to the old node name before saving.

---

### Fix 5: G/B/B Gutter Option Names — Exact Names Required

**Confirmed canonical G/B/B option names for new gutter installation estimates:**

| Tier | Exact Name | Contents |
|------|-----------|----------|
| Good | 6" Seamless Gutter Installation - Good | Basic 6" K-style aluminum gutters + downspouts |
| Better | 6" Seamless Gutter Installation - Better | Gutters (Good price) + GutterRX gutter guards |
| Best | 6" Seamless Gutter Installation - Best | Gutters (Good price) + Leafblaster Pro gutter guards |

Better and Best each have 2 line items: one for gutters at Good tier price, one for the guard upgrade delta.

The router identifies the "Better" option by matching the name containing "Better" — these exact names must be preserved.


## 2026-05-03 — Cassie Email Duplication Bug

**Problem:** Cassie sent a job scheduled booking confirmation email from office@ to a customer. GHL workflows already handle all transactional customer notifications (job scheduled, appointment reminders, estimates). Cassie duplicating these causes double-emails and confuses customers.

**Fix:** Added `## EMAIL — WHAT CASSIE MUST NEVER SEND` prohibition block to Cassie's system message in workflow `X9OndKjPk1rspj5l`. Approved email categories: complaint resolution, post-job follow-up (24+ hrs after complete), review requests, direct replies to inbound emails, retention/win-back.

**Rule for all agents with Gmail tools:** GHL owns all transactional notifications. Agents supplement (follow up, escalate, reply) — never duplicate what GHL auto-sends.


## WordPress Plugin Crash — PixelYourSite Reddit Module (2026-05-05)

### What Crashed
PixelYourSite plugin auto-update pushed corrupt `reddit.php` — PHP fatal error took down entire site.

### Error
```
PHP Fatal error: Namespace declaration statement has to be the very first statement
in /home1/ericaqw6/public_html/wp-content/plugins/pixelyoursite/modules/reddit/reddit.php line 4
```

### Diagnostic
```bash
curl -s -H "Range: bytes=-30000" https://americanservicesar.com/wp-content/debug.log | grep -i fatal
```

### Fix
Used cPanel UAPI to overwrite the broken file with a valid PHP namespace stub.
Full fix details: `references/fixes/feedback_wp_pixelyoursite_crash.md`

### Prevention
- Disable auto-updates on all plugins
- Manual plugin updates only, check changelog first
- Keep debug.log enabled for fast diagnostics
