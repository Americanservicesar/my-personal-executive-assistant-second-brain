---
name: Phase 3 — Conway AR #1 Ranking (ACTIVE)
description: All pillar pages fixed, menu cleaned. Next priority is Conway ranking — GBP, reviews, citations, backlinks. Conway pages are live but low authority.
type: project
last_updated: 2026-04-25
status: IN PROGRESS — Technical fixes COMPLETE. Off-page (GBP/reviews/citations/backlinks) needs Anthony action.
originSessionId: ccb3e528-01da-49dc-b07e-762b0b0108ff
---
## STRATEGIC DIRECTIVE (from Anthony)
**Rank #1 in Conway AR first, then expand to other cities.**
- Homepage focus keyword already set: `pressure washing conway ar`
- All 13 Conway×service pages are live at correct URLs
- This is the primary KPI before any other city work

---

## COMPLETED THIS SESSION (2026-04-19)

### Pillar Page Fixes (6 Elementor pages — DONE)
All 6 pages that were showing old Elementor content now show new SEO content:
- soft-washing (3460) → H1: "Soft Washing Services in Central Arkansas" ✅
- house-washing (383) → H1: "House Washing in Central Arkansas" ✅
- roof-cleaning (391) → H1: "Roof Cleaning in Central Arkansas" ✅
- deck-fence-cleaning (378) → H1: "Deck and Fence Cleaning in Central Arkansas" ✅
- holiday-lighting (3477) → H1: "Holiday Lighting in Central Arkansas" ✅
- window-cleaning (3036) → H1: "Window Cleaning in Central Arkansas" ✅
Fix method: REST API updated post_content + Code Snippet #30 cleared _elementor_data meta (now deactivated)

### Commercial Pages (DONE)
- /pressure-washing/commercial/ → H1: "Commercial Pressure Washing in Central Arkansas" ✅ (slug fixed from pressure-washing-commercial → commercial, ID 9004)
- /concrete-cleaning/commercial/ → H1: "Commercial Concrete Cleaning in Central Arkansas" ✅ (new page created, ID 9708)

### Navigation Menu (DONE)
Fixed 10 menu items — all had wrong titles or dead URLs:
| Item | Was | Now |
|------|-----|-----|
| Soft Washing | "Soft Washing Services in Central Arkansas \| American Services AR" | "Soft Washing" |
| House Washing | Full SEO title | "House Washing" |
| Roof Cleaning | Full SEO title | "Roof Cleaning" |
| Deck & Fence Cleaning | Full SEO title | "Deck & Fence Cleaning" |
| Window Cleaning | Full SEO title | "Window Cleaning" |
| Holiday Lighting | Full SEO title | "Holiday Lighting" |
| Fleet Washing | /?page_id=415 (dead) | /fleet-washing/ |
| Concrete Cleaning | /pressure-washing-concrete-cleaning/ (old) | /concrete-cleaning/ |
| Commercial Pressure Washing | /commercial-services-pressure-washing/ (old) | /pressure-washing/commercial/ |
| Commercial Concrete Cleaning | /commercial-concrete-cleaning/ (old) | /concrete-cleaning/commercial/ |

### Grounds Maintenance Menu — DONE (2026-04-19 Session 2)
Grounds Maintenance section (Turf Care, Lawn Care, Landscape Installation, Sprinkler Repair) removed. Replaced with Commercial + Residential hub pages. Anthony confirmed: replace with Commercial/Residential pages.

### Commercial & Residential Hub Pages — DONE (2026-04-19 Session 2)
- `/commercial/` (ID 3492) — "Commercial Exterior Cleaning Services in Conway, AR" — full SEO hub page, 1,500+ words, targets "commercial exterior cleaning Conway AR" ✅
- `/residential/` (ID 9001) — "Residential Exterior Cleaning Services in Conway, AR" — full SEO hub page, 1,500+ words, targets "residential exterior cleaning Conway AR" ✅
- `/concrete-cleaning/commercial/` (ID 9708) — "Commercial Concrete Cleaning Services in Central Arkansas" — restored to correct content after accidental overwrite ✅

### Menu Final State (2026-04-19 Session 2)
Top-level: Residential → /residential/ | Commercial → /commercial/ | Fleet Washing | About Us
Under Residential: Pressure Washing, Soft Washing, House Washing, Roof Cleaning, Concrete Cleaning, Deck & Fence, Window Cleaning, Holiday Lighting, Gutter Services (w/ sub-items)
Under Commercial: Commercial Pressure Washing, Commercial Concrete Cleaning, Parking Lot Maintenance (URL fixed to /parking-lot-maintenance/)
0 dead links remaining.

### Footer Cleanup — DONE (2026-04-19 Session 3)
Root cause of cache issue: `_elementor_element_cache` postmeta stores pre-rendered HTML, overrides `_elementor_data` until deleted.
- Footer now has 3 service columns: Residential (11), Commercial (5), Multi-Family (7)
- Contact heading: "American Services AR" (was "Omnia LLC DBA...")
- Hours: Mon–Fri: 24 Hours | Sat: 8AM–12PM | Sun: Closed
- Copyright: "Copyright © 2026 American Services AR — OMNIA LLC. All rights reserved."
- Schedule Now button: /contact/ (was /contact-us/)
- 23 total footer links, all valid

