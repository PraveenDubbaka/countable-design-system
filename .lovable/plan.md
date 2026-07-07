## Goal

Replace the ad-hoc "Sign-off / Prepared by / Reviewed by" cards on every worksheet with the same `ChecklistSignOff` UI used at the bottom of checklists (Preparer / Partner / Quality Reviewer / Admin-Tax Reviewer rows with Sign Off + Unsign buttons, add-extra-row, disclaimer text).

## Approach

1. **New wrapper** `src/components/WorksheetSignOff.tsx`
   - Props: `worksheetKey: string`, `engagementId: string`, `isEngagementMode?: boolean` (default `true`).
   - Builds a synthetic checklist id like `worksheet:{engagementId}:{worksheetKey}` and renders `<ChecklistSignOff checklist={{ id } as Checklist} isEngagementMode />`.
   - Storage keys stay isolated per worksheet so nothing collides with real checklist sign-offs.

2. **Replace inline Sign-off cards** in every worksheet with the wrapper. Files:
   - `AuditPAP501Worksheet.tsx` (501-B-C)
   - `AuditOASWorksheet.tsx` (430)
   - `AuditASMWorksheet.tsx`
   - `AuditSAEWorksheet.tsx`
   - `Audit513Worksheet.tsx`
   - `Audit590Worksheet.tsx`
   - `Audit605Worksheet.tsx` (uses shared `ConcludeBar` from WorksheetLayout — swap the sign-off block inside `ConcludeBar` or render `WorksheetSignOff` above it)
   - `Audit610Worksheet.tsx`, `Audit630Worksheet.tsx` (same shared bar pattern)
   - `AuditMaterialityWorksheet.tsx`, `AuditPAP501AWorksheet.tsx`, `AuditTeamPlanningWorksheet.tsx`, `Audit580Worksheet.tsx` (audit remaining worksheets for a Sign-off card and standardize)

3. **Keep** the existing "Conclude worksheet" button / concluded-on badge behavior (that's separate from sign-off). Only the four-role sign-off block is swapped.

4. **Do not touch** the `preparedBy` / `reviewedBy` fields in each worksheet's data model — leave for back-compat, just stop rendering them. (No storage migration needed.)

## Out of scope
- No visual redesign of the ChecklistSignOff component itself.
- No changes to real checklist sign-off storage or behavior.

## Question
Confirm: keep the separate "Conclude worksheet" button as-is (locks the worksheet, shows the green "Concluded on…" pill), and only replace the four-role Preparer/Reviewer card with the checklist-style sign-off. Correct?
