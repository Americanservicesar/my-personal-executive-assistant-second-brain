---
name: RankMath REST API — Correct Endpoint for Setting Post Meta
description: How to set RankMath title, description, and focus keyword for a page/post via the REST API
type: feedback
originSessionId: e38e4baf-3a4f-446d-828c-d62b084a6159
last_updated: 2026-04-28
---

Use `POST /wp-json/rankmath/v1/updateMeta` with `rank_math_` prefixed meta keys.

**Working payload:**
```json
{
  "objectType": "post",
  "objectID": 431,
  "meta": {
    "rank_math_title": "Your SEO Title Here",
    "rank_math_description": "Your meta description here.",
    "rank_math_focus_keyword": "your focus keyword"
  }
}
```

**Success response:** `{"slug": true, "schemas": []}`

**Why:** RankMath exposes `/rankmath/v1/updateMeta` for updating post SEO metadata. The `rank_math_` prefix is required — using just `title` or `description` as keys returns success but doesn't update anything.

**Why `wp/v2/pages meta` won't work:** RankMath meta fields are not registered with `show_in_rest: true` in the WordPress REST API, so POST to `wp/v2/pages/{id}` with `meta.rank_math_title` is silently ignored.

**WP Rocket cache:** After updating meta, fetch with `?nocache=1` to bypass WP Rocket and verify the live title. The cache clears automatically on post update.

**How to apply:** Any time you need to set SEO title/description/focus keyword on a page or post, use this endpoint instead of `update_post_meta()` via Code Snippets or the standard REST API meta field.
