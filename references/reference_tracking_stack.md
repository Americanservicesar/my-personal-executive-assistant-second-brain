---
name: Landing Page Tracking Stack
description: All 4 tracking IDs confirmed and live — GA4, Meta Pixel, Google Ads, Clarity — account structure, conversion actions still needed
type: reference
originSessionId: current
last_updated: 2026-05-05
---

## Tracking IDs — ALL CONFIRMED & LIVE

| Platform | ID | Status |
|---|---|---|
| **GA4** | `G-L34HPDH8GM` | ✅ LIVE in HTML |
| **Meta Pixel** | `754902199616286` (American Services AR) | ✅ LIVE in HTML |
| **Google Ads tag** | `AW-557411864` | ✅ LIVE in HTML |
| **Microsoft Clarity** | `w8snr3o14x` | ✅ LIVE in HTML |

### GA4 Extra Detail
- Measurement ID: `G-L34HPDH8GM`
- Property ID: `315915509`
- Stream: americanservicesar.com | Stream ID: `3575007992`
- Linked to Google Ads AW-557411864 for audience import

---

## Account Structure — CRITICAL

### Google Ads (TWO accounts — know which is which)
- **ASAR advertiser account**: `287-518-9149` (Customer ID: `4598481846`) — campaigns run here, AW-557411864 is this account's tag
- **MCC / Manager account (Emmie)**: `957-821-7886` — manager only, do NOT run ads or pull conversion tags from here
- OAuth2 n8n credential: `mvzr4UfAOA9u679W`
- Developer token: `dQ5rLVzw3dgLkDFJk-xLPA`

### Meta Pixel (THREE identifiers — know which is which)
- `754902199616286` — **American Services AR pixel** — use for ALL ASAR pages, landing pages, website
- `906205550941083` — **GHL pixel** — GoHighLevel internal, leave alone
- `1953487468872053` — **Facebook App ID** (NOT a pixel) — the FB app used for API/OAuth

### Microsoft Clarity
- Project ID: `w8snr3o14x`
- Dashboard: clarity.microsoft.com

---

## Landing Page File
`C:\Users\sales\OneDrive\Documents\CLAUDE\landing-pages\pressure-washing.html`

## Deployed Landing Page — WordPress
- **URL**: `https://americanservicesar.com/pressure-washing-lp-2/`
- **WP Page ID**: 10260
- **Title**: "Pressure Washing in Conway & Central AR | American Services AR"
- **Status**: Published (2026-05-05)
- **RankMath**: Focus keyword `pressure washing Conway AR`, title + description set
- **Astra meta**: `ast-banner-title-visibility: disabled`, `footer-sml-layout: disabled`, `site-content-layout: no-sidebar`, `ast-site-content-layout: full-width`
- **Tracking**: All 4 IDs live in page JS (GA4, Meta Pixel, Google Ads, Clarity) + UTM capture + scroll depth + click events
- **Note**: GHL Funnels API returns 401 — page hosted on WP instead. GHL form embed in page body still captures leads to GHL CRM.

---

## WordPress Site — FULLY FIXED (2026-05-05)
- **PixelYourSite plugin**: Meta Pixel ID field was corrupt (617 chars of raw HTML code). Fixed to `754902199616286` ✅
- **GA4 in PixelYourSite**: Was blank. Set to `G-L34HPDH8GM` ✅
- **All 4 IDs confirmed live on homepage** via curl: Meta Pixel, GA4, Google Ads AW tag, Clarity ✅
- **Microsoft Clarity plugin**: `w8snr3o14x` active on site ✅

---

## What's Wired (No Further Action Needed)

- **UTM capture** — reads utm_source/medium/campaign/content/term + gclid + fbclid, stores in sessionStorage, appends to every HCP booking link
- **Scroll depth** — GA4 + Pixel events at 25 / 50 / 75 / 90%
- **Click tracking** — phone taps → `phone_call_click` + Pixel `Contact`; booking buttons → `book_online_click` + Pixel `InitiateCheckout` (Budget/Fan Favorite/Luxury labeled)
- **Session time** — events at 30s (+ Pixel `ViewContent`) and 90s
- **GHL form listener** — postMessage listener auto-fires `generate_lead` + Pixel `Lead` when embedded GHL form submits

---

## Google Ads Conversion Actions — RESOLVED via GA4 Import (2026-05-05)

Direct Google Ads conversion labels removed from HTML. Using GA4 → Google Ads automatic import instead.
GA4 property 315915509 is linked to AW-557411864.

**Anthony action required**: In GA4 property 315915509, mark these 3 events as Conversion events:
1. `phone_call_click` → Phone call click conversion
2. `book_online_click` → HCP booking click conversion
3. `generate_lead` → Lead form submission conversion

These events are already firing on the landing page. Once marked as conversions in GA4, they auto-import to Google Ads within 24h. No code changes needed. This avoids double-counting (better than direct gtag conversion calls).

---

## Master Credentials Sheet
- Sheet ID: `17Waiy2_1t0JJ3B0KgHPde-ZJRweg27WexyTp2l3i4tI`
- Section: `═══ ANALYTICS & ADVERTISING ═══` (appended 2026-05-05, updated with confirmed IDs)
