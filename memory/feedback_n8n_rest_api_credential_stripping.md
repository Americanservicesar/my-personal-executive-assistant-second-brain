---
name: n8n REST API — GET→PUT Fails Due to Credential Stripping
description: Why GET /api/v1/workflows/{id} → PUT /api/v1/workflows/{id} returns 500 for complex workflows
type: feedback
last_updated: 2026-05-18
originSessionId: bdcb80a7-7e4c-4779-973e-e4aa123ce8da
---

## Problem

Attempting to GET a complex workflow (e.g. Vizzy orchestrator JAYrzGWR8A0tCBzB) and PUT it back after a text edit causes **HTTP 500 Internal Server Error** from n8n.

## Root Cause

The n8n public REST API (`/api/v1/`) **strips credential bindings** from GET responses. When you PUT back the modified JSON without credential IDs attached to nodes, n8n returns 500.

**Confirmed**: `grep "credentials"` on a 603k-char GET response found ZERO credential objects.

## What Works

| Method | Works? | Notes |
|--------|--------|-------|
| n8n MCP `update_workflow` (SDK format) | ✅ | Generates fresh workflow from SDK, sets credentials via `newCredential()` or leaves them out for hardcoded-header workflows |
| n8n MCP `update_workflow` for simple workflows (Estimate Engine) | ✅ | Works because Estimate Engine only uses hardcoded Authorization headers, no n8n credential objects |
| PowerShell Invoke-RestMethod GET→PUT | ❌ | 500 — credentials stripped on GET, workflow breaks on PUT |
| Python urllib GET→PUT | ❌ | DNS fails on this machine anyway |
| n8n Code node `fetch()` | ❌ | `fetch is not defined` in n8n's task runner |

## What Doesn't Work

- GET /api/v1/workflows/{id} → modify raw JSON → PUT /api/v1/workflows/{id}
- ANY approach that round-trips through the public REST API for workflows with real n8n credential objects (OpenAI, Google, GHL, Slack, etc.)

## Correct Approaches for Complex Workflow Edits

1. **n8n UI**: Log in → open workflow → click node → edit parameter directly. Safest for system message / text edits.
2. **n8n MCP SDK format**: Only viable if you can reconstruct the entire workflow in SDK syntax. Not practical for 600k+ char workflows with AI agent subnodes.
3. **API key rotation**: If editing is truly required via API, you'd need to know all credential IDs and re-apply them — not practical without credential ID documentation.

## Specific Pending Edit (as of 2026-05-18)

**Vizzy orchestrator** (JAYrzGWR8A0tCBzB) — "Vizzy - Supervisor Agent" node (ID: `d91623a2-dd4a-45d6-a6aa-bf34ee152a6f`)

In the `options.systemMessage` parameter, add this line BEFORE "Anything else or unclear":

```
  - Window cleaning / window wash / window washing --> "window_cleaning"
```

Full context (find this block and insert the new line):
```
  - Hydrojetting / drain cleaning / PVC underground drain --> "hydrojetting"
  - Window cleaning / window wash / window washing --> "window_cleaning"    ← ADD THIS LINE
  - Anything else or unclear --> "other"
```

**n8n UI path**: n8n → Workflow `JAYrzGWR8A0tCBzB` → Click "Vizzy - Supervisor Agent" node → Parameters → System Message → Find the service mapping section → Add the line.

## Note on API Keys

The API key used in the original session (`eyJ...exp:1753054400`) was **expired** (July 2025).

Current active keys (from reference_n8n_api.md):
- `claude-code`: read/query only
- `claude-workflow-save`: PUT/POST operations

Use `claude-workflow-save` key for any future PUT attempts.
