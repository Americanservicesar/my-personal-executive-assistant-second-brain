---
name: Elementor Page-Builder Layout Fix — Header Overlap & CSS Stripping
description: When rebuilding old Elementor pages via REST API, must clear both Elementor meta AND Astra layout meta or CSS gets stripped and transparent header overlaps content
type: feedback
originSessionId: e38e4baf-3a4f-446d-828c-d62b084a6159
---
## The Problem

Old pages originally built with Elementor have two issues after being rebuilt with plain HTML via the WP REST API:

1. **CSS `<style>` blocks get stripped** — The page renders `<style></style>` (empty) instead of the CSS. CSS classes like `.asar-stat-bar`, `.price-cards`, etc. have no styling.
2. **Text appears behind the global transparent header** — The Astra page-builder layout removes the standard header offset padding.

## Root Cause

Old Elementor pages carry two Astra meta fields that survive Elementor removal:

- `site-content-layout: page-builder` — Uses a different Astra template that strips inline `<style>` tags from post content and removes standard header offset padding
- `ast-site-content-layout: full-width-container` — Compounds the CSS stripping issue

Newly created pages (Phase 2 SEO pages, IDs 9001+) never had these set and work correctly.

## The Fix (3-Part)

Every time you rebuild an OLD Elementor page via REST API, include ALL THREE of these in the same POST:

```python
payload = {
    'content': html_content,
    'meta': {
        # Part 1: Clear Elementor data
        '_elementor_edit_mode': '',
        '_elementor_data': '[]',
        # Part 2: Reset Astra layout (THE KEY FIX for CSS + header)
        'site-content-layout': 'default',
        'ast-site-content-layout': '',
    }
}
```

## The Header Spacer

Even with the layout fixed, ALSO include this spacer div immediately after the `</style>` closing tag in the HTML content. It handles the Astra transparent/sticky header (≈90px tall):

```html
<style>...all CSS on single line...</style>
<div style="height:90px;display:block;"></div>
```

**Why:** The Astra transparent header floats over page content. Without the spacer, the first content element renders directly behind the header. Inline style used (not CSS class) so it works even if stylesheets haven't loaded.

## How to Apply

**Why:** Past incident where clearing Elementor alone wasn't enough — the `page-builder` content layout meta was left behind and kept stripping CSS + breaking the header. Discovered 2026-04-28.

**How to apply:** Whenever pushing content to a page that was previously built in Elementor (check: does it have `site-content-layout: page-builder` in its meta?), always include both the Elementor clear AND the layout reset in the same API call. Also always include the 90px spacer div in the HTML.

## Affected Pages (fixed 2026-04-28)
- ID 3460 soft-washing
- ID 383 house-washing
- ID 391 roof-cleaning
- ID 3468 pressure-washing
- ID 3036 window-cleaning
- ID 3477 holiday-lighting
- ID 3492 commercial
