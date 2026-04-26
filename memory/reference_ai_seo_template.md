---
name: AI-First SEO Page Template & Research
description: Optimal page layout for AI citation (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot) + traditional SEO — block order, schema stack, BLUF principle, semantic HTML rules
type: reference
last_updated: 2026-04-06
---

# AI-FIRST SEO PAGE TEMPLATE

## The Core Principle: BLUF (Bottom Line Up Front)
Every H2 section opens with its complete answer in the first sentence. AI systems extract the first 40-60 words of each section as "answer candidates."

## What AI Systems Cite Most
- Numbered/bulleted lists — 22% of all AI citations (highest format)
- Direct question-answer pairs with FAQ schema
- Specific statistics and original data (forces citation)
- Comparison structures ("X vs Y")
- Process steps (numbered how-to)
- Definition sentences ("Pressure washing is...")

## FAQ Schema Status (2025-2026)
Google killed FAQ rich snippets for most sites in 2023, BUT pages with FAQPage schema are 3.2x more likely to appear in Google AI Overviews. Use case shifted from SERP snippets to AI visibility. KEEP implementing FAQPage schema on every page.

## Optimal Content Block Order (Service Pages)

### Block 1: Hero + Trust Bar
- H1 (one per page — "Service Name in Central Arkansas")
- 1-sentence value prop
- Primary CTA: "Get a Free Quote" + phone
- Trust badge strip: Google rating, BBB, insured, license #
- LCP-optimized hero image (<2.5s)

### Block 2: Answer Capsule (60-100 words)
- Direct answer to "what is this service"
- BLUF — complete answer in FIRST sentence
- Self-contained, quotable by AI

### Block 3: Service Details (H2s in question format)
- Each H2 = question format
- First sentence = direct answer
- Bullet lists (22% AI citation rate)
- Comparison tables (<table> for AI parsing)

### Block 4: Process / How It Works
- Numbered <ol> (not visual bullets)
- Each step: action + outcome
- 4-6 steps
- HowTo schema

### Block 5: Pricing Factors
- H2: "How Much Does [Service] Cost in Central Arkansas?"
- First sentence: specific range
- Factors table
- CTA for custom quote

### Block 6: Before & After Gallery
- 4-6 real job photos (.webp)
- Alt text with service + city keywords
- E-E-A-T experience signal

### Block 7: Service Areas
- Each city: 1-2 sentences with LOCAL context
- Links to /service/city/ pages
- Named neighborhoods, ZIP codes

### Block 8: Social Proof
- 3-5 actual review texts
- Reviewer name, date, service
- AggregateRating schema
- CTA after reviews

### Block 9: FAQ (5-8 Q&As + FAQPage schema)
- Real customer questions
- Each answer: 40-80 words, direct answer first
- 3.2x AI Overview citation lift

### Block 10: Credentials + Final CTA
- License number (text, not image)
- Insurance details
- "Last Updated: [date]" (30% freshness boost)
- Final CTA: phone + form + HousecallPro booking

## Schema Stack Per Page (JSON-LD)
1. LocalBusiness (with geo, areaServed, sameAs, hasOfferCatalog)
2. FAQPage (all Q&As)
3. AggregateRating (nested in LocalBusiness)
4. BreadcrumbList (Home > Service > City)
5. HowTo (process section)

## Site-Wide Requirements
- llms.txt at root (AI crawler guide)
- Semantic HTML5 (<main>, <section>, <article>, <address>)
- One <h1> per page, never skip heading levels
- "Last Updated" dates on all service pages
- Content in footer deprioritized by AI — don't put key facts only there

## Key Metrics
- FAQ schema: 3.2x AI Overview citation lift
- Lists: 22% of AI citations
- Freshness (updated dates): 30% citation boost
- Sweet spot word count: 1,200-2,000 words (AI), 2,500-4,000 (pillar SEO)
- LCP: under 2.5s, INP: under 200ms, CLS: under 0.1

## Wise Guys Pro Wash Gaps to Exploit
- No H1 on any page
- Zero FAQ content/schema
- No pricing info
- No Service/AggregateRating/HowTo schema
- Thin service page content (2-3 paragraphs)
- NAP inconsistency (footer ≠ schema address)
- No online booking
- No breadcrumbs
