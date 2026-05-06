# ASAR Meta Ads — Operational Game Plan
# WHO / WHAT / WHERE / WHEN / HOW / WHY + Tools
Last updated: 2026-05-06

---

## WHO

**Owner:** Anthony Sons (decision-maker — approves budget changes, creative swaps, scaling)
**Operator:** Emmie (Emmie agent reviews weekly performance, flags anomalies to Anthony via Slack #emmie-email)
**Analyst:** Dexter (Dexter agent pulls Meta Insights data, appends to Dexter Google Sheet, surfaces ROAS/CPL trends)
**Traffic destination:** HousecallPro booking + americanservicesar.com landing pages
**Customer segments:**
- C1 — Past HCP customers (1,397 in audience → master list grows with QB merge)
- C2 — Website visitors (30d/60d/service page/booking page)
- C3 — AMP subscription prospects (lookalike + FB engagers)
- C4 — Commercial property managers, HOAs, apartment complexes
- C5 — Cold residential homeowners in Central AR

---

## WHAT

### 5 Campaign Tiers — All PAUSED, READY TO LAUNCH

| Campaign | ID | Budget | Audience | Goal |
|---|---|---|---|---|
| C1 — Customer Reactivation | 120246186930160723 | $15/day | HCP Customer List | Re-book past customers |
| C2 — Retargeting | 120246186931330723 | $10/day | Website visitors (30d/60d/service/booking) | Convert warm traffic |
| C3 — AMP Subscription | 120246186933570723 | $20/day | 1% HCP Lookalike | Sell maintenance plans |
| C4 — Commercial | 120246186934750723 | $25/day | 2% Website 90d Lookalike | Land commercial contracts |
| C5 — Cold Residential | 120246186936840723 | $20/day | 1% HCP + 1% Website 60d Lookalike | Fill the pipeline cold |
**Total: $90/day = $2,700/month**

### 12 Custom Audiences Built

| ID | Name | Type | Status | Used In |
|---|---|---|---|---|
| 120246249754120723 | ASAR HCP Customer List | Customer List | Populating | C1 target |
| 120246249860330723 | ASAR Website Visitors 7d | Website | Populating | C5 exclusion |
| 120246249861220723 | ASAR Website Visitors 30d | Website | Populating | C2 target |
| 120246249861920723 | ASAR Website Visitors 60d | Website | Populating | C2 target |
| 120246249862640723 | ASAR Website Visitors 90d | Website | Populating | lookalike seed |
| 120246249863380723 | ASAR Service Page Visitors 30d | Website | Populating | C2 target |
| 120246249864330723 | ASAR Booking Page Visitors 30d | Website | Populating | C2 target |
| 120246249865380723 | ASAR Landing Page Visitors 30d | Website | Populating | C2 target |
| 120246249877030723 | ASAR 1pct Lookalike - HCP Customers USA | Lookalike | Ready (2M) | C3, C5 target |
| 120246249878570723 | ASAR 1pct Lookalike - Website Visitors 60d USA | Lookalike | Updating | C5 target |
| 120246250261560723 | ASAR 2pct Lookalike - Website Visitors 90d USA | Lookalike | Building | C4 target |
| 120246250278550723 | ASAR 3pct Lookalike - Website Visitors 30d USA | Lookalike | Building | Scale |

### 5 Ad Creatives (built, ready on Meta servers)
| Campaign | Creative ID | Headline |
|---|---|---|
| C1 — Reactivation | 1502763554707961 | It's Been A While — We Miss You |
| C2 — Retargeting | 1345881884027399 | Still Thinking About It? |
| C3 — AMP Subscription | 1696739314840178 | Stop Worrying About Your Home's Exterior |
| C4 — Commercial | 1691706605200940 | Keep Every Property Spotless — On Contract |
| C5 — Cold Residential | 768749946206011 | Your Neighbors Are Booking Right Now |

### 5 Custom Conversions (tracking live)
| Name | ID | Pixel Event |
|---|---|---|
| ASAR Lead - Booking Form Submit | 1705017257338518 | Lead |
| ASAR Lead - Thank You Page | 983343610765783 | Lead |
| ASAR Schedule - Appointment Booked | 2079634359259800 | Schedule |
| ASAR Contact - Form or Call | 1663720608102482 | Contact |
| ASAR Service Page View | 1335958205122297 | ViewContent |

### Still Needed in Ads Manager UI (5 engagement audiences)
| Name | Source | Rule | Days |
|---|---|---|---|
| ASAR FB Page Engagers 365d | Meta Sources → Facebook Page | Everyone who engaged | 365 |
| ASAR FB Page Engagers 90d | Meta Sources → Facebook Page | Everyone who engaged | 90 |
| ASAR Instagram Engagers 365d | Meta Sources → Instagram | Everyone who engaged | 365 |
| ASAR Video Viewers 50pct | Meta Sources → Video | Watched >= 50% | 365 |
| ASAR Video Viewers 95pct | Meta Sources → Video | Watched >= 95% | 365 |
→ After building FB Page Engagers 365d: give audience ID → add to C3 ad set + create 2 more lookalikes

---

## WHERE

**Tracking entry points:**
- Meta Pixel ID: `754902199616286` — fires on all website pages + landing page
- GA4 Property: `G-L34HPDH8GM` — parallel tracking
- Google Ads: `AW-557411864` — remarketing tag on all pages
- Microsoft Clarity: `w8snr3o14x` — heatmaps + session recording

**Data flows:**
```
User sees ad → clicks → landing page → form submit → HCP booking → 
Pixel fires Lead event → Meta optimizes → GHL contact created → 
HCP job created → Dexter logs revenue → Dexter Sheet updated
```

**Reporting locations:**
- Meta Ads Manager: adsmanager.facebook.com/adsmanager (live performance)
- Dexter Google Sheet: 1YHE95PH9f86irf_6EggnTSBD3-CP6SKenWd2g9ndycE (aggregated)
- Slack #dexter-data: weekly Dexter report
- Slack #emmie-email: anomaly alerts from Emmie

---

## WHEN

### Launch Order (wait 3-5 days between each)
1. **C1 — Reactivation** — Launch FIRST (warmest, fastest ROAS, least risk)
2. **C2 — Retargeting** — Launch after 60d website audience builds up (5-7 days minimum)
3. **C4 — Commercial** — Long sales cycle, launch early to start building pipeline
4. **C3 — AMP** — After pixel has data to optimize (Day 10-14)
5. **C5 — Cold** — Last (broadest, let other campaigns build signal first)

### Weekly Rhythm
| Day | Task |
|---|---|
| Monday | Dexter pulls weekly performance report (impressions, clicks, CPL, ROAS per campaign) |
| Monday | Emmie reviews report, flags anything above CPL threshold to Anthony via Slack |
| Wednesday | Mid-week pulse check — any ad set burning budget without conversions? |
| Friday | Anthony reviews, approves any budget shifts or pauses |

### Optimization Triggers (act immediately)
- CPL > 2× target after 7 days + $50 spent → PAUSE that ad set
- CTR < 0.5% after 3 days → swap creative
- Frequency > 4.0 → expand audience or refresh creative
- Website audience reaches 1,000+ → recalibrate C2 bids
- HCP customer list hits 2,000+ → re-upload and refresh lookalikes

### Master Customer List Refresh Schedule
- When: Every time HCP exports new customers (quarterly minimum)
- How: Export HCP CSV + QuickBooks CSV → drop in meta_audiences/ folder → run build_master_audience.py
- Effect: Replaces Meta audience + lookalikes auto-refresh within 24-48h

---

## HOW

### Tracking & Analysis

**Step 1 — Dexter pulls Meta Insights via API:**
Endpoint: `GET /act_{AD_ACCOUNT}/insights`
Fields: impressions, clicks, spend, actions (lead, schedule, contact), cpm, ctr, cpp
Level: adset
Date: last 7 days
→ Parse actions array → extract lead count, cost_per_action_type
→ Append row to Dexter Sheet "Meta Ads" tab

**Step 2 — Calculate KPIs per campaign:**
```
CPL = spend / leads
CTR = clicks / impressions
CPC = spend / clicks
ROAS = (leads × avg_job_value × close_rate) / spend
```

**Step 3 — Flag anomalies:**
- CPL > 2× target → Emmie DMs Anthony: "C5 CPL is $47, target is $18. Pause?"
- Spend > budget by 20% → alert immediately (Meta overspend bug)
- Zero leads after $50 spend → creative swap needed

### Optimization Playbook

**Creative fatigue (frequency > 3.5 after week 2):**
- Swap headline (A/B test 2 variations)
- Test video vs static (video typically 2-3× better for home services)
- Rotate seasonal angle (Spring cleanup → Summer heat prep → Fall gutters)

**Audience expansion path (scaling to $2M):**
```
Month 1: C1 + C2 launch ($25/day) → validate CPL
Month 2: Add C4 Commercial + C5 Cold ($70/day) → test lookalikes
Month 3: Add C3 AMP ($90/day total) → optimize conversion events
Month 6: Scale winners to $200/day → lookalike stack fully populated
Month 12: Add FB/IG engager audiences → full-funnel retargeting
```

**Budget reallocation rules:**
- If C1 CPL < $35 → increase C1 budget by $5/day every 7 days (past customers convert highest)
- If C5 CPL < $20 → increase C5 budget by $10/day (cold scale is the path to $2M)
- If C4 lands commercial account → increase C4 by $15/day (highest ticket)
- Any campaign > $100 CPL after 14 days → pause and rebuild targeting

### Scaling Path to $2M

| Revenue Target | Monthly Ad Spend | Daily Budget | Key Levers |
|---|---|---|---|
| $300K/yr (current pace) | $0 (organic only) | $0 | — |
| $500K/yr | $3,000/mo | $100/day | C1 + C2 + C5 live |
| $750K/yr | $6,000/mo | $200/day | All 5 campaigns + A/B testing |
| $1M/yr | $10,000/mo | $333/day | Lookalike expansion + video creative |
| $2M/yr | $18,000/mo | $600/day | Full audience stack, 3 creatives per campaign, commercial pipeline |

**ROAS targets by campaign:**
| Campaign | Avg Job Value | Close Rate | Target CPL | Break-even CPL |
|---|---|---|---|---|
| C1 Reactivation | $750 | 70% | $52.50 | $525 |
| C2 Retargeting | $612 | 85% | $52.02 | $520 |
| C3 AMP | $512/mo | 60% | $30.72 | $307 |
| C4 Commercial | $2,500 | 50% | $125.00 | $1,250 |
| C5 Cold | $450 | 40% | $18.00 | $180 |

---

## WHY

**Why Meta ads for ASAR:**
- 94% of Central AR homeowners are on Facebook. Your competitors aren't running structured ads.
- The HCP customer list is a MOAT — 1,400 past customers who already trust you. Retargeting them costs 3-5× less per booking than finding cold leads.
- Lookalike audiences from real past customers outperform interest targeting 2-3× in home services.
- Facebook pixel data + GA4 + HCP booking data creates a closed loop — every dollar is accountable.
- $90/day ($2,700/month) at a 10× ROAS target = $27,000/month in booked jobs = $324K/yr incremental revenue at current close rates.

**Why this funnel structure:**
- C1 first: Lowest CPL, highest trust, fastest cash. Pays for the whole system.
- C2 retargeting: Captures the 97% who visited but didn't book. Second-cheapest lead.
- C4 early: Commercial jobs are $2,500+ avg — one win pays 30 days of ad spend.
- C5 last: Cold needs the pixel to be warmed up first or CPL spikes.

---

## TOOLS

### Primary Tools (agent-accessible via API)

| Tool | Purpose | Access Method | Frequency |
|---|---|---|---|
| Meta Marketing API v21.0 | Pull campaign/adset/ad insights, update targeting, pause/activate campaigns | REST API — TOKEN in build_ads.py | Weekly (Dexter) + on-demand |
| Meta Custom Audiences API | Refresh customer list, build new audiences, check sizes | REST API | Monthly or on HCP export |
| GA4 Data API | Cross-reference Meta conversions with website sessions | GA4 API (Seomi credential) | Weekly |
| HousecallPro API | Pull booked jobs, revenue, match to Meta lead source | HCP token in memory | Weekly |
| GHL API (via n8n) | Pull leads created from Meta campaigns, track pipeline stage | PIT token via n8n | Weekly |
| Dexter Google Sheet | Single source of truth for ad performance vs revenue | Google Sheets MCP | Weekly |

### Meta API Endpoints Dexter Should Call

```python
# Weekly performance pull
GET /act_756247089484122/insights
  ?fields=campaign_name,adset_name,spend,impressions,clicks,ctr,cpm,cpc,
          actions,cost_per_action_type
  &level=adset
  &date_preset=last_7d
  &access_token=TOKEN

# Check audience sizes
GET /act_756247089484122/customaudiences
  ?fields=id,name,approximate_count_lower_bound,operation_status
  &access_token=TOKEN

# Pause/activate ad set
POST /{adset_id}
  ?status=ACTIVE (or PAUSED)
  &access_token=TOKEN

# Update budget
POST /{campaign_id}
  ?daily_budget={amount_in_cents}
  &access_token=TOKEN
```

### Files & Scripts

| File | Purpose |
|---|---|
| `meta_adsets/build_ads.py` | Create ads (run after payment method added) |
| `meta_adsets/build_adsets.py` | Original ad set builder |
| `meta_adsets/LAUNCH_CHECKLIST.md` | Launch order + ad copy |
| `meta_adsets/META_ADS_OPERATIONAL_GAME_PLAN.md` | This file |
| `meta_audiences/build_master_audience.py` | Merge HCP+QB → hash → upload to Meta |
| `meta_audiences/build_lookalikes.py` | Create FB Page engager lookalikes (run after UI audiences built) |
| `meta_audiences/AUDIENCE_INVENTORY.md` | Full audience ID reference |
| `meta_audiences/AUDIENCE_BUILD_GUIDE.md` | UI build guide for engagement audiences |

### Monitoring Alerts Emmie Should Watch For

| Alert | Threshold | Action |
|---|---|---|
| Ad rejected | Any creative disapproval | Notify Anthony immediately |
| Spend spike | > 20% over daily budget | Pause + alert Anthony |
| CPL spike | > 2× target for 3+ days | Pause ad set, flag creative |
| Zero conversions | $50 spend + 0 leads | Swap creative or check pixel |
| Audience too small | < 1,000 people | Widen targeting or wait for population |
| Frequency too high | > 4.0 | Swap creative or expand audience |
| HCP customer list stale | > 90 days since last upload | Prompt Anthony to re-export |

---

## VERIFICATION SUMMARY — 2026-05-06

### Campaigns: 5/5 CONFIRMED
| Campaign | ID | Budget | Status | Objective |
|---|---|---|---|---|
| C1 — Customer Reactivation | 120246186930160723 | $15/day | PAUSED READY | OUTCOME_LEADS |
| C2 — Retargeting | 120246186931330723 | $10/day | PAUSED READY | OUTCOME_LEADS |
| C3 — AMP Subscription | 120246186933570723 | $20/day | PAUSED READY | OUTCOME_LEADS |
| C4 — Commercial | 120246186934750723 | $25/day | PAUSED READY | OUTCOME_LEADS |
| C5 — Cold Residential | 120246186936840723 | $20/day | PAUSED READY | OUTCOME_LEADS |

### Ad Sets: 5/5 CONFIRMED + AUDIENCES WIRED
| Ad Set | Included Audiences | Excluded Audiences |
|---|---|---|
| C1-AS1 | HCP Customer List | — |
| C2-AS1 | Website 30d, 60d, Service Page 30d, Booking Page 30d, Landing Page 30d | — |
| C3-AS1 | 1% HCP Lookalike | HCP Customer List |
| C4-AS1 | 2% Website 90d Lookalike | — |
| C5-AS1 | 1% HCP Lookalike, 1% Website 60d Lookalike | HCP Customer List, Website 7d |

### Creatives: 5/5 CONFIRMED (on Meta servers)
### Custom Conversions: 5/5 CONFIRMED (pixel tracking live)

### Ads: 0/5 — BLOCKED (add payment method to Meta ad account to unblock)

### Remaining Before Full Launch:
1. Add payment method → adsmanager.facebook.com → Billing
2. Run `build_ads.py` → creates the 5 ads linked to their creatives
3. Build 5 engagement audiences in Ads Manager UI
4. Provide FB Page Engagers 365d audience ID → 2 more lookalikes via build_lookalikes.py
5. Drop HCP fresh export + QB export → run build_master_audience.py (master customer list)
6. Launch C1 first → wait 3-5 days → launch C2, etc.
