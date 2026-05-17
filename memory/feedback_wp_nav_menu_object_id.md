---
name: WP Nav Menu — object_id Required for URL Change
description: For WordPress menu items of type post_type, the url field is read-only and derived from the linked page. To change where the item points, update object_id to the correct page ID.
type: feedback
date: 2026-05-17
originSessionId: ccb3e528-01da-49dc-b07e-762b0b0108ff
---
## The Problem

When updating a WordPress nav menu item via REST API, changing the `url` field has no effect for items where `type = "post_type"`. The URL is derived at render time from the page linked via `object_id`. You can set `url` to anything — it will be silently overwritten with the linked page's actual URL.

## Example

Menu item "Soft Washing" was pointing to old pillar page ID 3460 at `/soft-washing-services-of-central-arkansas/`. After rebuilding to `/soft-washing/`, the menu item still showed the old URL even after a REST API update with the new `url` value.

## The Fix

Update `object_id` to the correct page ID:

```python
import subprocess, json, base64

WP_BASE = "https://americanservicesar.com"
AUTH = base64.b64encode(b"Asons:qWzH 9qXZ z3L4 US1p cQyV GXwk").decode()

def curl(method, url, data=None):
    cmd = ["curl", "-s", "-X", method, "-H", f"Authorization: Basic {AUTH}",
           "-H", "Content-Type: application/json"]
    if data:
        cmd += ["-d", json.dumps(data)]
    cmd.append(url)
    return json.loads(subprocess.check_output(cmd))

# Find the menu item
menus = curl("GET", f"{WP_BASE}/wp-json/wp/v2/menu-items?per_page=100")
for item in menus:
    if "soft-washing" in item.get("url", ""):
        menu_item_id = item["id"]
        # Fix: update object_id to the correct page ID
        curl("PUT", f"{WP_BASE}/wp-json/wp/v2/menu-items/{menu_item_id}", {
            "object_id": 3460,  # correct page ID
            "title": "Soft Washing"  # also fix display title if needed
        })
```

## Key Facts

- `type = "post_type"` → URL is always derived from `object_id` (the page/post ID)
- `type = "custom"` → URL is stored directly and can be changed via `url` field
- Check type before deciding which field to update
- `title` field controls the visible menu label (not the page title)
- To fix menu title to short name (e.g., "Soft Washing" not "Soft Washing Services of Central Arkansas"), set `title` explicitly in the same PUT call

## Menu Item Fields Reference

| Field | Type | Editable | Notes |
|-------|------|----------|-------|
| `object_id` | int | ✅ Yes | The linked page/post ID |
| `url` | string | ❌ No (for post_type) | Read-only — derived from object_id |
| `title` | string | ✅ Yes | Display text in the menu |
| `status` | string | ✅ Yes | "publish" to show, "draft" to hide |
| `menu_order` | int | ✅ Yes | Position in the menu |
| `parent` | int | ✅ Yes | Parent menu item ID (for dropdowns) |

## How to Find Menu Items

```python
# List all menu items (paginate if needed)
items = curl("GET", f"{WP_BASE}/wp-json/wp/v2/menu-items?per_page=100&menus=MENU_ID")

# Get menu IDs
menus = curl("GET", f"{WP_BASE}/wp-json/wp/v2/menus")
```

## Applied Fix This Session

All 13 pillar page menu items had their `title` fields corrected to short service names (e.g., "Soft Washing" not the full SEO title). `object_id` values were already correct — titles were the only issue.
