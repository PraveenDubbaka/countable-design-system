# Acceptance Criteria — Global Design System (Countable)

**Scope:** Authoritative, copy-paste-ready acceptance criteria for every layout, section, header, left navigation, and shared component in the app. All criteria are global — they must hold on every page, every viewport, every theme unless explicitly noted. Token references map to `src/index.css` and `tailwind.config.ts`.

---

## 1. GLOBAL APP SHELL / LAYOUT

**Component:** `src/components/Layout.tsx`

- App container fills 100% of the viewport height (`h-screen`) and 100% width; no body scroll — only inner `<main>` scrolls.
- Background renders the Navy Core radial-gradient stack on `#0C2D55`; gradient is fixed (does not scroll with content).
- Three-column flex shell: Sidebar (left) → Content wrapper (center, `flex-1`) → Right panel portal (right). Portals: `#sidebar-secondary-portal` and `#right-panel-portal` must render even when empty (zero width, full height).
- `<main>` card uses `bg-background`, `rounded-xl`, `shadow-[0_4px_24px_rgba(0,0,0,0.35)]`, with `mb-1 mr-1` gutter so the gradient frames the card on bottom and right.
- Header wrapper sits above the content row, full-width, transparent (gradient shows through).
- Content overflow: only the inner `<main>` is scrollable (`overflow-auto`); the shell itself is `overflow-hidden`.
- Z-order: portals < main content < header < sidebar overlays < dialogs < toasts.
- No horizontal scrollbar at any supported viewport (≥1024px desktop; ≥360px mobile).

---

## 2. GLOBAL HEADER

**Component:** `src/components/GlobalHeader.tsx`

- Spans full width of the content area, height 56px, transparent background (Navy Core gradient visible behind).
- Left slot: page title rendered as **single H1**, Inter 18px / weight 600, color `--header-foreground` (white in Navy Core), no truncation up to header width — then ellipsis.
- Optional back button: secondary variant, `icon-sm`, sits 8px left of title, only when `showBackButton` is true.
- Right slot (fixed order): Accessibility toggle → Notifications → Settings → Ask Luka.
  - Accessibility, Notifications, Settings: secondary `icon` buttons, 36×36, transparent border on header (background blends with gradient but tokens stay secondary).
  - Notifications: dot indicator when unread; swing animation on new notification (≤600ms, ease-out, single cycle, respects reduced-motion).
  - Ask Luka: **primary** button, label "Ask Luka", icon left, navy fill, white text — must match Primary button criteria in §11.
