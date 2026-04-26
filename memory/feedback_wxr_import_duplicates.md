---
name: WXR Import Duplicate Page Fix Procedure
description: When WXR import creates -2 duplicate pages because slugs already exist, follow this exact procedure to fix them
type: feedback
---

When WordPress WXR import creates duplicate pages with `-2` suffix (e.g., `/soft-washing-2/` alongside `/soft-washing/`), use this procedure:

1. **Find pages blocking the slug** — REST API: `GET /wp-json/wp/v2/pages?slug=<slug>&status=any` — check draft, trash, and publish status. Published OR draft pages both block slug reuse.
2. **Unpublish/trash the old original page** — `DELETE /wp-json/wp/v2/pages/<orig-id>` (moves to trash, freeing the slug).
3. **Rename the -2 page to the correct slug** — `POST /wp-json/wp/v2/pages/<dup-id>` with `{ "slug": "correct-slug", "status": "publish" }`.

**Why:** WordPress won't assign a slug that's already in use by ANY page (published, draft, or trashed within the same request cycle). Draft pages silently block slug reuse — they won't appear in a standard `?slug=` search without `&status=any`.

**How to apply:** Any time a WXR import creates `-2` pages, immediately run the above 3-step fix. Do NOT copy content via REST API — that's more complex and error-prone. The new content IS on the -2 page; just free the slug and rename it.

**Auth:** Use `X-WP-Nonce` header (from `window.wpApiSettings.nonce` when logged into WP admin in browser) — Application Passwords don't work reliably from browser fetch.
