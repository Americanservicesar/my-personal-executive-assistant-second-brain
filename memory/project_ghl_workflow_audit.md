---
name: GHL Workflow Audit
description: Complete audit of all 79 GHL workflows — RMP stage map, published vs draft, key workflow purposes. Audited 2026-04-10.
type: project
---

## Residential Master Pipeline (RMP) — 9 Stages

All published. These are the current actual stage names (NOT the old names from prior sessions).

| # | Workflow Name | ID | Status | Notes |
|---|---|---|---|---|
| 1 | New Lead (RMP) | 8ebab856-e87e-4338-b0c7-fbacab1dc524 | Published | Trigger: lead enters New Lead stage. SMS nodes DISABLED — Milli AI flow to be built here (Session 4). Sets workflow_id custom field. |
| 2 | Attempting Contact (RMP) | 8e1d6aef-740b-4ce2-9518-bf49dfb0da89 | Published | Trigger: stage → Attempting Contact. Has Set Workflow ID, 5-day SMS/email sequence, move to Re-engagement after 14 days no response. CONTAINS estimate engine webhook call — REMOVE (fires too early, no sqft yet). |
| 3 | Qualified (RMP) | 829f3cab-a206-4f90-8223-ed35e7baba66 | Published | Trigger: stage → Qualified. |
| 4 | Estimate Scheduled (RMP) | db23c8c6-9efc-4f1e-b00a-2721a12f3181 | Published | 33 total enrolled, 2 active. |
| 5 | Estimate Sent/Complete (RMP) | 45a8974e-20a8-4c87-8ffc-4f2ff43a1e7f | Published | 38 total enrolled, 10 active. |
| 6 | Estimate Approved (RMP) | 834f4cbd-69fe-4c56-90c3-e9f3d22471e8 | Published | 9 total, 0 active. |
| 7 | Job Scheduled (RMP) | c2624f0f-a603-422e-8a72-00250dc42b27 | Published | Trigger: stage → Job Scheduled. Sets workflow_id. Sends confirmation SMS/email. |
| 8 | Job Complete (NiceJob Review Request) (RMP) | cf33306b-40f1-4353-8722-5d23750ab6ba | Published | Trigger: stage → Job Completed. Flow: Set WF ID → Create/Update Opportunity → Wait 15 Mins → IF "Has Review Request Been Sent Before?" (tag check). No branch: Add Tag + SMS1 + Email1 + Wait 7 Days + Update Opp Won + SMS2 + Email2 + Wait 14 Days + Email3 + Wait 30 Days + Email4 + END. Yes branch: Wait 7 Days → Update Opp Won → END. None → END. |
| 9 | Declined (RMP) | 13513dce-75dc-4b46-9caa-8ea98437d71b | Published | Trigger: stage → Declined. |

**Support RMP Workflow:**
- Residential Master Pipeline - Remove Froms | 07d637b5-5b21-4634-9f5b-817287fa63a9 | Published

## Stage Name Correction (IMPORTANT)
Previous session notes had WRONG stage names. Correct current names are above.
Old notes said: Appointment Scheduled, Estimate Sent, Job Scheduled, Job Completed, Re-engagement
**Actual names:** Qualified, Estimate Scheduled, Estimate Sent/Complete, Estimate Approved, Job Scheduled, Job Complete, Declined

## HCP Webhook Router (n8n)
- Merged workflow ID: `4XY3iZmgB6jm4YlD` (n8n)
- Webhook: `https://americanservicesar.app.n8n.cloud/webhook/hcp-webhook`
- Handles: job.scheduled → update GHL stage to "Job Scheduled"; job.completed → update GHL stage to "Job Complete" + review SMS
- Old workflows deactivated: 3E6CoWmPvLk6BTRj, IufCsKClinzJXQQs

## All 79 Workflows — Published Only (34 total)

### RMP Pipeline (9):
1. New Lead (RMP)
2. Attempting Contact (RMP)
3. Qualified (RMP)
4. Estimate Scheduled (RMP)
5. Estimate Sent/Complete (RMP)
6. Estimate Approved (RMP)
7. Job Scheduled (RMP)
8. Job Complete (NiceJob Review Request) (RMP)
9. Declined (RMP)

### Support/System (published):
- 1. New Applicant — hiring pipeline trigger
- 2. Customer Back in Pipeline -> Remove Estimate/Job Canceled Tag
- Database Reactivation
- Email Bounced / Complained / Unsubscribed
- Facebook Lead Form
- Facebook Messages
- Fleet Washing
- GHL Click Form
- GHL Click Google Ads
- GMB Business Message
- Incoming Call Flow (IVR)
- Instanly.ai - Call Tracking
- Lawn Fertilization & Irrigation
- Lost or Abandoned Status
- Messages Tagging
- Missed Call Text Back
- Negative Review Feedback Form
- Pause Texts and Emails Tag
- Residential Master Pipeline - Remove Froms
- Seasonal Emails Workflow v3
- Text Compliance: Customer Replied Stop/Out/Unsubscribe
- Text Compliance: Website SMS Opt-in Form
- Website Form - to Anthony

### Key DRAFT Workflows (not running — future build targets):
- 1. New Lead - Commercial
- Commercial - Approved to Scheduling
- Commercial - Decision Maker Follow-Up
- Commercial - Invoice Reminder
- Commercial - Renewal Engine
- Commercial - Site Walk Task (x2)
- Commercial - Tier 1 Nurture
- Commercial - Tier 2 Follow-Up
- Commercial Prospecting (in progress)
- Estimating Brain
- Gutter Cleaning Lead
- Christmas Lights
- Pressure Washing Ballpark
- Pressure Washing Lead

## What I've Personally Read (node-by-node):
- ✅ WF 1: New Lead (RMP) — all SMS nodes DISABLED, has webhook to n8n estimate engine (remove), sets workflow_id
- ✅ WF 2: Attempting Contact (RMP) — 5-day sequence, estimate engine call (REMOVE), 14-day no-response → Re-engagement
- ✅ WF 7: Job Scheduled (RMP) — confirmation SMS/email, sets workflow_id
- ✅ WF 8: Job Complete — review request with tag dedup, multi-touchpoint sequence, marks opp Won

## Session 4 Build Plan (updated)
**Stage 1 (New Lead) flow:**
1. Lead enters New Lead → Milli texts greeting: "Hi [name], thanks for reaching out to ASAR! What's the address for the property you need serviced?"
2. Customer replies with address
3. **For sqft/stories**: Milli uses SerpApi to look up property records (county assessor/Zillow) by address
4. **For gutter linear footage**: Milli uses `HTTP - GutterGlove (Milli)` tool (measure.gutterglove.com) — NOT RoofSnap (RoofSnap only does gutter eaves, not general sqft)
5. Measurements → n8n estimate engine webhook → price calculated
6. Penn writes formal estimate copy → Milli creates estimate in HousecallPro
7. No ballpark SMS to customer unless they explicitly ask
8. Move lead to Estimate Scheduled/Sent stage

**Why:** Property lookup by address is automatic — no need to ask customer for sqft/stories. GutterGlove handles linear ft for gutter jobs. RoofSnap is NOT used for general sqft.
