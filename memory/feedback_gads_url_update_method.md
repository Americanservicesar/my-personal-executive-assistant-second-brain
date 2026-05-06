---
name: Google Ads Final URL Update — Method & Lessons
description: Bulk Final URL update via n8n API failed; Chrome MCP UI approach succeeded. Key lessons on n8n auth + API versions.
type: feedback
last_updated: 2026-05-06
originSessionId: b24e5b60-f5fe-476b-89f9-ab1fc617db72
---
## What We Were Doing
Bulk-update Final URLs on all Pressure Washing campaign ads (account 4598481846) to `https://americanservicesar.com/pressure-washing/`

## What Failed: n8n Webhook + Google Ads API Approach

### Failure 1 — Wrong API Version
- Google Ads API v17, v18, v19 are **sunset** — they return HTML 404, not JSON
- **Fix**: Always use `API_VER = "v20"` (current as of 2026-05)

### Failure 2 — n8n `googleOAuth2Api` Does NOT Inject Auth
- The n8n HTTP Request node with `predefinedCredentialType: "googleOAuth2Api"` does NOT inject the Bearer token automatically
- It only works for certain native credential types (e.g. `googleDriveOAuth2Api`)
- `genericCredentialType: "oAuth2Api"` also fails because the credential is type `googleOAuth2Api`, not `oAuth2Api`
- Result: every Google Ads API call returned 401 UNAUTHENTICATED
- **No clean fix found via n8n API** — would need to access the OAuth token out-of-band

### Root Cause Summary
n8n cloud's HTTP Request node `predefinedCredentialType` auth injection only works for a specific allowlist of credential types. Generic Google OAuth2 is NOT in that list. The credential exists and works fine in the UI, but cannot be used for custom API calls via the HTTP Request node.

## What Worked: Chrome MCP + Google Ads UI

### Method
1. Navigate to Google Ads → Campaigns → Pressure Washing → Ads
2. Select all 44 ads (click checkboxes → "Select all 44")
3. Edit → Change ads → Make changes to: Responsive search ads → Edit: Final URL
4. Enter `https://americanservicesar.com/pressure-washing/`
5. Click Apply

### Results
- **20 Responsive Search Ads** updated — new versions created, "Under review / Pending" status, +1 indicator confirmed
- **~24 Expanded Text Ads** — Google deprecated ETAs in 2022, marked "No longer available," cannot be edited by anyone
- Final URL verified in ad editor: `https://americanservicesar.com/pressure-washing/` ✅

### Key Chrome MCP Notes
- Google Ads is an Angular SPA — JS-dispatched mouse events are ignored by Angular components
- Must use Chrome MCP `computer` tool for native clicks (not `left_click` on the page directly when Angular intercepts)
- Ad blocker was hiding ads in the table — removing the "Policy approval status: Disapproved" filter revealed all ads

## Future Reference
- For Google Ads bulk URL updates: always use the UI method above (Edit → Change ads → Final URL)
- n8n + Google Ads API is viable only if you can pass the Bearer token from an external source (not via predefinedCredentialType)
- Pressure Washing campaign ID: `14486263322`
- ASAR advertiser account: `4598481846` (display: 287-518-9149)
- MCC/manager account: `9578217886` (display: 957-821-7886) — login-customer-id for API calls
