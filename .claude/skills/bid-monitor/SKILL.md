---
name: bid-monitor
description: >
  Finds, monitors, and alerts Anthony to active commercial bids, RFPs, government
  contracts, and construction opportunities that match American Services AR's
  service lines. Use this skill whenever Anthony needs to find open bids, check
  bid boards, discover government contracts, monitor RFPs, or identify upcoming
  public projects that ASAR could win. Trigger for requests like "find open bids",
  "check for RFPs", "any government contracts for pressure washing", "what bids
  are out there", "find construction cleanup bids in Arkansas", "monitor bid
  boards", "are there any active tenders for property maintenance", "find me
  something to bid on", or any variation involving public procurement, contract
  opportunities, or competitive bidding. Also trigger when Anthony says "what
  should we be bidding on" or "find work we can bid" — this skill fills the
  pipeline with contract-level opportunities.
---

# Bid Monitor & Alert

Finds active bids, RFPs, and public contract opportunities across Arkansas that
match American Services AR's service lines — pressure washing, fleet washing,
parking lot maintenance, gutter installation, construction cleanup, snow/ice,
and commercial property maintenance.

---

## Target Bid Sources

### Government & Public Procurement
| Source | URL | What's There |
|---|---|---|
| **AR Bid Online** ⭐ | arbid.arkansas.gov | Central hub — Conway + multiple AR cities post here; register once, get notified for all |
| Arkansas State Procurement (SAS) | sas.arkansas.gov/procurement | State agency RFPs, IFBs, and open bids |
| Arkansas Building Authority | sas.arkansas.gov/building-authority/bid-announcements | State facility construction and maintenance bids |
| City of Little Rock Procurement | littlerock.gov/procurement | Municipal contracts — cleaning, maintenance, facilities |
| City of Conway Procurement | conwayarkansas.gov/procurement | Posts directly to AR Bid; 1111 Main St Conway |
| SAM.gov | sam.gov | Federal contracts (EPA cleanup, GSA facilities, USDA) |
| Arkansas APEX Accelerator | uaex.uada.edu/business | Free help finding + competing for government contracts |
| Faulkner County | faulknercountyar.net | County facility contracts |
| Pulaski County | pulaskicounty.net | County contracts |

### Construction Bid Boards
| Source | URL | What's There |
|---|---|---|
| BuildZoom | buildzoom.com | Active permits + contractor activity |
| iSqFt | isqft.com | Commercial construction projects |
| Dodge Construction Network | construction.com | Pre-bid project leads |
| ConstructConnect | constructconnect.com | Invited bids + open RFPs |

### Property Maintenance Tenders
| Source | What to Search |
|---|---|
| Apartments.com / NMHC member portals | Large PM companies posting vendor RFQs |
| LinkedIn + Google | "[company] vendor RFP 2026 Arkansas" |
| Local news / Arkansas Business | Public project announcements |

---

## Workflow

### Step 1 — Clarify the Search

Confirm before searching:
- **Scope**: Government only, construction only, or full sweep?
- **Service lines**: All services or specific ones? (default: all)
- **Geography**: Statewide or specific counties/cities? (default: Central Arkansas)
- **Urgency**: Due soon (under 30 days) or full open pipeline?

If Anthony says "find bids" with no extra context, run a full sweep across all sources.

---

### Step 2 — Search Execution

Run targeted searches across these query patterns:

**Government / Public:**
- `site:arkansas.gov "pressure washing" bid OR RFP 2026`
- `"City of Conway" OR "City of Little Rock" "request for proposal" maintenance 2026`
- `Arkansas "bid opening" "pressure washing" OR "janitorial" OR "facility maintenance"`
- `sam.gov Arkansas "cleaning" OR "facility maintenance" OR "grounds maintenance"`
- `Arkansas county "invitation to bid" 2026 cleaning OR washing OR maintenance`

**Construction Projects (cleanup opportunities):**
- `"building permit" Conway OR "Little Rock" OR Benton Arkansas 2026 commercial`
- `"new construction" Central Arkansas 2026 commercial site:buildzoom.com`
- `Arkansas general contractor "final clean" OR "construction cleanup" subcontractor`
- `Arkansas "certificate of occupancy" commercial 2026` (nearly-complete buildings)

