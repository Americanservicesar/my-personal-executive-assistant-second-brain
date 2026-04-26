---
name: Seomi Google API Setup
description: OAuth2 credential setup for Search Console, GA4, GBP — what works, what doesn't, custom OAuth client details
type: feedback
---

## Working Auth Configuration (as of 2026-04-05)

All 3 Google API tools use `googleOAuth2Api` credential (ID: dMFkHV4KEbioauC6):
- Google Search Console — googleOAuth2Api
- Google Analytics 4 (Property ID: 315915509) — googleOAuth2Api
- Google Business Profile — googleOAuth2Api

Custom OAuth2 client (in Google Cloud project famous-cache-375522):
- Client ID: 438510860572-mut7d43npjp2cvlo4rshimlmug6gised.apps.googleusercontent.com
- Redirect URI: https://oauth.n8n.cloud/oauth2/callback

Scopes configured:
```
https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.email
```

Note: `userinfo.profile` scope is INVALID for this client — causes error 400.

## Google Cloud APIs Enabled
- Search Console API
- Google Analytics Data API
- My Business Business Information API
- Business Profile Performance API
- My Business Account Management API

## What Didn't Work
- Service account (`googleApi`) for GA4 — "Unable to sign without access token"
- Service account for GBP — pending invite that can't be accepted
- n8n's built-in OAuth client (438510860572-ebjbtnsbm0r2sntqflj0lrbvav3qnr60) — redirect_uri_mismatch for custom scopes
- Google Analytics API (old UA) — dead, use Analytics Data API instead
