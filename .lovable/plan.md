
# QA Test Notes — Design System Update (Global Buttons + Tokens)

**Scope:** Verify global updates to Primary buttons, Secondary buttons (incl. dropdown/toggle/selected states), ExpandableIconButton, ExpandableSearch, and token mapping in `index.css` / `tailwind.config.ts`. Coverage spans all pages and all interactive states.

**Build under test:** Preview — https://id-preview--be946e2d-5cf9-45df-af36-3b166973e674.lovable.app
**Published:** https://countable-design-system.lovable.app
**Browsers:** Chrome (latest), Safari (latest), Firefox (latest), Edge (latest)
**Viewports:** 1920×1080, 1440×900, 1374×861, 1280×800, 1024×768, 768×1024, 390×844
**Themes:** Navy Core (light) — Dark mode where applicable (Sidebar, secondary panels)

---

## Acceptance Criteria (must hold globally)

- **Primary button**
  - Default: bg `#0C2D55`, white text, transparent border, radius `10px`, height `h-9` (36px), font-weight 600, 15px.
  - Hover: bg `#244266`.
  - Active/Pressed: bg `#081F3B`.
  - Focus-visible (keyboard Tab): bg `#0C2D55` + 2px ring `#A3A3A3 @ 50%` with 2px offset against background.
  - Disabled: 50% opacity, pointer-events none.
- **Secondary button**
  - Default: bg `--secondary-button-bg`, text `--secondary-button-foreground` (navy), border `--secondary-button-border`.
  - Hover: bg + border use `*-hover` tokens.
  - Active / `data-[state=open]` / `data-[state=on]` / `aria-selected`: bg + border use `*-active` tokens (the "selected" navy fill).
  - Focus-visible: 2px navy ring at 30% opacity, no offset; border = `--secondary-button-foreground`.
  - Radius `10px`, font 15px/600.
- **Icons** inside buttons: 18px, inherit text color, no shift on hover.
- **Transitions:** color/bg/border 200ms; no scale, no lift, no drop shadow (per global "flat" rule).
- **Dark mode (Sidebar / secondary panels):** secondary buttons retain light-gray bg + navy text (token parity).

---

## Test Cases

### TC-DS-001 — Primary Button: Default rendering
**Pages:** Dashboard, Clients, Engagements, CreateEngagement, EngagementDetail, ProcedureDetail, TrialBalance, Teams, DesignSystem, EngagementTemplates, AuditDependencyRegister.
**Steps:** Load each page; locate every primary CTA (Save, Create, Continue, Confirm, Apply, Add, Sign-off, etc.).
**Expected:** bg `#0C2D55`, white text, border transparent, radius 10px, h-9, font 15px/600.
**Notes:** Capture screenshot per page.

### TC-DS-002 — Primary Button: Hover
**Steps:** Hover each primary button with mouse.
**Expected:** bg transitions to `#244266` in ≤200ms; no scale/lift/shadow; cursor pointer; text remains white.

### TC-DS-003 — Primary Button: Active/Pressed
**Steps:** Mouse-down (hold) on each primary button.
**Expected:** bg becomes `#081F3B` while held; releases back to default/hover.

### TC-DS-004 — Primary Button: Keyboard focus
**Steps:** Tab through page; land on each primary button.
**Expected:** Visible focus ring `#A3A3A3 @ 50%`, 2px, offset 2px; bg unchanged from default; ring disappears on blur. Enter and Space trigger click.

### TC-DS-005 — Primary Button: Disabled
**Steps:** Trigger disabled state (e.g., Save with no changes; submit with invalid form).
**Expected:** Opacity 50%; no hover/active changes; pointer-events none; not reachable via keyboard activation.

### TC-DS-006 — Primary Button: Icon + label alignment
**Steps:** Inspect primary buttons containing icons (e.g., "+ Add", "Save").
**Expected:** Icon 18px, vertically centered, 8px gap to label, no overflow on min content.

