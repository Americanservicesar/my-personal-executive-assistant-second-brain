---
name: Audit Cost & Token Optimization
description: Token costs for Seomi SEO audits and strategies to reduce LLM spend on n8n workflows
type: feedback
---

## Actual Audit Cost (2026-04-05)
- Full audit (11 tasks, 5 runs): **758,819 tokens total**
- Content gap analysis alone: **~674,800 tokens** (89% of total cost)
- At GPT-4.1 Mini pricing: ~$0.38 per audit
- Without content gap: ~$0.05 per audit

**Why:** Content gap = LLM comparing 80 page slugs against 143 service+city combos via string matching. This is a CODE task, not an LLM task. Should cost zero tokens.

## CRITICAL: Never Use LLM for Content Gap
Content gap analysis must be done programmatically (Code node in n8n or local script):
1. Pull page list via WordPress API
2. Compare against 13×11 matrix in code
3. Output missing combos as structured data
4. Only use LLM to format/present the results if needed

## Cost Reduction Strategies

1. **Content gap via code, not LLM** — Saves ~675K tokens per audit ($0.25+)
2. **Always use `_fields` on WordPress API** — Cuts response payload 95%, prevents OOM
3. **Skip Vizzy routing for direct agent tasks** — Saves ~1,600 tokens per request
4. **Batch similar tasks** — Group by response size, not topic
5. **Limit rowLimit on first pass** — Use 10 for initial, 25 for detailed
6. **Cache audit baselines in GitHub Brain** — Only pull deltas
7. **Don't test with production prompts** — Use minimal data during dev
8. **PageSpeed has daily quota (~25 calls)** — Run once per audit cycle

## Token Breakdown by Task Type
- Vizzy routing overhead: ~1,600 tokens per request
- WordPress page list (80 pages, _fields): ~2,000 tokens
- GA4 report (25 rows): ~1,500 tokens
- Search Console query (25 rows): ~1,500 tokens
- Moz DA check: ~800 tokens
- GBP account list: ~800 tokens
- Broken link check (3 URLs): ~600 tokens
- Content gap (LLM — DO NOT USE): ~674,800 tokens
- Content gap (code — USE THIS): ~0 LLM tokens
