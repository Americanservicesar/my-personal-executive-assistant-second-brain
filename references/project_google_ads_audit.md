# Google Ads Audit & Optimization — ASAR
**Customer ID:** 4598481846 | **Account:** American Services AR
**Last Updated:** 2026-05-05

---

## Campaign ID Reference
| Campaign | ID | Status | Budget |
|---|---|---|---|
| Pressure Washing | 14486263322 | Paused | $20/day |
| Window Cleaning | 14486263325 | Paused | (unknown) |
| Gutter Cleaning | 14486263199 | Paused | (unknown) |
| Christmas Lights | 18782204578 | Paused | (unknown) |
| Vent Cleaning | 19466297496 | Paused | $15/day |
| Brand | 14486263196 | Paused | (unknown) |
| Fleet Washing | 17330622225 | Paused | **$12/day** (cut from $40) |
| Performance Max | 19947218819 | Paused | (portfolio) |
| Demand Gen - 2024-03-07 | 21086399719 | Paused | (unknown) |
| Core Aeration | Lawn Aeration | (unknown) | Paused | (blocked) |

---

## Conversion Actions (15 total)
| Name | ctId | Status | Notes |
|---|---|---|---|
| WEBSITE LEAD FORM SUBMISSION | 6764827588 | ⚠️ Needs attention | Tracks myservicerobot.com — WRONG domain. Google tag can't fire on 3rd-party domain. Only 2 convs in 2 years. Value fixed $350→$1. |
| Thank You Page - Service Booked | 7600444527 | ⚠️ Inactive (new) | Created 2026-05-05. Tracks /thank-you/ on ASAR site. Just needs first conversion to activate. Verify page exists + HCP redirects there. |
| GHL Click | (page 2) | ⚠️ 0 conversions | Offline import type. Needs n8n GCLID pipeline built to upload conversions. |
| All other conversions | — | Various | Mostly inactive/legacy. |

**Conversion value rule:** $1 for all conversions (pure lead tracking, not revenue tracking).

---

## Ad Schedules — COMPLETED 2026-05-05
All 7 Search campaigns set to **6:00 AM – 11:00 PM, 7 days/week**:
- ✅ Pressure Washing (pre-existing)
- ✅ Window Cleaning (pre-existing)
- ✅ Gutter Cleaning (pre-existing)
- ✅ Christmas Lights (pre-existing)
- ✅ Vent Cleaning ← **newly set**
- ✅ Brand ← **newly set**
- ✅ Fleet Washing ← **newly set**

---

## Pressure Washing Bid Adjustments — COMPLETED 2026-05-05
Based on all-time historical data (1,075 clicks, 58 conversions, $8,498 spend):

| Day | Bid Adj | Conv/day | Cost/conv | Rationale |
|---|---|---|---|---|
| Monday | — | 10.8 | $136 | Near average, left untouched |
| Tuesday | 0% | 11.0 | $137 | Near average |
| **Wednesday** | **+15%** | **16.0** | **$90** | Best converting day |
| Thursday | 0% | 8.1 | $133 | Near average |
| Friday | 0% | 6.0 | $161 | Slightly above avg, not enough data for adj |
| **Saturday** | **-40%** | **2.1** | **$482** | Worst day — terrible ROI |
| **Sunday** | **-30%** | **4.0** | **$255** | Bad day — well below average |

---

## Fleet Washing Budget Cut — COMPLETED 2026-05-05
- **Before:** $40/day (highest in entire account)
- **After:** $12/day
- **Why:** Only 51 all-time clicks, $472 total spend, 1 raw lead in history. Was massively over-budgeted vs results.

---

## Vent Cleaning Portfolio Bid Strategy Fix — COMPLETED 2026-05-05
- Detached from "Portfolio Maximize Conversions_579934054-300-1719358537253"
- Now: standalone Maximize Clicks at $15/day
- "2 entities updated" confirmed

---

## Key Findings from Audit

### PMax (campaignId=19947218819)
- Stays paused — not worth running at current budget scale
- Data showed Sunday worst day: $151 spend, 0 conversions
- Wednesday/Friday best days: $32-31/conv
- Revisit only when LSA is set up

### Fleet Washing
- Targets: semi truck washing, fleet washing, commercial truck cleaning
- Keyword "semi truck washing" = $212 spend, 23 clicks ($9.24 CPC)
- Very niche B2B play — low volume in Central AR market

### Pressure Washing (most mature campaign)
- Best all-time data: 1,075 clicks, 58 conversions, avg $146/conv
- Wednesday is the clear winner at $90/conv
- Weekend performance terrible ($255-482/conv) vs weekday avg ~$135/conv

---

## HCP Booking Redirect — COMPLETED 2026-05-06
- **Redirect URL set:** `https://americanservicesar.com/thank-you/`
- Location: HCP → Settings → Booking → Online Booking → Advanced Settings → Booking redirect
- After any successful HCP online booking, customer is now redirected to the thank-you page
- This will fire the "Thank You Page - Service Booked" conversion (ctId=7600444527) on the first booking

