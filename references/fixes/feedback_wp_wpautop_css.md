---
name: WordPress wpautop Breaks CSS Style Blocks with Blank Lines
description: WordPress auto-paragraph filter (wpautop) injects <p> tags inside <style> blocks if blank lines exist between CSS rules — breaks all CSS
type: feedback
originSessionId: e38e4baf-3a4f-446d-828c-d62b084a6159
last_updated: 2026-04-28
---

WordPress's `wpautop` filter converts double newlines into `<p>` tags. It's supposed to skip `<style>` blocks, but it fails when there are **blank lines** between CSS rule groups inside a `<style>` tag.

**Broken (has blank lines between rule groups):**
```css
<style>
.class-a { ... }
.class-b { ... }

.class-c { ... }   /* ← blank line above triggers wpautop */
</style>
```

Result: rendered HTML has `</p><p>` inside the style block, breaking all CSS.

**Fix: write the entire CSS on a single line (no newlines inside the style tag):**
```css
<style>.class-a{...}.class-b{...}.class-c{...}</style>
```

**Why:** The solar pages (IDs 9739-9754) have newlines in their style blocks but NO blank lines between rules, so they render fine. The original About page had blank lines between CSS sections, causing breakage.

**How to apply:** When injecting CSS via WordPress REST API `content` field, always minify the `<style>` block — remove all newlines and blank lines inside the style tag. Newlines BETWEEN CSS rules (no blank line) are also safe to remove.

Also: HTML elements in flex containers — keep them on a single line or without blank lines between them, to prevent WordPress from wrapping sibling divs in `<p>` tags.
