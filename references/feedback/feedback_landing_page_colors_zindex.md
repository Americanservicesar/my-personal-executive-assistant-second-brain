---
name: Landing Page — Logo Color Match + Dropdown Z-Index Fix
description: Two bugs fixed on pressure-washing.html — select dropdowns hiding behind sticky bar, and colors not matching ASAR logo
type: feedback
last_updated: 2026-05-06
originSessionId: 0fd81466-46ae-41e4-807f-72687c16e397
---

## BUG 1 — Select Dropdowns Hiding Behind Sticky Orange/Red Bar

**What happened:**
Native HTML `<select>` dropdowns on the landing page appeared behind the sticky top bar (phone number + "Same-Week Service" strip).

**Root causes (two of them):**
1. `.pw-top` had `z-index: 200` — not high enough when form section created a new stacking context
2. `.pw-form-section` had `overflow: hidden` — this creates a clipping stacking context that traps native select dropdowns inside it, preventing them from rendering above the sticky bar
3. `.pw-hero` also had `overflow: hidden` — same issue for any elements in that zone

**Fix:**
```css
/* Before */
.pw-top { z-index: 200; }
.pw-form-section { overflow: hidden; }
.pw-hero { overflow: hidden; }

/* After */
.pw-top { z-index: 9999; }
.pw-form-section { overflow: visible; }
.pw-hero { overflow: visible; }
```

**Lesson:**
- Sticky/fixed bars that must stay on top of EVERYTHING: use `z-index: 9999`, not `200`
- `overflow: hidden` on a section that contains `<select>` elements clips the native browser dropdown — always use `overflow: visible` on form containers
- The `::before` pseudo-element decorative blobs on those sections still work fine with `overflow: visible` — the clip was unnecessary

---

## BUG 2 — Landing Page Colors Didn't Match ASAR Logo

**What happened:**
First color pass used official US flag Pantone values (`#002868` navy, `#BF0A30` red) which are technically correct for the flag but DON'T match the actual ASAR logo colors. Logo uses brighter, more vibrant versions.

**How logo colors were identified:**
Downloaded logo from Google Drive (file ID: `1Erx00BjvdSjFAXIceoZ-MYpeeYxCyHqL`), ran PIL pixel analysis — filtered out white background (R>230 AND G>230 AND B>230), bucketed remaining pixels into 16-step color groups, counted frequency.

**Actual ASAR logo colors (pixel-verified):**
| Color | Hex | RGB | % of logo |
|---|---|---|---|
| Brand Blue | `#0050A0` | RGB(0, 80, 160) | 55% |
| Brand Red | `#CC2030` | RGB(204, 32, 48) | ~12% |
| White | `#FFFFFF` | — | text + stars |

**All CSS variables updated to match:**
```css
:root {
  --navy:   #0050A0;   /* logo blue — all dark sections */
  --mid:    #003d7a;   /* slightly darker blue for gradients */
  --orange: #CC2030;   /* logo red — all CTAs, badges, accents */
  --red:    #CC2030;   /* same */
}
/* Hover darken */
button:hover → #a01828
phone link hover → #e03040
footer → #002860
```

**All hardcoded rgba() values also updated:**
- `rgba(232,93,0,X)` → `rgba(204,32,48,X)` (old orange → logo red)
- `rgba(191,10,48,X)` → `rgba(204,32,48,X)` (interim red → logo red)
- `rgba(26,53,112,X)` → `rgba(0,61,122,X)` (old blue mid → logo blue mid)

**Lesson:**
- NEVER use official Pantone/flag hex codes for brand colors — always pixel-sample the ACTUAL logo
- Logo colors are often brighter/more vibrant than official flag standards for screen legibility
- Use PIL pixel analysis pattern: download → filter background → bucket to 16-step groups → count frequency → top result IS the brand color
- For ASAR: `#0050A0` blue + `#CC2030` red — use these everywhere (landing pages, WordPress pages, email templates, proposals, ad creatives)

---

## Files Changed
- `C:\Users\sales\OneDrive\Documents\CLAUDE\landing-pages\pressure-washing.html`
- Uploaded to Google Drive MARKETING/Meta Ads folder
- Brand colors added to `reference_asar_brand_facts.md`
