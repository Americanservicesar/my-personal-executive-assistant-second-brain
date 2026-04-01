---
name: lead-platform-manager
description: >
  Manages business profiles, content posting, and lead responses on lead generation
  platforms — HomeAdvisor, Nextdoor, Thumbtack, Angi, and Yelp. Use this skill
  whenever Anthony needs to manage these platform profiles, respond to leads,
  post updates, track lead performance, or optimize listings. Trigger for "check
  HomeAdvisor", "respond to Thumbtack leads", "post on Nextdoor", "update our Yelp
  profile", "how are our lead platforms doing", "manage our listings", or any
  variation involving these lead generation and business listing platforms.
---

# Lead Platform Manager (Soshie + Milli)

Manages business profiles, posts content, responds to leads, and tracks
performance on HomeAdvisor, Nextdoor, Thumbtack, Angi, and Yelp.

---

## Platforms

| Platform | Profile Type | Lead Type | Cost Model | Notes |
|----------|-------------|-----------|-----------|-------|
| **HomeAdvisor** | Pro listing | Inbound leads (phone + form) | Pay-per-lead | High volume, variable quality |
| **Nextdoor** | Business page | Recommendations + direct messages | Free posts, paid ads optional | Hyper-local trust, great for residential + small commercial |
| **Thumbtack** | Service listing | Matched leads (you bid on them) | Pay-per-lead or subscription | Good for specific services |
| **Angi** | Business listing | Inbound leads + reviews | Free listing, paid placement | Combined with HomeAdvisor now |
| **Yelp** | Business page | Inbound via search + reviews | Free, paid ads optional | Reviews heavily influence local decisions |

---

## Workflow

### Step 1 — Profile Management

For each platform, maintain:
- Business name, address, phone (consistent across all)
- Service list (all ASAR service lines)
- Service area (Central Arkansas cities)
- Photos: before/after, equipment, crew, completed jobs
- Business hours
- Licensing/insurance info

**Update profiles quarterly** or when services/areas change.

### Step 2 — Content Posting

**Nextdoor (weekly):**
- Business recommendations
- Job completion photos
- Seasonal tips
- Special offers for neighbors
- Community engagement (respond to local posts)

**HomeAdvisor / Angi:**
- Update project photos
- Respond to all reviews (positive and negative)
- Keep service list current

**Thumbtack:**
- Update service descriptions
- Respond to quote requests within 1 hour (speed matters)
- Keep pricing competitive

**Yelp:**
- Respond to all reviews within 24 hours
- Update photos quarterly
- Post offers/updates

### Step 3 — Lead Response

| Platform | Response Target | Who Handles | Routing |
|----------|----------------|-------------|---------|
| HomeAdvisor | Within 30 min | Milli (hot lead) | → Milli for call, log in GHL |
| Thumbtack | Within 1 hour | Milli (bid on lead) | → Milli for response, log in GHL |
| Nextdoor | Within 2 hours | Soshie (respond) → Milli (if lead) | → Milli if commercial opportunity |
| Angi | Within 1 hour | Milli (hot lead) | → Milli for call, log in GHL |
| Yelp | Within 24 hours | Cassie (review) / Milli (inquiry) | → Cassie for review response |

### Step 4 — Review Management

- Respond to ALL reviews on ALL platforms
- Positive reviews: Thank them, mention the service/property specifically
- Negative reviews: Acknowledge, apologize, offer to make it right, take offline
- Route positive review screenshots to Soshie for social media content
- Route negative review patterns to Cassie for service improvement

### Step 5 — Track Performance

Monthly, update `memory/marketing.md` → Lead Platform Performance:
- Leads received per platform
- Leads converted per platform
- Revenue per platform
- Cost per lead per platform
- ROI per platform

---

## Example Trigger Phrases
- "Check our HomeAdvisor leads"
- "Post on Nextdoor about our spring special"
- "Respond to this Thumbtack request"
- "How are our lead platforms performing?"
- "Update our listings on all platforms"
- "We got a bad Yelp review — handle it"

---

## Learning Protocol

1. **Monthly:** Update `memory/marketing.md` → Lead Platform Performance with fresh metrics
2. **Track cost per lead:** Calculate by platform — pause platforms with terrible ROI
3. **Track conversion by platform:** Which platforms produce leads that actually close?
4. **When lead converts:** Log source platform to `memory/clients.md` → Lead Conversion Funnel
5. **When review received:** Log to `memory/agent-performance.md` under Cassie (if she requested it)
6. **Quarterly:** Review platform ROI — recommend budget shifts (e.g., "Thumbtack costs 3x more per lead than Nextdoor with same close rate — shift budget")
