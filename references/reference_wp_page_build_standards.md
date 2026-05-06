---
name: WordPress Page Build Standards — ASAR
description: How service×city pages are built on americanservicesar.com — CSS patterns, pricing tables, mobile readability, WP REST API approach. Reference for all future page builds.
type: reference
originSessionId: c72c750d-4937-4cbd-92f8-72065a8c591a
last_updated: 2026-04-28
---

# ASAR WordPress Page Build Standards

## Core Approach
- All pages built via **WordPress REST API** using `curl` subprocess in Python (NOT Python `requests` — DNS fails on Windows for americanservicesar.com)
- Auth: `Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s=` (Asons app password)
- Endpoint: `https://americanservicesar.com/wp-json/wp/v2/pages/{PAGE_ID}`
- Method: POST with `Content-Type: application/json` and `--data-binary @payload.json`
- Response: HTTP 200 on success

## Brand Colors
| Use | Color | Hex |
|-----|-------|-----|
| Primary navy (dark bg) | Navy | `#0a1628` |
| Secondary navy | Mid-navy | `#1a2f4e` |
| Accent orange | ASAR orange | `#e85d00` |
| Danger/price red | Red | `#c0392b` |
| Text on light bg | Dark text | `#2d3748` |
| Muted text | Gray | `#718096` |
| Light text | Off-white | `#f5f5f5` |

## CRITICAL READABILITY RULE
**NEVER use transparent/rgba backgrounds for list items or callout boxes inside dark-background containers.**
- ❌ BAD: `background:rgba(232,93,0,.15)` — nearly invisible on dark bg
- ✅ GOOD: `background:#fff` with dark text, or `background:#c0392b` with `color:#fff`
- Always ensure text color contrasts strongly against its background

## Mobile List Items (Advantage/Feature Lists)
```css
/* Inside dark-background sections — solid white box */
.fw-mobile-list li {
  background: #fff;
  border-left: 4px solid #e85d00;
  color: #0a1628;
  padding: 9px 14px;
  font-size: .9rem;
  font-weight: 600;
  border-radius: 0 6px 6px 0;
}
```

## Pricing / Callout Badges
Three tiers for price display — all pill-shaped badges:
```css
/* Primary price (highlighted / most expensive) — red badge */
.fw-vt-price {
  display: inline-block;
  background: #c0392b;
  color: #fff;
  font-weight: 700;
  font-size: .85rem;
  padding: 5px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

/* Standard tier — navy badge */
.fw-vt-price-std {
  display: inline-block;
  background: #1a2f4e;
  color: #fff;
  font-weight: 600;
  font-size: .83rem;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

/* Full-service / premium — dark navy + orange text */
.fw-vt-price-full {
  display: inline-block;
  background: #0a1628;
  color: #e85d00;
  font-weight: 600;
  font-size: .83rem;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

/* Custom quote / N/A */
.fw-vt-custom {
  color: #718096;
  font-size: .82rem;
  font-style: italic;
}
```

## Vehicle / Service Pricing Table (replaces icon grids)
**Rule**: Icon grids look nice but are not scannable — replace with structured HTML tables that KEEP the emoji icons.

```css
/* Vehicle pricing table */
.fw-vehicle-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
  font-size: .9rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}
.fw-vehicle-table thead tr { background: #0a1628; }
.fw-vehicle-table th {
  color: #fff;
  padding: 13px 16px;
  text-align: left;
  font-weight: 700;
  font-size: .88rem;
  letter-spacing: .3px;
}
.fw-vehicle-table th:not(:first-child) { text-align: center; }
.fw-vehicle-table td {
  padding: 11px 16px;
  border-bottom: 1px solid #e8edf2;
  vertical-align: middle;
  color: #2d3748;
}
.fw-vehicle-table td:not(:first-child) { text-align: center; }
.fw-vehicle-table tr:nth-child(even) td { background: #f8f9fa; }
.fw-vehicle-table tr:last-child td { border-bottom: none; }

/* Cell with emoji icon + label + subtitle */
.fw-vt-cell { display: flex; align-items: center; gap: 10px; }
.fw-vt-emoji { font-size: 1.8rem; flex-shrink: 0; }
.fw-vt-label { font-weight: 700; color: #0a1628; font-size: .92rem; }
.fw-vt-sub { font-size: .78rem; color: #718096; font-weight: 400; display: block; }
```

