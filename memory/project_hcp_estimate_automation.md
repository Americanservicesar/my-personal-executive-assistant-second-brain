---
name: HCP Estimate Automation — Address Processor + Estimate Engine
description: What was built and how the Telegram→GHL→HCP estimate creation flow works end-to-end
type: project
last_updated: 2026-05-18
originSessionId: 79d692b3-68e1-4992-9671-4c274090b8bf
---
## What Was Built

Automated lead intake flow: Telegram lead → GHL contact → address capture → property lookup → HCP estimate (G/B/B) → Slack alert for Anthony review.

## Workflows Involved

| Workflow | ID | Role |
|---|---|---|
| ASAR Lead Address Processor | `d8xiKaMU7rZ0Ldxp` | Orchestrates address → estimate flow |
| ASAR Estimate Engine | `KffILLHBKDAG4RYf` | Calculates prices by service + sqft/LF |

## Full Flow (step by step)

1. Anthony sends lead info to Telegram (name, phone, address, service, notes)
2. Vizzy orchestrator (`JAYrzGWR8A0tCBzB`) creates GHL contact + opportunity, sets `ai_awaiting_address` tag
3. Anthony sends address in Telegram → orchestrator posts to Address Processor webhook
4. **Lookup Property (SerpApi)** — searches Zillow for sqft + stories
5. **Parse Property Data** — extracts sqft, stories, calculates `linearFt = sqrt(sqft) * 4 * 1.15` (fallback: sqft=1800)
6. **Call Estimate Engine** — POST to `/webhook/estimate` with service, sqft, stories, linearFt, contactId, opportunityId
7. **Estimate Calculable IF** — checks `$json.price` is not empty (routes to HCP Placeholder if yes, custom quote branch if no)
8. **HCP Placeholder** (now fully built) — creates/finds HCP customer, creates G/B/B estimate, updates GHL, Slack alert
9. **Remove Awaiting Tag** → **Add Address Collected Tag** → **Move to Estimate Scheduled** stage in GHL
10. **Send Ack SMS** to customer

## Root Cause of Prior Failure (fixed 2026-05-01)

`new_gutter_install` was hardcoded in `CUSTOM_QUOTE_SERVICES` array, making Estimate Engine return `{success:false, needsCustomQuote:true}`. This caused `Estimate Calculable` to route to the custom quote branch (SMS only), completely skipping HCP Placeholder.

**Fix:** Removed `new_gutter_install` from CUSTOM_QUOTE_SERVICES. Added LF-based G/B/B pricing in Estimate Engine:
- Good: LF × $7.50
- Better: LF × $9.00  
- Best: LF × $11.00

## HCP Placeholder — What it does now

1. Searches HCP for existing customer by phone/email match
2. Creates HCP customer if not found (with address)
3. Builds 3 estimate options (G/B/B) for `isGBB` services, or single option for others
4. Creates HCP estimate (status: needs scheduling = pending Anthony review)
5. Updates GHL contact custom fields: HCP ID, address, AI Handled=Yes, price range
6. Updates GHL opportunity monetary value
7. Posts Slack alert to #milli-sales (`C0AQN7QDEP7`) with estimate # and options

## Service Routing in Estimate Engine

| Input string | Maps to | Pricing type |
|---|---|---|
| "new gutter installation" | `new_gutter_install` | G/B/B LF-based |
| "gutter cleaning" | `gutter_repair` | Sqft tier |
| "gutter repair" | `gutter_repair` | Sqft tier |
| "commercial gutters" | `comm_gutter_standard_1x` | Fixed rate |
| "hydrojetting" / "hydrojet" / "drain jetting" / "drain cleaning" | `hydrojetting` | G/B/B LF-based |
| "window cleaning" / "window wash" / "window washing" | `window_cleaning` | needsCustomQuote (pricebook pending — Commet+Dexter to finalize) |
| "other" | null | needsCustomQuote |

## Estimate G/B/B Option Names — Seamless Gutter Installation

| Tier | Name | What's Included |
|---|---|---|
| Good | `6" Seamless Gutter Installation - Good - $XXX` | Basic K-style aluminum gutters + downspouts |
| Better | `6" Seamless Gutter Installation - Better - $XXX` | Gutters + **GutterRX** gutter guards (2 line items) |
| Best | `6" Seamless Gutter Installation - Best - $XXX` | Gutters + **Leafblaster Pro** gutter guards (2 line items) |

Better and Best split into 2 line items: gutters at Good price + guards at the upgrade delta.

Format for hydrojetting: `Hydrojetting – PVC Drain Lines - Good/Better/Best - $XXX`

## window_cleaning Added — 2026-05-18

Added `window_cleaning` to Estimate Engine PROJECT_TYPE_MAP (KffILLHBKDAG4RYf). Routes to `needsCustomQuote:true` with `reason:'window_cleaning_pricebook_pending'`. When Commet+Dexter finalize pricebook, add pricing tier to Estimate Engine and remove needsCustomQuote for that service.

**Vizzy orchestrator SM** (JAYrzGWR8A0tCBzB) also needs 1 line added to "Vizzy - Supervisor Agent" node — PENDING (must do via n8n UI, REST API PUT fails due to credential stripping). See `feedback_n8n_rest_api_credential_stripping.md`.

## What Still Needs to Be Done

- **Hydrojetting** → ✅ LIVE as of 2026-05-01. G/B/B LF-based: Good=$6/LF | Better=$8/LF | Best=$10/LF. Default fallback LF=200. Competes vs Badger Daylighting ($4K-$7K+ for same scope).
- **Commercial gutter jobs** → still routes to custom quote branch. Milli must manually create HCP estimates until a commercial pricing tier is added.
- **Gutter guard install** → uses LF × rate (already works), but goes through single-option path
- **Slack bot token** — HCP Placeholder uses `$env.SLACK_BOT_TOKEN`. Confirm this env var is set in n8n instance settings.

## Why: To eliminate manual estimate creation for every lead
