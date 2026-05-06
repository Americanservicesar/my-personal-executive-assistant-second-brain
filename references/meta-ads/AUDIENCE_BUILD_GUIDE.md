# ASAR Meta Audiences — Complete Build Guide
Last updated: 2026-05-06

---

## ✅ ALREADY BUILT (via API)

| Audience | ID | Status |
|---|---|---|
| ASAR HCP Customer List — 1397 Past Customers | `120246249754120723` | ✅ Uploaded — populating 24-48h |

---

## BUILD IN UI — Ads Manager → Audiences → Create

Go to: https://adsmanager.facebook.com/adsmanager/audiences

---

### GROUP 1 — Website (Your Sources → Website)
Select pixel: American Services AR (754902199616286)

| # | Name | Rule | Retention |
|---|---|---|---|
| 1 | `ASAR Website Visitors 30d` | All Website Visitors | 30 days |
| 2 | `ASAR Website Visitors 60d` | All Website Visitors | 60 days |
| 3 | `ASAR Website Visitors 90d` | All Website Visitors | 90 days |
| 4 | `ASAR Service Page Visitors 30d` | URL contains `/pressure-washing` OR `/gutter` OR `/roof` OR `/fleet` OR `/window` | 30 days |
| 5 | `ASAR Booking Page Visitors 30d` | URL contains `/book-now` OR `/get-a-quote` OR `/pressure-washing-lp` | 30 days |
| 6 | `ASAR Website Visitors 7d` | All Website Visitors | 7 days ← EXCLUSION audience |

**How to set URL rules:**
- In the audience builder, under "People who visited specific web pages"
- Add URL → "contains" → paste the path

---

### GROUP 2 — FB Page Engagers (Meta Sources → Facebook Page)
Select page: American Services AR

| # | Name | Rule | Retention |
|---|---|---|---|
| 7 | `ASAR FB Page Engagers 365d` | Everyone who engaged with your Page | 365 days |
| 8 | `ASAR FB Page Engagers 90d` | Everyone who engaged with your Page | 90 days |

---

### GROUP 3 — Instagram Engagers (Meta Sources → Instagram account)
Select account: American Services AR Instagram

| # | Name | Rule | Retention |
|---|---|---|---|
| 9 | `ASAR Instagram Engagers 365d` | Everyone who engaged with your professional account | 365 days |

---

### GROUP 4 — Video Viewers (Meta Sources → Video)
Select your ASAR videos

| # | Name | Rule | Retention |
|---|---|---|---|
| 10 | `ASAR Video Viewers 50%+` | People who watched at least 50% of any video | 365 days |
| 11 | `ASAR Video Viewers 95%+` | People who watched at least 95% of any video | 365 days |

---

## AFTER UI AUDIENCES ARE BUILT — Run Lookalikes

Once you have IDs for `ASAR Website Visitors 60d` and `ASAR FB Page Engagers 365d`:
1. Update `build_lookalikes.py` with those IDs (replace REPLACE_AFTER_UI_BUILD)
2. Run: `python build_lookalikes.py`

Lookalikes created (5 total):
- 1% Lookalike — HCP Customers ← C5 Cold (best ROI)
- 2% Lookalike — HCP Customers ← C5 Cold / C4 Commercial
- 1% Lookalike — Website Visitors 60d ← C5 Cold
- 1% Lookalike — FB Page Engagers ← C3 AMP
- 2% Lookalike — FB Page Engagers ← C4 Commercial

---

## FULL AUDIENCE → CAMPAIGN MAP

| Audience | Campaign | Role |
|---|---|---|
| HCP Customer List | C1 Reactivation | Target past customers |
| FB Page Engagers 365d | C1 Reactivation | Warm brand-aware audience |
| Instagram Engagers 365d | C1 Reactivation | Warm brand-aware audience |
| Booking Page Visitors 30d | C2 Retargeting | Hottest intent |
| Service Page Visitors 30d | C2 Retargeting | High intent |
| Website Visitors 60d | C2 Retargeting | General retargeting |
| FB Page Engagers 90d | C3 AMP | Mid-funnel warm |
| 1% Lookalike FB Page | C3 AMP | Cold but similar to fans |
| HCP Customer List (exclude) | C3, C4, C5 | Don't waste $ on existing customers |
| 2% Lookalike HCP | C4 Commercial | Broad qualified cold |
| 1% Lookalike HCP | C5 Cold | Tightest cold audience |
| 1% Lookalike Website 60d | C5 Cold | Intent-based cold |
| Website 7d (exclude) | C5 Cold | Push to retargeting instead |

---

## EXCLUSION RULES (apply to each campaign)

- **C1 Reactivation**: Exclude nobody (cast wide net on warm audiences)
- **C2 Retargeting**: Exclude Booking Page Visitors who already converted
- **C3 AMP**: Exclude HCP Customer List (already have maintenance customers)
- **C4 Commercial**: No exclusions
- **C5 Cold**: Exclude Website Visitors 30d + HCP Customer List (they should be in warmer campaigns)

---

## TOTAL AUDIENCE COUNT: 17
- 6 Website (UI) ← build today
- 3 Engagement/Meta Sources (UI) ← build today
- 2 Video (UI) ← build when you have videos
- 1 Customer List (API ✅ done)
- 5 Lookalikes (API — run after seeds populate, 24-48h)
