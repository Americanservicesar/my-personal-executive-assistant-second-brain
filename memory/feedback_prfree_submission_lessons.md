---
name: PRFree.com Submission — Workflow, Format Rules, and Lessons
type: feedback
last_updated: 2026-05-05
originSessionId: c72c750d-4937-4cbd-92f8-72065a8c591a
---

## WHAT WAS DONE
Submitted 19 press releases to PRFree.com in a single batch session (May 3-5, 2026).
All submitted to: https://prfree.org/submit.php?v=free
Newsroom: https://prfree.org/@americanservicesar
Account: americanservicesar / American$ervices@R2 / office@americanservicesar.com

## SUBMISSION WORKFLOW (how to fill forms via Chrome MCP)

PRFree uses `name` attributes, NOT `id` attributes on most fields. Use:
```js
document.querySelector('[name="title2020"]')   // headline
document.querySelector('[name="summary"]')      // summary
document.querySelector('#inputBody')            // body (has id)
document.querySelectorAll('[name^="tag"]')      // tags 1-8
document.querySelector('[name="issued_by"]')
document.querySelector('[name="email"]')
document.querySelector('[name="country"]')      // SELECT element
document.querySelector('[name="address1"]')
document.querySelector('[name="address2"]')
document.querySelector('[name="phone"]')
document.querySelectorAll('input[name="categorySelected[]"]')  // checkboxes
```

## FIELD RULES (hard limits — violating causes rejection or failure)

| Field | Rule |
|---|---|
| Headline (title2020) | Max 120 chars, min 20 chars |
| Summary | **Max 250 chars**, min 50 chars — always check `.length` before submitting |
| Body (inputBody) | Max 10,000 chars, min 150 chars |
| Tags | 3-8 tags — fill tag1 through tag8 |
| Issued By | Max 50 chars — use **"American Services AR"** (company, not person name) |
| Email | Max 50 chars |
| Country | Must select from dropdown — use: `for loop on countrySelect.options, match .text === 'United States'` |
| Address | **LEAVE BLANK** — do not enter home/business address |
| Phone | Use 501-289-5623 |
| Categories | Max 3 checkboxes — PRFree silently ignores 4th+ checked boxes |

## CAPTCHA
- PRFree requires manual CAPTCHA click on every submission
- form.submit() / requestSubmit() returns captcha error — cannot automate
- Workflow: fill via JS → user clicks CAPTCHA → user clicks Submit → user confirms "submitted"

## CATEGORY IDs (for `categorySelected[]` checkboxes)
- Construction: 58
- Services: 132
- Regional: 123
- Home: 84
- Business: 56
- Automotive: 49

## CONTENT RULES
- "Issued By" = **American Services AR** (company name, not Anthony Sons — gets SEO credit)
- "veteran-owned" is WRONG — use **"locally owned and operated"**
- "serving since" = **2015** (not 2021)
- Commercial/industrial PRs first, then residential
- Each PR needs distinct angle — don't repeat same service twice

## PRIORITY ORDER FOR PR TOPICS
1. High-dollar commercial first (fleet washing, dryer vent, parking lot, commercial building)
2. Commercial niche (restaurants, property managers, construction cleanup)
3. City-specific (Little Rock & Conway heavy focus, Maumelle, then secondary cities)
4. Residential (house washing, roof, gutters, driveway, windows last)

## PRs SUBMITTED (May 2026 batch)
1. Fleet Washing — Mobile Commercial
2. Apartment/HOA Dryer Vent Cleaning
3. Parking Lot Sealcoating & Striping
4. Deck & Fence Cleaning
5. Bryant & Sherwood City PR
6. Post-Construction Cleanup (Commercial + Industrial + Residential)
7. Commercial Building & Facility Pressure Washing
8. Commercial Gutter Cleaning & Maintenance
9. Commercial Holiday Lighting
10. Commercial Soft Washing
11. Restaurant & Food Service Exterior Cleaning
12. Commercial Property Management Maintenance Programs
13. Residential Roof Soft Washing
14. Residential House Washing & Soft Washing
15. Residential Gutter Cleaning & Guard Installation
16. Residential Driveway & Concrete Pressure Washing
17. Little Rock & Conway — Primary Markets
18. Maumelle — City Expansion
19. Window Cleaning — Residential & Commercial

## TRACKER SHEET
Google Sheet ID: 1SCrKzT_EMui-Z6uNYLPskS7jFCtprh6AyJnEe0AZehs
Tab 1: PR Schedule & Tracker (all submissions, dates, status, reset dates)
Tab 2: Ranking Tracker (30 keywords, monthly ranking log, change log)

## SITES STILL PENDING
- PRLog: NLR + Benton PRs — manual login required (files: PR_NLR.txt, PR_Benton.txt in Downloads)
- PR.com: Soft Washing PR — file: PR_SoftWash_PRcom.txt
- i-Newswire: SSL error — check later
- 24-7PressRelease: $49 Basic plan only (free plan = $29 site-only, no distribution)

## RESET SCHEDULE
- PRFree: UNLIMITED — no reset needed, submit anytime
- PRLog: 2 per week, resets every Monday
- OpenPR: 1 per 30 days (~May 26 next)
- PR.com: 1 per month (June 1 next)
