---
name: SEO Audit Results & Action Plan - americanservicesar.com
description: Full website audit findings + Phase 1C completion log. Phase 2 silo creation next.
type: project
last_updated: 2026-04-06
status: Phase 1C COMPLETE — Phase 2 silo creation next
---

## RESUME IN NEXT SESSION — Phase 2: Silo Page Creation

### Phase 1C COMPLETED (2026-04-06)
All technical SEO fixes done:
1. ✅ RankMath schema phone → 501-289-5623 (verified live)
2. ✅ Noindexed: /thank-you/, /best-lawn-care-services-near-me/, 4 neighborhood pages (IDs 3581, 3584, 3385, 3383)
3. ✅ 301 redirect /contact/ → /contact-us/ (RankMath Redirections)
4. ✅ WP Rocket: Minify CSS, Remove Unused CSS, Minify JS, LazyLoad CSS BG + iframes, WebP caching enabled
5. ✅ Elementor: Load Google Fonts Locally enabled, all perf settings on
6. ✅ Imagify: Hero images optimized (IMG_20230404_152921 + 152928), WebP generated
7. ✅ All 11 phone tel: links fixed to 501-289-5623 site-wide (footer icon-list in template 64, "Get A Quote" in template 303)
8. ✅ Canonical tags verified on 16 service pages — all self-referencing, 200 OK
9. ✅ PageSpeed: 64 → 74, FCP 4.4s → 1.7s, Speed Index 4.4s → 2.0s, LCP 12.7s → 8.8s

### DEFERRED TO POST-REVAMP
- **Imagify Bulk Optimization** — run after all silo pages are created. Media > Bulk Optimization to convert ALL images to WebP
- WebP serving should improve further once bulk optimization runs and cache rebuilds
- LCP still 8.8s (target <2.5s) — hero section render delay (1,150ms) + image size are factors. Bulk WebP + possible hero image replacement will help

### Phase 2 Steps (from reference_seo_silo_structure.md)
1. Create all 11 service pillar pages (/pressure-washing/, /soft-washing/, etc.)
2. Create 3 hub pages (/commercial/, /residential/, /service-areas/)
3. Update homepage to link to all pillars + hubs
4. Set up breadcrumbs in RankMath
5. Create city pages — TOP 4 cities first (Conway, Little Rock, NLR, Sherwood) = 52 pages
6. Then remaining 7 cities = 91 pages
7. Total: ~193 static pages

### Files to reference for Phase 2:
1. This file (audit results + completion log)
2. reference_seo_silo_structure.md (complete URL map, linking rules, content templates)
3. reference_seo_knowledge_base.md (2026 best practices)
4. reference_housecallpro_booking.md (HCP widget for booking CTAs)

### Files to reference:
1. This file (audit results)
2. reference_seo_knowledge_base.md (2026 best practices)
3. reference_seo_tools.md (which tools to use)
4. Google Doc: ASAR SEO Knowledge Base (ID: 1EewYGbo8o7J0wfZTyhUxzyTpvk-zkUFJkwLEEWox9qI)
5. Background research output files (if completed):
   - Silo structure: C:\Users\sales\AppData\Local\Temp\claude\...\tasks\ad5f22543bdf29ecb.output
   - Keyword research: C:\Users\sales\AppData\Local\Temp\claude\...\tasks\a801d05ac49ae1ea0.output

### Steps to resume:
1. Read this file + the two research outputs
2. Compare audit findings vs ideal silo vs keyword map
3. Create Google Sheet: "ASAR SEO Content Matrix" with every service x city page, status, priority
4. Build n8n sub-workflow: "SEO Daily Audit" (schedule trigger → PageSpeed check → broken link scan → rank check → Slack report to #seomi-seo)
5. Have Seomi post initial audit findings to #seomi-seo
6. Create 301 redirect plan for URL restructuring
7. Begin page creation priority list

---

## AUDIT FINDINGS (2026-04-04)

### Site Overview
- Domain: americanservicesar.com
- CMS: WordPress + Elementor Pro
- SEO Plugins: RankMath PRO, Search Atlas SEO, Ahrefs SEO
- Performance: WP Rocket (caching), Imagify (image optimization)
- Pages in sitemap: 71 pages + 300+ blog posts
- Address: 1495 Highway 365, Conway, AR 72032
- Phone: 501-932-8681 (schema) / 501-289-5623 (meta description) — INCONSISTENCY
- Email: sales@americanservicesar.com
- Hours: Mon-Fri 8-5, Sat 8-12

### CRITICAL ISSUES

1. **No silo structure** — URLs are flat and inconsistent:
   - /pressure-washing-little-rock-ar/ (flat, not nested)
   - /little-rock-ar/ (city page disconnected from services)
   - /gutter-cleaning/ (exists as blog-style, not proper silo)

2. **143+ service+city pages MISSING** — Only 2 PW+city pages exist (Little Rock, Maumelle)

3. **Thin content** — Main pressure washing page ~150-200 words (needs 1,500-2,500)

4. **No FAQ sections** on any service page (missing FAQPage schema)

5. **Two phone numbers** — NAP inconsistency between meta desc and schema

6. **15+ park pages** (Burns Park, Toad Suck Park, etc.) adding zero SEO value

7. **Services that shouldn't be there**: HVAC, Sprinkler Repair, Lawn Care, Landscape Installation, Turf Care — dilute topical authority

8. **Stale content** — Most pages last updated 2023-2024

9. **Location sitemap only has 2 locations** (Conway, Little Rock) — missing 9+ cities

10. **Schema markup basic** — Has LocalBusiness but missing Service, FAQPage, AggregateRating schemas

### WHAT'S WORKING
- SSL/HTTPS ✅
- RankMath PRO ✅
- Sitemap generated ✅
- Robots.txt configured ✅
- WP Rocket caching ✅
- Imagify optimization ✅
- LeadConnector (GHL) ✅
- BreadcrumbList schema on some pages ✅

### SEOMI TOOLS CONNECTED (14 total)
1. WordPress REST API (full admin)
2. RankMath API (SEO meta control)
3. PageSpeed Insights (free, Core Web Vitals)
4. Bing Webmaster (backlinks, Bing rankings)
5. Moz API (Domain Authority, 50 free requests/month)
6. Broken Link Checker (internal link health)
7. SerpApi (Google rank tracking)
8. Web Search (Tavily, competitor research)
9. Google Sheets (content matrix, keyword tracking)
10. Google Drive (templates, assets)
11. Google Docs (write content before publishing)
12. Airtable (content pipeline tracking)
13. Slack (#seomi-seo + #agent-activity)
14. GitHub Brain (memory)

### PENDING TOOLS (need Google Cloud API enablement)
- Google Search Console (API may be enabled — needs OAuth node)
- Google Analytics 4 (needs API enabled + OAuth node)
- Google Business Profile API (needs API enabled)
- Copyscape Premium (needs $5 deposit + API key)
