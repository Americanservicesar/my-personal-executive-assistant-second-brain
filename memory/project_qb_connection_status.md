---
name: QB Connection Status — n8n vs Browser
description: QB OAuth RESOLVED 2026-04-17. n8n credential T1Uyc7utOiuqYJWO now connected to real ASAR company (realmId 123146373988304) with Production keys.
type: project
originSessionId: e0b64290-e2c0-45f3-9e15-b56d8aedabce
---
## STATUS: ✅ RESOLVED — 2026-04-17

**Confirmed working:** Webhook `https://americanservicesar.app.n8n.cloud/webhook/dexter-qb` returns real ASAR data.
- `company: American Services AR`
- `realmId: 123146373988304`
- `open_ar_total: $33,697.16`

## What Was Fixed
1. **Root cause:** Intuit "ClaudeCode" app was in Development mode — Development apps can ONLY authorize the sandbox company.
2. **Fix 1:** Completed Intuit Go Live compliance tasks to put app IN PRODUCTION status.
3. **Fix 2:** Added Production redirect URI `https://oauth.n8n.cloud/oauth2/callback` to ClaudeCode app → Settings → Redirect URIs → Production tab (was missing, only had Playground URL).
4. **Fix 3:** Updated n8n credential `T1Uyc7utOiuqYJWO` with Production Client ID/Secret, reconnected to American Services AR.
5. **Fix 4:** Fixed QB IDS query — `>` operator not supported; changed to `SELECT * FROM Invoice ORDER BY DueDate DESC MAXRESULTS 100` and filter balance>0 in Code node.

## n8n QB Credential (PRODUCTION — WORKING)
- Credential ID: `T1Uyc7utOiuqYJWO`
- Client ID (Production): `AB7HOJCtdU7k1ecz20cAQSOAEURZZ4uMAF2neC2bpVnWltsSgo`
- Client Secret (Production): `fhcq3ElTZI82vBfI5UeB4CuETCgV0dONkI17fBAR`
- Environment: Production
- Connected to: American Services AR (realmId `123146373988304`)

## Test Workflow
- Workflow ID: `4Gu94FVzCVuq6tOe` ("Dexter — QB Data Pull Webhook")
- Webhook: `https://americanservicesar.app.n8n.cloud/webhook/dexter-qb`
- Returns: P&L, Balance Sheet, open invoices summary

## Intuit Developer App (ClaudeCode)
- App ID: `f865ea66-e1cb-43f3-91c4-f8ff580ac8bc`
- Status: IN PRODUCTION
- Workspace: Sample Workspace
- Production Redirect URIs: Playground URL + `https://oauth.n8n.cloud/oauth2/callback`

## Key Financial Data (live as of 2026-04-17)
- Open AR total: $33,697.16 (all overdue)
- 2025 Gross Receipts: $327,418.62
- Centennial Operating balance: ~$9,607.47
