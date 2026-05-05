---
name: Vizzy Lead Intake Protocol — Fix
description: Vizzy's CONTACT INTAKE PROTOCOL was broken — leads never reaching HCP or GHL. Fixed 2026-05-05.
type: feedback
last_updated: 2026-05-05
originSessionId: 79d692b3-68e1-4992-9671-4c274090b8bf
---
# Vizzy Lead Intake Protocol Fix

## What Was Broken
When Anthony called in lead info via Telegram, Vizzy would respond but:
1. GHL contact was created without opportunity (no pipeline stage)
2. HCP estimate was NEVER created — Milli's `HTTP - Housecall Pro` node has `method: GET` hardcoded; she cannot POST
3. Vizzy routed to Milli for HCP — Milli hallucinated success (received 404 but fabricated "customer created" message)
4. GHL contact upsert included `notes` field → 422 error

## Root Causes
- `HTTP - Housecall Pro (Milli)` node: `method: GET` hardcoded → cannot POST to create customers/estimates
- Vizzy's old protocol: no GHL opportunity creation step, no direct Address Processor call
- GHL API: `notes` field not supported on upsert endpoint (422)

## Fixed Protocol (Vizzy system message — workflow JAYrzGWR8A0tCBzB)
New 4-step CONTACT INTAKE PROTOCOL:

**STEP 1 — Create GHL contact via HTTP - HighLevel (Vizzy)**
```
POST /contacts/upsert
RULES: Never include "notes" field (422). Never send empty email. Phone must have country code +1.
```

**STEP 2 — Create GHL opportunity via HTTP - HighLevel (Vizzy)**
```
POST /opportunities/
Body: { pipelineId: "STK7CNhP5z1pNmtMckPM", locationId: "PQp7xlYjxZKsi0CWsSA7",
        name: "Service - [FirstName LastName]", contactId: [Step 1 id],
        status: "open", pipelineStageId: "e9ee8dc7-fd1c-4052-a07c-6527f16590f6" }
```

**STEP 3 — Trigger Address Processor via HTTP Request Tool (generic, NOT HighLevel)**
```
POST https://americanservicesar.app.n8n.cloud/webhook/lead-address-received
Body: { "contactId": "[Step 1]", "opportunityId": "[Step 2]",
        "message": "[full address]", "projectType": "[mapped type]" }
```
Project type mapping: gutter install → "new_gutter_install", driveway → "driveway_pw", etc.

**STEP 4 — Confirm to Anthony (fire-and-forget Step 3)**
```
"LEAD CAPTURED — [Name] | GHL contact+opportunity created | HCP estimate building (~60s) | Open HCP to review"
```

## Never Route Lead Intake Through Milli
Milli's HCP node is GET-only. All HCP create operations must go through the Address Processor webhook or be built into Vizzy's own HTTP Request Tools.
