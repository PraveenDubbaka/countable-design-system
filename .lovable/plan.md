# 501-B-C — Preliminary Analytical Procedures rebuild

Align the worksheet with the source workbook while keeping the existing worksheet design language (same cards, colored variance lanes, muted headers, Info tooltips). Single page, no tabs.

## What the reference workbook actually contains

Part B — Financial Comparatives
- Setup: "Compare to current budget/forecast?" (Yes/No), "Compare to prior period?" (Yes/No), "Number of sales streams" (1-5).
- Income Statement, per-stream: Sales, Cost of Sales, Gross Margin $, Gross Margin %, plus totals.
- Other Revenue (2 rows) + total.
- Expenses (Salaries, Occupancy, Interest, Bonuses, Repairs, Bad debts, Non-recurring, 3 × Other) + total.
- Net income before tax + "% of revenue" row.
- Balance Sheet: Current Assets, Long-Term Assets, Totals; Current Liabilities, Long-Term Liabilities, Totals; Equity, Total L&E.
- Ratios: Working capital, Days in receivables, Days sales in inventory, Inventory turnover, Days purchases in trade payables, Debt-to-equity.

Part C — Matters & Conclusion
- Matters table (Part B ref, Summary, Management response, Audit implications).
- Fraud-risk conclusion narrative.
- Prepared by / Reviewed by sign-off.

## Changes in `src/components/AuditPAP501Worksheet.tsx`

1. **Top "Setup" card** (new, first card in body): Compare-to-Budget Yes/No, Compare-to-Prior Yes/No, Number of sales streams. `showBudget` and `showPrior` now derive from these toggles instead of the hardcoded `true`. Keeps the existing context bar (Entity, Period end, Performance materiality auto-populated from the Materiality worksheet).
2. **Income Statement card**: add per-stream Gross Margin $ block (computed = sales − cos per stream) and per-stream Gross Margin % block (computed). Add "Net income before tax — % of revenue" computed row.
3. **Balance Sheet card**: unchanged structure, just uses the new `showBudget`/`showPrior` toggles.
4. **New Ratios card** with 6 user-entered rows and the same variance columns.
5. **Part C** stays as-is (matters table, fraud conclusion, sign-off). Card headers unchanged.
6. **State model** additions: `compareBudget: 'Yes'|'No'`, `comparePrior: 'Yes'|'No'`, `ratios: Record<string, FinRow>`; default `Yes` for both toggles. Backfill on load.
7. **FinEditRow / FinTotalRow**: accept an optional `showPrior` prop so prior-period columns can be hidden when the toggle is No. Variance columns for prior remain purple, budget remain blue.
8. **Computed-only row helper** for per-stream Gross Margin $ and Gross Margin % (read-only, styled like `FinEditRow` but numbers rendered instead of inputs).

## Auto-population dependencies preserved

- Entity + Period end: `loadEngagements()` by `engagementId` (already wired).
- Performance materiality: `audit-materiality-data-{ca|us}` localStorage (already wired).
- Sales-stream labels: kept editable, seeded from existing `streamLabels`.
- Persistence key `audit-pap501-data-{ca|us}` unchanged; migration merges new fields with defaults.

## Out of scope

- Part A stays untouched (already on the 501-A checklist page).
- No new design tokens, no tabs, no new components outside this file.
