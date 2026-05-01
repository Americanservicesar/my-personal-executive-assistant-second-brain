---
name: Commercial Pipeline Routing Rule
description: Any lead with a business name goes into the Commercial Master Pipeline, not Residential
type: feedback
date: 2026-05-01
---
Any lead that includes a company/business name must be routed to the **Commercial Master Pipeline** (`OyuNwhoc79Lb8YS7h3kg`), starting at stage "New Commercial Lead" (`deb10121-eaa4-49ac-be06-7aa266a0bd0b`).

**Why:** Commercial jobs (churches, apartments, businesses) have a different sales process vs. residential estimate flow.

**How to apply:**
- Business name present -> Commercial pipeline, tag `commercial`
- No business name -> Residential pipeline (`STK7CNhP5z1pNmtMckPM`)
- Add this rule to Vizzy's system message in the lead intake section.
- Examples: "Central Baptist Church" -> commercial. Individual homeowner -> residential.
