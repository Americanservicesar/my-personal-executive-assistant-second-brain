# n8n Code Node — No Outbound HTTP

n8n cloud Code nodes cannot make any outbound HTTP calls — `$http`, `fetch`, `$helpers.httpRequest()`, and `require('https')` are all disallowed in the sandbox.

## Fix
Use Code nodes ONLY for data transformation. Use HTTP Request nodes for all API calls.

### Correct Pattern (applied 2026-05-01 — Address Processor HCP chain)
```
Prepare HCP Data (Code)
  → HCP Search Customer (HTTP GET /customers?query=name)
  → HCP Create Customer (HTTP POST /customers, continueOnFail=true)
  → Resolve HCP Customer ID (Code — phone/email match from search, fallback to created)
  → Build Estimate Body (Code — G/B/B or single option)
  → HCP Create Estimate (HTTP POST /estimates)
  → GHL Update Contact (HTTP PUT /contacts/:id)
  → GHL Update Opportunity (HTTP PUT /opportunities/:id)
```

## Why
n8n cloud enforces strict security restrictions on Code node execution environments. The sandbox blocks all outbound network access to prevent unauthorized external calls.

## Methods That Fail
- `$http.get()` → `$http is not defined`
- `fetch()` → `fetch is not defined`
- `$helpers.httpRequest()` → `$helpers is not defined`
- `require('https')` → `Module 'https' is disallowed`