- Header never wraps to a second row. On <1280px, hide Accessibility label (icon only); below 1024px, collapse Settings into overflow menu.
- Header is always visible — does not hide on scroll. No drop shadow (relies on main card's shadow for separation).

---

## 3. LEFT NAVIGATION (SIDEBAR)

**Component:** `src/components/Sidebar.tsx`

### Structure
- Fixed left column, full viewport height, dark theme always (navy/black surface), independent of route theme.
- Width: `expanded = 240px`, `collapsed = 64px`. State persists in `localStorage`.
- Sections, top → bottom: Logo → Primary nav tree → Spacer → Secondary nav (Templates, Design System) → User block.
- No visible scrollbar (scroll allowed but hidden globally per memory rule).

### Logo
- Luka mark: white Zap icon on gradient orb, animated orb pulse (infinite, respects reduced-motion).
- Click on logo → routes to `/`.

### Nav items
- Inter 15px / weight 500; icon 18px left of label with 12px gap.
- Default: text `--sidebar-foreground`, icon inherits.
- Hover: background `--sidebar-accent` (subtle navy lift, no scale, no shadow).
- Active route (NavLink `isActive`): background `--sidebar-accent-active`, text/icon `--sidebar-accent-foreground`, left 3px navy indicator bar.
- Focus-visible: 2px ring `--sidebar-ring`, no offset.
- Collapsed state: icon-only, centered in 64px column, tooltip on hover (right side, 8px gap).

### Folder / tree items
- Custom folder icons (open/closed) from `FolderIcons.tsx`; chevron right on collapsed, chevron down on expanded.
- Leaf items indented 24px from parent.
- Expanded group containing active route stays open by default.

### Sidebar collapse toggle
- Circular button, 24×24, sits on right edge of sidebar at vertical center of viewport, visible only on hover over the sidebar edge (200ms fade).
- Click toggles expand/collapse with 200ms width transition.
- Does not overlap nav items at any width.

### Secondary panel (when a nav item opens one)
- Renders inside `#sidebar-secondary-portal` (right of sidebar, left of main).
- Width: resizable 280–480px, persisted to localStorage.
- Background: light surface (light mode) or dark surface (dark mode) per `--secondary-panel-bg`.
- Rounded right side only (`cockpit` 1.25rem radius outer, square against sidebar).
- Drag handle: 4px wide, centered vertically, cursor `col-resize`, hover shows accent.

---

## 4. SECONDARY PANELS (RIGHT PANEL)

**Components:** `EngagementRightPanel.tsx`, `ClientRightPanel.tsx`

- Render inside `#right-panel-portal`, sit at right edge of content area.
- Width: 360px default, resizable 320–560px, persisted.
- Full content-area height, with 4px bottom gutter (`pb-1`) matching main card.
- Background `--secondary-panel-bg`; rounded left side only (`cockpit` 1.25rem); border `--secondary-panel-border` on the left edge only.
- Internal scroll, hidden scrollbar.
- Close button: secondary `icon-sm`, top-right, 8px inset.
- Expand handle: fixed centered on inner left edge, 24×48, no gap to panel.

---

## 5. PAGE CONTENT AREA (`<main>`)

- Padding: top 24px, sides 24px, bottom 24px (overridden by full-bleed pages like Trial Balance).
- Default content width: full main width; opt-in `max-w-[1280px] mx-auto` for forms/settings.
- Section spacing: 24px vertical rhythm between top-level blocks; 16px between sub-blocks; 8px between label/control pairs.
- Page title (when not in global header): H1 navy `#0C2D55`, Inter 24px / weight 700, 0 margin-top, 16px margin-bottom.
- Sub-section headings: H2 18px / 600, navy; H3 16px / 600.
- Body text: Inter 15px / 400, color `#101828` (never gray per memory rule).
- Helper text: 13px / 400, color `#101828` at 70% opacity max — never `text-gray-*`.

---

## 6. TABLES

**Components:** `ChecklistTableView.tsx`, Trial Balance table, Clients table, Teams table.

- Borderless layout — only horizontal row dividers `--table-row-border` (1px).
- Header row: sticky to top of scroll container, background `--table-header-bg`, text navy 13px / 600 uppercase tracking-wide.
- Row height: 44px standard; 56px with avatar; never grows on edit (per row-stability rule).
- Cell padding: 12px horizontal, 8px vertical; first/last cell get 16px outer padding.
- Text truncation: single line with ellipsis by default; tooltip on hover when truncated.
- Row hover: background `--table-row-hover`; no scale, no shadow.
- Selected row: background `--table-row-selected`, 2px left navy bar.
- Sort headers: secondary-button-styled inline triggers with chevron; `aria-sort` reflected.
- Empty state: centered illustration + heading + secondary CTA, 64px vertical padding.
- Action column: sticky right, transparent background, icon buttons only (secondary `icon-sm`).

---

## 7. FORMS

**Components:** `Input`, `Textarea`, `Select`, `Calendar`, `DatePicker`, `RadioGroup`, `Checkbox`, `Switch`.

### Inputs & textareas
- Height 36px (`h-9`); textarea min-height 80px, auto-grow optional.
- Background white, border `--input-border` 1px, radius 10px.
- Text 15px / 400 navy; placeholder `#101828` at 50%.
- Focus: **double border** — inner 2px `--input-focus` (#1C63A6 blue), outer 2px transparent offset ring (per memory rule).
- Disabled: 50% opacity, no border change.
- Error: border `--destructive`, error text below 13px destructive.

### Select / DatePicker triggers
- Render as **secondary buttons** — must satisfy §12 (incl. `data-[state=open]` active token swap).
- Chevron icon 16px right, rotates 180° on open (200ms).

### Date input
- Width `fit-content` per memory rule (does not stretch to container).
- Calendar popover: light surface, rounded 12px, 16px padding, selected day = primary navy fill.

### Radio cards (Settings/Luka Autopilot)
- Card 100% width, 12px padding, radius 10px, border `--card-border`.
- Selected: 2px border `--primary`, background `--primary/8`, no shadow.
- Hover (unselected): border darkens; no lift.

### Switch
- 36×20, track `--muted` off / `--primary` on, thumb 16px white with subtle border.

### Labels
- 13px / 600 navy, 4px above control. Required marker `*` in `--destructive`.

### Form layout
- Fields stack vertically on mobile; 2-column grid ≥768px when grouped; 24px gap.
- Inline help text 13px below field.

---

## 8. DIALOGS / SHEETS / POPOVERS

### Dialog
- Centered, max-width 480px (default) / 640px (medium) / 800px (large).
- Background `--dialog-bg`, radius 16px, shadow `--shadow-dialog`, 24px padding.
- Overlay: `rgba(12,45,85,0.6)`, blur 4px.
- Header: title 18px / 600, optional description 14px / 400 muted.
- Footer: actions right-aligned, 8px gap; primary on right, secondary on left.
- Close button: secondary `icon-sm`, top-right 16px inset.
- Escape closes; clicking overlay closes (unless `disableOutsideClose`).
- Focus trapped inside; focus returns to trigger on close.
- Destructive confirmations (delete, duplicate) use AlertDialog with destructive variant on the confirm action.

### Sheet (Settings panel, Add Checklist)
- Slides from right, width 900px (Settings) / 720px (default), full height.
- Same header/footer rules as Dialog.
- Dual-pane layout where applicable (Settings) — left nav 240px, right content scrolls.

### Popover / DropdownMenu
- Background `--popover-bg`, border `--popover-border`, radius 10px, shadow `--shadow-popover`, 4px padding.
- Items: h-9, 12px horizontal padding, 15px/400, hover `--accent`, selected (checkmark) `--accent-active`.
- Min-width matches trigger; max-width 320px.

---

## 9. CARDS

- Background `--card`, border `--card-border` 1px, radius 12px, padding 16px.
- **No hover scale, no vertical lift, no drop shadow** (per global memory rule).
- Header (optional): title 16px / 600 navy, action slot right.
- Footer: 12px top padding, separator `--card-border` above when present.
- Status / summary cards (Dashboard, Teams): same rules, animations explicitly disabled.

---

## 10. BADGES / PILLS

- Height 22px, radius 999px (pill), padding 8px horizontal, 12px / 600.
- Variants map to semantic tokens: `info`, `success`, `warning`, `destructive`, `neutral`.
- Text wraps allowed for long labels (no single-line forcing per memory rule).
- No border by default; subtle background `--badge-{variant}-bg` + text `--badge-{variant}-fg`.

---

## 11. PRIMARY BUTTON

**Component:** `src/components/ui/button.tsx` variant `default`.

- Background `#0C2D55`, text white, border transparent, radius 10px.
- Sizes: `sm` h-8 / px-3, `default` h-9 / px-4, `lg` h-11 / px-6; icon variants 9×9 / 7×7 / 11×11.
- Font: Inter 15px / 600, line-height 1.3, no letter-spacing.
- Icon: 18px, inherits white, 8px gap from label.
- **Hover:** background `#244266`, 200ms color transition; no scale, no lift, no shadow.
- **Active/pressed:** background `#081F3B`.
- **Focus-visible (keyboard):** background unchanged, ring 2px `#A3A3A3` at 50%, offset 2px against `--background`.
- **Disabled:** opacity 50%, pointer-events none, no state changes.
- Loading state (when used): spinner replaces icon, label stays, button disabled.

---

## 12. SECONDARY BUTTON (CRITICAL — global)

**Component:** `src/components/ui/button.tsx` variant `secondary`.

- Background `--secondary-button-bg` (light gray), text `--secondary-button-foreground` (navy), border `--secondary-button-border` (navy) 1px, radius 10px, h-9.
- Font / icon / sizes identical to Primary.
- **Hover:** background `--secondary-button-bg-hover`, border `--secondary-button-border-hover`; 200ms transition.
- **Active/pressed:** background `--secondary-button-bg-active`, border `--secondary-button-border-active`.
- **Selected / open state (must apply to every dropdown, select, popover, toggle trigger):**
  - `data-[state=open]` → active token set.
  - `data-[state=on]` → active token set.
  - `aria-selected="true"` → active token set.
- **Focus-visible:** ring 2px `--secondary-button-foreground` at 30%, no offset; border becomes `--secondary-button-foreground`.
- **Disabled:** 50% opacity, no state changes.
- **Dark mode (Sidebar / dark panels):** retains light-gray bg + navy text — NOT inverted (per memory rule).

---

## 13. OTHER BUTTON VARIANTS

- **Outline:** 1px border `#0A3159`, transparent bg, navy text; hover bg `primary/14`, active `primary/22`. Dark mode swaps border to `--primary`.
- **Ghost:** transparent bg, navy text; hover `primary/14`, active `primary/22`. Used inside dense toolbars.
- **Link:** color `#1C63A6`, no background, underline on hover only.
- **Tonal:** `--secondary-container` bg, `--on-secondary-container` text. For low-emphasis tertiary actions only.
- **Elevated:** `--surface-container-low` bg, subtle shadow; navy text.
- **Destructive:** `--destructive` bg, white text, hover 75% opacity, active 65%. Reserved for delete/remove confirmations.
- All variants share Primary's radius, sizing scale, focus-ring offset behavior, disabled rule, and the "no scale/lift/shadow on hover" rule.

---

## 14. EXPANDABLE ICON BUTTON

**Component:** `src/components/ui/expandable-icon-button.tsx`

- ≥1368px viewport: renders as full secondary button — icon + label, h-9, 12px horizontal padding, 8px gap.
- <1368px viewport: collapses to icon-only, 36×36 (`min-w-9`), no padding/gap.
  - Hover smoothly expands to show label: padding 12px, gap 8px, 200ms ease-in-out grid-cols transition.
- `data-[state=open]` swaps to active secondary tokens regardless of viewport.
- Accessible name always present via `aria-label` (even when label visible).

---

## 15. EXPANDABLE SEARCH

**Component:** `src/components/ui/expandable-search.tsx`

- Collapsed: 36×36 secondary icon button with search glyph.
- Click → expands to 256px wide input, auto-focuses, retains double-border focus style (§7).
- Esc / X / outside-click with empty value → collapses, clears value.
- Enter → fires `onSearch(value)`; X always clears and collapses.
- Transition: width + opacity 200ms ease-in-out.

---

## 16. TOGGLES / TOGGLE GROUPS / VIEW MODE TOGGLE

- Each toggle item is a secondary button with `data-[state=on]` semantics.
- Toggle group: items share a row, no gap between (segmented look); first item radius-left 10px, last radius-right 10px, middle 0.
- Single border around the group, dividers between items 1px navy at 20%.
- Selected item: active secondary tokens; others: default.

---

## 17. TOOLBARS (Engagement, RichText, FAB)

- Inline flex row, 8px gap, 8px padding, background `--toolbar-bg`, border `--toolbar-border` 1px, radius 12px.
- All buttons inside use secondary or expandable-icon-button variants.
- RichText toolbar: floating, anchored to selection; respects viewport bounds (flips above/below); 200ms fade-in.
- Floating Action Bar: draggable, snaps to bottom-left / bottom-center / bottom-right zones; position persisted; never overlaps sticky table headers (per memory rule).

---

## 18. NOTIFICATIONS (Sonner toasts + header popover)

- Toast: custom card aesthetic, white bg, navy border 1px, radius 12px, 16px padding, shadow `--shadow-toast`.
- Shrinking progress bar 2px at bottom indicating remaining time.
- Max 3 stacked, newest on top, 8px gap.
- Action button inside toast: secondary `sm`.
- Header notification popover: list of items, each row 56px, hover `--accent`, action on click.

---

## 19. ASK LUKA OVERLAY

- Two modes: half-screen (right 50%) and full-screen; smooth transition 240ms.
- Background: light surface, rounded-left 16px (half-screen), full radius 0 (full-screen).
- Sidebar inside overlay is collapsible; collapsed = icon strip.
- Prompt chips: secondary `sm` buttons, wrap to next row at gap 8px.
- Send button: primary, icon-right.
- Voice button: secondary `icon`, mic icon; recording overlay covers input row with waveform.
- Z-index above all page content, below dialogs.

---

## 20. ACCESSIBILITY (Global)

- Contrast: text on background ≥ 4.5:1; large text & icons ≥ 3:1; focus ring vs adjacent surface ≥ 3:1.
- Every interactive element has a visible focus indicator (per variant rules above).
- Every icon-only control has `aria-label`.
- Keyboard: full tab order matches visual order; Esc closes overlays; Enter/Space activate buttons; arrow keys navigate menus/toggle groups.
- Reduced motion: all decorative animations (orb pulse, swing, sparkle spin) disable; functional transitions (color, opacity, width) cap at 200ms.
- Font scaling toggle A / AA / AAA applies a root class; all components must scale without clipping or overflow.
- ARIA roles correct on dialogs (`role="dialog"`, `aria-modal`), menus (`role="menu"`), tabs (`role="tablist"`), live regions for toasts (`role="status"`).

---

## 21. RESPONSIVE BEHAVIOR

- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`; compact icon-button threshold 1368.
- ≥1280px: full sidebar + right panel; header shows all labels.
- 1024–1280px: sidebar collapsible default-expanded; right panel default-collapsed.
- <1024px: sidebar becomes offcanvas drawer; right panel hidden, accessible via header button.
- <768px: header collapses action labels; dialogs become full-screen sheets; tables horizontal-scroll within their container (page does not scroll horizontally).

---

## 22. THEMING

- Single theme: **Navy Core**. No theme switcher (per memory rule).
- All colors defined as HSL triplets in `:root` and `.dark` blocks of `src/index.css`.
- Components must reference semantic tokens — never raw Tailwind color classes (`text-white`, `bg-black`, etc.) except for Primary's explicit brand hex.
- Dark mode applies only to: Sidebar, secondary side panels. Page content remains light.

---

## 23. MOTION

- Default transition: 200ms ease-out for color / background / border / opacity / width / transform-rotate.
- Forbidden globally: hover scale, hover translate, hover drop-shadow on cards and buttons (per memory rule).
- Allowed signature motion: Luka logo orb pulse, notification swing (single cycle), sparkle icon infinite spin, RichText toolbar fade, sidebar width transition.

---

## 24. DEFINITION OF DONE (per page / per component)

A page or component passes acceptance when:
1. All states (default, hover, active, focus-visible, disabled, open, on, selected, error, loading, empty) match the criteria above.
2. Tokens are sourced from `index.css` / `tailwind.config.ts` — no inline hex except documented brand exceptions.
3. Keyboard, screen-reader, and reduced-motion paths are verified.
4. Layout holds at 1920 / 1440 / 1374 / 1280 / 1024 / 768 / 390 widths without horizontal scroll on the page shell.
5. Light/dark surfaces (where applicable) render correctly without color inversion regressions.
6. No console errors, no React key warnings, no a11y violations from axe at level AA.
