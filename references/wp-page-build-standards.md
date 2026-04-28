# WordPress Page Build Standards — ASAR

> Last updated: 2026-04-28
> Applies to: ALL agents building or editing americanservicesar.com pages
> Owned by: Seomi (SEO), Penn (Copy)

## Core API Approach
- All pages built via **WordPress REST API** using `curl` subprocess in Python
- Auth: `Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s=` (Asons app password)
- Endpoint: `https://americanservicesar.com/wp-json/wp/v2/pages/{PAGE_ID}`
- **NEVER** use Python `requests` for americanservicesar.com — DNS fails on Windows
- Always use `curl` via subprocess

## Brand Colors
| Use | Hex |
|-----|-----|
| Navy (dark bg) | `#0a1628` |
| Mid-navy | `#1a2f4e` |
| ASAR orange | `#e85d00` |
| Danger red / price badge | `#c0392b` |
| Dark text | `#2d3748` |
| Muted | `#718096` |
| Off-white | `#f5f5f5` |

## CRITICAL READABILITY RULE
**NEVER use rgba/transparent backgrounds for items inside dark containers.**
- BAD: `background:rgba(232,93,0,.15)` — invisible on dark bg
- GOOD: `background:#fff` with dark text OR `background:#c0392b` with `color:#fff`

## CSS Class Prefixes
Prefix all custom class names with 2-3 char page acronym (e.g., `.fw-` fleet washing,
`.pw-` pressure washing, `.gc-` gutter cleaning) to avoid collisions across pages.

## Mobile Feature/Advantage List Items
```css
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

## Price Badges (3 tiers, all pill-shaped)
```css
/* Primary / most highlighted — red */
.fw-vt-price { background:#c0392b; color:#fff; font-weight:700; font-size:.85rem; padding:5px 12px; border-radius:20px; display:inline-block; white-space:nowrap; }
/* Standard tier — navy */
.fw-vt-price-std { background:#1a2f4e; color:#fff; font-weight:600; font-size:.83rem; padding:4px 10px; border-radius:20px; display:inline-block; white-space:nowrap; }
/* Premium / full-service — dark navy + orange text */
.fw-vt-price-full { background:#0a1628; color:#e85d00; font-weight:600; font-size:.83rem; padding:4px 10px; border-radius:20px; display:inline-block; white-space:nowrap; }
/* N/A or custom quote */
.fw-vt-custom { color:#718096; font-size:.82rem; font-style:italic; }
```

## Vehicle/Service Pricing Table
**Rule**: Replace icon grids with structured HTML tables — KEEP emoji icons as `.fw-vt-emoji` spans.
```css
.fw-vehicle-table { width:100%; border-collapse:collapse; margin-bottom:32px; font-size:.9rem; border-radius:10px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); }
.fw-vehicle-table thead tr { background:#0a1628; }
.fw-vehicle-table th { color:#fff; padding:13px 16px; text-align:left; font-weight:700; font-size:.88rem; letter-spacing:.3px; }
.fw-vehicle-table th:not(:first-child) { text-align:center; }
.fw-vehicle-table td { padding:11px 16px; border-bottom:1px solid #e8edf2; vertical-align:middle; color:#2d3748; }
.fw-vehicle-table td:not(:first-child) { text-align:center; }
.fw-vehicle-table tr:nth-child(even) td { background:#f8f9fa; }
.fw-vehicle-table tr:last-child td { border-bottom:none; }
.fw-vt-cell { display:flex; align-items:center; gap:10px; }
.fw-vt-emoji { font-size:1.8rem; flex-shrink:0; }
.fw-vt-label { font-weight:700; color:#0a1628; font-size:.92rem; }
.fw-vt-sub { font-size:.78rem; color:#718096; font-weight:400; display:block; }
```

Table HTML pattern (columns: Vehicle Type | Basic Ext | Standard | Full-Service):
```html
<table class="fw-vehicle-table">
  <thead><tr>
    <th style="width:38%;">Vehicle Type</th>
    <th>Basic Exterior</th><th>Standard Full Wash</th><th>Full-Service Detail</th>
  </tr></thead>
  <tbody>
    <tr>
      <td><div class="fw-vt-cell"><span class="fw-vt-emoji">&#128666;</span>
        <div><span class="fw-vt-label">Semi-Tractor</span><span class="fw-vt-sub">Cab only</span></div></div></td>
      <td><span class="fw-vt-price">From $35</span></td>
      <td><span class="fw-vt-price-std">$75–$125</span></td>
      <td><span class="fw-vt-price-full">$150–$250</span></td>
    </tr>
    <!-- Custom quote row: -->
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
Content length: 1,000+ words for service pages.

## Schema Stack (MANDATORY on every page)
- `LocalBusiness` — NAP, hours, service area
- `Service` — name, description, provider, areaServed
- `FAQPage` — 3-5 Q&A pairs (always include)
- `AggregateRating` — when reviews available

## WordPress REST API Python Pattern
```python
import json, subprocess

PAGE_ID = 9053
AUTH = "Basic QXNvbnM6cVd6SCA5cVhaIHozTDQgVVMxcCBjUXlWIEdYd2s="

# 1. GET current content
r = subprocess.run(['curl', '-s', '-H', f'Authorization: {AUTH}',
    f'https://americanservicesar.com/wp-json/wp/v2/pages/{PAGE_ID}?_fields=content,slug,title'],
    capture_output=True)
data = json.loads(r.stdout.decode('utf-8'))
content = data['content']['raw']

# 2. Make edits (string replace)
content = content.replace(old_html, new_html)

# 3. POST changes
payload = {"content": content}
with open('payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False)
r = subprocess.run(['curl', '-s', '-w', '\n%{http_code}', '-X', 'POST',
    '-H', f'Authorization: {AUTH}', '-H', 'Content-Type: application/json',
    '--data-binary', '@payload.json',
    f'https://americanservicesar.com/wp-json/wp/v2/pages/{PAGE_ID}'],
    capture_output=True)
lines = r.stdout.decode('utf-8').strip().split('\n')
print(f"HTTP {lines[-1]}")  # 200 = success
```

## Rules
1. NEVER use "ASAR" in public-facing content — always "American Services AR"
2. Set RankMath meta BEFORE submitting to Google/Bing (keyword, title, desc)
3. Check for duplicate content before publishing
4. Always include FAQ section with FAQPage schema
5. All orange-on-dark elements → solid red/navy background + white text
6. CSS always goes in `<style>` block at top of page content
7. Use 2-3 char class prefix per page to avoid collisions

## Key Page IDs
| Page | ID |
|------|----|
| Fleet Washing | 9053 (fixed 2026-04-28: mobile list, price badges, vehicle table) |

## SerpApi Tracking
- API Key: `8a0bac6e6a8035d5bee9946ab7c054a73f4888027c83b505efa4dd5d666bab66`
- Plan: Free (250 searches/month) — NEEDS UPGRADE for weekly 157-page tracking
- Rank Tracker Sheet: `1kxU_oXAELyiZk0X2jZwg8edoTlccuRxcnsI7GclGshA`
- Cadence: Weekly every Monday — add new dated column, never overwrite prior weeks
