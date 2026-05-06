# ASAR Meta Ads — Full Setup Status & Launch Checklist
Last updated: 2026-05-05

---

## WHAT IS BUILT (PAUSED — DO NOT START YET)

### 5 Campaigns
| Campaign | ID | Budget | Status |
|---|---|---|---|
| C1 — Customer Reactivation | 120246186930160723 | $15/day | PAUSED |
| C2 — Retargeting | 120246186931330723 | $10/day | PAUSED |
| C3 — AMP Subscription | 120246186933570723 | $20/day | PAUSED |
| C4 — Commercial | 120246186934750723 | $25/day | PAUSED |
| C5 — Cold Residential | 120246186936840723 | $20/day | PAUSED |
**Total daily budget when live: $90/day**

### 5 Ad Sets
| Ad Set | ID | Campaign | Targeting |
|---|---|---|---|
| C1-AS1 | 120246187220200723 | C1 Reactivation | 40mi from Conway+LR, 25-65, homeowner interests |
| C2-AS1 | 120246187221400723 | C2 Retargeting | 40mi, 25-65, homeowner interests |
| C3-AS1 | 120246187222400723 | C3 AMP | 35mi, 25-65, homeowner interests |
| C4-AS1 | 120246187192660723 | C4 Commercial | 50mi, 25-65, commercial property interests |
| C5-AS1 | 120246187223190723 | C5 Cold | 40mi, 25-65, homeowner stack |

### 5 Custom Conversions (tracking is live)
| Name | ID | Event |
|---|---|---|
| ASAR Lead - Booking Form Submit | 1705017257338518 | Lead |
| ASAR Lead - Thank You Page | 983343610765783 | Lead |
| ASAR Schedule - Appointment Booked | 2079634359259800 | Schedule |
| ASAR Contact - Form or Call | 1663720608102482 | Contact |
| ASAR Service Page View | 1335958205122297 | ViewContent |

---

## CREATIVE IDs (built 2026-05-06 — all 5 ready on Meta servers)
| Campaign | Creative ID |
|---|---|
| C1 — Reactivation | `1502763554707961` |
| C2 — Retargeting | `1345881884027399` |
| C3 — AMP Subscription | `1696739314840178` |
| C4 — Commercial | `1691706605200940` |
| C5 — Cold Residential | `768749946206011` |

---

## WHAT STILL NEEDS DONE BEFORE LAUNCH

### STEP 1 — Unlock Ad Creatives ✅ DONE (2026-05-06)
FB App switched to Live mode. Creatives built via API.
The Facebook App used for the system user is in **Development Mode**.
You need to switch it to Live.

1. Go to: https://developers.facebook.com/apps/
2. Find the app (likely named something like "N8N" or "Emmie")
3. In the top bar you'll see a toggle: **Development → Live**
4. Click it and confirm
5. Done — this unlocks dark post creation for ads

If you can't find which app, look for the App ID via:
- Meta Business Suite → Settings → Business Assets → Apps

---

### STEP 2 — Add Ad Creatives in Meta Ads Manager (REQUIRED — 20 minutes)
After Step 1, add one ad to each ad set. Use the copy below.

Go to: https://adsmanager.facebook.com → Campaigns tab → find each campaign (all named "ASAR C1…", "ASAR C3…" etc.)

**OPTION A: Upload a before/after photo from your job photos folder and paste the copy below**
**OPTION B: Use a video from a recent job (video ads convert 2-3× better for home services)**

---

### AD COPY — PASTE INTO ADS MANAGER

#### C1 — Customer Reactivation
**Headline:** It's Been A While — We Miss You
**Body:** You trusted American Services AR before. Ready for another spotless job? Book in 60 seconds — pressure washing, gutters, roof cleaning & more. Central Arkansas since 2015.
**CTA:** Book Now
**URL:** https://americanservicesar.com/book-now/?utm_source=facebook&utm_medium=paid&utm_campaign=c1-reactivation

