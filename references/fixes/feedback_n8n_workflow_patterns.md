---
name: n8n Workflow Patterns & Pitfalls
description: Hard-won lessons from building/debugging the ASAR autonomous agent workflow — memory limits, credential handling, connection naming, error resilience
type: feedback
originSessionId: c64d9896-a60a-4412-b24f-5f15bcd98a67
---

## availableInMCP — How to Preserve via API PUT (2026-04-17)

`availableInMCP: true` CAN be included in the PUT body settings — but ONLY if you strip all other non-standard settings first.

**Working pattern:**
```python
put_body["settings"] = {
    "executionOrder": "v1",
    "callerPolicy": "workflowsFromSameOwner",
    "errorWorkflow": "TL5bO1l7QCI3XIAm",
    "availableInMCP": True   # This works when other non-standard fields are absent
}
```

**Why it failed before:** The PUT was including `binaryMode`, `timeSavedMode`, and `timeSavedPerExecution` alongside `availableInMCP`. AJV schema validation rejects the combination. Keeping only the core settings + `availableInMCP` passes validation.

**How to apply:** Always build your PUT settings from scratch with just the 4 fields above — do NOT copy the full GET settings object into the PUT body.

## Workflow Deactivate/Activate Endpoints

- Deactivate: `POST /api/v1/workflows/{id}/deactivate`
- Activate: `POST /api/v1/workflows/{id}/activate`
- Neither PATCH nor DELETE work on these paths.
## WordPress API Updates Use POST, Not PATCH

WordPress REST API uses **POST** to update existing resources, NOT PATCH. Seomi's WordPress HTTP tool must use method POST when updating pages. PATCH returns success but doesn't actually change anything.

**Why:** Seomi reported "success" for 27 page status changes but none actually applied because the tool used GET or PATCH instead of POST.

**How to apply:** When updating WordPress pages/posts, always use POST to the specific resource URL (e.g., POST /wp-json/wp/v2/pages/3742 with body {"status":"draft"}).

## WordPress API Memory

Always use `_fields=id,title,slug,status,modified` when listing pages/posts via WordPress REST API. Without it, the API returns full HTML content for every page, which blows n8n Cloud memory on 80+ page sites.

**Why:** n8n Cloud has memory caps. Full WP API responses for 80 pages = tens of MB, causes "Execution stopped" OOM errors.

**How to apply:** Baked into the WordPress tool description for Seomi. When building new WP integrations, always default to `_fields` parameter.

## n8n Connection Direction

Tool nodes connect TO agent nodes, not FROM. The connection format is:
```
connections["Tool Name"] = {"ai_tool": [[{"node": "Agent Name", "type": "ai_tool", "index": 0}]]}
```

**Why:** Got burned when new tools connected to wrong node name ("Seomi - SEO Agent" vs actual "Seomi - SEO Specialist"). Always verify exact node names with a GET before adding connections.

**How to apply:** Before adding tools, GET the workflow and check actual agent node names. Never assume from reference docs — they can be stale.

## Credential Re-application on Every PUT (Public API)

n8n public REST API (`/api/v1/workflows/:id`) strips credential bindings on GET responses AND wipes credential associations on PUT. NEVER use the public API to update workflows with credentials.

**Why:** PUT with empty `credentials: {}` on nodes deletes the credential binding rows in n8n's database. Restoring from version history does NOT fix this — version history also stores `credentials: {}`.

**How to apply:** Use the **n8n internal REST API** instead: `PATCH /rest/workflows/:id` (accessible from the browser with session cookies via `fetch('/rest/workflows/:id', {credentials:'include'})`). This endpoint properly reads and stores credential references from the node `credentials` property.

**Full rescue process when credentials are wiped:**
1. Load the workflow in browser — Pinia `workflows` store has all nodes
2. Get all available credentials via `pinia._s.get('credentials').credentials`
3. Map node types to credential types and directly set `node.credentials = {credType: {id, name}}` on each node in `wfStore.workflow.nodes`
4. `JSON.parse(JSON.stringify(nodes))` to strip Vue proxy metadata
5. `PATCH /rest/workflows/:id` with the clean nodes payload (include `versionId` from a fresh GET)
6. Activate via `POST /api/v1/workflows/:id/activate`

