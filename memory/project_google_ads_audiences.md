# Google Ads Audiences — Full Setup Status

**Last updated: 2026-05-06**

## Customer Match Lists (CSV Uploaded)
| Audience | Source | Contacts | Status |
|---|---|---|---|
| All Customers — Master Audience List | GHL + HCP merged CSV | 1,390 | Populating (24-48h) |
| Past Customers — HCP Invoice List | HCP invoices | TBD | Populating (24-48h) |

- Master list built from `build_master_audience.py` (GHL QuickBooks export) + `merge_master_audience.py` (HCP enrichment)
- CSV format: Email Address, Phone Number, First Name, Last Name, Country, Zip
- Upload method: base64 chunked injection via Chrome MCP javascript_tool (52 chunks, DataTransfer API)
- Compliance checkbox confirmed checked before save

## Website Visitor Audiences (Auto/Rule-based)
| Audience | Type | Size | Notes |
|---|---|---|---|
| All Users of American Services AR - GA4 | Website visitors | 41 | Customer Match enabled |
| All Users of American Services AR - Anthony Sons | Website visitors | 0 | Tag-based, building |
| All visitors (Google Ads) | Website visitors | Active | Remarketing tag |
| All converters | Rule-based | 0 | Conversion tracking |
| Google-engaged audiences | Auto | Active | Search/display traffic |
| AdWords optimized list | Auto combination | Active | Smart campaigns |
| Click_but_no_conversions_10565_3d7e236_30d | Smart exclusion | Active | Excludes converters |

## Similar Segments (Lookalikes)
- Google auto-generates Similar Segments once Customer Match lists reach 100+ matched users
- Expected: 3-7 days after Populating completes
- No manual action needed

## What's Still Needed (Next Session)
1. **Add audiences to campaigns as Observation** — apply All Customers + All Visitors to Search campaigns so Google can optimize bid adjustments
2. **Page-specific retargeting** — create rule-based audience for /pressure-washing/ visitors who didn't convert (30-day window)
3. **Time-segmented remarketing** — 7d, 14d, 30d site visitor buckets for Display/RLSA

## Files
- Master audience CSV: `C:\Users\sales\Documents\customer-match-google-ads.csv` (1,390 rows, 77,860 bytes)
- Build script: `C:\Users\sales\Documents\build_master_audience.py`
- Merge script: `C:\Users\sales\Documents\merge_master_audience.py`
- Audience Manager URL: `https://ads.google.com/aw/audiences/management?ocid=579934054&euid=446890213&__u=4630755837&uscid=579934054&__c=4598481846&authuser=0`
