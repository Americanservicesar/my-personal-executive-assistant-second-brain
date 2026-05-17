---
name: Elementor Content Override — Root Cause & Fix
description: Elementor _elementor_data meta overrides post_content at render time. REST API updates to post_content appear to succeed but page still shows old Elementor content.
type: feedback
date: 2026-05-17
originSessionId: ccb3e528-01da-49dc-b07e-762b0b0108ff
---
## The Problem

Pages built with Elementor store the full builder layout as JSON in the `_elementor_data` post meta key (160k+ chars). When WordPress renders these pages, Elementor intercepts the render and outputs its stored JSON — completely ignoring `post_content`. This means:

- `PUT /wp-json/wp/v2/pages/{id}` with new content → silently succeeds (HTTP 200)
- But the page STILL shows old Elementor content in the browser
- `content.rendered` via REST API also returns the Elementor-rendered HTML, not your new content

## Affected Pages (ASAR 2026-05-17)

Pages 3460, 383, 391, 378, 3477, 3036 — all originally built with Elementor, Phase 2 REST API updates failed silently because of this.

## How to Detect It

Pull the page via REST API and check `content.rendered` length:
- **> 50,000 chars** = Elementor JSON still active (real content is ~5-6k chars)
- **< 20,000 chars** = post_content rendering correctly

Also check H1 — if it says a city name from the old Elementor template, Elementor is still in control.

## The Fix (Confirmed Working)

**Step 1:** Update `post_content` via REST API with new content (this writes to the DB but Elementor still overrides render).

**Step 2:** Deploy a Code Snippets PHP snippet that deletes the Elementor meta keys:

```php
add_action('init', function() {
    $page_ids = [3460, 383, 391, 378, 3477, 3036]; // target page IDs
    $meta_keys = [
        '_elementor_data',
        '_elementor_edit_mode',
        '_elementor_template_type',
        '_elementor_css',
        '_elementor_version',
        '_elementor_controls_usage',
        '_elementor_page_settings',
        '_elementor_element_cache',  // pre-rendered HTML cache — CRITICAL to delete
    ];
    foreach ($page_ids as $id) {
        foreach ($meta_keys as $key) {
            delete_post_meta($id, $key);
        }
    }
    if (function_exists('rocket_clean_domain')) rocket_clean_domain();
}, 20);
```

**Step 3:** Trigger the snippet by visiting any page on the site (curl -s https://site.com/ works).

**Step 4:** Deactivate the snippet immediately after — it's idempotent but no reason to run it on every request.

## Important: `_elementor_element_cache`

This is a separate meta key that stores **pre-rendered HTML** from Elementor's element caching system. Even after deleting `_elementor_data`, if `_elementor_element_cache` exists it will serve the old cached HTML. **Always include this key in the deletion list.**

## Deploy Snippet via Code Snippets REST API

```python
import subprocess, json, base64, tempfile, os

AUTH = base64.b64encode(b'Asons:qWzH 9qXZ z3L4 US1p cQyV GXwk').decode()
php_code = "... your PHP above ..."

tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
tmp.write(json.dumps({'name': 'Fix Elementor Meta', 'code': php_code, 'scope': 'global', 'active': True}))
tmp.close()

subprocess.run(['curl', '-s', '-X', 'POST',
    '-H', f'Authorization: Basic {AUTH}',
    '-H', 'Content-Type: application/json',
    '-d', f'@{tmp.name}',
    'https://americanservicesar.com/wp-json/code-snippets/v1/snippets'])
os.unlink(tmp.name)
```

## Deactivate Snippet After Use

```python
subprocess.run(['curl', '-s', '-X', 'PUT',
    '-H', f'Authorization: Basic {AUTH}',
    '-H', 'Content-Type: application/json',
    '-d', json.dumps({'active': False}),
    f'https://americanservicesar.com/wp-json/code-snippets/v1/snippets/{snippet_id}'])
```

## Verification

After fix, re-pull via REST API — `content.rendered` should be ~5-6k chars (not 160k+). H1 should match the new content's H1 block.
