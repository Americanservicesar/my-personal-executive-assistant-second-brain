# ASAR Meta Audiences — Full Inventory
Last updated: 2026-05-06

---

## BUILT VIA API (14 total)

### Customer List
| ID | Name | Records | Status |
|---|---|---|---|
| `120246249754120723` | ASAR HCP Customer List — 1397 Past Customers | 1,214 emails + 1,363 phones | Matching (24-48h) |

### Website Pixel Audiences (7)
| ID | Name | Retention | Purpose |
|---|---|---|---|
| `120246249860330723` | ASAR Website Visitors 7d | 7d | EXCLUSION — keeps cold spend clean |
| `120246249861220723` | ASAR Website Visitors 30d | 30d | C2 Retargeting |
| `120246249861920723` | ASAR Website Visitors 60d | 60d | C2 Retargeting + lookalike seed |
| `120246249862640723` | ASAR Website Visitors 90d | 90d | C1 Reactivation warm |
| `120246249863380723` | ASAR Service Page Visitors 30d | 30d | C2 Retargeting high-intent |
| `120246249864330723` | ASAR Booking Page Visitors 30d | 30d | C2 Retargeting hottest |
| `120246249865380723` | ASAR Landing Page Visitors 30d | 30d | Paid traffic retargeting |

### Lookalike Audiences (4 built via API)
| ID | Name | Ratio | Seed | Feeds |
|---|---|---|---|---|
| `120246249877030723` | ASAR 1pct Lookalike - HCP Customers USA | 1% | HCP List | C3, C5 Cold |
| `120246249878570723` | ASAR 1pct Lookalike - Website Visitors 60d USA | 1% | WV 60d | C5 Cold |
| `120246250261560723` | ASAR 2pct Lookalike - Website Visitors 90d USA | 2% | WV 90d | C4 Commercial |
| `120246250278550723` | ASAR 3pct Lookalike - Website Visitors 30d USA | 3% | WV 30d | Scale |

**Note:** 2%/3% from HCP source blocked by Meta dedup (prior session created+deleted). Recreated from website audiences — functionally equivalent for broad prospecting. Once HCP list grows to 5,000+ records after QB merge, create fresh HCP-seeded lookalikes.

---

## STILL NEEDS UI CREATION (5 — engagement only)

Go to: https://adsmanager.facebook.com/adsmanager/audiences → Create → Custom Audience

### FB Page Engagers (Meta Sources → Facebook Page → American Services AR)
| Name | Rule | Retention |
|---|---|---|
| `ASAR FB Page Engagers 365d` | Everyone who engaged with your Page | 365 days |
| `ASAR FB Page Engagers 90d` | Everyone who engaged with your Page | 90 days |

### Instagram Engagers (Meta Sources → Instagram account)
| Name | Rule | Retention |
|---|---|---|
| `ASAR Instagram Engagers 365d` | Everyone who engaged with your business account | 365 days |

### Video Viewers (Meta Sources → Video — select your videos)
| Name | Rule | Retention |
|---|---|---|
| `ASAR Video Viewers 50pct` | People who watched at least 50% | 365 days |
| `ASAR Video Viewers 95pct` | People who watched at least 95% | 365 days |

**After building FB Page Engagers 365d → give me that audience ID → I'll create 2 more lookalikes from it via API**

---

## PENDING: Master Customer List Update (QB + HCP merge)
- Fresh HCP export: pending download
- QuickBooks export: Anthony to provide
- Merge script: ready at `build_master_audience.py`
- Once merged: re-upload replaces current list + refresh lookalikes

---

## AUDIENCE → CAMPAIGN MAP

| Audience | Campaign | Role |
|---|---|---|
| HCP Customer List | C1 Reactivation | Target past customers directly |
| FB Page Engagers 365d | C1 Reactivation | Brand-aware warm audience |
| IG Engagers 365d | C1 Reactivation | Brand-aware warm audience |
| Booking Page Visitors 30d | C2 Retargeting | Hottest — almost booked |
| Service Page Visitors 30d | C2 Retargeting | High intent |
| Website Visitors 60d | C2 Retargeting | General retargeting |
| FB Page Engagers 90d | C3 AMP | Mid-funnel warm |
| 1% Lookalike FB Page Engagers | C3 AMP | Cold but similar to fans |
| 2% Lookalike HCP | C4 Commercial | Broad qualified cold |
| 1% Lookalike HCP | C5 Cold | Best ROI cold audience |
| 1% Lookalike Website 60d | C5 Cold | Intent-based cold |
| Website Visitors 7d (EXCLUDE) | C3, C4, C5 | Push to retargeting first |
| HCP Customer List (EXCLUDE) | C3, C4, C5 | Don't pay to reach existing customers |
