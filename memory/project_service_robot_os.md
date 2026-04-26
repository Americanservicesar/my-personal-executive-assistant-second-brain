---
name: Service Robot OS Build Plan
description: Enterprise autonomous lead-to-booked-job system for ASAR — GHL + n8n + ElevenLabs. Full plan in Google Doc and local plan file. Ready to execute in sessions.
type: project
---

## Status
Plan APPROVED — ready to execute session by session.

## Plan Files
- **Local plan file**: `C:\Users\sales\.claude\plans\abstract-churning-brook.md`
- **Google Doc**: https://docs.google.com/document/d/1mu0Fi1zilzkJzXrhGijdDiRhIbDrkhz8621GR82NKSo/edit (saved to sales@ Google Drive)

## Architecture (Final Decisions)
- **GHL** = CRM, pipeline, contacts, SMS/email delivery, forms, funnels, reputation
- **n8n** = ALL intelligence (voice AI, text AI, prospecting, estimates, HCP sync, reports)
- **ElevenLabs** = Voice (NOT GHL Voice AI — too basic; ElevenLabs Turbo v2.5, "Bella" or custom clone)
- **Twilio** = Already in GHL (50% markup). May need separate Twilio account for Voice AI — Anthony to decide
- **LLM** = GPT-4o-mini for high-volume text/voice, Claude Sonnet 4.6 for complex reasoning
- **GHL botServiceEnabled** = NOT NEEDED — voice built entirely in n8n, bypasses GHL AI

**Why:** GHL + n8n integration pattern: GHL fires webhook → n8n processes with AI → n8n calls GHL API to update. Seamless — GHL logs everything as if human sent it.

## 9 Build Sessions
| Session | Phase | Goal | Prereqs |
|---|---|---|---|
| 1 | Phase 0 | Emergency fixes — publish stage 2-3 workflows, custom values/fields, re-engage 44 stuck leads | None (Claude does it) |
| 2 | Phase 1A | Estimate engine — n8n price calc + GHL integration | Pricing session with Anthony first |
| 3 | Phase 1B | Full residential pipeline + HCP sync | Session 2 done |
| 4 | Phase 2 | Text AI brain (SMS/chat handled by AI) | Session 3 done |
| 5 | Phase 3 | Voice AI "Mia" (ElevenLabs + Twilio + n8n) | ElevenLabs API key from Anthony |
| 6 | Phase 4 | Commercial pipeline activation | Session 4 done |
| 7 | Phase 5 | Buddy commercial prospector (day-of-week vertical rotation) | Max Marketing domain names from Anthony |
| 8 | Phase 6 | Intelligence layer (Dexter learns, all agents improve weekly) | Session 7 done |
| 9 | Phase 7 | Tech pay-for-performance | Pay structure from Anthony |

## Critical Audit Findings
- 44 leads stuck in "New Lead" — stage 2 + 3 workflows are DRAFT
- All commercial pipeline workflows DRAFT — 0 automation, 0 opportunities
- Conversation AI: 3 bots, 0 bookings in 30 days, missing booking action node
- Voice AI: 0 agents (not needed — building in n8n instead)
- Missing custom fields: Estimate Amount, Ballpark Low/High, HCP Job ID, workflow_id, AI Handled

## Agent Assignments (no new agents needed)
- Voice AI Mia = standalone n8n workflow (feeds Milli)
- Text AI brain = n8n using Milli + Cassie personas
- Commercial Prospector = BUDDY (update his system message + workflow)
- Weekly Intelligence/Learning = DEXTER (extend his system message)
- Post-job reviews = CASSIE (already her job)
- 1-year nurture coupon = EMMIE (already her job)
- Commission tracking (Max Marketing) = DEXTER
- Social auto post = SOSHIE via existing "Ultimate Media Agent" n8n workflow (DO NOT REBUILD)