### Multi-Family Hub Page — DONE (2026-04-19 Session 3)
- `/multi-family/` (ID 9715) — "Apartment & Multi-Family Services" — 1,500+ words, covers dryer vent cleaning/inspection + air duct inspection/cleaning + exterior services
- Focus keyword: `multi-family exterior cleaning conway ar`
- Added to main nav menu (between Fleet Washing and About Us)
- Added to footer as 3rd services column with 7 links

### Menu Final State (2026-04-19 Session 3)
Top-level: Residential → /residential/ | Commercial → /commercial/ | Fleet Washing | **Multi-Family** → /multi-family/ | About Us
Under Residential: (same as before)
Under Commercial: (same as before)

### Site Safety Protocol — DONE (2026-04-19 Session 3)
- Full backup triggered via UpdraftPlus (Apr 19, 12:15 — DB + Plugins + Themes + Uploads + Others)
- Daily DB backups already running (Apr 12-18 confirmed)
- Safety protocol documented at: C:\Users\sales\OneDrive\Documents\CLAUDE\ASAR_Safety_Protocol.md
- Key rule: NEVER use `global` scope Code Snippets for one-time operations. Use `single-use` scope.
- Dangerous snippet #32 deleted permanently

---

## CONWAY PAGE AUDIT (2026-04-19)

All 13 Conway pages exist, have correct URLs, return 200, have 9 H2s, FAQ, phone. BUT:

| Service | Word Count | Gap to 1,200 |
|---------|-----------|--------------|
| Roof Cleaning | 581 | -619 🔴 |
| Pressure Washing | 842 | -358 |
| Concrete Cleaning | 842 | -358 |
| Window Cleaning | 838 | -362 |
| Fleet Washing | 866 | -334 |
| Gutter Cleaning | 857 | -343 |
| Gutter Guards | 863 | -337 |
| Soft Washing | 907 | -293 |
| Holiday Lighting | 903 | -297 |
| House Washing | 936 | -264 |
| Deck & Fence | 930 | -270 |
| Parking Lot | 911 | -289 |
| Gutter Installation | 918 | -282 |

**NOTE: Word count alone is NOT why pages don't rank.** Google does not use word count as a ranking factor. RankMath's 1,200-word rule is a guideline, not Google law.

---

## WHY CONWAY PAGES AREN'T RANKING #1 (Real Reasons)

1. **Domain Authority too low** — DA 9, DR 9. Competitors have DA 20-40+. This is the #1 blocker.
2. **GBP not fully optimized** — Local Pack (Maps) is where local searches win first. GBP has gaps.
3. **Pages are new** — Google takes 3-6 months to fully trust new pages from low-authority domains.
4. **No backlinks to new pages** — The silo pages have zero external links pointing to them.
5. **Missing citations** — Bing Places, Apple Maps, Yelp, BBB, Angi not fully set up yet.

---

## NEXT SESSION PRIORITY ORDER