#### C2 — Retargeting
**Headline:** Still Thinking About It?
**Body:** You checked us out — let us finish the job. ASAR handles pressure washing, gutter cleaning, roof soft wash, and more. $300 minimum, premium results. Book today.
**CTA:** Book Now
**URL:** https://americanservicesar.com/book-now/?utm_source=facebook&utm_medium=paid&utm_campaign=c2-retargeting

#### C3 — AMP Subscription
**Headline:** Stop Worrying About Your Home's Exterior
**Body:** The American Maintenance Program keeps your home clean year-round — starting at $100/mo. Quarterly pressure washing + gutter cleaning + window wash. Lock in your spot now.
**CTA:** Subscribe
**URL:** https://americanservicesar.com/maintenance-program/?utm_source=facebook&utm_medium=paid&utm_campaign=c3-amp

#### C4 — Commercial
**Headline:** Keep Every Property Spotless — On Contract
**Body:** ASAR handles exterior cleaning for apartment complexes, commercial buildings, and fleet vehicles across Central Arkansas. Monthly contracts from $175/mo. Free site assessment.
**CTA:** Contact Us
**URL:** https://americanservicesar.com/commercial/?utm_source=facebook&utm_medium=paid&utm_campaign=c4-commercial

#### C5 — Cold Residential
**Headline:** Your Neighbors Are Booking Right Now
**Body:** American Services AR has been pressure washing, cleaning gutters, and washing roofs across Central Arkansas since 2015. See what a professional clean looks like — book your estimate today.
**CTA:** Book Now
**URL:** https://americanservicesar.com/book-now/?utm_source=facebook&utm_medium=paid&utm_campaign=c5-cold-residential

---

### STEP 3 — Accept Custom Audiences TOS (REQUIRED — 2 minutes)
This unlocks retargeting and lookalike audiences.

1. Go to: https://www.facebook.com/customaudiences/app/tos/?act=756247089484122
2. Click Accept
3. Done

After accepting, Emmie can create:
- Website Visitors 30d/60d audiences (for C2 Retargeting)
- Customer list audience from the 1,397 hashed HCP customers (file: hcp_customers_hashed.csv)
- 1% Lookalike from customer list (for C3 and C5)

---

### STEP 4 — Fix PixelYourSite Plugin (REQUIRED for accurate tracking)
1. Go to WordPress Admin → PixelYourSite → Facebook
2. The Pixel ID field currently has garbage HTML in it
3. Clear it completely
4. Type ONLY: `754902199616286`
5. Save

This fixes the main pixel so Lead/ViewContent/Contact events fire correctly.

---

### STEP 5 — Change Facebook Page Category (Page Quality boost)
1. Facebook.com → American Services AR page
2. Edit Page Info
3. Change category from "Home Window Service" to "Pressure Washing Service"

---

## LAUNCH ORDER (when ready)

**Start in this order — wait 3-5 days between each:**
1. **C1 — Reactivation** (warmest audience, fastest ROAS)
2. **C2 — Retargeting** (needs TOS + 60d website audience to build first)
3. **C4 — Commercial** (long sales cycle, start early)
4. **C3 — AMP** (needs pixel data to optimize)
5. **C5 — Cold** (broadest — let other campaigns build first)

## ROAS TARGETS
| Campaign | Avg Job Value | Close Rate | Target CPL | Break-even CPL | 10x ROAS CPL |
|---|---|---|---|---|---|
| C1 Reactivation | $750 | 70% | $52.50 | $525 | $52.50 |
| C2 Retargeting | $612 | 85% | $52.02 | $520 | $52.02 |
| C3 AMP | $512/mo | 60% | $30.72 | $307 | $30.72 |
| C4 Commercial | $2,500 | 50% | $125.00 | $1,250 | $125.00 |
| C5 Cold | $450 | 40% | $18.00 | $180 | $18.00 |

*Stop/pause any ad set with CPL > 2× target after 7 days and $50+ spent*