**Node type → credential type map (ASAR workflow):**
- `lmChatOpenAi` → `openAiApi: fMfNln3kzNasVG9K`
- `gmailTool` → `gmailOAuth2: BzBgoySpZrWPcE09`
- `googleCalendarTool` → `googleCalendarOAuth2Api: qOq56coC8TDB9EuE`
- `googleSheetsTool` → `googleSheetsOAuth2Api: Tpo5kkkuG9qiBBvf`
- `googleDriveTool` → `googleDriveOAuth2Api: Hu80FNVrNnpo62Fj`
- `googleDocsTool` → `googleDocsOAuth2Api: Wr90fsShYFRj1K5Q`
- `airtableTool` → `airtableTokenApi: flYD85xUURg7jDi7`
- `slackTool` → `slackOAuth2Api: lopIua3GVl7ESuOs`
- `slackTool` (Vizzy only — "Slack Tool - Vizzy") → `slackApi: 6yUg4MuD1ruBxZQY`
- `telegramTrigger` / `telegram` → `telegramApi: IJ4MKsmQlba3y6iT`
- `toolSerpApi` → `serpApi: W674ZSbrWCALEVEp`
- `slack` (base) → `slackOAuth2Api: lopIua3GVl7ESuOs`
- `quickBooksOAuth2Api` → `T1Uyc7utOiuqYJWO` (already persisted, not wiped)

## continueOnFail for Resilient Workflows

Set `onError: "continueRegularOutput"` on ALL tool nodes and agent nodes. Without this, a single tool failure (quota exceeded, 404, auth error) crashes the entire execution.

**Why:** During the Seomi audit, SerpApi errors, PageSpeed quota limits, and GBP access issues each killed the whole workflow.

**How to apply:** Set on every node in the workflow, not just the ones you expect to fail. But beware: continueOnFail can mask real failures (like the WordPress PATCH issue). Always verify actual results, not just execution status.

## Telegram/Chat Trigger Routing

The ASAR workflow has two entry points: Chat Interface and Telegram Trigger. Post-Vizzy output nodes reference `$("Format for Vizzy")` which only exists in the Telegram path.

**Fix:** Wrap all references in `$if($("Format for Vizzy").isExecuted, ..., "")` AND set `onError: continueRegularOutput`.

## Google API Auth in n8n