### Priority 1 — GBP Optimization (fastest ROI for Conway Local Pack)
- [ ] Add all 13 services with descriptions and prices to GBP
- [ ] Seed 10+ Q&A with keyword-rich answers (must do from Anthony's personal Google account)
- [ ] Add minimum 10 before/after job photos
- [ ] Set up weekly GBP posts (coordinate with Soshie)
- [ ] Confirm messaging is ON with auto-reply
- [ ] Deploy the 57 review replies staged in SearchAtlas (before access ends) OR respond manually
- [x] Address: 220 Mill Pond Rd, Conway AR 72034 — CONFIRMED CORRECT by Anthony 2026-04-25. No mismatch. No action needed.

### Priority 2 — Reviews Push
- Target: 80+ Google reviews (competitor New Heights has 103)
- Set up HousecallPro review request SMS after every job
- Ask Anthony how many reviews ASAR currently has

### Priority 3 — Citations / Entity Building
- [ ] Bing Places — submit NAP
- [ ] Apple Maps Connect — submit NAP
- [ ] Yelp — claim/optimize listing
- [ ] BBB — claim/optimize listing
- [ ] Angi, HomeAdvisor, Thumbtack, Nextdoor
- [ ] Data Axle, Neustar, Foursquare — data aggregators (push NAP to 100+ directories)

### Priority 4 — Backlink Building (1-2 months out)
- [ ] Google Site (sites.google.com) with ASAR content + links (free) — DO LAST per Anthony
- [ ] Blogger post with NAP + links (free)
- [x] 2 SEO blog posts live on site: /how-often-pressure-wash-conway-ar/ (ID 9717) + /gutter-cleaning-conway-ar-guide/ (ID 9719)
- [x] RankMath meta set on posts 9717 + 9719 via Code Snippet #53 (2026-04-25) — titles + descriptions confirmed live
- [ ] Pitch Log Cabin Democrat (Conway) for local feature story (free)
- [x] PRLog account created (sales@americanservicesar.com / American$ervices@R2) — profile live at prlog.org/americanservicesar
- [x] Conway press release #1 submitted 2026-04-25 (ID 13141820) — "American Services AR Offers Expert Pressure Washing and House Washing in Conway, AR"
- [x] Little Rock press release submitted 2026-04-25 (ID 13141821)
- PRLog FREE tier = 2 press releases/week max. Schedule below:
  - Week of 2026-04-28: North Little Rock + Benton
  - Week of 2026-05-05: Bryant + Sherwood
  - Week of 2026-05-12: Cabot + Maumelle
  - Week of 2026-05-19: Jacksonville + (bonus city or OpenPR.com repeat)
- [ ] NLR, Benton, Bryant, Sherwood, Cabot, Maumelle, Jacksonville — 7 remaining
- [x] OpenPR.com press release submitted 2026-04-26 — "Fleet Washing in Conway, AR" with PR Banner image 1600x900
- [ ] 2-3 guest posts on Link Laboratory — DA 20+, home services niche, ~$300-450

### Priority 5 — Conway Page Content (improve quality, not just word count)
- Add real local context to each Conway page (Conway neighborhoods, Faulkner County references)
- Add LocalBusiness + FAQPage schema to all 13 Conway pages
- Add internal cross-links between Conway pages (e.g., pressure-washing/conway links to soft-washing/conway)
- Roof Cleaning Conway (581 words) needs expansion most urgently

---

## SESSION 2026-04-25 FIXES (ALL DONE)

### Technical Fixes
- GSC n8n workflow `9AdSMJNMkym65Y5V` — root cause found: HTTP Request nodes had `authentication: genericCredentialType` with expired OAuth. Fixed to `authentication: none`. JWT auth now handles it. Confirmed working via Python test.
- All 13 Conway pages — RankMath meta set and verified live. Critical fix: "gutters in conway ar" ranking #1 with 185 impressions / 0 clicks (blank meta) — now has title+description.
- Redirects — Snippet 52 (frontend scope): `/?page_id=415` → `/fleet-washing/`, `/?page_id=422` → `/residential/`, `/turf-care/` → `/residential/`, `/lawn-care-lawn-maintenance/` → `/residential/`. All 301, no query string pollution.
- Rank Tracker Sheet — 200 rows of Apr 1-23 GSC keyword/position data loaded.
- OTTO over-linking — confirmed NOT a DB issue. Pixel-injected only, gone when SearchAtlas pixel removed.
- Address — confirmed CORRECT: 220 Mill Pond Rd, Conway AR 72034.

### Phase 3 Audit (as of 2026-04-25)
- GBP: ✅ DONE — confirmed by Anthony 2026-04-25
- Reviews: NiceJob 52 reviews ✅. Google count unknown. Target: 80+ Google reviews. Review engine SMS running via HCP webhook.
- Citations: BBB ✅, Yelp ✅ (updated Apr 2026), Houzz ✅, NiceJob ✅. NAP inconsistency: Chamber of Commerce shows 501-932-8681 (wrong). Correct: 501-289-5623.
- Backlinks: IN PROGRESS. PRLog profile created + Conway press release #1 submitted 2026-04-25. 8 more city press releases queued (LR, NLR, Benton, Bryant, Sherwood, Cabot, Maumelle, Jacksonville). Blog posts #9717 + #9719 live on site.

### Autonomous Systems Running
- Daily GSC check: workflow `9AdSMJNMkym65Y5V` (runs 19:00 UTC = 2PM CDT — schedule says 9AM CDT but n8n interprets cron in local TZ)
- Weekly rank tracker: `e6PnFg6YZpagNq7j` Mon 8AM CDT
- Soshie weekly GBP posts: `ibcZUQdHjcT81HTV` Mon 7AM CDT
- Review engine: `ciBlDuYcknxv9dES` HCP webhook → 24h+72h SMS

## KEY FACTS TO REMEMBER
- NAP: American Services AR | 220 Mill Pond Rd, Conway AR 72034 | 501-289-5623
- GBP Login: sales@americanservicesar.com
- WP Auth: Asons / qWzH 9qXZ z3L4 US1p cQyV GXwk
- Domain Authority: DA 9, DR 9, 1,100 backlinks, 182 referring domains
- Target (6 months): DR 20+, DA 20+, 80+ reviews, top 3 Local Pack Conway
- Chamber of Commerce NAP fix needed: phone shows 501-932-8681, should be 501-289-5623

---

## AI WEBSITE BUILDER RESEARCH (for future visual redesign)
- **Lovable.dev** ($20/mo) — AI builds full-stack app from prompt. Best for homepage/pillar visual rebuild. Weak on 143 SEO pages.
- **Webflow** ($23-39/mo) — Best fit for full site rebuild at ASAR's scale. Handles 143 pages + visual design.
- **Framer** ($10-30/mo) — Best visual results, great for landing pages, NOT for 143 SEO pages.
- **Manus AI** — Autonomous agent (acquired by Meta $2-3B). Best for deep competitive research, not a website builder.
- **Recommendation**: Focus on Conway ranking first. Visual redesign is Phase 4+.