**Fleet & Industrial:**
- `Arkansas "fleet maintenance" OR "fleet washing" RFQ vendor 2026`
- `Arkansas industrial facility "maintenance contract" 2026 bid`

**Snow & Ice (seasonal Oct–Mar):**
- `Arkansas municipality "snow removal" OR "ice management" contract 2026`
- `"request for proposal" "snow plowing" Arkansas county 2026`

---

### Step 3 — Qualify Each Opportunity

Score every bid found against these criteria:

| Criteria | Points |
|---|---|
| Matches ASAR service line exactly | +3 |
| Located in Central Arkansas (within 90 min) | +3 |
| Due date > 7 days away (enough time to bid) | +2 |
| Estimated value $5K+ | +2 |
| Public entity (government = easier to enter) | +1 |
| Contact/specs available to download | +1 |

**Score 10–12 = 🔴 Bid Now | 7–9 = 🟡 Review | 4–6 = 🟢 Monitor | <4 = Skip**

---

### Step 4 — Output Format

Deliver results as:

#### Active Bid Alerts

| # | Opportunity | Issuing Entity | Service Match | Due Date | Est. Value | Score | Action |
|---|---|---|---|---|---|---|---|

#### For each 🔴 Bid Now opportunity, include:
- **What they need** — one sentence summary
- **Why ASAR wins this** — our competitive advantage for this specific bid
- **Next step** — exactly what to do (download specs, call contact, register on portal)
- **Deadline countdown** — X days remaining

#### No Bids Found?
If no active bids match, deliver:
1. A list of the portals checked + when to check back
2. 3 upcoming bid opportunities likely to open based on government fiscal cycles
3. A proactive suggestion (e.g., "Conway's FY budget cycle starts in June — submit a vendor registration now")

---

### Step 5 — Routing & Follow-Up

After delivering alerts, always output:

**→ Action Items:**
- Bids to submit this week (ranked by score)
- Portals to register on if not already (one-time setup)
- Contacts to call before submitting (relationship before paper = higher win rate)

**→ Agent Routing:**
- **→ Buddy** — Relationship outreach before bid submission
- **→ Penn** — Write the bid proposal / scope of work
- **→ Milli** — Call the contact listed on the bid before submitting
- **→ Dexter** — Track win/loss rate on bids over time

---

## Key Arkansas Portals to Register On (One-Time Setup)

Register ASAR on these portals to receive automatic bid notifications:

| Portal | URL | Cost | Priority |
|---|---|---|---|
| **AR Bid Online** ⭐ | arbid.arkansas.gov | Free | Do this first — covers Conway + 20+ AR cities in one registration |
| Arkansas State Procurement (SAS) | sas.arkansas.gov/procurement/vendor-resources | Free | State agency bids |
| SAM.gov | sam.gov | Free | Required for all federal contracts |
| City of Little Rock | littlerock.gov/procurement | Free | LR municipal bids |
| Arkansas APEX Accelerator | uaex.uada.edu/business | Free | Free coaching on winning government bids |
| DemandStar | demandstar.com | Paid | Notifies of local gov bids statewide |
| ConstructConnect | constructconnect.com | Paid | Commercial construction bid board |

---

## Bid Calendar (Proactive Monitoring)

Some bid types are predictable by season:

| Month | What to Watch For |
|---|---|
| Jan–Feb | Snow removal contract renewals, new fiscal year RFPs |
| Mar–Apr | Spring exterior maintenance contracts, construction site cleanup season starts |
| May–Jun | Summer facility maintenance RFPs, parking lot contracts |
| Jul–Aug | State fiscal year renewal bids (AR fiscal year = July 1) |
| Sep–Oct | Snow/ice management RFPs for upcoming winter |
| Nov–Dec | Year-end emergency contracts, budget spending |

---

## Example Trigger Phrases
- "Find open bids in Arkansas for pressure washing"
- "Check the bid boards — anything for us?"
- "What government contracts are we missing?"
- "Are there any RFPs for facility maintenance?"
- "What should we be bidding on this month?"
- "Find construction cleanup bids near Conway"
- "Any snow removal contracts coming up?"
