---
name: GHL Social Planner Settings — Audit & Config Status
description: Full audit of Social Planner settings tabs, notification config, and account status
type: reference
lastAudited: 2026-04-19
originSessionId: 47fc01bc-562d-4761-a9d3-352fa34638e2
---
## Social Accounts (7 connected)
| Platform | Account | Type | Validity | Notes |
|----------|---------|------|----------|-------|
| Google Business Profile | American Services AR | Location | — (permanent) | ✅ |
| Facebook | American Services AR | Page | 54 days | ✅ |
| Instagram | anthonylewissons | Professional | 59 days | ✅ Creator account linked to ASAR |
| LinkedIn | American Services AR | Page | 22 days (exp ~May 12) | ⚠️ Reconnect before May 12 |
| TikTok | americanservicesar | Business | 7 months | ✅ |
| Pinterest | American Services AR | Profile | 59 days | ✅ |
| YouTube | American Services AR | Profile | — (permanent) | ✅ |

## Notifications (configured 2026-04-19)
| Type | User | Frequency | Status |
|------|------|-----------|--------|
| Account Pre-Expiry | Office Assistant (OA) | Every 5 days | 🔵 ON |
| Account Expired | Anthony Sons | Every 1 day | 🔵 ON |
| Post Failed | Auto (post creator) | — | 🔵 ON |
| Request for Approval | — | — | OFF (no approval workflow) |
| Approved Post | — | — | OFF |
| Rejected Post | — | — | OFF |

## Groups
- **AmServ** (`664ca746736cf510c6735658`): ALL 7 platforms confirmed in group (verified 2026-04-19 via API)
  - GBP ✅ | Facebook ✅ | Instagram ✅ | LinkedIn ✅ | TikTok ✅ | Pinterest ✅ | YouTube ✅

## GHL Account IDs (verified 2026-04-19)
| Platform | Account ID |
|----------|-----------|
| Google Business Profile | `64b007f6bc971ab25b25a0b0_PQp7xlYjxZKsi0CWsSA7_13724995530775627829` |
| Facebook Page | `64b007bfbc971a06c925a0a3_PQp7xlYjxZKsi0CWsSA7_293488501278927_page` |
| Instagram | `64b00bd2caf39b3c60c01837_PQp7xlYjxZKsi0CWsSA7_17841449879508464` |
| LinkedIn Page | `64b00815bc971ae44a25a0bb_PQp7xlYjxZKsi0CWsSA7_81069172_page` |
| TikTok Business | `691dde0398ee589c06276c2b_PQp7xlYjxZKsi0CWsSA7_000ArcYmrkXGiiHJw5KdAEuCz0lBjtFYbd_business` |
| Pinterest Profile | `66c61e739fb0f6fc67d518d0_PQp7xlYjxZKsi0CWsSA7_949204196371175388_profile` |
| YouTube Profile | `66e441d8a1b05a4f658a46ce_PQp7xlYjxZKsi0CWsSA7_UCtT5kTZSadj28mXZdeHyx-Q_profile` |

## Posting Strategy — Platform-Optimized (updated 2026-04-19)
GHL `create-post` sends ONE caption to all selected accounts — same text to all platforms.
Soshie makes SEPARATE API calls per platform group with tailored captions:
- **Call 1**: Facebook + GBP — conversational, local, 40-80 chars, question/story opener
- **Call 2**: Instagram — 138-150 chars, hook + story + CTA + hashtags
- **Call 3**: LinkedIn — 150-300 chars, professional, commercial property angle
- **Call 4**: Pinterest — 100-200 chars, keyword-rich, SEO-optimized description
- **Call 5**: TikTok — video only (skip image posts), short hook + 3-5 hashtags
- **Call 6**: YouTube — video only, SEO title + description + chapters

## Pinterest
- Default board: "American Services AR" (set Dec 11, 2025)

## Social Categories (7)
American Services AR, Gutter Services, Fleet Wash, Lawn Care, HVAC, Commercial Pressure Washing, Residential Pressure Washing

## Watermark
- "American Services AR" applied to 6 accounts (updated Dec 11, 2025)

## Global Settings
- Media Optimization: ✅ ON
- Apply Watermark: ✅ ON

## Manage Links
- Empty — no approval workflow in use

## GHL Settings URL
`https://login.myservicerobot.com/v2/location/PQp7xlYjxZKsi0CWsSA7/marketing/social-planner/settings`

## Action Items
- ⚠️ Reconnect LinkedIn ~May 5 (7 days before May 12 expiry) — will get Pre-Expiry email alerts
