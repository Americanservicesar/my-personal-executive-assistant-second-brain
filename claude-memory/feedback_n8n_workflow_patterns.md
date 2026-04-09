---
name: n8n Workflow Patterns & Pitfalls
description: Hard-won lessons from building/debugging the ASAR autonomous agent workflow — memory limits, credential handling, connection naming, error resilience
type: feedback
---

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

## Credential Re-application on Every PUT

n8n REST API strips credential bindings on GET responses. Every PUT must re-apply ALL credentials from known IDs.

**Why:** Without re-applying, workflow fails validation with "Missing required credential" errors.

**How to apply:** Every update script must include the full credential map and type-to-credential mapping loop.

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
