## Goal

Pull **only** the checklist templates (Global Templates library + folder tree) from project [Checklist Option 4](/projects/9b6a6b80-deac-4e54-a55b-505da8df8016) and merge them into this project. Nothing else in this project changes — UI, theming, design system, sidebar layout, navigation, components, pages, routes, etc. all stay as they are.

## What gets merged

### 1. `src/lib/globalTemplates.ts` — full replacement

Source has **32 template generators** vs this project's **6**. The source file is a strict superset/upgrade of the current one. The cleanest, safest merge is to **overwrite this file with the source version** (5,011 lines).

Templates that will be added:
- **Compilation** (existing 6, refreshed): Client Acceptance, Independence, Knowledge of the Business, Planning, Withdrawal, Completion
- **Review** (18 new): New engagement acceptance, Existing engagement continuance, Understanding the Entity – Basics & Systems, Engagement Planning, Completion, Subsequent Events, Withdrawal, ASPE disclosure checklists (General, Income Taxes, Leases, Goodwill & Intangibles, Employee Future Benefits, Supplementary, Agriculture), Specific Circumstances, Worksheet – Going Concern, Worksheet – Accounting Estimates
- **Tax** (1): Completion
- **Audit** (6 new folder): Audit Completion, Engagement Partner Audit Completion, Auditor's Report, Modified Opinion, Supplementary & Other Information, Management Representations
- **Compilation 2026** (1 new folder): Client Acceptance and Continuance

The exported API stays the same (`getGlobalTemplateChecklist`, `GLOBAL_TEMPLATE_GENERATORS`), and the source file already includes back-compat IDs (`global-1-1`, `global-template-...`, plain slugs) so all existing call sites keep working.

### 2. `src/components/Sidebar.tsx` — surgical edit only

Replace **only** the `initialGlobalTemplates` constant (lines ~91–141) to add the new "Audit" and "Compilation 2026" folders and align the "Knowledge of the Business" label. No other change to Sidebar.tsx — the nav items, icons, layout, panel structure, and everything else stay exactly as they are in this project.

### 3. My Templates — not code, no merge

"My Templates" are user-created entries persisted in the browser's `localStorage` under key `savedChecklists`. They are runtime data on each user's machine, not part of the source code, so there is nothing to pull from the other project's repo. (If you ever want to seed default "My Templates", we can do that in a follow-up — let me know.)

## Explicitly NOT changed

- Design System page, theme tokens, colors, typography, memory rules
- Sidebar nav items, icons, layout, panels, signoffs overlay, secondary panels
- Any page (Dashboard, Clients, Engagements, EngagementDetail, Builder, etc.)
- Any UI component (Tabs, buttons, dialogs, etc.)
- Routes, App.tsx, index.css, tailwind config
- Supabase / backend / `.env`

## Technical notes

- Single-file overwrite of `src/lib/globalTemplates.ts` via `cross_project--read_project_file` → `code--write`.
- One small `code--line_replace` on `src/components/Sidebar.tsx` to update only the `initialGlobalTemplates` array.
- After the change, the existing `BulkAddToMyTemplatesDialog` and `getGlobalTemplateChecklist(templateId)` flow will resolve every new folder/file ID automatically (template IDs `global-2-1` … `global-5-1` all map in the source's switch statement).
- No type changes — both projects share the same `Checklist`/`Section`/`Question` types.
- No risk to user-saved `savedChecklists` in localStorage; they are keyed by their own folder IDs and untouched.

## Verification after build

- Open the sidebar → "Master" tab → confirm 5 folders (Compilation, Review, Tax, Audit, Compilation 2026) with the expected counts (6 / 18 / 1 / 6 / 1).
- Click any new template → opens with full sections/questions populated.
- "My Templates" tab still shows whatever the user previously saved — unchanged.