### TC-DS-007 — Primary Button: Size variants
**Steps:** Verify `sm` (h-8), `default` (h-9), `lg` (h-11), `icon` (9×9), `icon-sm` (7×7), `icon-lg` (11×11) where used.
**Expected:** Heights and paddings match spec; radius 10px consistent.

### TC-DS-008 — Primary Button: Dark mode
**Pages:** Sidebar, any dark secondary panels.
**Expected:** Same navy default; hover/active/focus identical to light theme.

---

### TC-DS-010 — Secondary Button: Default rendering
**Locations:** Toolbar actions (Share, Replace, Delete, Export, Import), Cancel buttons in dialogs, dropdown triggers (Select, DropdownMenu trigger), filter chips, ViewModeToggle, segmented toggles, ExpandableIconButton, ExpandableSearch collapsed state.
**Expected:** Light gray bg from `--secondary-button-bg`, navy text, navy border, 10px radius, h-9.

### TC-DS-011 — Secondary Button: Hover
**Expected:** bg → `--secondary-button-bg-hover`, border → `--secondary-button-border-hover`; transition 200ms; no scale/shadow.

### TC-DS-012 — Secondary Button: Pressed (active)
**Steps:** Mouse-down hold.
**Expected:** bg → `--secondary-button-bg-active`, border → `--secondary-button-border-active`.

### TC-DS-013 — Secondary Button: Selected / Open state (DROPDOWN TRIGGERS)
**Steps:** Click a Select / DropdownMenu / Popover trigger to open it.
**Expected:** While open (`data-[state=open]`), trigger uses the *-active token set (navy-filled "selected" look). Closes back to default on dismiss.
**Critical:** This was the previously-reported defect — verify on every dropdown across all pages.

### TC-DS-014 — Secondary Button: Toggle ON state
**Locations:** ViewModeToggle, RichTextToolbar formatting toggles, any Toggle / ToggleGroup item.
**Expected:** `data-[state=on]` applies *-active tokens. Toggling off returns to default.

### TC-DS-015 — Secondary Button: aria-selected items
**Steps:** Tabs, segmented controls, list items with `aria-selected="true"`.
**Expected:** Active token set applied.

### TC-DS-016 — Secondary Button: Keyboard focus
**Expected:** 2px navy ring @ 30% opacity, border becomes navy foreground; no offset; ring removed on blur.

### TC-DS-017 — Secondary Button: Disabled
**Expected:** 50% opacity; no state changes.

### TC-DS-018 — Secondary Button: Dark mode parity
**Pages:** Sidebar, dark secondary panels (Engagement right panel, Ask Luka overlay if dark).
**Expected:** Same light-gray/navy aesthetic per memory rule — NOT inverted.

### TC-DS-019 — ExpandableIconButton: Wide viewport (≥1368px)
**Steps:** Resize to 1440px; inspect Share/Replace/Delete in toolbar.
**Expected:** Icon + label visible, secondary variant tokens applied, h-9, 12px horizontal padding, 8px gap.

### TC-DS-020 — ExpandableIconButton: Compact viewport (<1368px)
**Steps:** Resize to 1280px.
**Expected:** Icon-only (min-w-9, no padding, no gap). On hover: smoothly expands to show label (padding 12px, gap 8px, 200ms ease-in-out). Tokens remain secondary.

### TC-DS-021 — ExpandableIconButton: Active state when popover open
**Steps:** Trigger an expandable icon button that opens a popover/menu.
**Expected:** `data-[state=open]` applies active token bg+border.

### TC-DS-022 — ExpandableSearch: Collapsed
**Expected:** 36×36 secondary button with search icon, default tokens.

### TC-DS-023 — ExpandableSearch: Expand
**Steps:** Click search icon.
**Expected:** Smoothly expands to 256px, focuses input, shows double-border focus style (2px blue, 2px offset).

### TC-DS-024 — ExpandableSearch: Collapse
**Steps:** Press Esc / click X / click outside with empty input.
**Expected:** Collapses back to icon button; value cleared.

### TC-DS-025 — ExpandableSearch: Typing + Enter
**Expected:** Value updates; Enter fires onSearch; X button clears and collapses.

