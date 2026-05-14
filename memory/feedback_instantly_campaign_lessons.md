---
name: Instantly Campaign Lessons — Tracking, Subjects, Lead Quota
description: Key lessons from ASAR-01-Apartments campaign audit 2026-05-14
type: feedback
originSessionId: bdcb80a7-7e4c-4779-973e-e4aa123ce8da
---

## Lesson 1 — Never Upload Instantly Leads Back Into Instantly

**What happened**: 994 of 1,000 monthly upload credits were burned uploading leads that were FOUND in Instantly (via SuperSearch) back as a CSV. This is circular and wastes quota.

**Rule**: The monthly upload cap (1,000/mo) is for EXTERNAL lead sources only — leads you found outside of Instantly (Apollo, manual research, scrapers, etc.) uploaded as CSV.

**Instantly-native leads** (found via SuperSearch → Lead Lists) are moved to campaigns via:
- Lead List → Select All → Move → Move to Campaign → [Campaign Name] → Copy Leads ✅ → Confirm
- This does NOT use the upload quota. It's an internal move within Instantly.

**Never export a SuperSearch Lead List to CSV and re-upload it. The leads are already in Instantly.**

---

## Lesson 2 — Always Check Tracking Before Activating a Campaign

**What happened**: ASAR-01-Apartments ran 38 emails (10 leads × 4 steps) with:
- Open Tracking: OFF
- Link Tracking: OFF
- Delivery Optimization: ON (which also disables open tracking)

So we got zero visibility — 0 opens, 0 clicks, no data at all.

**Fix applied 2026-05-14**:
- Open Tracking: ON ✅
- Link Tracking: ON ✅
- Delivery Optimization: OFF ✅ (it disables open tracking — never leave this ON when you want tracking data)

**Rule**: Before activating ANY campaign, go to Options and verify:
1. Open Tracking = ON
2. Link Tracking = ON
3. Delivery Optimization = OFF (or accept that you'll have no tracking data)

---

## Lesson 3 — Subject Lines Must Sound Human, Not Like Marketing Hooks

**What was wrong**: Original subject lines were clever/fear-based:
- "What prospects see before they call you" — blog title vibes
- "Dryer vent fires — most complexes aren't..." — fear bait
- "96-unit complex in Benton — what changed..." — case study hook
- "Last note from me, {{firstName}}" — classic breakup email trick

Everyone who gets cold email recognizes these patterns immediately. They scream "automated sequence."

**Fix applied 2026-05-14** — replaced all 8 subject lines:
| Step | Variant | New Subject |
|------|---------|-------------|
| 1 | A | Pressure washing for your property |
| 1 | B | We clean breezeways, parking lots, and building exteriors |
| 2 | A | Dryer vent cleaning for apartment complexes |
| 2 | B | Parking lot striping and maintenance |
| 3 | A | Gutter cleaning and soft washing for your buildings |
| 3 | B | We work with property managers across Central Arkansas |
| 4 | A | Just checking in |
| 4 | B | Still here if you need exterior maintenance help |

**Rule**: If a subject line sounds like a blog post title or a marketing hook, cut it. If it sounds like what you'd type to a colleague in 10 seconds, keep it. Direct = human. Clever = spam filter.
