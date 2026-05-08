# Ads + Tracking Optimization Audit — 2026-05-07

## Items Verified This Session (Items 2–16)

### ✅ DONE
| # | Item | Notes |
|---|---|---|
| 2 | GHL → Google Ads connected | Confirmed by Anthony — American Services AR account |
| 4 | GA4 data retention → 14 months | Live verified: Event data 14mo + User data 14mo both set |

### ❌ NOT DONE — Priority Order

| # | Item | Live State | Action Needed |
|---|---|---|---|
| 1 | Meta payment method | MISSING | adsmanager.facebook.com → Billing → Add payment → 5 campaigns go live immediately |
| 3 | Audiences → Observation targeting | NOT applied | Google Ads → each campaign → Audiences → Add All Customers + All Visitors → Observation |
| 5 | phone_call_click + book_online_click | EVENTS DON'T EXIST in GA4 | Only 6 events exist; these never set up. Need GTM trigger or n8n Measurement Protocol |
| 6 | GA4 custom dimensions | 0 of 0 created | Create: service_type, lead_source, city_market in GA4 Admin → Custom Definitions |
| 7 | Internal traffic filter | EXISTS but in Testing mode | GA4 Admin → Data Filters → Internal Traffic → flip Testing → Active |
| 8 | /pressure-washing/ retargeting audience | Not created | Google Ads Audience Manager → New → Website visitors → URL contains /pressure-washing/ → 30d |
| 9 | Vent Cleaning campaign rebuild | Not done | Rebuild B2B: Property Mgrs / HOA / Commercial ad groups, remove residential targeting |
| 10 | LSA setup | Never started | ads.google.com/localservices → Cleaning category → Google Guaranteed badge |
| 11 | Meta lookalike audiences | Populating (uploaded 2026-05-07) | Auto-generates in 24-48h once Customer Match lists hit 100+ matches — no action needed |
| 12 | Core Aeration campaign | BLOCKED | /core-aeration/ landing page needed first — Seomi agent must build it |
| 13 | 7d/14d/30d retargeting buckets | Not created | Google Ads → Audience Manager → 3 new Website visitor audiences by time window |
| 14 | GHL Social Planner GBP + YouTube | EXPIRED 2026-05-06 | GHL → Settings → Integrations → Social Planner → reconnect both |
| 15 | sales@ Gmail inbox sweep | Not done | Trigger Emmie: archive + label all inbox (same as asons@ sweep) |
| 16 | Instantly ASAR-01-Apartments | Cap hit (994/1K) | Monthly cap resets — when reset: Lead List → select all → Move to ASAR-01-Apartments campaign |

## GA4 Events That Exist (as of 2026-05-07)
1. conversion_event_submit_lead_form — No stream data
2. first_visit — American Services AR - GA4
3. generate_lead — American Services AR - GA4
4. purchase — No stream data
5. Submitted_LightBox — No stream data
6. Submitted_SmartForm — No stream data

**Missing:** phone_call_click, book_online_click — need to create via GTM or n8n Measurement Protocol

## Automation Roadmap
- **phone_call_click**: n8n → when GHL call logged → POST GA4 Measurement Protocol event
- **book_online_click**: n8n → when HCP job booked → POST GA4 Measurement Protocol event
- **Audience refresh**: n8n nightly → export new GHL contacts → Google Ads API OfflineUserDataJobService
- **Meta audience refresh**: n8n weekly → export new GHL contacts → POST to Meta Custom Audience API
- **Instantly cap check**: n8n cron daily → check cap → when < 1K used, auto-move leads to campaign

## GA4 Property Info
- Account: American Services AR (a180175854)
- Property: American Services AR - GA4 (p315915509)
- Admin URL: https://analytics.google.com/analytics/web/#/a180175854p315915509/admin
