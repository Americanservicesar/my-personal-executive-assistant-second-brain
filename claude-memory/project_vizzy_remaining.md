---
name: Vizzy Agent - Remaining Items
description: Incomplete tasks from Vizzy (Agent 1) optimization that need manual setup or future work
type: project
---

## Vizzy Agent 1 — Remaining Checklist

### Nodes Not Yet Added (need credentials created first)
- [ ] **HighLevel - Contacts (Vizzy)** — needs `highLevelOAuth2Api` credential created via n8n UI (OAuth2 app setup in GHL, not private integration token)
- [ ] **HighLevel - Opportunities (Vizzy)** — same credential as above
- [ ] **HighLevel - Tasks (Vizzy)** — same credential as above

**Why:** HighLevel Tool v2 in n8n requires OAuth2 credentials. The existing `highLevelApi` credential (private integration token `pit-...`) is incompatible. Anthony needs to create an OAuth2 app in GHL Settings → Integrations → Marketplace Apps, get Client ID + Client Secret, then create a HighLevel OAuth2 credential in n8n.

**How to apply:** Once credential exists, I can push the 3 nodes via REST API in one pass.

### Gmail Account Separation
- [ ] **4 Gmail tool nodes share one OAuth2 credential** (`BzBgoySpZrWPcE09`) — if each email account (sales@, office@, asons@, sonsfamily2012@) needs its own OAuth credential, 3 additional Gmail OAuth2 credentials need to be created in n8n and reassigned.

### Agents 2-12 Not Yet Started
- [ ] Agent 2: Milli (Sales Manager)
- [ ] Agent 3: Penn (Copywriter)
- [ ] Agent 4: Emmie (Email Marketing)
- [ ] Agent 5: Soshie (Social Media)
- [ ] Agent 6: Buddy (Business Development)
- [ ] Agent 7: Cassie (Customer Support)
- [ ] Agent 8: Seomi (SEO Specialist)
- [ ] Agent 9: Scouty (Recruiter)
- [ ] Agent 10: Gigi (Personal Growth Coach)
- [ ] Agent 11: Commet (eCommerce Manager)
- [ ] Agent 12: Dexter (Data Analyst)