---

### TC-DS-030 — Token integrity (CSS variables)
**Steps:** DevTools → inspect `:root` for `--secondary-button-bg`, `-hover`, `-active`, `-foreground`, `-border`, `-border-hover`, `-border-active`. Repeat for `.dark`.
**Expected:** All tokens defined as HSL triplets, no missing/undefined values.

### TC-DS-031 — Tailwind config exposure
**Steps:** Use Inspect → confirm classes `bg-secondary-button`, `bg-secondary-button-hover`, `bg-secondary-button-active`, `text-secondary-button-foreground`, `border-secondary-button-border(-hover|-active)` resolve to expected HSL.
**Expected:** No `undefined` Tailwind classes; build emits valid CSS.

### TC-DS-032 — No legacy overrides remain
**Steps:** Grep visually for any secondary button rendering with `bg-card`, `bg-white/10`, `hover:bg-muted`, `variant="outline"` where it should be `secondary`.
**Expected:** None on Sidebar, EngagementDetail, TrialBalance, Teams, Clients, CreateEngagement.

---

### TC-DS-040 — Page sweep: Dashboard
Primary: hero CTAs, status card actions. Secondary: filter chips, status card menu triggers, ExpandableSearch.
**Expected:** All buttons match spec across states.

### TC-DS-041 — Page sweep: Clients
Primary: "Add Client", row primary actions. Secondary: column header sort triggers, partner-assignment dropdown trigger, row action icon buttons.
**Critical:** Partner-assignment dropdown selected/open state (TC-DS-013).

### TC-DS-042 — Page sweep: Engagements
Primary: "Create Engagement". Secondary: status filters, view toggle, row action buttons.

### TC-DS-043 — Page sweep: CreateEngagement
Primary: "Continue", "Create". Secondary: "Cancel", template selectors, step navigation toggles.

### TC-DS-044 — Page sweep: EngagementDetail
Primary: Save / Sign-off / Share. Secondary: Toolbar (Share, Replace, Delete via ExpandableIconButton), ViewModeToggle, MondayBoard category triggers, RichText toolbar toggles, FloatingActionBar buttons.
**Critical:** RichText toolbar toggles ON state (TC-DS-014); FAB section creation dropdown trigger (TC-DS-013).

### TC-DS-045 — Page sweep: ProcedureDetail
Primary: Save / Apply. Secondary: row action icon buttons, accounts table header toggles.

### TC-DS-046 — Page sweep: TrialBalance
Primary: Import / Apply. Secondary: ExpandableSearch, column filters, GIFI hierarchy expand toggles.

### TC-DS-047 — Page sweep: Teams
Primary: "Invite". Secondary: status card expand buttons, row actions.

### TC-DS-048 — Page sweep: DesignSystem
**Steps:** Open token playground; verify every button variant rendered matches spec across states.
**Expected:** Primary + Secondary swatches/exemplars all updated; no stale tokens.

### TC-DS-049 — Page sweep: EngagementTemplates
Primary: "Save as Template", "Add to My Templates". Secondary: category folder triggers, multi-select checkbox toolbar.

### TC-DS-050 — Page sweep: Sidebar
Secondary: collapse toggle, settings, notifications, Ask Luka.
**Expected:** Dark-theme contrast preserved per MutationObserver theme rule; selected nav items apply active tokens.

### TC-DS-051 — Page sweep: Global Header
Primary: "Ask Luka". Secondary: accessibility toggle, notifications button (with swing animation intact), settings button.

### TC-DS-052 — Page sweep: Settings Panel (Sheet)
Primary: "Save". Secondary: "Cancel", radio-card triggers (Luka Autopilot UI), sheet close button.

### TC-DS-053 — Page sweep: Ask Luka Overlay
Primary: Send. Secondary: prompt chips, attach menu trigger, voice button, mode toggle (half/full).
**Expected:** Selected mode uses active tokens.

