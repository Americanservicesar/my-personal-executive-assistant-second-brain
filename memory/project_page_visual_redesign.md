---
name: Page Visual Redesign — Session Prompt
description: Prompt to kick off a new session for redesigning ASAR service pages — currently generic/text-heavy, need images, color, visual layout
type: project
last_updated: 2026-04-19
status: NOT STARTED — use prompt below
originSessionId: 3a35798e-ae9f-458e-b25d-bfb6e27f5a38
---
## PROBLEM

The 143 SEO service pages (service×city grid) are live and ranking but visually terrible:
- Wall of text, no images
- No brand colors (blue/orange/white — ASAR palette)
- No visual hierarchy — everything looks the same
- Generic Gutenberg blocks with no styling
- Anthony's words: "very generic, need pics and color, not packed with words"

## START-OF-SESSION PROMPT (paste this to begin)

---

We need to visually redesign the ASAR service pages on americanservicesar.com. The pages are live and ranking for SEO but Anthony says they look generic — too much text, no images, no color.

**What we have:**
- WordPress site with Elementor + Gutenberg
- 143 service×city pages (e.g. /pressure-washing/conway/, /soft-washing/little-rock/)
- 13 pillar/service pages (e.g. /pressure-washing/, /soft-washing/)
- WP REST API auth: `Asons` / `qWzH 9qXZ z3L4 US1p cQyV GXwk`
- Brand colors: primary blue (#1B3A6B or similar), orange accent, white
- Company: American Services AR — veteran-owned pressure washing, Conway AR

**Goal:**
- Pages should feel like a modern local service business site
- Visual sections with background colors, not just white
- Images or image placeholders in key sections (hero, before/after, process steps)
- Less text per section — short punchy sentences, not paragraphs
- Clear CTA button per section (Call Now, Get a Free Quote)
- Keep ALL existing SEO structure intact: H1, H2s, FAQ, RankMath meta — do NOT change URLs or post IDs

**Constraints:**
- NEVER change slugs, post IDs, or RankMath focus keywords
- Keep the FAQ section (it's schema-marked)
- The redesign is visual only — same content, better presentation
- Safety protocol: always use single-use Code Snippets scope, never global

**First step:** Pull up one Conway page (e.g. /pressure-washing/conway/ — ID can be looked up via REST API) and show me a redesigned version we can test on that single page before rolling out to all 143.

---

## DESIGN DIRECTION NOTES (from Anthony)

- Wants pics and color — not walls of text
- Pages should look like a real business, not an SEO farm
- Short punchy content wins over long paragraphs
- Before/after photos will eventually be added (stored in MARKETING Drive > Job Photos & Videos)
- Mobile matters — most HCP customers are on phones

## TECH OPTIONS TO EXPLORE

1. **Elementor blocks via REST API** — inject Elementor JSON templates per page (best for full control)
2. **Custom CSS + Gutenberg cover blocks** — add colored section backgrounds via CSS classes
3. **Elementor template library** — create one master template, apply to all pages
4. **Full page rebuild with new Elementor JSON** — replace current Gutenberg content with styled Elementor layout

## RELATED MEMORY

- SEO Silo Structure: `reference_seo_silo_structure.md` — URL map, page IDs
- RankMath SEO Checklist: `reference_rankmath_seo_page_checklist.md` — what to preserve
- Safety Protocol: `C:\Users\sales\OneDrive\Documents\CLAUDE\ASAR_Safety_Protocol.md`
