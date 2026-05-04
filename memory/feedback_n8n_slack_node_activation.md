---
name: n8n Slack Node Activation Fix
description: GET+PUT breaks Slack node activation; use HTTP Request node with slackApi credential instead
type: feedback
last_updated: 2026-05-03
originSessionId: 0a48a353-6237-4cd8-8a18-1312f0ecf31a
---
## Rule
Never use `n8n-nodes-base.slack` nodes in workflows updated via the REST API. Use `n8n-nodes-base.httpRequest` with predefined `slackApi` credential instead.

**Why:** n8n's GET endpoint strips internal UI metadata from Slack nodes (`select` parameter, `__rl` resourceLocator wrappers). When you PUT the workflow back and try to activate it, n8n's validator rejects with: `"Missing required credential: slackApi"` and/or `"Missing or invalid required parameters: select"`. This affects ALL Slack node typeVersions including v2.3. Even workflows that were ACTIVE before break when deactivated and re-activated via API.

**How to apply:**
1. Credential IDs: `slackApi` type = `6yUg4MuD1ruBxZQY` ("Slack account"); `slackOAuth2Api` type = `lopIua3GVl7ESuOs` ("Slack OAuth2 API")
2. Use this node structure for any Slack post:
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "parameters": {
    "method": "POST",
    "url": "https://slack.com/api/chat.postMessage",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "slackApi",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {"name": "channel", "value": "CHANNEL_ID"},
        {"name": "text", "value": "message text here"}
      ]
    },
    "options": {}
  },
  "credentials": {
    "slackApi": {"id": "6yUg4MuD1ruBxZQY", "name": "Slack account"}
  }
}
```
3. When converting existing workflows: remove any `"webhookId"` from old Slack nodes
4. Fixed all 16 scheduled workflows on 2026-05-03 — all ACTIVE
