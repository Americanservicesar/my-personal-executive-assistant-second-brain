---
name: RMP Pipeline Changes — Revert Log
description: Full log of every change made to Residential Master Pipeline (RMP) n8n workflows and GHL workflows — use this to revert if needed
type: project
---

All changes made across multiple sessions to the RMP pipeline and Milli SMS automation.
**Why:** Build out the Milli AI text agent for inbound lead handling (new lead greeting → address collection → estimate).
**How to apply:** If Anthony says "revert all changes ever made to RMP pipeline," undo everything listed below.

---

## GHL Workflow Changes

### 1. "1. New Lead (RMP)" (ID: `8ebab856-e87e-4338-b0c7-fbacab1dc524`)
**What was added:**
- New Webhook node: "Milli - New Lead Greeting"
  - URL: `https://americanservicesar.app.n8n.cloud/webhook/new-lead-greeting`
  - Method: POST
  - Inserted AFTER "Create Or Update Opportunity - New Lead" node
  - Sends: `contactId`, `opportunityId`, `firstName`, `phone`, `projectType`
- Position in flow: after Create Opportunity, before Internal Notification - SMS
- Status: Published

**To revert:** Remove the "Milli - New Lead Greeting" webhook node and reconnect "Create Or Update Opportunity" directly to "Internal Notification - SMS".

---

### 2. "ASAR Inbound SMS — Address Router" (NEW workflow, ID: `bb326dec-6825-4c18-8ed7-f3079ac261b0`)
**What was created:** Brand new GHL workflow (did not exist before)
- Trigger: Customer Replied + Filter: Has Tag = `ai_awaiting_address`
- Action: Webhook POST to `https://americanservicesar.app.n8n.cloud/webhook/lead-address-received`
- Payload: `contactId`, `opportunityId`, `firstName`, `phone`, `message`
- Status: Published

**To revert:** Delete the entire "ASAR Inbound SMS — Address Router" workflow.

---

### 3. New GHL Tag Created
- `ai_awaiting_address` — tag was created new for this pipeline
- Used to gate the Inbound SMS Router trigger
- Applied by n8n after greeting is sent; removed by address processor after address is collected

**To revert:** Delete the `ai_awaiting_address` tag from GHL (Settings → Tags).

---

## n8n Workflow Changes

### 4. "ASAR New Lead Greeting" (ID: `6jgRjUbNX0GuBaVN`)
**Original state:** Webhook → Parse Lead → Has Phone (broken condition) → Respond No Phone  
**What was fixed (Session 5, 2026-04-12):**
- "Has Phone" IF node condition was broken: was checking `$json.success === true` (boolean) which always routed FALSE
- Fixed to: `$json.phone notEquals ""` (string, strict)
- This fix enabled the true branch (Send Greeting SMS → Tag Awaiting Address → Respond Success) to actually run

**To revert:** Change "Has Phone" condition back to:
```json
{
  "leftValue": "={{ $json.success }}",
  "rightValue": true,
  "operator": { "type": "boolean", "operation": "equal" }
}
```
(Note: reverting this will break greeting — the old condition never worked)

---

### 5. "ASAR Lead Address Processor" (ID: `d8xiKaMU7rZ0Ldxp`)
**What was changed (Session 4+5, 2026-04-12):**

**a) SerpApi Zillow node added** (by `update_address_processor_serpapi.py` run in Session 4):
- Added "Lookup Property (SerpApi)" HTTP Request node
- URL: `https://serpapi.com/search.json` with engine=zillow
- Inserted between "Get GHL Contact" and "Parse Property Data"
- Credential: SerpApi account (ID: `W674ZSbrWCALEVEp`)

**b) SerpApi node — continueOnFail enabled** (Session 5, 2026-04-12):
- Added `"onError": "continueRegularOutput"` to the SerpApi node
- Reason: SerpApi free plan doesn't support Zillow engine; this lets the fallback (1800 sqft default) kick in

**c) Parse Property Data code updated** (Session 5, 2026-04-12):
- Added `projectType` fallback: if not in webhook body, reads from GHL contact custom field `NCEGefruybXUR4zom3w4` (services array, takes first item)
- Also added try/catch around SerpApi data parsing

**To revert address processor to pre-Session-4 state:**
- Remove the "Lookup Property (SerpApi)" node entirely
- Reconnect "Get GHL Contact" → "Parse Property Data" directly
- Revert Parse Property Data code to read `ctx.projectType` only (no GHL customField fallback)

---

### 6. "ASAR Estimate Engine" (ID: `KffILLHBKDAG4RYf`)
**What was changed (Session 5, 2026-04-12):**
- "Update GHL Opportunity" node jsonBody: added `|| 0` null-safety to price fields
- Before: `"field_value": {{ $json.price }}` → crashed with malformed JSON when price was undefined
- After: `"field_value": {{ $json.price || 0 }}`
- Same change applied to `ballparkLow` and `ballparkHigh` fields

**To revert:** Change "Update GHL Opportunity" jsonBody back to:
```
={"customFields": [{"id": "urJ7LpOcMUyA90Qq6vdn", "field_value": {{ $json.price }}}, {"id": "rXRgLBLZMzzM57uYIot2", "field_value": {{ $json.ballparkLow }}}, {"id": "60u5McU6WlIYpiHFooUm", "field_value": {{ $json.ballparkHigh }}}]}
```

---

## Summary — Complete Revert Checklist

To undo ALL RMP/Milli changes ever made:

**GHL:**
- [ ] Remove "Milli - New Lead Greeting" webhook node from "1. New Lead (RMP)" workflow
- [ ] Delete "ASAR Inbound SMS — Address Router" workflow entirely
- [ ] Delete `ai_awaiting_address` tag from GHL Settings → Tags

**n8n:**
- [ ] In "ASAR New Lead Greeting": revert "Has Phone" condition back to boolean success check (or just leave it — the new condition is the correct one)
- [ ] In "ASAR Lead Address Processor": remove SerpApi node, reconnect Get GHL Contact → Parse Property Data directly, revert Parse Property Data code
- [ ] In "ASAR Estimate Engine": revert "Update GHL Opportunity" jsonBody to remove `|| 0` fallbacks

---

## What Was NOT Changed
- No other RMP pipeline stages were modified (stages 2-9 in RMP untouched)
- No other GHL workflows were modified
- No contacts were permanently altered (tags can be removed)
- No HCP changes were made
