---
name: RankMath Sitemap Cache — Physical File Fix
description: RankMath caches sitemaps as physical XML files, not just DB transients. Must delete files from disk to force regeneration.
type: feedback
---

RankMath PRO caches sitemaps as physical XML files, NOT just database transients.
Clearing RankMath's "sitemap cache" via the Status & Tools page only clears DB transients —
the physical files remain and are served instead.

**Fix procedure:**
1. Delete all `rank_math_*.xml` files from `wp-content/uploads/rank-math/`
2. Delete the `rank_math_sitemap_cache_files` DB option (tracks which files exist)
3. RankMath will regenerate fresh on next sitemap request

**PHP to do it:**
```php
$upload = wp_upload_dir();
$dir = $upload['basedir'] . '/rank-math/';
$files = glob($dir . 'rank_math_*.xml');
foreach ((array)$files as $f) { unlink($f); }
delete_option('rank_math_sitemap_cache_files');
```

**Why:** RankMath serves cached XML files directly via PHP include, bypassing the DB transient check. WP Rocket cache clearing also doesn't help — the files are inside WordPress's upload directory served by PHP, not the page cache.

**How to apply:** Any time the RankMath sitemap appears stale or missing new pages, run the above procedure via Code Snippets or phpMyAdmin. Do NOT just click "Clear Cache" in the RankMath Status & Tools page — that only clears transients.

**Additional requirement:** Pages must have `rank_math_robots` meta set (to any value other than noindex) to appear in the sitemap. Pages created via REST API without going through WP admin won't have this meta set automatically.

**DB table prefix on americanservicesar.com: `sSep60_`** — never hardcode `wp_posts`. Always use `$wpdb->posts`, `$wpdb->postmeta`, `$wpdb->options`.
