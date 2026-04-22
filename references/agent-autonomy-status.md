---
name: Agent Autonomy Status
description: Full autonomous coverage status as of 2026-04-22
last_updated: 2026-04-22
status: SUBSTANTIALLY COMPLETE
---
# ASAR Agent Autonomy Status

## Autonomous Triggers — ACTIVE

| Workflow | Trigger | Agent | Status |
|----------|---------|-------|--------|
| Vizzy 6AM Daily Briefing (3a8Wv9UQjSWgZ8Pn) | Daily 6AM CDT | Dexter | ACTIVE |
| Buddy Weekly Bid Check (JjZNWiBLGWkNVwUn) | Mon+Thu 8AM CDT | Buddy | ACTIVE |
| Gmail Monitor sales@ (n4BTLoY1O23Z5pfR) | New email → sales@ | Milli | ACTIVE |
| Gmail Monitor office@ (c4nyYUqWEJPBfwMS) | New email → office@ | Cassie | ACTIVE |
| Gmail Monitor asons@ (WSNA0uSazWbvIEDt) | New email → asons@ | Buddy | ACTIVE |
| Soshie Monday Batch (ibcZUQdHjcT81HTV) | Mon 7AM CDT | Soshie + UMA | ACTIVE |
| Commet Weekly Monitoring (X9CJeuwPHXFTF2ta) | Mon 9AM CDT | Commet | ACTIVE |
| ASAR Weekly Rank Tracker (e6PnFg6YZpagNq7j) | Mon 8AM CDT | Seomi | ACTIVE |
| ASAR Daily GSC Check (9AdSMJNMkym65Y5V) | Daily 9AM CDT | Seomi | ACTIVE |
| Review Engine (ciBlDuYcknxv9dES) | HCP job complete webhook | Cassie | ACTIVE |
| Instantly Reply Router (OhcsTjpdQ83Zwv9R) | Webhook instantly-replies | Buddy | ACTIVE |

## Agent Coverage Summary

| Agent | Autonomous Trigger | Handles |
|-------|-------------------|---------|
| Vizzy | Orchestrator (Telegram + Chat + Gmail routers) | Task routing |
| Milli | Gmail sales@ monitor | Sales email responses |
| Penn | Called by Emmie/Commet/Milli | Copy on demand |
| Emmie | Called by other agents | Email deployment |
| Soshie | Monday 7AM cron | Social media calendar |
| Buddy | Mon+Thu 8AM bid check + Gmail asons@ | Bids + BD emails |
| Cassie | Gmail office@ + Review Engine | Customer support |
| Seomi | Daily GSC + Monday rank tracker | SEO monitoring |
| Scouty | Telegram/Chat only | On demand |
| Gigi | Telegram/Chat only | On demand (personal) |
| Commet | Monday 9AM cron | Store/package monitoring |
| Dexter | Daily 6AM briefing cron | Morning data pull |

## Remaining Manual Items (Anthony action required)

1. **QuickBooks reconnect** — n8n QB credential stuck on sandbox. Go to n8n > Credentials > QuickBooks > re-auth with prod account (realmId: 123146373988304). ~15 min. Unlocks Dexter financial reporting.
2. **Instantly webhook** — Go to Instantly.ai > Settings > Webhooks > add URL:  for Reply event. Unlocks auto-tagging warm leads.
3. **Upload leads to Instantly** — ASAR-01-Apartments campaign is drafted but needs lead list uploaded to activate.
4. **LinkedIn reconnect in GHL** — Expires May 12. Reconnect ~May 5 to avoid posting blackout.
5. **Add 2 Instantly sending accounts** — Add commercialwashingpros@ and cleanpropertyexperts@ to increase sending from 40/day to 100/day.

## Cannot Activate (broken config)

- **ASAR Master Data Sync** (no1R0fVxStQuJxNT) — 8 nodes with missing params (url, fieldToSplitOut, application/table). Needs manual rebuild in n8n UI.
