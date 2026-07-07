# Split 501 — Preliminary Analytical Procedures into two items

Today the left-nav has a single node **501 — Preliminary Analytical Procedures** (`aud-ra-pap501`) that renders `AuditPAP501Worksheet`, which internally holds Part A (procedure checklist), Part B (financial comparatives table) and Part C (matters + fraud + sign-off). We will split it into two independently-navigable items that follow the correct design standards.

## Left-nav

Replace the single entry in `src/components/Sidebar.tsx` with:

- `aud-ra-pap501a` — **501-A — Preliminary Analytical Procedures** · icon `checklist` · route `checklist/aud-ra-pap501a`
- `aud-ra-pap501bc` — **501-B-C — Preliminary Analytical Procedures** · icon `worksheet` · route `checklist/aud-ra-pap501bc`

Update the `titleFor` map (~line 658 of `src/pages/EngagementDetail.tsx`) with the two labels and remove the old key.

## 501-A — Checklist (Part A only)

Follows the Monday-Board / Checklist design standard used by other `checklist` items (Yes/No/NA responses, explanation, W/P Ref pill), matching `src/components/luka/workspace/ChecklistView.tsx` conventions and the app's existing `ChecklistTableView`.

Content = the 8 Part-A procedure rows already defined in `PART_A_PROCS` (procedures 1, 2, 3a–c, 4a–b, 5a–b). Each row exposes:

- Question text (procedure description / sub-item)
- Response: Yes / No / N/A pill toggle
- Explanation: free-text (summarize exceptions / findings)
- Reference: W/P ref attach (RefButton)

New file `src/components/AuditPAP501AChecklist.tsx`. Persists to its own key `audit-pap501a-data-${ca|us}`. Sign-off stamp handled by the shared checklist sign-off block already used elsewhere.

## 501-B-C — Luka Worksheet (Parts B & C)

Keeps today's worksheet chrome/design standards (WorksheetLayout / WorksheetSection cards) plus the existing Luka generation flow (`pap501-generate` event, Luka overlay `pap501Mode`, "Regenerate / Export / Share / Delete" action bar).

New file `src/components/AuditPAP501BCWorksheet.tsx` extracted from the current component, containing only:

- Part B financial comparatives table (income statement, balance sheet, ratios) with number-of-streams control and stream labels
- Part C matters register (10 rows), fraud conclusion answer, and prepared-by / reviewed-by sign-off
- Luka fill logic for the Part-B / Part-C keys in `LUKA_PAP501_FILLS`

Persistence key `audit-pap501bc-data-${ca|us}`. The current `AuditPAP501Worksheet.tsx` file is deleted after extraction.

## EngagementDetail wiring

In `src/pages/EngagementDetail.tsx`:

1. Import both new components; remove `AuditPAP501Worksheet` import.
2. Router switch: replace the single `aud-ra-pap501` branch with two — one renders `<AuditPAP501AChecklist />`, the other `<AuditPAP501BCWorksheet />`.
3. Update the Luka action-bar guard (`checklistKey === 'aud-ra-pap501' && pap501Accepted`) and the `pap501-generate` event handler so Luka generation, regenerate, and accepted-state now key off `aud-ra-pap501bc` only. Storage key `pap501-accepted-${engagementId}-*` stays but is only consulted on the B-C route.
4. Add a small one-time migration: on mount, if legacy `audit-pap501-data-*` exists in `localStorage`, split it into the two new keys (Part A → checklist key; streams + fin + matters + fraud + sign-off → BC key) so users don't lose in-progress data.

## Backwards-compatibility redirect

In the checklist route resolver, if `checklistKey === 'aud-ra-pap501'` navigate to `aud-ra-pap501bc` (preserves any bookmark / open state such as your current `/checklist/aud-ra-pap501`).

## Out of scope

No changes to Luka overlay internals, no schema changes to the Luka fills, no Cloud/DB changes. Existing engagement templates (`ca-501` etc.) untouched — those refer to CAS 501, not Form 501.
