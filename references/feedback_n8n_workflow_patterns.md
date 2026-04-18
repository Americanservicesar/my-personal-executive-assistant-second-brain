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