Table HTML pattern:
```html
<table class="fw-vehicle-table">
  <thead>
    <tr>
      <th style="width:38%;">Vehicle Type</th>
      <th>Basic Exterior</th>
      <th>Standard Full Wash</th>
      <th>Full-Service Detail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><div class="fw-vt-cell"><span class="fw-vt-emoji">&#128666;</span><div><span class="fw-vt-label">Semi-Tractor</span><span class="fw-vt-sub">Cab only</span></div></div></td>
      <td><span class="fw-vt-price">From $35</span></td>
      <td><span class="fw-vt-price-std">$75–$125</span></td>
      <td><span class="fw-vt-price-full">$150–$250</span></td>
    </tr>
    <!-- Custom quote row (spans 3 cols): -->
    <tr>
      <td><!-- vehicle cell --></td>
      <td colspan="3" style="text-align:center;"><span class="fw-vt-custom">&#128222; Custom quote — call (501) 289-5623</span></td>
    </tr>
  </tbody>
</table>
```

## SEO Page Structure (every service×city page)
```
Title Tag (<60 chars): [Service] in [City], AR | American Services AR
H1: [Service] in [City], Arkansas
Intro (100-150 words): What we do, who we serve, why choose us
H2: Our [Service] Services in [City] — bullet list of specifics
H2: Why Choose ASAR — experience, equipment, licensing, local presence
H2: Service Area — cities covered, neighborhoods, map
H2: Get a Free Estimate — CTA with phone + form link
H2: FAQ — 3-5 questions with FAQPage schema
```

## Schema Requirements (MANDATORY on every page)
- `LocalBusiness` — NAP, hours, service area
- `Service` — name, description, provider, area
- `FAQPage` — 3-5 Q&A pairs
- `AggregateRating` — if reviews available

## Internal CSS Pattern
All custom CSS goes in a `<style>` block at the top of the page content (Gutenberg Custom HTML block or raw HTML). Prefix all class names with a 2-3 char page acronym (e.g., `.fw-` for fleet washing) to avoid collisions.

## WordPress REST API — Python curl Pattern
```python
import json, subprocess

PAGE_ID = 9053  # get from WP admin
AUTH = "Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s="

# Read current content first
with open('page_content.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Make string replacements
content = content.replace(old_string, new_string)

# Write payload
payload = {"content": content}
with open('payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False)

# POST via curl subprocess
r = subprocess.run([
    'curl', '-s', '-w', '\n%{http_code}',
    '-X', 'POST',
    '-H', f'Authorization: {AUTH}',
    '-H', 'Content-Type: application/json',
    '--data-binary', '@payload.json',
    f'https://americanservicesar.com/wp-json/wp/v2/pages/{PAGE_ID}'
], capture_output=True)

lines = r.stdout.decode('utf-8').strip().split('\n')
status_code = lines[-1]
```

## Fetch Page Content (GET before editing)
```python
r = subprocess.run([
    'curl', '-s',
    '-H', f'Authorization: {AUTH}',
    f'https://americanservicesar.com/wp-json/wp/v2/pages/{PAGE_ID}?_fields=content,slug,title'
], capture_output=True)
data = json.loads(r.stdout.decode('utf-8'))
content = data['content']['raw']
```

## Fleet Washing Page (Page ID: 9053)
- **Fixed 2026-04-28**: Mobile list items, price badge colors, vehicle grid → pricing table
- **Still needed**: /fleet-washing/conway/ and /fleet-washing/little-rock/ city pages not yet built

## Photo Pipeline (WP Media + Drive)
- Script: `C:\Users\sales\Downloads\run_photo_pipeline_test.py`
- Injects GPS EXIF for 10 cities, uploads to WP Media × 10 with SEO fields, renames/moves in Drive via gdrive.py
- **Always use gdrive.py for Drive ops** — NEVER Google Workspace MCP for file operations
- WP Media upload: `Content-Type: image/jpeg` + `Content-Disposition: attachment; filename="..."`

## Key Rules
1. NEVER use "ASAR" in any public-facing content — always "American Services AR"
2. Every page needs RankMath meta set BEFORE submitting to Google/Bing
3. Check for duplicate content before publishing
4. Always include FAQ section with FAQPage schema
5. All orange-on-dark-background elements → replace with solid red/navy background + white text
