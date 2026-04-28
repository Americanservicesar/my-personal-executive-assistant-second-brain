---
name: n8n HCP/GHL Lead Creation — Silent Failure Patterns
description: Two recurring bugs that cause Telegram→GHL/HCP lead intake to fail silently
type: feedback
originSessionId: 82a28ede-7bd6-4bb7-a292-2c623a220dad
---
**Bug 1 — HCP POST /customers fails silently with empty zip or empty mobile_number**
When Milli sends POST /customers with zip: "" or mobile_number: "", HCP returns a paginated customers LIST instead of a created customer record. The node shows executionStatus: success so Milli thinks it worked.
Why: HCP rejects invalid fields but returns 200 with a list, not an error.
Fix applied: Added ZIP LOOKUP TABLE to Milli STEP 3A (Conway=72032, Bryant=72022, Benton=72015, etc.) and a CRITICAL check: if response contains "customers" array instead of top-level "id": "cus_...", the creation FAILED — stop immediately, do not use previously-known customer IDs.
How to apply: Any time you modify Milli's system prompt related to HCP customer creation, keep the ZIP table and the POST success validation check intact.

**Bug 2 — Context contamination after HCP POST failure**
After a failed POST, Milli's LLM picks up the most recently mentioned customer_id from earlier in the conversation (can be a completely different customer) and uses that for subsequent PATCH and POST /estimates calls. This caused Michael King's estimate to be written to Rebecca Bennett's record.
Why: LLM context window retains prior tool call results; when the POST gives no new ID, the model reuses the last-seen cus_ value.
Fix applied: Added explicit rule: "DO NOT use any previously known customer_id from earlier in this conversation" when POST fails.
How to apply: Never remove the "CRITICAL — VERIFY POST SUCCEEDED" block from Milli's STEP 3A.

**Bug 3 — GHL upsert 422 when email is empty string**
When no email is provided, Vizzy sends email: "" in the GHL contact upsert body. GHL returns 422 "email must be an email". Vizzy retried 3 times before succeeding on the 3rd attempt (with email field omitted), but this causes delay and unnecessary retries.
Why: GHL validates email format — empty string is invalid.
Fix applied: Added EMAIL RULE to Vizzy's GHL upsert instruction: "Only include email field if Anthony provided one. NEVER send email: '' or email: null."
How to apply: When modifying Vizzy's lead intake GHL step, always omit optional fields (email, zip) when not provided rather than sending empty strings.

**Bug 4 — HCP Webhook Router never moved GHL stages (silent from day one)**
The HCP Webhook Router (`4XY3iZmgB6jm4YlD`) had 4 compounding bugs that caused ZERO stage updates ever:
1. n8n v2 boolean.equal IF nodes — always routed to false path (see feedback_n8n_workflow_patterns.md)
2. approval_status read from wrong path — should be `entity.options[0].approval_status`, was reading `entity.approval_status` (undefined)
3. GHL contact search email-first — missed contacts with null email; changed to phone-first
4. HTTP jsonBody expressions not evaluated — jsonBody must start with `=` prefix
All 4 fixed 2026-04-28. Verify end-to-end with a real HCP event replay after any future changes to this workflow.

**Bug 5 — HCP Placeholder node is a stub — no HCP customers ever auto-created**
The Address Processor (`d8xiKaMU7rZ0Ldxp`) "HCP Placeholder" Code node only passes data through. It never calls HCP API. Every contact who replies with their address gets GHL stage movement + SMS but NO HCP customer record. Anthony must manually create HCP customers via API until this node is replaced with real POST /customers + POST /customers/{id}/addresses calls.

**Pattern: Agents hallucinate success when tool calls fail**
All these bugs share a root cause: n8n tool nodes return executionStatus: success even when the API returns an error or wrong response type. The LLM reads the tool output and assumes success. Always add explicit response validation rules to system prompts for critical API operations.
