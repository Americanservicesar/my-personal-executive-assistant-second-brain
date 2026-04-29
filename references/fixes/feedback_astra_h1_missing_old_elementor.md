---
name: Astra H1 Missing on Old Elementor Rebuilt Pages
description: Old Elementor pages don't get Astra theme page-title H1 after rebuild — must inject H1 into content
type: feedback
originSessionId: e38e4baf-3a4f-446d-828c-d62b084a6159
discovered: 2026-04-29
---

## The Problem

Old Elementor pages rebuilt via REST API render with **no visible H1** on the live page, even after clearing Elementor meta and resetting Astra layout.

**Root cause:** Astra theme renders the WordPress page title as an H1 in a dedicated "page title" section for freshly-created pages (Phase 2, IDs 9000+). Old Elementor pages have this per-page title display setting **disabled** from their original Elementor build — that setting survives the Elementor clear and layout reset. Result: the theme never renders the H1, and if the page content doesn't include one either, there is no H1 at all.

**Symptom:** Content starts with BLUF paragraph directly below the nav — no heading visible at top of page. Fresh Phase 2 pages correctly show theme-rendered H1 above the BLUF.

## Affected Pages (fixed 2026-04-29)

| ID | Slug | H1 Added |
|----|------|----------|
| 3460 | `/soft-washing/` | Soft Washing Services in Central Arkansas |
| 383  | `/house-washing/` | House Washing Services in Central Arkansas |
| 391  | `/roof-cleaning/` | Roof Cleaning Services in Central Arkansas |
| 3468 | `/pressure-washing/` | Pressure Washing Services in Central Arkansas |
| 3036 | `/window-cleaning/` | Window Cleaning Services in Central Arkansas |
| 3477 | `/holiday-lighting/` | Holiday Lighting Installation in Central Arkansas |
| 378  | `/deck-fence-cleaning/` | Deck & Fence Cleaning in Central Arkansas |
| 3492 | `/commercial/` | Commercial Exterior Cleaning in Central Arkansas |

## The Fix

When rebuilding **any old Elementor page**, inject an H1 tag directly into the page content, immediately after the 90px spacer div:

```python
SPACER = '<div style="height:90px;display:block;"></div>'
H1 = '<h1>Your Service Name in Central Arkansas</h1>'

# Insert after spacer in content
raw = raw.replace(SPACER, SPACER + '\n' + H1, 1)
```

Include in the same REST API payload as the Elementor clear + Astra layout reset:

```python
payload = {
    'content': html_with_h1,
    'template': '',
    'meta': {
        'site-content-layout': 'default',
        'ast-site-content-layout': '',
        '_elementor_edit_mode': '',
        '_elementor_data': '[]'
    }
}
```

## Full Pattern for Old Elementor Page Rebuild

Every old Elementor page rebuild now requires **4 parts**:

1. Clear `_elementor_edit_mode` + `_elementor_data`
2. Reset `site-content-layout: default` + `ast-site-content-layout: ""`  
3. Add `<div style="height:90px;display:block;"></div>` after `</style>` (transparent header spacer)
4. **Add `<h1>Service Name in Central Arkansas</h1>` after spacer** ← this is the new addition

See also: `feedback_elementor_page_builder_fix.md` for the original 3-part fix (CSS strip + header overlap).
