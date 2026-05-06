---
name: RankMath SEO Page Checklist — Correct Build Order
description: Exact sequence and specs for building service×city landing pages that score 81/100 on RankMath (practical ceiling with "AR" in keyword). Learned from Phase 2 ASAR deployment.
type: reference
last_updated: 2026-04-12
---

## Why 81/100 is the Practical Ceiling

Two checks are permanently unfixable:
1. **URL check** — keyword is "soft washing conway ar" but URL is `/soft-washing/conway/` (no "ar"). Accept this.
2. **Content AI** — RankMath paid upsell feature. Not included in free plan.

These cost ~19 points. 81/100 is the real max for this site structure.

---

## Step 1 — Set Focus Keyword First

Format: `[service slug] [city name lowercase] ar`

Examples:
- `soft washing conway ar`
- `pressure washing little rock ar`
- `gutter cleaning benton ar`

> **Always set this BEFORE indexing.** RankMath grades everything relative to this keyword.

---

## Step 2 — SEO Title (must start with keyword)

Format: `[Service Title Case] [City] AR | #1 Rated | Free Estimates | American Services AR`

Rules:
- Must **start with** the keyword (RankMath checks "keyword at beginning of title")
- Must contain a **number** (#1 satisfies this)
- Must contain a **power word** ("Rated" and "Free" both count)
- Keep under 60 characters for the keyword+city+AR part; full title can be longer

Example: `Soft Washing Conway AR | #1 Rated | Free Estimates | American Services AR`

---

## Step 3 — Meta Description (must contain exact keyword phrase)

Format: `Need [service] [city] AR? American Services AR delivers expert, fully insured service. 4.9-star rated since 2010. Free estimates — call (501) 289-5623.`

Rules:
- Exact keyword phrase must appear (e.g., "soft washing Conway AR" — case doesn't matter)
- Keep under 160 characters
- Phone number helps CTR (optional but use if fits)
- **Phone: (501) 289-5623** ← always use this number

---

## Step 4 — Page Content Structure (1,200+ words, Gutenberg blocks)

Build in this exact order for maximum score:

### Block 1: Trust Bar (wp:paragraph)
```
★ 4.9 Google Rating | Since 2010 | Fully Insured | Free Estimates
```

### Block 2: Intro Paragraph — keyword in bold, phone link
```
When your property needs professional **[service] [City] AR** service, American Services AR delivers...
Call [(501) 289-5623](tel:+15012895623) to schedule your free estimate.
```
> Keyword must appear in **first 10%** of content. Put it in the first sentence.

### Block 3: Image (wp:image)
- Use existing media library image for that service
- Alt text: `[service img_alt description] in [City] AR`
- Must contain keyword words in alt

### Block 4: H2 — What Is...
`What Is [Service Title] [City] AR Professionals Use?`

Include:
- 2-3 paragraph explanation of the service
- **External dofollow link** to authority site (ARMA for soft/roof/house washing; EPA WaterSense for others)

### Block 5: H2 — Why [City] Properties Need...
`Why [City] Properties Need Professional [Service Title]`

Include:
- Local context (Arkansas climate, humidity, specific challenges)
- Mention the county

### Block 6: H2 — Surfaces (with ul list)
`[Service Title] [City] AR — Surfaces We Service`

### Block 7: H2 — Process (with ol numbered list)
`Our [Service Title] Process in [City]`

### Block 8: H2 — Benefits
`Benefits of Professional [Service Title] for [City] Properties`

### Block 9: H2 — Pricing (with ul list + phone)
`[Service Title] [City] AR — Pricing Guide`

End with phone CTA.

### Block 10: H2 — FAQ
`Frequently Asked Questions — [Service Title] [City] AR`

4 Q&A pairs minimum.

### Block 11: H2 — Serving Area (mentions all 11 cities)
`Serving [City], [County], and Central Arkansas`

List all 11 cities to establish geographic coverage.

### Block 12: H2 — Related Services (5 internal links)
`Related Services in [City], AR`

5 links to other service pages for this city (exclude current service).

---

## RankMath Checks and How Each One Passes

| Check | How We Pass |
|-------|-------------|
| Keyword in title | Title starts with exact keyword |
| Keyword at beginning of title | Yes — first words |
| Keyword in meta description | Exact phrase in description |
| Keyword in URL | ❌ FAILS (accept — "ar" not in slug) |
| Keyword in first 10% | Bold in first paragraph |
| Keyword density (1-3%) | ~24 mentions in 1,200 words = ~2% |
| Keyword in H2 | Multiple H2s contain keyword words |
| Keyword in image alt | Alt text includes service + city + AR |
| Outbound dofollow link | ARMA or EPA WaterSense link |
| Internal links | 5 related service links |
| Content length 300+ | 1,200+ words |
| Power word in title | "Rated" and "Free" |
| Number in title | "#1" |
| Title readability | Starts with keyword, readable |
| Content readability | Short paragraphs, subheadings, lists |
| Content AI | ❌ FAILS (paid feature, accept) |

---

## Phone Number
- Display: `(501) 289-5623`
- Link: `tel:+15012895623`

---

## 11 Cities (confirmed slugs)
benton, bryant, cabot, conway, greenbrier, jacksonville, little-rock, maumelle, north-little-rock, sherwood, vilonia

## 13 Service Pillars (WP IDs)
| Service | Slug | ID |
|---------|------|----|
| Pressure Washing | pressure-washing | 3468 |
| Soft Washing | soft-washing | 3460 |
| Roof Cleaning | roof-cleaning | 391 |
| Concrete Cleaning | concrete-cleaning | 9049 |
| Deck & Fence Cleaning | deck-fence-cleaning | 378 |
| Window Cleaning | window-cleaning | 3036 |
| Gutter Cleaning | gutter-cleaning | 9006 |
| Gutter Guards | gutter-guards | 9008 |
| Gutter Installation | gutter-installation | 9007 |
| Fleet Washing | fleet-washing | 9053 |
| Parking Lot Services | parking-lot | 9073 |
| Holiday Lighting | holiday-lighting | 3477 |
| House Washing | house-washing | 383 |

---

## What Went Wrong (Lessons Learned)

1. **Wrong focus keyword** on pillar pages — soft washing pillar (3460) had "house washing" set. Always audit existing keywords before assuming they're correct.
2. **Thin content (~440 words)** on city pages from initial creation — RankMath penalizes anything under 600 words. Use 1,200+ for good scores.
3. **Wrong phone number** in test page — used (501) 514-3928 instead of (501) 289-5623. Always pull from credentials reference.
4. **Browser JS timeout (45s)** kills long loops — don't run 143 REST calls from browser JS. Use PHP-side batching with `?offset=X`.
5. **PHP apostrophes in JS template literals** — `\'` becomes `'` and breaks PHP strings. Use PHP heredoc or double-quoted strings instead.
6. **Code Snippets snippet goes inactive on parse error** — any PHP syntax error deactivates the snippet silently. Test PHP before deploying.
7. **RankMath sitemap caches as physical files** — clearing DB transients isn't enough. Must delete files from `uploads/rank-math/` + `rank_math_sitemap_cache_files` option.

---

## Deployment Method (for future batch updates)

1. Write PHP to local file using `Write` tool
2. Upload via Python + `urllib.request` using WordPress Application Password
3. Call `/wp-json/asar/v1/rmcheck?offset=0` in a loop (15 pages/call) until `done=true`
4. Delete the Application Password when done (security hygiene)
5. Verify a sample page via REST API
