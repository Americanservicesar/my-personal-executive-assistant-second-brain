# Address Processor — HCP Placeholder Restructure

## Problem
The `HCP Placeholder` Code node tried to make outbound HTTP calls to HCP and GHL APIs but failed because n8n cloud Code nodes block all outbound HTTP.

## Solution (applied 2026-05-01)
Replaced single Code node (`HCP Placeholder`) with 8 proper nodes in workflow `d8xiKaMU7rZ0Ldxp` (ASAR Lead Address Processor):

| Node | Type | Purpose |
|------|------|---------|
| Prepare HCP Data | Code | Extract phone, email, name, address, prices |
| HCP Search Customer | HTTP GET | /customers?query=firstName+lastName |
| HCP Create Customer | HTTP POST, continueOnFail | /customers (skip if duplicate) |
| Resolve HCP Customer ID | Code | Phone/email match from search; fallback to created ID |
| Build Estimate Body | Code | G/B/B options with GutterRX/Leafblaster Pro |
| HCP Create Estimate | HTTP POST | /estimates |
| GHL Update Contact | HTTP PUT | Custom fields: HCP customer ID, address, prices |
| GHL Update Opportunity | HTTP PUT | monetaryValue = betterPrice |

## Connection Rewiring
- `Estimate Calculable [0]` → `Prepare HCP Data` (was → HCP Placeholder)
- Chain: each new node → next
- `GHL Update Opportunity` → `Wait 45s` (was HCP Placeholder → Wait 45s)

## Also Fixed
- `Send Ack SMS` node referenced `$('HCP Placeholder')` for price range; updated to `$('Prepare HCP Data').first().json.goodPrice` / `bestPrice`
