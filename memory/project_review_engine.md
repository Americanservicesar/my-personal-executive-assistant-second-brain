---
name: ASAR Review Engine — Autonomous Review Request System
description: Fully autonomous post-job Google review request system: HCP webhook → 24h delay → dedup → SMS D0 + D3 → GHL tag → Sheets log
type: project
last_updated: 2026-04-19
status: LIVE — 1 manual step remaining
originSessionId: 3a35798e-ae9f-458e-b25d-bfb6e27f5a38
---
## SYSTEM IS LIVE

**n8n Workflow:** ASAR Review Engine  
**Workflow ID:** `ciBlDuYcknxv9dES`  
**Webhook URL (production):** `https://americanservicesar.app.n8n.cloud/webhook/hcp-review-engine`  
**Status:** Active ✅

---

## HOW IT WORKS

1. HousecallPro fires webhook on every job event → `hcp-review-engine` endpoint
2. HMAC-SHA256 signature verified (secret: `b4dcd3bc22854cc49903d135b82aa568`)
3. Event parsed — only `job_completed` events continue
4. Webhook responds 200 immediately (async continue)
5. Searches GHL for contact by phone number
6. Checks `review_requested` tag — **dedup gate** (exits if already sent)
7. Creates GHL contact if not found
8. **Waits 24 hours**
9. Sends Day 0 SMS with GBP link: `https://g.page/r/CU5ZJHLOkTF_EAE/review`
10. Adds `review_requested` tag to GHL contact
11. Logs to Google Sheets (`11Ql6ck7E4Goh3LTNzn5udeXcJTbqy_n8y0pCXINc1qI`)
12. **Waits 72 hours**
13. Sends Day 3 follow-up SMS
14. Logs Day 3 to Sheets

---

## DUPLICATE PREVENTION — DONE

The old **HCP Webhook Router** (`4XY3iZmgB6jm4YlD`) had an immediate review SMS branch.
- That branch has been **disconnected and disabled** (2026-04-19)
- "Is Job Completed?" now routes to "Respond Stage Updated" on both branches
- Nodes "Build Review Request", "Send Review Request SMS", "Respond Review Sent" are disabled

---

## HCP WEBHOOK — REGISTERED ✅ (2026-04-19)

Webhook registered in HousecallPro Settings → Integrations → Webhooks:
- URL: `https://americanservicesar.app.n8n.cloud/webhook/hcp-review-engine`
- Event: Job Completed
- Secret: `b4dcd3bc22854cc49903d135b82aa568`

**System is fully autonomous. No remaining manual steps.**

---

## BUILD FILES

- `C:\Users\sales\OneDrive\Documents\CLAUDE\build_review_engine.py` — original build script
- `C:\Users\sales\OneDrive\Documents\CLAUDE\dump_workflow_json.py` — JSON dump utility
- `C:\Users\sales\OneDrive\Documents\CLAUDE\workflow_payload.json` — workflow JSON
- `C:\Users\sales\OneDrive\Documents\CLAUDE\review_engine_wf_id.txt` — workflow ID

---

## GOOGLE SHEETS LOG

Spreadsheet ID: `11Ql6ck7E4Goh3LTNzn5udeXcJTbqy_n8y0pCXINc1qI`  
Sheet: Sheet1  
Columns: Timestamp, HCP Job ID, Customer Name, Phone, Email, Job Type, GHL Contact ID, Day0 SMS Sent, Day0 Sent At, Day3 SMS Sent, Day3 Sent At, Status, Notes

---

## FUTURE ENHANCEMENTS (optional)

- **Backfill workflow**: Send review requests to last 30-60 days of completed jobs (2,501 exist)
- **review_received tag**: When review posted, tag contact to prevent redundant Day 3 follow-up
- **Business hours filter**: Only send SMS between 8am-8pm CT
