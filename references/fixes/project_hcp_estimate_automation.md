---
name: HCP Estimate Automation — Address Processor + Estimate Engine
description: What was built and how the Telegram->GHL->HCP estimate creation flow works end-to-end
type: project
date: 2026-05-01
---
## What Was Built

Automated lead intake flow: Telegram lead -> GHL contact -> address capture -> property lookup -> HCP estimate (G/B/B) -> Slack alert for Anthony review.

## Workflows Involved

| Workflow | ID | Role |
|---|---|---|
| ASAR Lead Address Processor | `d8xiKaMU7rZ0Ldxp` | Orchestrates address -> estimate flow |
| ASAR Estimate Engine | `KffILLHBKDAG4RYf` | Calculates prices by service + sqft/LF |

## Root Cause of Prior Failure (fixed 2026-05-01)

`new_gutter_install` was hardcoded in `CUSTOM_QUOTE_SERVICES` array, making Estimate Engine return `{success:false, needsCustomQuote:true}`. This caused `Estimate Calculable` to route to the custom quote branch (SMS only), completely skipping HCP Placeholder.

**Fix:** Removed `new_gutter_install` from CUSTOM_QUOTE_SERVICES. Added LF-based G/B/B pricing in Estimate Engine:
- Good: LF x $7.50
- Better: LF x $9.00
- Best: LF x $11.00

## HCP Placeholder — What it does now

1. Searches HCP for existing customer by phone/email match
2. Creates HCP customer if not found (with address)
3. Builds 3 estimate options (G/B/B) for `isGBB` services, or single option for others
4. Creates HCP estimate (status: needs scheduling = pending Anthony review)
5. Updates GHL contact custom fields: HCP ID, address, AI Handled=Yes, price range
6. Updates GHL opportunity monetary value
7. Posts Slack alert to #milli-sales (`C0AQN7QDEP7`) with estimate # and options

## What Still Needs to Be Done

- Commercial gutter + hydrojetting jobs still route to custom quote branch (no tier in engine).
- Verify `SLACK_BOT_TOKEN` env var is set in n8n instance settings.
