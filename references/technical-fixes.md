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
