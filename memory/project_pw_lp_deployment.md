---
name: Pressure Washing Landing Page — Deployment Status
description: LP build complete, ready to deploy to WP. Blocked by Cloudflare rate limit in session 2026-05-05.
type: project
originSessionId: b24e5b60-f5fe-476b-89f9-ab1fc617db72
---

## LP Status: LIVE ✅ — https://americanservicesar.com/pressure-washing/
## Google Ads URLs: UPDATED ✅ — 2026-05-06 (20 RSAs pending review, ETAs deprecated/uneditable)

**Deployed 2026-05-06** — WP Page ID 3468, published, RankMath SEO meta set.
- Title: "Pressure Washing Conway AR | American Services AR"
- Focus keyword: "pressure washing Conway AR"
- Deploy method: Browser-side fetch via X-WP-Nonce (app password auth fails on this host; nonce from wp-admin session works)
- Auth: logged in as Anthony Sons (asons@americanservicesar.com) at wp-admin, used window.wpApiSettings.nonce

---

## PREVIOUSLY: BUILT, NOT YET DEPLOYED

### Local File
`C:\Users\sales\OneDrive\Documents\CLAUDE\landing-pages\pressure-washing.html`

### Deploy Script
`C:\Users\sales\OneDrive\Documents\CLAUDE\deploy_pw_lp.py`
- Creates WP page at slug `/pressure-washing`
- Starts as `draft` — review, then publish
- Disables Astra header/footer (`ast_disable_header`, `ast_disable_footer`)
- Minified CSS to avoid wpautop breaking it
- Auth: user `anthonyasons` + app password in script

### WP Deployment (PENDING — blocked 2026-05-05 by Cloudflare 429)
Run in a fresh session:
```bash
cd "C:/Users/sales/OneDrive/Documents/CLAUDE"
python3 deploy_pw_lp.py
```
Then:
1. Preview the draft page at the WP edit URL
2. Set RankMath SEO meta (title/desc/focus keyword)
3. Publish the page
4. Update Google Ads campaigns to point to the new URL

### After Deployment — Google Ads URL Update ✅ DONE 2026-05-06
- Campaign: Pressure Washing (ID: 14486263322)
- Final URL set to: `https://americanservicesar.com/pressure-washing/`
- 20 RSAs updated (new versions pending Google review); ~24 Expanded Text Ads are deprecated (can't edit)
- Method: Chrome MCP → Google Ads UI bulk edit (Edit → Change ads → Final URL)
- Verify conversion tracking fires (form submit → GA4 + Google Ads + Meta Pixel)

## n8n + GHL Infrastructure (COMPLETE)
All built and active as of 2026-05-05:

| Component | ID | Status |
|-----------|-----|--------|
| PW LP Form Intake (n8n) | `9pyPeDS3BOM2e0on` | ACTIVE — webhook `/webhook/pw-lp-form` |
| Milli Inbound SMS Poller (n8n) | `vrlc0Up4HTsBbfdq` | ACTIVE — polls every 1 min |
| Milli Inbound SMS Handler (n8n) | `4jtIAZZR9QFz7Nx2` | ACTIVE — webhook (reserved for future GHL wf) |
| GHL Conversation AI bot | — | SMS removed from channels (won't intercept Milli) |

## LP Form → Backend Flow
1. Visitor fills native HTML form → form submit JS fires
2. Conversion pixels fire immediately (GA4 generate_lead + Google Ads + Meta Lead), value: $1
3. POST to n8n `/webhook/pw-lp-form`
4. n8n: upsert GHL contact (phone E.164, strips empty fields) → create Residential opportunity → POST Address Processor
5. Address Processor: SerpApi property lookup → Estimate Engine → G/B/B estimate SMS via Milli
6. Visitor gets SMS with Good/Better/Best price within minutes

## Inbound SMS Reply Flow
1. Contact texts back → GHL receives inbound SMS
2. n8n Milli poller fires every 1 min → filters lastMessageDirection=inbound + TYPE_SMS + within 2 min
3. Builds context query (contact name, tags, last 8 messages)
4. Calls Milli standalone `BJ8RLrbjuZ8pSmAL` → Milli generates response
5. SMS reply sent via GHL conversations API

## Conversion Values
All LP conversions use `value: 1` (dollar) to keep Smart Bidding neutral:
- GA4 `generate_lead` event: value 1
- Google Ads conversion (`AW-557411864/2fyDCMSn3JkZEJjc5YkC`): value 1
- Meta Pixel `Lead` event: value 1
- Google Ads conversion action UI default: still $350 (non-blocking — event value overrides it)
  → To fix: edit "Book Appointment" conversion in Google Ads UI → change default value to $1
