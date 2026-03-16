---
name: commercial-lead-hunter
description: >
  Finds, researches, and compiles commercial leads for American Services AR into
  structured, ready-to-use prospect lists. Use this skill whenever Anthony needs
  to find new commercial clients, build a target list, research a market segment,
  or identify properties or companies that need pressure washing, fleet washing,
  parking lot maintenance, gutter installation, construction cleanup, or any other
  ASAR service. Trigger for requests like "find me commercial leads", "build a
  prospect list", "who should we be targeting", "find apartment complexes near X",
  "research property management companies in Arkansas", "find construction projects
  we could bid on", "give me 20 industrial facilities to call", or any variation
  involving finding new business opportunities, building call lists, or identifying
  target accounts. Also trigger when Anthony says "who should Milli be calling" or
  "feed the pipeline" — this skill fills the top of the sales funnel.
---

# Commercial Lead Hunter

Finds and organizes commercial prospects for American Services AR into structured
lead lists, ready for outreach by Milli (Sales) or Emmie (Email).

---

## Lead Categories

| Segment | Best Services to Pitch | Priority |
|---|---|---|
| Apartment Complexes | Pressure washing, parking lots, gutters | High |
| Property Management Companies | Full-service maintenance contracts | High |
| Construction Projects (new builds) | Final clean, pressure wash, gutters | High |
| Industrial Facilities | Fleet washing, industrial cleanup | High |
| Commercial Retail Centers | Parking lot, pressure washing | Medium |
| Government/Municipal Properties | Pressure washing, snow, maintenance | Medium |
| Trucking & Fleet Companies | Fleet & heavy equipment washing | High |
| HOAs | Pressure washing, concrete, gutters | Medium |

---

## Workflow

### Step 1 — Clarify the Hunt

Before searching, confirm:
- **Segment**: Which category above? (or "all" for a broad sweep)
- **Geography**: Which city/county/radius? (default: Central Arkansas — Conway, Little Rock, Benton, Bryant, Sherwood, North Little Rock)
- **Output size**: How many leads? (default: 20–25 actionable leads)
- **Purpose**: Cold call list, email campaign, or bid research?

If Anthony gives a quick request like "find apartment complexes", use smart defaults and proceed.

---

### Step 2 — Research Sources

Use web search across these source types:

**For Apartment Complexes & Property Management:**
- Search: `"apartment complex" [city] Arkansas property management`
- Search: `"property management company" Conway OR "Little Rock" OR Benton Arkansas`
- Look for: Company name, address, number of units/properties, management contact

**For Construction Projects:**
- Search: `"new construction" OR "building permit" [city] Arkansas 2025 2026`
- Search: `site:buildzoom.com OR site:permitsonline.com [city] Arkansas commercial`
- Look for: Project name, GC name, address, stage (active = best), completion date

**For Industrial & Fleet:**
- Search: `trucking company [city] Arkansas fleet`
- Search: `industrial facility OR warehouse [city] Arkansas`
- Look for: Company name, fleet size hint, physical address, decision-maker title

**For Retail & Commercial:**
- Search: `shopping center OR retail plaza [city] Arkansas property management`
- Google Maps searches for commercial districts in target cities

**For Government/Municipal:**
- Search: `[city] Arkansas facilities maintenance bid OR RFP pressure washing`
- Check: arkansas.gov, city municipal sites, SAM.gov for federal

---

### Step 3 — Build the Lead List

Compile results into a structured table. Always include:

| # | Company / Property Name | Type | City | Address | Est. Size | Contact Name | Phone/Email | Best Service Pitch | Source | Priority |
|---|---|---|---|---|---|---|---|---|---|---|

**Scoring priority:**
- 🔴 **Hot** — Large property, clear need, easy to reach decision-maker
- 🟡 **Warm** — Good fit, contact info partial or needs research
- 🟢 **Cold** — Good segment match, contact info unknown

---

### Step 4 — Add Intel Notes

For each lead, add a brief "Pitch Note" — one sentence on WHY they need ASAR services:
- Apartment: "High-traffic parking + exterior = recurring maintenance opportunity"
- Construction: "New build completing Q2 — needs final pressure wash + gutters before turnover"
- Fleet: "30+ trucks based locally — mobile fleet washing saves them downtime"

---

### Step 5 — Output Format

Deliver the list in this order:
1. **Summary table** (all leads, sorted by priority)
2. **Top 5 Hot Leads** — expanded detail with suggested first contact script opener
3. **Routing note** — flag for Milli (calls) or Emmie (email sequences) or both
4. **Next step suggestion** — what to do with this list (e.g., "Load into GHL, assign to Milli for call blitz this week")

---

## Output Standards

- Always produce a copy-paste ready table (markdown)
- Include source URL where available so Anthony can verify
- Flag any lead that could be a **contract/recurring** opportunity (mark with ♻️)
- Flag any lead that could be a **$5K+ single job** (mark with 💰)
- Keep notes sharp — one line per lead, no fluff

---

## Handoff Tags

After delivering the list, always add:
> **→ Milli** (sales outreach) | **→ Emmie** (email campaign) | **→ Buddy** (partnership angle if applicable)

---

## Example Trigger Phrases
- "Find me 20 apartment complexes in Little Rock"
- "Build a fleet washing prospect list for Conway"
- "Who should we be targeting for construction cleanup this spring?"
- "Find property management companies in Central Arkansas"
- "Give Milli a call list for this week"
- "Feed the commercial pipeline"
