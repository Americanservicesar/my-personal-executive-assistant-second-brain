---
name: Operations
description: How ASAR runs day-to-day — 3 brands, crews, autonomous systems, seasonal patterns, active campaigns
last_updated: 2026-04-22
type: memory
---
# Operations — American Services AR

## 3 Brands (All route through ASAR for now)
- **American Services AR** — Core brand (all exterior cleaning services)
- **Apex Shield Coatings** — Premium roofing + gutters brand (future)
- **Legendary Exterior Solutions** — Residential-focused friendly brand (future)

## Service Area
- Primary: Conway AR + 45-mile radius (Central AR)
- Secondary: Little Rock metro
- Travel >45 min from Conway: +$100-150 surcharge

## 13 Services (with Approved G/B/B Pricing)

| Service | GOOD | BETTER | BEST |
|---------|------|--------|------|
| Pressure Washing | $300 | $499 | $749 |
| House Washing | $399 | $649 | $999 |
| Roof Cleaning | $550 | $799 | $1,049 |
| Concrete Cleaning | $300 | $499 | $749 |
| Deck & Fence | $349 | $549 | $849 |
| Window Cleaning | $300 | $449 | $649 |
| Gutter Cleaning | $300 | $449 | $699 |
| Gutter Installation | $1,249 | $1,942 | $3,200 |
| Gutter Guards | $499 | $999 | $1,799 |
| Fleet Washing | $499 | $763 | $1,299/mo |
| Parking Lot | $699 | $1,799 | $3,999 |
| Construction Cleanup | $599 | $1,299 | $2,499 |
| Holiday Lighting | $549 | $849 | $1,499 |

$300 minimum — bundle to hit minimum. Always quote BETTER or BEST first.

## Crew
- Anthony Sons — Owner/Operator
- Subcontractors as needed (see references/subcontractor-list.md)
- Google Sheet: 1pB7-csrUFU_58HM56Usv3yhWhgoiFCYZ62Es098NZgI (17 trades, 51 companies)

## Job Workflow (Autonomous)
1. Lead in (call / HCP booking / website / email / Instantly reply)
2. Estimate created in Housecall Pro (Milli assists)
3. Won job → HCP webhook fires → GHL contact updated (stage: Job Scheduled)
4. Job complete → HCP webhook fires → Review Engine triggers SMS (24h + 72h)
5. Invoice created → Dexter monitors overdue

## Autonomous Systems Active (2026-04-22)

### 40 Active n8n Workflows

Scheduled Crons:
- Daily 6AM: Dexter pulls HCP data, posts morning briefing to #vizzy-command
- Daily 9AM: Seomi checks GSC for ranking changes
- Mon 7AM: Soshie generates 7-day social content calendar
- Mon 8AM: Seomi runs weekly rank tracker (ASAR Rank Tracker Google Sheet)
- Mon+Thu 8AM: Buddy scans 10+ AR procurement portals for bids
- Mon 9AM: Commet reviews store performance and AMP subscriptions
- Monthly: Emmie pulls Facebook/Google Ad spend reports

Gmail Monitors (fire on every new email):
- sales@americanservicesar.com → Milli (quotes, new leads, sales inquiries)
- office@americanservicesar.com → Cassie (support, billing, scheduling)
- asons@americanservicesar.com → Buddy (RFPs, GC leads, partnership requests)

Webhooks Live:
- HCP Webhook Router: fires on every HCP event (job won/scheduled/complete)
- Review Engine: fires post-job, sends 24h + 72h SMS review requests
- Instantly Reply Intake: fires when Instantly lead replies, routes to GHL + Buddy

All 12 Agent Standalones: active, callable on demand or via orchestrator

## Cold Outreach Pipeline

### Instantly Campaigns (Active)
- ASAR-01-Apartments: ACTIVE, 4-step sequence, 100 emails/day
- cleanmycommercialproperty@gmail.com (40/day)
- commercialwashingpros@gmail.com (40/day)
- cleanpropertyexperts@gmail.com (20/day)

### 12 Target Segments
ASAR-01-Apartments | ASAR-02-HOA | ASAR-03-CommercialPropMgmt | ASAR-04-Fleet
ASAR-05-Warehouse | ASAR-06-GeneralContractors | ASAR-07-Government | ASAR-08-Schools
ASAR-09-UniHospital | ASAR-10-Dealerships | ASAR-11-Hotels | ASAR-12-Restaurants

### Lead Flow
Instantly reply -> n8n webhook -> GHL upsert + tag (instantly-reply, V-[vertical], T-warm) -> #buddy-bizdev alert -> Buddy qualifies -> Milli closes

## Seasonal Plan

| Season | Focus | Key Services |
|--------|-------|-------------|
| Spring (Mar-May) | Spring cleaning push | PW + gutter + house wash bundles |
| Summer (Jun-Aug) | Commercial contracts | Fleet + parking lot + commercial exterior |
| Fall (Sep-Nov) | Gutter season | Gutter clean + guards + installation |
| Winter (Dec-Feb) | Holiday lighting + maintenance | Lighting install + maintenance programs |

## Maintenance Programs (AMP)

| Plan | Monthly | Annual | Includes |
|------|---------|--------|---------|
| Home Exterior Care <=2,000 sqft | $100/mo | $1,200/yr | Quarterly PW + annual gutter + window |
| Home Exterior Care <=2,500 sqft | $125/mo | $1,500/yr | Quarterly PW + annual gutter + window |
| Home Exterior Care <=3,500 sqft | $150/mo | $1,800/yr | Quarterly PW + annual gutter + window |
| Commercial Maintenance | $175-350/mo | - | Monthly PW + quarterly deep clean + gutters |
| Gutter Guard Plan | $75/mo | $849/yr | Bi-annual clean + annual inspection + priority |

## Key Tool Connections

| Tool | Use | Status |
|------|-----|--------|
| Housecall Pro | CRM/dispatch/invoicing | LIVE — webhook router active |
| GoHighLevel | Pipeline/automation/SMS/email | LIVE — all workflows active |
| QuickBooks | Financials | LIVE — production connected |
| Instantly | Cold outreach | LIVE — 3 accounts, 100/day |
| n8n | Automation backbone | LIVE — 40 workflows |
| Slack | Agent comms | LIVE — all 12 agent channels |
| Google Workspace | Docs/Sheets/Drive | LIVE — all 4 Gmail accounts |
| Canva | Design (Commet) | LIVE |
| GitHub Brain | Agent memory | LIVE — synced |
