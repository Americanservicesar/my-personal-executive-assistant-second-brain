---
name: Run Audit After Any Phase 3 (or Similar) Generation
description: After generating any WXR import files, PHP scripts, or batch content for ASAR, always run the audit script immediately — do not wait to be asked
type: feedback
---

After generating Phase 3 city pages (or any similar batch of WXR/PHP files), ALWAYS run the audit script immediately without being asked.

**Why:** The user explicitly said "I don't want to have to ask to audit again." Auditing after generation is mandatory, not optional.

**How to apply:**
1. After generating any batch of ASAR import files, run:
   `python3 C:/Users/sales/ASAR-Silo-Pages/audit_phase3.py`
2. Show the user the full audit results (pass/fail counts + any errors/warnings)
3. Fix any errors before handing off files
4. Only mark generation complete after 0 errors, 0 warnings

**Audit script location:** `C:/Users/sales/ASAR-Silo-Pages/audit_phase3.py`

**What it checks (16 checks per page, 143 pages = 107+ total checks):**
- File existence and count (39 files: 13 WXR + 13 fix.php + 13 meta.php)
- Item count per WXR (11 cities per service)
- Post IDs correct and unique (formula: 10000 + svc_idx*11 + city_idx)
- post_parent matches live pillar page ID
- City slugs correct
- post_status = draft
- Word count 600-950 (body text, excluding CSS/JS/schema)
- Phone 501-289-5623 present
- Required H2 sections present (What We Do, Why [City], Service Areas, Pricing, FAQ)
- Schema types: LocalBusiness + Service + BreadcrumbList
- RankMath meta: rank_math_title, rank_math_description, rank_math_focus_keyword
- Internal link to pillar page
- Internal link to city hub (/service-areas/[city]/)
- City name in content
- Local neighborhood/landmark terms present
- Fix PHP: security key, WP bootstrap, publish function, correct pillar ID
- Meta PHP: all 3 RankMath fields present

**If new services or cities are added:** Update audit_phase3.py constants (PILLAR_IDS, SERVICE_ORDER, CITY_ORDER, CITY_NEIGHBORHOODS) to match.
