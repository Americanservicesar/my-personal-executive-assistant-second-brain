# HCP Router — G/B/B Estimate Value Calculation Bug

## Problem
The HCP Webhook Router was summing `total_amount` across ALL 3 options in a G/B/B estimate:
- Good ($1,460) + Better ($1,755) + Best ($2,145) = $5,360 → GHL showed $5,364

## Root Cause
```javascript
// OLD — sums all options (WRONG for G/B/B)
const optionsTotal = (entity.options || []).reduce((s, opt) => s + (opt.total_amount || 0), 0);
```

## Fix (applied 2026-05-01)
```javascript
// NEW — use "Better" (middle) option only
const estOptions = entity.options || [];
const betterOpt = estOptions.length >= 2
  ? (estOptions.find(o => (o.name||'').toLowerCase().includes('better')) || estOptions[Math.floor((estOptions.length-1)/2)])
  : estOptions[0] || {};
const optionValue = betterOpt.total_amount || 0;
```

## Notes
- HCP stores `total_amount` in **cents** — divide by 100 for GHL dollar value
- For single-option estimates: uses the only option's total
- For G/B/B: finds option named "Better" or falls back to middle index
- Applied in workflow `4XY3iZmgB6jm4YlD` (HCP Webhook Router), node `Parse HCP Event`
