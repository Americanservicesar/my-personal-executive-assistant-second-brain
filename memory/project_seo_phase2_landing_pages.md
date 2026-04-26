---
name: SEO Phase 2 — Service & City Landing Pages
description: ALL 4 steps complete. 143 service×city pages live, pillar links updated, homepage verified, sitemap confirmed.
type: project
last_updated: 2026-04-11
status: COMPLETE ✓
---

## STATUS: FULLY COMPLETE — ALL STEPS INCLUDING PILLAR SEO (2026-04-11)

### Pillar SEO Step COMPLETE (2026-04-11 session)
All 14 pillar pages + homepage have RankMath meta set. Homepage Elementor layout restored and verified.

**Homepage (4402):**
- Focus keyword: `pressure washing conway ar` (Conway = home city, rank #1 there first)
- Title: `Pressure Washing Conway AR | #1 Rated | Free Estimates | American Services AR`
- H1: "Top Rated Pressure Washing Services in Conway Arkansas" ✓
- Elementor layout: fully restored from revision 4608 after corruption (missing wp_slash bug fixed)
- Snippet 16 (phase3-pillars) deactivated — was interfering with post_content
- WP Rocket + Elementor cache cleared and verified live

**All 14 pillar pages — focus keywords set:**
| Page | ID | Focus Keyword |
|------|----|---------------|
| Pressure Washing | 3468 | pressure washing central arkansas |
| Soft Washing | 3460 | soft washing central arkansas |
| Roof Cleaning | 391 | roof cleaning central arkansas |
| Deck & Fence Cleaning | 378 | deck fence cleaning central arkansas |
| Window Cleaning | 3036 | window cleaning central arkansas |
| Holiday Lighting | 3477 | holiday lighting central arkansas |
| House Washing | 383 | house washing central arkansas |
| Concrete Cleaning | 9049 | concrete cleaning central arkansas |
| Gutter Cleaning | 9006 | gutter cleaning central arkansas |
| Gutter Guards | 9008 | gutter guards central arkansas |
| Gutter Installation | 9007 | gutter installation central arkansas |
| Fleet Washing | 9053 | fleet washing central arkansas |
| Parking Lot | 9073 | parking lot cleaning central arkansas |

**Sitemaps submitted:**
- Google Search Console: sitemap_index.xml — Success, 239 pages ✓
- Bing Webmaster Tools: sitemap_index.xml — Processing ✓

**Active Code Snippets deployed this session:**
- Snippet 18: ASAR Phase3 Diagnostic+Revert (can deactivate after verified)
- Snippet 19: ASAR Phase3 Pillar Rewrite (can deactivate after verified)
- Snippets for tmp fixes (HP Check, EL Raw Diag, HP Fix, EL Restore, Fix Widget2) — can all be deleted

**Keyword strategy note:**
- Homepage → Conway first (home city, GBP location, low competition = winnable)
- Pillar pages → Central Arkansas (regional authority)
- City pages → [service] [city] ar (143 pages, all live)

### Step 1 COMPLETE: Pillar Page Audit
All 13 service pillar pages verified. IDs confirmed:

| Pillar | Slug | WP ID | Notes |
|--------|------|-------|-------|
| Pressure Washing | /pressure-washing/ | 3468 | Has 2 children (commercial/residential) |
| Soft Washing | /soft-washing/ | 3460 | |
| Roof Cleaning | /roof-cleaning/ | 391 | |
| Concrete Cleaning | /concrete-cleaning/ | 9049 | |
| Deck & Fence Cleaning | /deck-fence-cleaning/ | 378 | |
| Window Cleaning | /window-cleaning/ | 3036 | |
| Gutter Cleaning | /gutter-cleaning/ | 9006 | Child of gutter-services (9003) |
| Gutter Guards | /gutter-guards/ | 9008 | Child of gutter-services (9003) |
| Gutter Installation | /gutter-installation/ | 9007 | Child of gutter-services (9003) |
| Fleet Washing | /fleet-washing/ | 9053 | |
| Parking Lot | /parking-lot/ | 9073 | Created this session (NOT 9051) |
| Holiday Lighting | /holiday-lighting/ | 3477 | |
| House Washing | /house-washing/ | 383 | |

Also exists:
- `/gutter-services/` hub (ID: 9003) — parent of the 3 gutter pillars
- `/service-areas/` hub (ID: 9000) — parent of 11 generic city pages

### Step 2 COMPLETE: 143 Service×City Pages Created
All 143 pages live (IDs 9075–9359). Published, with parent set to pillar ID.
13 services × 11 cities = 143 pages.

### Step 3 COMPLETE: Pillar Pages Updated with City Links
All 13 pillar pages have an "Areas We Serve in Central Arkansas" `<h2>` section
with `<ul>` links to all 11 city children. Added via REST API (X-WP-Nonce auth).

### Step 4 COMPLETE: Homepage Verified
- All 13 pillar slugs confirmed present in live DOM
- Nav menu fixed (concrete-cleaning and fleet-washing slugs corrected; gutter services submenu added; parking lot added)
- Elementor body content fixed for fleet-washing (was pointing to /fleet-wash/, corrected to /fleet-washing/)
- 13/13 pillars linked

### Step 5 COMPLETE: GSC Sitemap Confirmed
**All 143/143 service×city pages appear in page-sitemap.xml** ✓

Root cause of sitemap issue: RankMath caches sitemaps as physical XML files at
`wp-content/uploads/rank-math/rank_math_<hash>.xml`. DB transient clearing doesn't
help — the files must be deleted from disk.

Fix applied:
1. Added `rank_math_robots = ['index']` to all 143 pages via Code Snippets snippet
   (table prefix is `sSep60_`, NOT `wp_` — hardcoded table names fail on this site)
2. Deleted all cached sitemap XML files from `wp-content/uploads/rank-math/`
3. Deleted `rank_math_sitemap_cache_files` option to force full regeneration
4. Set `items_per_page = 300` in RankMath sitemap settings

Result: page-sitemap.xml now has 200 pages including all 143 service×city pages.

## NEXT STEPS (Phase 3)
- Submit `https://americanservicesar.com/sitemap_index.xml` to Google Search Console
- Submit to Bing Webmaster Tools
- Monitor indexing over 2–4 weeks
- Phase 3: GBP deep audit + rank #1 optimization (see project_next_session_local_seo.md)

## WordPress API Access
- Base: `https://americanservicesar.com/wp-json/wp/v2/`
- Auth: X-WP-Nonce (from wpApiSettings.nonce when logged into WP admin)
- DB table prefix: `sSep60_` (NOT wp_)

## Key Lessons Learned
- RankMath sitemap cache = physical files at `uploads/rank-math/rank_math_*.xml`
- Must delete files AND `rank_math_sitemap_cache_files` option to force regeneration
- `rank_math_robots` meta must be set for pages to appear in sitemap
- Table prefix on this site is `sSep60_` — never hardcode `wp_posts`
- Code Snippets REST API: `POST /wp-json/code-snippets/v1/snippets` with `{name, code, scope:'global', active:true}`
- Use diagnostic REST endpoint pattern (asar/v1/rmcheck) for server-side DB queries
