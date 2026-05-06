---
name: Tyler George Pay Structure
description: Tyler George's pay rates, workweek schedule, and pay calculation rules for Dexter auto-pay tracking
type: reference
originSessionId: b4dca069-953d-4051-b0c7-4a7917c8e25e
---
## Employee
- **Name:** Tyler George
- **HCP ID:** `pro_118577ebab724631996f89098f9204e2`
- **Role in HCP:** Field Tech

## Pay Rates
- **Lead Tech (with others on job):** 9% of job sell price
- **Lead Tech (solo — only assigned employee):** 16% of job sell price (9% lead + 7% helper — he earns both cuts)
- **Laborer:** 7% of job sell price
- **Tyler's confirmed role:** Lead (default to Lead on all jobs unless told otherwise)

## Commission Logic
Any job pays out 16% total (9% lead + 7% helper).
- Two-person crew: Lead gets 9%, helper gets 7%
- Solo: Lead pockets both = 16%
- This keeps total payout consistent regardless of crew size

## Pay Rules
- **Incomplete jobs (not marked complete in HCP):** Pay at HALF rate
  - Lead Solo incomplete: 18% → 9%
  - Lead w/ others incomplete: 9% → 4.5%
  - Laborer incomplete: 7% → 3.5%
- **Complete jobs:** Full rate
- **Outstanding balance $0 = paid/complete** (cross-reference work_status)

## Workweek & Pay Schedule
- **Workweek:** Monday through Thursday (Friday off)
- **Pay calculation:** Every Friday at 7:00 AM CDT — Dexter auto-runs via n8n
- **Pay period:** Mon 12:00 AM – Thu 11:59 PM CDT

## KPI Tracking — Dexter Responsibilities
Dexter tracks daily in Google Sheets ("ASAR Operations" sheet, "Technician Pay" tab):
- Job date
- Customer name
- Job description
- Job value (sell price)
- Tyler's role (Lead Solo / Lead / Laborer)
- Scheduled hours (from HCP schedule window)
- Actual clock-in (started_at)
- Actual clock-out (completed_at)
- Hours on job (calculated)
- Job status (complete / incomplete)
- Pay rate applied
- Pay earned

## Friday 7AM Auto-Pay n8n Workflow (TO BUILD)
- Trigger: Schedule — Friday 7:00 AM CDT
- Pull: All HCP jobs Mon–Thu with Tyler assigned
- Calculate: Pay per job based on role + status rules
- Write: Results to Google Sheets "Technician Pay" tab
- Alert: Send pay summary to Anthony via Telegram/Slack

## Current Week (Apr 27 – May 1, 2026)
| Job | Customer | Value | Role | Status | Pay |
|---|---|---|---|---|---|
| Gutter Install | Michael King | $1,590 | Lead Solo | Incomplete → Half | $143.10 |
| Gutter Install | Terry Alexander | $2,520 | Lead w/ Anthony | Complete | $226.80 |
| **TOTAL** | | **$4,110** | | | **$369.90** |

**Flag:** Michael King job still open — full pay = $286.20 once complete (+$143.10 owed)
