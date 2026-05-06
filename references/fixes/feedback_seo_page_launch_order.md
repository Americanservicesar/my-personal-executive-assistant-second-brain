---
name: SEO Page Launch Order
description: Correct order of operations when building and launching new WordPress SEO pages — SEO meta must be set BEFORE submitting to Google/Bing
type: feedback
---

Always set RankMath SEO meta (title, description, focus keyword) on pages BEFORE submitting to search engines or requesting indexing.

**Why:** Pages submitted to Google while missing meta titles/descriptions get crawled and cached without that data. Although "Unknown to Google" pages have a window before actual crawl, the safest order eliminates any risk of Google indexing a page with blank/auto-generated meta.

**How to apply — correct launch order for new WordPress pages:**
1. Create pages (XML import or REST API)
2. Set parent/slug structure correctly
3. Set RankMath SEO meta on all pages (PHP script or manual)
4. Publish pages
5. Submit sitemap to Google Search Console
6. Submit sitemap + URL batch to Bing Webmaster API
7. Submit IndexNow for instant Bing/Yandex pickup

Do NOT submit to indexing until step 3 is confirmed complete.
