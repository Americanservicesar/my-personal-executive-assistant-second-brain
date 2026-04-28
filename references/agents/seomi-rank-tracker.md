# Seomi — SEO Rank Tracker Instructions

> Last updated: 2026-04-28
> Sheet: https://docs.google.com/spreadsheets/d/1kxU_oXAELyiZk0X2jZwg8edoTlccuRxcnsI7GclGshA/edit
> Cadence: EVERY MONDAY — add new dated column, never overwrite prior weeks

## Sheet Structure (3 Sections — ALWAYS Maintain)

The rank tracker sheet is organized into 3 labeled sections separated by a blank row:

| Section | Label Row | What it tracks |
|---------|-----------|----------------|
| 1 | `── PILLAR PAGES ──` | Main service pages: /pressure-washing/, /fleet-washing/, etc. |
| 2 | `── SERVICE × CITY PAGES ──` | 157 service×city pages: /fleet-washing/conway/, etc. |
| 3 | `── CITY HUB PAGES ──` | City landing pages: /conway-ar/, /service-areas/conway/, etc. |

This structure lets Anthony see at a glance which type of page is ranking.

## Column Format
`Page Type | Service | City | Focus Keyword | Page URL | Tracking Start | [date columns...]`

## Weekly Monday Protocol
1. Open the rank tracker sheet
2. Add a new column with today's date (format: `YYYY-MM-DD`) as the header
3. For each page, use SerpApi to check the Google position for its focus keyword
4. Enter the rank (1-100) or "NR" if not in top 100
5. NEVER overwrite prior week columns — always append to the right

## SerpApi
- Key: `8a0bac6e6a8035d5bee9946ab7c054a73f4888027c83b505efa4dd5d666bab66`
- Account: asons@americanservicesar.com
- Plan: Free (250 searches/month) — NEEDS UPGRADE for ~200+ pages weekly (~800+ searches/month)
- n8n credential ID: W674ZSbrWCALEVEp

## Ranking Priorities (by section)
1. **Pillar pages**: These should rank for the service + Conway/AR keywords
2. **Service×City pages**: Target top 10 for exact [service] + [city] + ar keyword
3. **City Hub pages**: Target top 10 for "exterior cleaning services [city] ar"

## Alert Thresholds
- Any page moves from 11+ → top 10: post win to #seomi-seo
- Any page drops more than 5 positions week-over-week: flag to #seomi-seo
- Any pillar page not in top 50 after 60 days: escalate to Vizzy