### TC-DS-054 — Page sweep: Dialogs
**Dialogs:** ShareWithClientDialog, DeleteChecklistDialog, AddToMyTemplatesDialog, BulkAddToMyTemplatesDialog, SaveDialog, UnsavedChangesDialog, ClientResponseDialog, ReorderModal, EditOptionsPopover, AlertDialog confirmations.
**Expected:** Primary confirm = navy; Cancel = secondary; destructive uses destructive variant (unchanged).

### TC-DS-055 — Page sweep: AddChecklistSheet, FormLayoutEditor, GenerationPreview
**Expected:** All CTAs follow spec.

---

### TC-DS-060 — Accessibility: Color contrast
**Steps:** Run axe / WCAG contrast checker on primary (white on `#0C2D55`) and secondary (navy on light gray).
**Expected:** ≥ 4.5:1 for text; ≥ 3:1 for focus ring against adjacent surfaces.

### TC-DS-061 — Accessibility: Font scaling A/AA/AAA
**Steps:** Toggle accessibility font size; verify buttons don't clip/overflow.
**Expected:** Heights expand gracefully; labels remain readable.

### TC-DS-062 — Accessibility: Keyboard-only navigation
**Steps:** Tab through entire page; activate each control via Space/Enter.
**Expected:** Visible focus ring on every button (primary and secondary); no traps.

### TC-DS-063 — Accessibility: Reduced motion
**Steps:** OS-level prefers-reduced-motion ON.
**Expected:** Color transitions still apply (≤200ms acceptable); no large motion regression.

### TC-DS-064 — Accessibility: Screen reader labels
**Expected:** Icon-only buttons (ExpandableIconButton compact, ExpandableSearch collapsed) expose accessible name via aria-label.

---

### TC-DS-070 — Regression: No hover scale/lift/shadow
**Steps:** Hover every card/button on every page.
**Expected:** Per memory rule — zero scale, vertical lift, or drop shadow appears.

### TC-DS-071 — Regression: Border radius 10px on all buttons
**Expected:** No 4px/6px/12px outliers.

### TC-DS-072 — Regression: Destructive variant unchanged
**Expected:** Destructive still uses `--destructive` tokens with red bg.

### TC-DS-073 — Regression: Outline / Ghost / Link / Tonal / Elevated variants
**Expected:** Render correctly with their own tokens; no bleed from secondary update.

### TC-DS-074 — Regression: Sonner toasts, notification popover, FAB
**Expected:** Inner buttons follow new spec; layouts unchanged.

### TC-DS-075 — Regression: Forms (Input, Select, Textarea, Calendar, DatePicker)
**Expected:** Form chrome unchanged; Select/Calendar trigger as secondary button shows active state when open.

### TC-DS-076 — Cross-browser parity
**Steps:** Execute TC-DS-001 through TC-DS-024 in Chrome, Safari, Firefox, Edge.
**Expected:** Identical pixel/state behavior; no Safari/Firefox focus-ring anomalies.

### TC-DS-077 — Responsive parity
**Steps:** Execute TC-DS-019/020 at all listed viewports.
**Expected:** ExpandableIconButton compact threshold at <1368px; no overflow on mobile.

### TC-DS-078 — Preview vs Published parity
**Steps:** Spot-check 5 pages on both preview and published URLs.
**Expected:** Identical rendering; no stale CSS.

---

## Defect Reporting Template (per finding)
- **Page / Component:**
- **State (default/hover/active/focus/open/on/disabled):**
- **Viewport / Browser / Theme:**
- **Expected (token / hex):**
- **Actual (token / hex):**
- **Screenshot:**
- **Steps to reproduce:**
- **Severity (Blocker/Major/Minor):**

---

## Sign-off Checklist
- [ ] All Primary states verified on every page
- [ ] All Secondary states verified, incl. dropdown open + toggle on + aria-selected
- [ ] ExpandableIconButton + ExpandableSearch verified at both viewport tiers
- [ ] Tokens present in light + dark
- [ ] No legacy overrides remain
- [ ] Accessibility (contrast, focus, keyboard, SR) passes
- [ ] Cross-browser + responsive parity confirmed
- [ ] Preview matches Published
