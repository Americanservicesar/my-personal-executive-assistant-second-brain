---
name: Instantly API Key Format
description: Instantly v2 API Bearer token must be sent as raw base64 string, NOT decoded to UUID:secret
type: feedback
---

Send the raw base64 string directly as the Bearer token — do NOT decode it.

**Why:** Instantly v2 API (`api/v2/`) uses the full base64 string as the Bearer token. Decoding it to `UUID:secret` format returns 401 "Invalid API key". The raw base64 string returns 200. Confirmed 2026-04-16 via browser fetch test.

**How to apply:** When configuring the `emmie-tl0` n8n node (HTTP - Instantly API), set:
- Header: `Authorization`
- Value: `Bearer YzI3YTdhODUtMGMxNy00ZTNkLWE1ZTktYzA0NDI1OGNlMjM5OkZSVEV2Y3JCd0daWQ==`

The current key is stored in `reference_master_credentials.md` and `agent_04_emmie.md`. If a new key is generated in Instantly (Settings → API Keys → Version 2), copy the full base64 string shown at creation and use it verbatim in the Bearer header.
