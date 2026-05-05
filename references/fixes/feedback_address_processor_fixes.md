---
name: Address Processor — Bug Fixes Log
description: All bugs found and fixed in the ASAR Lead Address Processor workflow (d8xiKaMU7rZ0Ldxp)
type: feedback
last_updated: 2026-05-05
originSessionId: 79d692b3-68e1-4992-9671-4c274090b8bf
---
# ASAR Lead Address Processor Bug Fixes

Workflow ID: `d8xiKaMU7rZ0Ldxp` | Webhook: `POST /webhook/lead-address-received`

## Bug: HCP phone number 11 digits (fixed 2026-05-05)
- **Root cause**: GHL stores phone as "+15018330305". After `.replace(/\D/g,'')` = "15018330305" (11 digits). HCP requires exactly 10 digits.
- **Fix in `Prepare HCP Data`**:
  ```javascript
  let phone = (contact.phone || '').replace(/\D/g,'');
  if (phone.length === 11 && phone.startsWith('1')) phone = phone.slice(1);
  ```

## Bug: HCP Search Customer used name-search (caused duplicate customers)
- **Root cause**: URL `?query={{ firstName + ' ' + lastName }}` returns the 5 most recent customers regardless of name match. None match the lead, so falls through to create every time → duplicate customers.
- **Fix**: Changed to phone search: `?query={{ $('Prepare HCP Data').first().json.phone }}&page_size=5`
- This reliably finds existing customer by phone number before attempting create.

## Bug: Resolve HCP Customer ID picked wrong customer (Jill Gray)
- **Root cause**: Search returned 5 most-recent customers, none matching. `match` was undefined. Code then tried `$('HCP Create Customer').first().json.id` but this wasn't working reliably due to n8n continueOnFail output wrapping.
- **Fix**: Rewrote Resolve logic to PRIORITIZE create result, fall back to search match:
  ```javascript
  let created = {};
  try { created = $('HCP Create Customer').first().json || {}; } catch(e) {}
  if (created && created.id && !created.error) {
    return [{json: {hcpCustomerId: created.id, hcpAddressId: (created.addresses||[])[0]?.id||null}}];
  }
  // Fall back to phone match in search results
  ```

## Bug: GHL Update Opportunity didn't move pipeline stage
- **Root cause**: `jsonBody` was `{monetaryValue: betterPrice}` only — no pipelineStageId.
- **Fix**: Added `pipelineStageId: "ca504c58-9309-4f9b-8c6d-603151af1b4a"` (Estimate Scheduled) + `status: "open"`.

## Bug: Send Ack SMS crashed on DND contact
- **Root cause**: GHL returns error "Cannot send message as DND is active" — no `continueOnFail`.
- **Fix**: Added `continueOnFail: true` to Send Ack SMS node.

## Bug: Notify Anthony referenced deleted HCP Placeholder node
- **Root cause**: Node was not updated when HCP Placeholder Code node was replaced by 8 proper HTTP nodes.
- **Fix**: Updated jsonBody references:
  - `$('HCP Placeholder').json.hcpEstimateNumber` → `$('HCP Create Estimate').first().json.estimate_number`
  - `$('HCP Placeholder').json.priceLow` → `$('Prepare HCP Data').first().json.goodPrice`
  - `$('HCP Placeholder').json.priceHigh` → `$('Prepare HCP Data').first().json.bestPrice`
  - Also added `continueOnFail: true`

## Bug: Parse Input crashed when GHL workflow triggers webhook
- **Root cause**: `body.message` can be a GHL object `{type: 24}` (not a string) when GHL workflows accidentally hit the webhook. `.trim()` fails on objects.
- **Fix**:
  ```javascript
  const msgRaw = body.message || body.messageBody || '';
  const message = (typeof msgRaw === 'string' ? msgRaw : (msgRaw.body || msgRaw.text || '')).trim();
  ```

## Verified working: Execution 4024 (2026-05-05)
All 21 nodes ran successfully:
- Webhook → Parse Input → Has Valid Input → Get GHL Contact → Lookup Property (SerpApi) → Parse Property Data → Call Estimate Engine → Estimate Calculable → Prepare HCP Data → HCP Search Customer → HCP Create Customer → Resolve HCP Customer ID → Build Estimate Body → HCP Create Estimate → GHL Update Contact → GHL Update Opportunity → Wait 45s → Send Ack SMS → Remove Awaiting Tag → Add Address Collected Tag → Notify Anthony

## Pending manual cleanup in HCP app
- Estimate #922 (Jill Gray — wrong customer) → delete
- Estimate #923 (Jill Gray — wrong customer) → delete
- Duplicate Sid Nunis customers (3 created during debugging) → merge or delete extras, keep `cus_029787e0ca9e4fc6b1a68fed36c1cdc4`