## WordPress /thank-you/ Page — PENDING (site rate-limited)
- WP REST API auth: user=`Asons`, app password=`qWzH 9qXZ z3L4 US1p cQyV GXwk`
- Basic auth header: `Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s=`
- Create command (run when site recovers):
  ```
  curl -s -X POST "https://americanservicesar.com/wp-json/wp/v2/pages" \
    -H "Authorization: Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s=" \
    -H "Content-Type: application/json" \
    -d '{"title":"Thank You","slug":"thank-you","status":"publish","content":"<h2>Thank You for Booking!</h2><p>Your request has been received. A member of the American Services AR team will be in touch shortly to confirm your appointment.</p>"}'
  ```
- Verify with: `curl -s "https://americanservicesar.com/wp-json/wp/v2/pages?slug=thank-you" -H "Authorization: Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s="`

---

## GCLID / Offline Conversion Research — COMPLETED 2026-05-06
**Finding: GHL does NOT capture GCLID. Offline pipeline is unnecessary.**

Checked all 54 GHL custom fields + reviewed recent contact attributions (4,299 contacts):
- Zero contacts have a `gclid` field
- All web lead attributions show `medium: "other"` — no UTM data at all
- Root cause: GHL form is embedded as a cross-origin iframe. Browser blocks the iframe from reading the parent page URL, so GHL never sees the `gclid` URL parameter.

**Offline conversion pipeline (GHL Click ctId) → SKIP.** No GCLID to upload.

**Correct path (already partially built):** GA4 → Google Ads auto-import.
- The landing page already fires `generate_lead` (postMessage listener when GHL form submits), `book_online_click`, and `phone_call_click` events to GA4
- GA4 property `315915509` is linked to Google Ads `AW-557411864`
- GA4 sees the GCLID from the Google Ads tag already firing on the ASAR page
- So attribution is intact — just needs the events marked as conversions

**⚠️ Anthony action required (one-time, takes 2 minutes):**
Go to GA4 → property 315915509 → Admin → Conversions → mark these 3 events:
1. `generate_lead`
2. `book_online_click`
3. `phone_call_click`
Google Ads starts receiving these conversions with GCLID attribution within 24h. No code changes needed.

---

## Remaining TODO (priority order)
1. **Create /thank-you/ WP page** — Site was rate-limited during 2026-05-06 session. Run the curl command above when site is accessible. HCP redirect is already set.
2. **Anthony marks 3 GA4 events as conversions** — `generate_lead`, `book_online_click`, `phone_call_click` in GA4 property 315915509. This replaces the broken WEBSITE LEAD FORM SUBMISSION conversion and the offline pipeline entirely.
3. **Vent Cleaning campaign rebuild** — B2B ad groups, commercial/apartment/HOA targeting, air vent + dryer vent separate ad groups
4. **Remarketing audience** — 90-day website visitor list + Customer Match CSV from HCP customer list
5. **Set up Local Services Ads (LSA)** — Maps presence, pay-per-lead model, Google-verified badge. Better than PMax for local service business at this budget level.
6. **Core Aeration campaign** — Blocked until dedicated landing page is built
7. **PMax optimization** — Skipped for now. Stays paused. Revisit after LSA is live.

**Removed from TODO:**
- ~~Fix WEBSITE LEAD FORM SUBMISSION tracking~~ — Replaced by GA4 import approach. GHL domain mismatch issue is irrelevant since attribution flows through GA4 on the ASAR page itself.
- ~~Build GHL Click offline conversion pipeline~~ — GCLID never reaches GHL (cross-origin iframe blocks URL params). No data to upload.

---

## Navigation Patterns
- Ad schedule URL: `https://ads.google.com/aw/adschedule?campaignId=XXXXX&ocid=579934054&__c=4598481846&authuser=0`
- Campaign overview URL: `https://ads.google.com/aw/overview?campaignId=XXXXX&ocid=579934054&__c=4598481846&authuser=0`
- Conversions URL: `https://ads.google.com/aw/conversions?ocid=579934054&__c=4598481846&authuser=0`
- Campaigns list: `https://ads.google.com/aw/campaigns?ocid=579934054&__c=4598481846&authuser=0`

## Browser Automation Notes
- Campaign table uses virtual/shadow DOM — `find` tool works, JS queries don't
- Campaign dropdown (ref pattern: button "CampaignName") opens listbox with all campaigns
- Bid adj inline edit: click cell → Increase/Decrease toggle → type value → Save
- Budget edit: click pencil icon next to budget → type value → Save (may trigger "Confirm it's you" dialog — click Confirm then retry Save)
- Ad schedule editor: "Edit ad schedule" button → "All days" pre-selected → set start/end times → Save