## Max Marketing Gutter Websites (verified 2026-04-10)
- www.conwaygutter.com ✅ LIVE → source_maxmktg_conway_gutter | phone: 501-504-7139
- www.littlerockgutter.com ✅ LIVE → source_maxmktg_lr_gutter | phone: 501-725-8112
- www.bentongutter.com ✅ LIVE → source_maxmktg_benton_gutter | phone: 501-430-3723
- www.northlittlerockgutters.com ✅ LIVE → source_maxmktg_nlr_gutter | phone: 501-502-2310
- www.maumellegutters.com → source_maxmktg_maumelle_gutter | phone: currently forwards to 501-932-8681 (Anthony answers manually) — needs dedicated GHL Twilio number + Max Marketing forward update + n8n routing added (same setup as other 4 sites) — Session 5 prereq
- www.bryantgutter.com ❌ DOWN (error page) → source_maxmktg_bryant_gutter
- www.sherwoodgutters.com ⚠️ SSL EXPIRED (Cloudflare 526) → source_maxmktg_sherwood_gutter — tell Anthony to contact host to fix SSL cert
- NOTE: "Max Marketing Jacksonville Gutter" source found on 1 contact (ROBERT LEWIS) — no Jacksonville site exists, tag removed, source was likely data entry error
- Session 1 complete: all gutter contacts tagged with source_maxmktg_* format (21 contacts)
- Gutter leads come via email parser (already set up) — text bot collects address after contact is created
- Voice AI gutter number: 501-381-3885 — all 4 Max Marketing sites forward here (Anthony asking Max Marketing to change forward from 501-932-8681 to this number)
- Per-site tracking still works: n8n reads `To` field on inbound call → 501-504-7139=Conway, 501-725-8112=LR, 501-430-3723=Benton, 501-502-2310=NLR

## Phone Number Routing (GHL Twilio numbers)
- 501-289-5623 → Website/main (Voice AI — all services)
- 501-381-3885 → Gutters/Max Marketing (Voice AI — gutter-focused)
- 501-575-1109 → Residential Wash (Voice AI — PW/soft wash)
- 501-222-9962 → Fleet Wash (Voice AI — commercial, transfer big accounts)
- 501-214-5866 → GMB (Voice AI — all services)
- 501-406-0421 → Google Ads (Voice AI — high-intent, fast booking)
- 870-279-3119 → Anthony's personal cell (NEVER route through AI)

## Re-engagement (44 stuck leads) — Timing
DO NOT send until residential pipeline is 100% tested end-to-end. Runs as final step of Session 3 verification only.

## Anthony's Action Items (must happen before specific sessions)
- Session 1 prereq: Confirm re-engagement blast for 44 stuck leads
- Voice AI prereq: Create ElevenLabs account + provide API key; decide on Twilio (GHL number vs separate); provision dedicated GHL Twilio number for maumellegutters.com + ask Max Marketing to forward to it (same as other 4 sites)
- Pricing session: Confirm all service pricing BEFORE estimate engine is deployed (target avg ticket $350-550, 4 jobs/tech/day, repair min $125 trip charge)
- Commercial prospector prereq: Provide all 7 Max Marketing website domain names (need for UTM/commission tracking)
- Tech pay prereq: Define pay structure (base + KPI + upsell commission + review bonus)

## Max Marketing Commission
- 7 gutter websites owned by third party, earns 10% commission on gutter INSTALLS only
- Need: domain names → UTM tags → source_maxmktg_* GHL tags → Dexter commission tracker workflow
- Monthly: auto-calculate and report for Anthony review before payment

## Key Custom Values to Create (Session 1)
booking_link, google_review_link, n8n_estimate_webhook, n8n_text_webhook, guarantee, license_statement, owner_first_name, pricing floors (after pricing session)

## Re-engagement Clarification
- 44 stuck leads = submitted form/called but got ZERO follow-up (stage 2 was DRAFT)
- Blast = one-time SMS "still interested in a quote?" → respond YES → enter Attempting Contact (stage 2)
- Separate from 1-year anniversary re-engagement coupon (that's for past customers, 365 days after last job)

## Why: GHL + n8n
GHL cannot replace itself (CRM/messaging infrastructure). n8n cannot replace GHL. They work together — GHL is the database/communication layer, n8n is the brain. Keep all 3 platforms (GHL + HCP + n8n) until fully proven; revisit HCP drop after full build-out ($329/mo savings potential).
