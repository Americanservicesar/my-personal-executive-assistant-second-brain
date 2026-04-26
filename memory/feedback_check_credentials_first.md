---
name: Always Check Credentials Before Asking
description: Always reference memory and master credentials sheet before asking Anthony for tokens or API keys
type: feedback
originSessionId: ccb3e528-01da-49dc-b07e-762b0b0108ff
---
Always check memory files and the master credentials sheet before asking Anthony for credentials, tokens, or API keys.

**Why:** Anthony keeps all credentials in memory and the master Google Sheet (ID: `17Waiy2_1t0JJ3B0KgHPde-ZJRweg27WexyTp2l3i4tI`). Asking when they're already documented wastes time.

**How to apply:** Before asking for any credential, token, or API key:
1. Check relevant memory files (reference_*.md files)
2. Read the master credentials sheet (ID: `17Waiy2_1t0JJ3B0KgHPde-ZJRweg27WexyTp2l3i4tI`) via Google Workspace MCP — read the FULL sheet, not just partial rows
3. Only ask or declare "NEEDS SETUP" if genuinely not found in either place
4. When reporting not found, confirm you checked the full sheet

**Also:** Always save newly obtained credentials/info to memory immediately — don't wait to be asked.

---

## STANDING RULE — Save All Credentials Immediately

**Whenever Anthony provides any of the following — save it to the master credentials sheet AND memory without being asked:**
- API key
- API secret
- Bearer / access token
- Private token / PIT token
- Password
- Account ID / location ID / workspace ID
- Webhook URL / endpoint
- Any other authentication credential

**How to save:**
1. Write to master Google Sheet (ID: `17Waiy2_1t0JJ3B0KgHPde-ZJRweg27WexyTp2l3i4tI`) — add row with: Service | Type | Value | Notes | Date
2. Update or create the relevant memory file (reference_master_credentials.md or service-specific reference)
3. Confirm saved in response — no need to ask first

**This applies regardless of context.** Even if Anthony shares a credential in passing, in a message, or as part of another instruction — save it immediately.
