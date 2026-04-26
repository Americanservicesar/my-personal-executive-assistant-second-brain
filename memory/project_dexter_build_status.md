---
name: Dexter Build Status — Section 1A Audit
description: Exact completion status of all 13 caps, what's done, what's pending, and what to fix next session
type: project
originSessionId: 45dc0278-8bc3-4434-a523-9fb5a713b655
---
## Session Summary (2026-04-17)

Dexter Section 1A fully built and audited. All data sources connected. Line-by-line audit completed against game plan doc.

---

## KEY ASSETS

- **Intelligence Hub (Google Sheet)**: `1YHE95PH9f86irf_6EggnTSBD3-CP6SKenWd2g9ndycE`
  - Location: SALES shared drive → Dexter — Intelligence Hub folder (`1O2NjhIiwA512_q9mrunchkNxbqpP5Xr8`)
- **gdrive.py utility**: `C:\Users\sales\scripts\gdrive.py` + OPERATIONS drive → Scripts — Automation Utils
- **Analysis scripts**: All in `C:\Users\sales\AppData\Local\Temp\` AND in SALES/Dexter folder
  - `da.py` = GHL Caps 1,4,8,10
  - `da2.py` = GHL Caps 5,7,11
  - `hcp_full.py` = HCP Caps 3,9,12
  - `qb_full.py` = QB Cap 2
- **QB Excel exports** (in SALES/Dexter Drive folder + Downloads):
  - `American Services AR_Profit and Loss (2).xlsx` — 2025 full year P&L
  - `American Services AR_Transaction Detail by Account.xlsx` — 10,672 rows Jan 2024–Jan 2026
  - `Sons_Tax_Master_2024-2026.xlsx`

---

## DATA SOURCES STATUS

| Source | Status | Notes |
|--------|--------|-------|
| GHL MCP | ✅ LIVE | 213 opportunities pulled (2 pages + 9 manual page-3 records) |
| HousecallPro API | ✅ LIVE | Key: `13317c556f61472e8a57c60e0bea930f` — 1,000 jobs pulled |
| QuickBooks | ⚠️ EXCEL ONLY | Live QB MCP needs browser OAuth (separate from n8n). Excel exports work fine. n8n cred `T1Uyc7utOiuqYJWO` stuck on sandbox — Anthony must reconnect to Production |
| Google Sheets MCP | ✅ LIVE | 10 tabs built and populated |
| Slack MCP | ✅ LIVE | All correct channel IDs now known and used |
| SerpApi | ❌ NOT DONE | Needed for Caps 7 (competitor pricing) and 11 (competition density) |
| Instantly | ❌ NOT DONE | Needed for Cap 6 (Marketing ROI) — Emmie session |
| Google Drive | ✅ LIVE | gdrive.py utility works on all 5 shared drives via gcloud token |

---

## 13 CAPS STATUS

| Cap | Name | Status | What's Missing |
|-----|------|--------|----------------|
| 1 | Lead Source Intelligence | ⚠️ PARTIAL | Cost per lead ❌ (needs ad spend) |
| 2 | Service Profitability | ⚠️ PARTIAL | Overall margins ✅ (48.5% gross, 0.2% net). Service-level QB breakdown ❌ (Transaction Detail has it — parse `ASAR_QB_TransactionDetail_2024-2026.xlsx` by account/service) |
| 3 | Job Cost Analysis | ⚠️ PARTIAL | 1,000 jobs ✅. Estimated vs actual materials ❌. Only 196/1000 jobs have timestamps. |
| 4 | Pipeline Leak Detection | ✅ COMPLETE | |
| 5 | Customer Lifetime Value | ⚠️ PARTIAL | Top customers ✅. CLV trend over time ❌ |
| 6 | Marketing ROI | ❌ BLOCKED | Emmie session needed for Google Ads + Facebook + Max Marketing invoice spend data |
| 7 | Pricing Intelligence | ⚠️ PARTIAL | Win rate by tier ✅. Competitor pricing via SerpApi ❌ |
| 8 | Seasonal Demand Forecasting | ⚠️ PARTIAL | Monthly trends ✅. Crew capacity per month ❌ |
| 9 | Crew Productivity | ⚠️ PARTIAL | Jobs/rev per tech ✅. Callback rate ❌. Review score per tech ❌ |
| 10 | Revenue Forecasting | ✅ COMPLETE | |
| 11 | Territory Intelligence | ⚠️ PARTIAL | Area code proxy ✅. Competition density ❌ (SerpApi). Travel cost ❌ |
| 12 | Operational Efficiency | ⚠️ PARTIAL | Monthly trends ✅. Drive time % ❌ (only 196/1000 jobs have timestamps). Fuel cost per city ❌ |
| 13 | Weekly CEO Dashboard | ⚠️ PARTIAL | Sheet exists ✅. Does NOT match Section 4C format ❌. Not automated ❌. Cash position missing ❌ |

---

## SLACK CHANNEL IDs (all verified working)

| Agent | Channel | ID |
|-------|---------|-----|
| Vizzy | #vizzy-command | C0AQPHWL7V4 ✅ posted |
| Milli | #milli-sales | C0AQN7QDEP7 ✅ posted |
| Commet | #commet-ecommerce | C0AQRKQ6HJN ✅ posted |
| Scouty | #scouty-recruiting | C0AQK8FP15H ✅ posted |
| Seomi | #seomi-seo | C0AQV7SAXB6 ✅ posted |
| All agents | #all-american-services-agents | C0AM48SUEAW ✅ posted |
| Dexter | #dexter-data | C0AR4GT0N0Z ✅ posted |
| Activity | #agent-activity | C0ARKTU2HR6 ✅ posted |
| Penn | #penn-copy | ❌ ID unknown — search Slack next session |
| Emmie | #emmie-email | ❌ ID unknown |
| Soshie | #soshie-social | ❌ ID unknown |
| Buddy | #buddy-bizdev | ❌ ID unknown |
| Cassie | #cassie-support | ❌ ID unknown |
| Gigi | #gigi-personal | ❌ ID unknown (private) |

---

## NEXT SESSION PRIORITIES

1. **Fix CEO Dashboard to match Section 4C format exactly** — add cash position, this week vs last week revenue, hiring status, exact template
2. **SerpApi competitor pricing** — run for Caps 7 and 11 (competitor pricing benchmarks + competition density by city)
3. **Parse QB Transaction Detail by service** — `ASAR_QB_TransactionDetail_2024-2026.xlsx` has 10,672 rows — parse by account name to get service-level margin breakdown for Cap 2
4. **Find missing Slack channel IDs** — Penn, Emmie, Soshie, Buddy, Cassie, Gigi
5. **Add BOTTOM LINE + RECOMMENDED ACTION** to every Google Sheet tab (per Section 4B)
6. **Set up Monday 9am automation** — scheduled task or n8n workflow to auto-run Dexter weekly
7. **Set up anomaly alert system** — real-time triggers per Section 3B format (4D)
8. **HCP review scores per tech** — check `/reviews` endpoint or job rating fields
9. **Cap 6 Marketing ROI** — Emmie session for ad spend data

---

## KEY FINANCIAL DATA (2025 — from QB exports)

- Gross Sales: $245,036
- Total Income (incl. sales tax): $278,920
- Gross Profit: $135,376 (48.5% margin)
- Total COGS: $143,543
- Total Expenses: $96,340
- Net Operating Income: $687 (0.2% net margin — CRITICAL)
- Materials/Supplies: $54,619 (22% of sales — target 15-20%)
- Interest Expense: $15,771
- Software: $12,144
- Legal Services: $10,897 (one-time? confirm)
- Marketing spend: $11,047 (ad spend portion)

## KEY HCP DATA (1,000 jobs)

- Total revenue: $742,043
- Outstanding A/R: $271,270 (Fleet Wash: $48,287 alone)
- Cancellation rate: 23% (232 jobs)
- Anthony on 85% of all jobs (848/1,000) — owner bottleneck
- Best service $/hr: Pressure Washing $914/hr, Gutter Install $703/hr
- Best avg/job: Parking Lot $5,690, Dryer Vent $3,306, Gutter Install $2,282
- Worst: Fleet Wash $97/hr, Window Cleaning $98/hr