- `googleApi` credential type = Service Account. Unreliable for GA4/GBP.
- `googleOAuth2Api` credential type = User OAuth2. Works for all Google APIs with proper scopes.
- Custom OAuth client required (not n8n's built-in). Redirect URI: `https://oauth.n8n.cloud/oauth2/callback`

## Splitting Large Audit Runs

n8n Cloud memory limits mean max 3-5 tool calls per execution. Split into batches.

## PageSpeed Insights Quota

~25 calls/day free. Don't burn during testing.

---

## GHL Workflow Trigger: "Tag Added" Does NOT Fire from API

**Critical finding (confirmed 2026-04-15):** GHL "Tag Added" workflow triggers only fire when a tag is added via the GHL UI (manually by a user). Adding tags via the REST API (`POST /contacts/{id}/tags` or `PUT /contacts/{id}` with tags array) does NOT trigger "Tag Added" workflow automation — even with a 3-minute wait.

**What works instead:** Use the GHL Workflow Enrollment API to directly enroll a contact:
```
POST https://services.leadconnectorhq.com/contacts/{contactId}/workflow/{workflowId}
Content-Type: application/json
{}
```
This bypasses the tag trigger entirely and enrolls the contact directly. Creates the opportunity in ~1 second. ✅

**Impact on Buddy (n8n commercial prospector):** Buddy CANNOT rely on adding `commercial_lead` tag via API to trigger Workflow 1. Must use workflow enrollment API directly. Pattern for Buddy:
1. Create/upsert contact in GHL via API
2. Add `commercial_lead` tag (for CRM visibility only — does NOT fire workflow)
3. Call workflow enrollment API with Workflow 1 ID: `481aecbf-0328-4f57-93aa-ebb1ffbdf599`

**Also applies to:** Any n8n automation that adds tags expecting GHL workflows to fire. Always use enrollment API for guaranteed trigger.

## GHL Calendar API: widgetSlug vs slug

When creating GHL calendars via API, the field for the booking URL slug is `widgetSlug` (NOT `slug`). The `slug` field returns a 422 error. Booking URL format: `https://link.myservicerobot.com/widget/bookings/{widgetSlug}`.

Also: `calendarType: "event"` does not support team member assignment. For single-user estimate calendars, create with `event` type, assign user via GHL UI (Users → user → Calendars tab).

## GHL Calendar API: PUT Overwrites Notifications

Every PUT to `/calendars/{id}` resets the `notifications` array to empty if not included. Always include notifications in EVERY update call. Lesson: always send the full desired state, not just the fields you want to change.

## GHL "Your version is outdated" Error in Workflow Builder

GHL workflow builder is a SPA that caches local state. If the page has been open for a long time and you try to save, you get "Your version is outdated." Fix: navigate away (confirm "leave with unsaved changes" dialog), come back fresh, redo changes.

## Google Sheets Tool Default Operation Is Read-Only

All 11 `googleSheetsTool` nodes in the ASAR workflow were deployed with `operation: "read"`. Agents trying to WRITE to sheets silently return `value: []` (empty array) — no error, no row appended. This looks like a timeout or access issue but is actually just the wrong operation.

**Fix:** Change node `parameters.operation` from `"read"` to `"appendOrUpdate"` and add a `columns` block:
```json
"columns": {
  "mappingMode": "defineBelow",
  "value": {"ColName": "={{ $fromAI('paramName', 'description', 'string') }}"},
  "matchingColumns": [],
  "schema": [{"id": "ColName", "displayName": "ColName", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true}]
}
```
Also set `"descriptionType": "manual"` and `"toolDescription"` so the agent knows it's a write tool.

## $fromAI() Descriptions Must Not Contain Apostrophes

Single quotes in `$fromAI()` description strings break n8n's expression parser: `"Today's date"` → `"Unbalanced parentheses while parsing $fromAI call"`. The apostrophe closes the string argument prematurely.

**Fix:** Never use apostrophes in `$fromAI()` description arguments. Use `"Date in YYYY-MM-DD format"` not `"Today's date"`.

## Telegram Forum Topic Creation Returns Empty chatInput

Telegram "Super Group" forums allow organizing messages into topics. When a user creates a new topic, n8n's Telegram Trigger fires a `forum_topic_created` event — the message object has the topic name but no `text` field. The `Extract Telegram Input` node returns empty string for `chatInput`.

**Impact:** Vizzy sees no input and responds "No new input detected." The actual complaint text was only the topic title, not a message.

**Fix for testing:** Send a plain text message to the bot (not as a new forum topic). Real customer messages from GHL/webhooks won't have this issue.

## GHL Chrome Extension Tab Can Get Stuck

The Claude-in-Chrome extension can get stuck on a blank page with an orange "Cancel" banner — this is a GHL AI session overlay blocking the page. Fix: use `javascript_tool` to click the × button (`document.querySelectorAll('button')[0].click()`), or create a new tab via `tabs_create_mcp`. The extension tab may be in a different Chrome window than the user's main GHL session.

## `fetch` Not Available in n8n Code Nodes (v2.13.3 Cloud)

`fetch()` is NOT available in n8n Cloud Code nodes as of v2.13.3. Using it throws `ReferenceError: fetch is not defined` at runtime.

**Fix:** Replace all `fetch()` calls with `this.helpers.httpRequest()`:
```javascript
// WRONG — throws ReferenceError
const resp = await fetch('https://api.example.com/data', {headers: {...}}).then(r => r.json());

// CORRECT
const resp = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://api.example.com/data',
  headers: {'Authorization': 'Bearer ' + TOKEN},
  qs: {param: 'value'}   // query string params
});
// Returns parsed JSON directly (no .json() call needed)
```

**Also:** `Promise.all()` with `fetch` fails for the same reason. Use sequential `await` calls in a loop, or restructure into parallel branches feeding a Merge node.

## Email Safety — Never Fabricate Email Addresses in Agent Workflows

**Confirmed bug (2026-04-26):** Milli was hallucinating email addresses using `@example.com` (e.g., `carolyn.kennedy@example.com`, `Kristen.Williams@example.com`) when it could not find a verified email in the inbound notification. The Gmail Monitor workflow was passing only the raw email body to Milli without explicit instructions on how to resolve the contact's real email.

**Root cause:** The `Format Email Query` node instruction said "Upsert contact in GHL (name, email, phone if included)" — no guidance on HOW to find the email. The AI filled in the gap by fabricating an address from the person's name.

**Fix applied 2026-04-26:**
- Added CRITICAL EMAIL SAFETY block to `Format Email Query` node in workflow `mqSWSLhNl3Qy0Nyy`
- Added same block to Milli standalone system message in `BJ8RLrbjuZ8pSmAL`

**Pattern to enforce on ALL email-sending workflows:**
```
To find the prospect email:
  a. Scan notification BODY for "Email: xxx@xxx.com" — use that exact address
  b. If not in body: GET /contacts/?locationId=PQp7xlYjxZKsi0CWsSA7&query=<phone_or_name>
  c. Use email from GHL contact record
  d. If NO verified email: DO NOT SEND — post to Slack requesting the email
  e. HARD BLOCK: never send to @example.com, @email.com, or any placeholder domain
```

**Internal agent emails do not exist:** `cassie@americanservicesar.com`, `emmie@americanservicesar.com`, `penn@americanservicesar.com` — none of these are real mailboxes. Route internal alerts to `office@` or `sales@` instead.

**Why:** `example.com` is an RFC-reserved domain that explicitly rejects all email. Any send to `@example.com` will always bounce. It also reveals that the AI fabricated the address.

**How to apply:** Add the email safety block to every new Gmail Monitor or auto-reply workflow. Put it in the Format Query node AND in the agent system message.

## Fan-In Duplicate Execution — Code Nodes Run N Times

When N HTTP nodes all connect to a single downstream Code node (`runOnceForAllItems`), the Code node executes **once per upstream branch** = N times, producing N identical output sets. This causes duplicate rows in Sheets, duplicate Slack messages, etc.

**Root cause:** n8n's fan-in model triggers the Code node once for each input batch it receives, not once for all combined inputs.

**Fix option 1 — Consolidate (preferred):** Move all HTTP calls inside a single Code node using `this.helpers.httpRequest()`. Only one upstream branch → Code node runs exactly once.

**Fix option 2 — Merge node:** Insert a `n8n-nodes-base.merge` node (mode: `append`) before the Code node. All N branches feed into the Merge node's inputs (input 0, input 1, ... input N-1). Merge fires once with all items combined. Code node downstream runs exactly once.

**Pattern used in Emmie Ad Spend workflow (t2Lne2UMjeJ2cB46):**
- 7 HTTP calls (FB + 6 GHL tags) → consolidated into 1 Code node
- 1 Google Ads HTTP node (needs OAuth2 cred, can't be inside Code node) → Merge node input 1
- Code node output → Merge node → Format Code node (runs exactly once, no duplicates)

## HTTP Request Tool Node — Required Format for AI Agent Tools

When adding HTTP Request Tool nodes to AI agent workflows:

**typeVersion MUST be 4.4** — NOT 1.1. Using 1.1 causes `Cannot read properties of undefined (reading 'supplyData')` error when uploading via API.

**POST body requires:**
- `"specifyBody": "json"` (NOT `"contentType": "json"`)
- `"jsonBody": "={{ $fromAI('body', '...', 'string') }}"` (NOT `"body": "..."`)

**$fromAI() expressions:** Use single quotes inside the expression. Double quotes inside cause parse errors.

**Working POST with JSON body pattern (verified 2026-04-26):**
```json
{
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ $fromAI('body', 'Description here', 'string') }}"
}
```

**For predefined credentials in tool nodes:** `authentication: "predefinedCredentialType"` + `nodeCredentialType: "googleAdsOAuth2Api"` works at typeVersion 4.4.

**Google Service Account for GSC tool:** Use `nodeCredentialType: "googleApi"` with credential `nWnxAUry9O6tRyTm` (Google Service Account account). This gives SA-based auth to GSC/Search Console APIs.

---

## n8n v2 IF Node: `boolean.equal` Never Matches — Use `boolean.true`

**Confirmed bug (2026-04-28):** In n8n v2 IF nodes, the operator `{"type":"boolean","operation":"equal"}` with `rightValue: true` NEVER correctly matches a JavaScript boolean `true` returned from a Code node — even when the value clearly equals true. Executions silently route to the false/drop path every time.

**Fix:** Change the operator to `{"type":"boolean","operation":"true"}` with NO `rightValue` field. This checks truthiness instead of equality and works correctly.

```json
// WRONG — never matches boolean true from Code nodes
{"type": "boolean", "operation": "equal", "rightValue": true}

// CORRECT — works in n8n v2
{"type": "boolean", "operation": "true"}
```

**Affected workflows confirmed:** `d8xiKaMU7rZ0Ldxp` (Address Processor — Has Valid Input), `4XY3iZmgB6jm4YlD` (HCP Webhook Router — 5 IF nodes). Any workflow with IF nodes checking `$json.success`, `$json.contactFound`, `$json.oppFound`, `$json.isCompleted`, etc. is likely broken.

**How to apply:** Any time an IF node checks a boolean value from a Code node output, always use `boolean.true`. Audit all existing IF nodes when debugging silent drop/routing failures.

## n8n HTTP Request Body: `jsonBody` Must Start With `=` for Expressions to Evaluate

**Confirmed bug (2026-04-28):** In HTTP Request nodes with `specifyBody: "json"`, if the `jsonBody` string does NOT start with `=`, any `={{ expr }}` expressions inside are sent as literal strings to the API — GHL responds 422 Unprocessable Entity.

**Fix:** Prefix `jsonBody` with `=` and use `{{ expr }}` (not `={{ expr }}`) inside the string:

```json
// WRONG — sends "firstName": "={{ $json.firstName }}" literally to the API
"jsonBody": "{\"firstName\": \"={{ $json.firstName }}\"}"

// CORRECT — evaluates expressions, sends actual values
"jsonBody": "={\"firstName\": \"{{ $json.firstName }}\"}"
```

**Why:** n8n only evaluates the entire `jsonBody` value as an expression when it starts with `=`. Without the prefix, the curly-brace syntax is treated as a literal string, not an n8n expression.

**Affected nodes in HCP Webhook Router (`4XY3iZmgB6jm4YlD`):** Update GHL Stage, Create GHL Contact, Create GHL Opportunity (New), Create GHL Opportunity (No Opp), Update GHL Contact — all 5 were broken.

**Also wrong (do NOT do):** Changing `specifyBody` to `"string"` and renaming `jsonBody` to `body`. This causes n8n to parse the body as a malformed JSON object.

**How to apply:** When writing any HTTP Request node with dynamic fields, always start `jsonBody` with `=` and use `{{ }}` for expressions inside.

## HCP Webhook: `approval_status` Is Nested at `options[0]`, Not Entity Top Level

**Confirmed bug (2026-04-28):** For `estimate.option.approval_status_changed` events from HousecallPro, `approval_status` is NOT at `entity.approval_status` or `body.approval_status`. It lives at `entity.options[0].approval_status`.

**Fix:** Add `options[0]` as a fallback in the lookup chain:
```javascript
const approvalStatus = (
  body.approval_status ||
  entity.approval_status ||
  (entity.options && entity.options[0] && entity.options[0].approval_status) ||
  ''
).toLowerCase();
```

**Why it matters:** Without this fix, approval events always route as 'declined' (empty string doesn't match 'approved'), so estimates approved by customers never move GHL stage to Estimate Approved.

**How to apply:** In any HCP webhook parser handling estimate events, always check the `options` array for approval_status.

## GHL Contact Search: Always Phone-First, Email as Fallback

**Confirmed pattern (2026-04-28):** GHL contacts created from HCP often have no email (if email was blank in HCP). Phone-first search (`$json.phone || $json.email`) finds these contacts reliably. Email-first (`$json.email || $json.phone`) misses them and triggers a duplicate Create.

**Fix:**
```
// WRONG — misses contacts with no email
/contacts/?locationId=...&query={{ $json.email || $json.phone }}

// CORRECT — finds contacts even when email is null
/contacts/?locationId=...&query={{ $json.phone || $json.email }}
```

**How to apply:** In any GHL contact lookup, default to phone-first. Only use email-first if you know the contact always has an email.

## HCP Placeholder Node Is a Stub — Does Not Create HCP Customers

**Confirmed 2026-04-28:** The "HCP Placeholder" Code node in the ASAR Lead Address Processor (`d8xiKaMU7rZ0Ldxp`) contains ONLY this code:
```javascript
// Pass all data through — HCP creation bypassed until API access confirmed
return items;
```

It passes data through without creating anything in HousecallPro. Every customer who replies with their address gets moved through GHL stages and receives an SMS — but NO HCP customer record is ever created.

**Impact:** Technicians and Anthony cannot schedule or send estimates in HCP for these contacts. Manual HCP customer creation is required for every address-collected lead until this is replaced.

**Fix needed:** Replace the HCP Placeholder with real HCP API calls:
1. `POST https://api.housecallpro.com/customers` (create customer)
2. `POST https://api.housecallpro.com/customers/{id}/addresses` (add service address)
Auth: `Token 13317c556f61472e8a57c60e0bea930f`

**Manual workaround (confirmed working 2026-04-28):** Use HCP API directly to create customer + address, then PUT to add email/phone. Used for David Carver (`cus_3d3ebaca3cf843ce9e79e95b2d9a01af`).

**How to apply:** Flag any new address-collected lead for manual HCP creation until Placeholder is replaced. Log in n8n execution notes or Slack.
