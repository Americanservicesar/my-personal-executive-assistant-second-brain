---
name: n8n Workflow Patterns
description: Confirmed patterns, rules, and anti-patterns for building n8n workflows in the ASAR agent ecosystem
last_updated: 2026-05-01
type: reference
---
# n8n Workflow Patterns

## Rule 1: Code Nodes Are for Data Transformation ONLY

n8n cloud sandboxes Code nodes and **blocks all outbound network access**. The following all fail in Code nodes:
- `$http.request()`
- `fetch()`
- `$helpers.httpRequest()`
- `require('https')`
- `require('axios')`

**Correct architecture:**
```
Code (prepare/transform) -> HTTP Request (API call) -> Code (parse response) -> HTTP Request (next call)
```

**Never** attempt HTTP inside a Code node. Any Code node that makes API calls must be split:
1. Code node: build the payload/parameters
2. HTTP Request node: execute the call
3. Code node (optional): parse/transform response

**Confirmed broken workflows fixed by this rule:**
- `d8xiKaMU7rZ0Ldxp` -- HCP Placeholder Code node replaced with 8 proper nodes (2026-05-01)

---

## Rule 2: Node Reference Safety -- Search Before Renaming

When you rename or delete a node, **always search all other nodes** in the workflow for references to the old name before saving.

Expression references use the pattern: `$('NodeName').first().json.fieldName`

If a downstream node still references the old name, the workflow throws "referenced node not found" at runtime.

**Example fix (2026-05-01):**
- Old: `$('HCP Placeholder').first().json.goodPrice`
- After renaming: `$('Prepare HCP Data').first().json.goodPrice`

---

## Rule 3: HCP API -- Amount is in Cents

HousecallPro stores all monetary values (`total_amount`, `unit_price`) in **cents** as integers.
Always divide by 100 before storing in GHL or displaying to users.

```javascript
const dollarAmount = hcpOption.total_amount / 100; // e.g., 175500 -> $1,755.00
```

---

## Rule 4: G/B/B Estimate Value -- Use "Better" Option Only

When calculating the value of a G/B/B estimate for GHL pipeline tracking, use the **Better** (middle) option only.

**Wrong:** `.reduce((s, opt) => s + opt.total_amount, 0)` -- sums all 3 options (~3x the real value)

**Correct:** Find the option whose name contains "Better" (or use middle index as fallback), use that `total_amount` only.

---

## Rule 5: HCP Webhook Event Stage Mapping

Only map events to pipeline stages when the customer-facing action has actually occurred.

| Event | Correct Stage | Rationale |
|-------|--------------|-----------|
| `estimate.created` | Estimate Scheduled | Estimate exists in HCP |
| `estimate.option.created` | null (no stage change) | Internal step -- fires 3x for G/B/B; customer has not seen it |
| `estimate.sent` | Estimate Sent | Anthony clicked Send -- customer received estimate |
| `estimate.option.approval_status_changed` (approved) | Estimate Approved | Customer approved |
| `estimate.copy_to_job` | Job Scheduled | Converted to job |

**Rule:** Option creation events (`estimate.option.created`) must NEVER trigger stage changes.

---

## Rule 6: n8n Workflow PUT -- Strip settings Object

When doing `PUT /workflows/{id}` via REST API, strip the `settings` object down to only `executionOrder`.

Extra fields cause: `HTTP 400 "request/body/settings must NOT have additional properties"`

Correct: `{"executionOrder": "v1"}`
Wrong: `{"executionOrder": "v1", "binaryMode": true, "availableInMCP": true, ...}`

---

## Rule 7: n8n API GET Does Not Return Credentials

n8n API `GET /workflows/{id}` responses do NOT include credential bindings on nodes.

When you `PUT` a workflow back, you must manually re-add credentials to every node. Pull credential IDs from agent reference docs, not from the GET response.

---

## Rule 8: executeWorkflow Settings

Correct pattern for calling a standalone agent workflow from an orchestrator:

```json
{
  "workflowId": {"__rl": true, "value": "WORKFLOW_ID", "mode": "id"},
  "options": {"waitForSubWorkflow": false}
}
```

`waitForSubWorkflow: false` = fire and forget (async). Agent posts results to Slack independently.

---

## Rule 9: Agent Standalones Use json.query (NOT json.chatInput)

All 12 agent standalone workflows use the field name `query` as their input, NOT `chatInput`.

Set node must output: `{"query": "your prompt here"}`

---

## Rule 10: wpautop Breaks CSS Style Blocks

Blank lines inside `<style>` blocks in WordPress content cause `wpautop` to inject `<p>` tags, breaking all CSS.

**Fix:** Minify the style block to a single line when pushing via REST API. No blank lines inside `<style>...</style>`.
