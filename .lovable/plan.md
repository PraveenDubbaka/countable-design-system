# Acceptance Criteria — Global Design System (Countable)

**Scope:** Authoritative, copy-paste-ready acceptance criteria for every layout, section, header, left navigation, and shared component in the app. All criteria are global — they must hold on every page, every viewport. Theme is locked to **Navy Core**. Values below are inlined as raw colors (hex) and pixel sizes; the source of truth still lives in `src/index.css` and `tailwind.config.ts`.

---

## 1. GLOBAL APP SHELL / LAYOUT

**Component:** `src/components/Layout.tsx`

- App container fills 100% of the viewport height (100vh) and 100% width; no body scroll — only inner `<main>` scrolls.
- Background renders the Navy Core radial-gradient stack on **#0C2D55**; gradient is fixed (does not scroll with content).
- Three-column flex shell: Sidebar (left) → Content wrapper (center, `flex-1`) → Right panel portal (right). Portals: `#sidebar-secondary-portal` and `#right-panel-portal` must render even when empty (0px width, 100% height).
- `<main>` card uses background **#FFFFFF**, border-radius **12px**, shadow `0 4px 24px rgba(0,0,0,0.35)`, with 4px bottom and 4px right gutter so the gradient frames the card on bottom and right.
- Header wrapper sits above the content row, full-width, transparent (gradient shows through).
- Content overflow: only inner `<main>` scrolls (overflow-auto); shell is overflow-hidden.
- Z-order: portals < main content < header < sidebar overlays < dialogs < toasts.
- No horizontal scrollbar at any supported viewport (≥1024px desktop; ≥360px mobile).

---

## 2. GLOBAL HEADER

**Component:** `src/components/GlobalHeader.tsx`

- Spans full width of the content area, height **56px**, transparent background (Navy Core gradient #0C2D55 visible behind).
- Left slot: page title rendered as **single H1**, Inter **18px / weight 600**, color **#FFFFFF**, no truncation up to header width — then ellipsis.
- Optional back button: secondary variant, 28×28px (icon-sm), sits 8px left of title, only when `showBackButton` is true.
- Right slot (fixed order): Accessibility toggle → Notifications → Settings → Ask Luka.
  - Accessibility, Notifications, Settings: secondary icon buttons, **36×36px**, transparent border on header.
  - Notifications: dot indicator when unread; swing animation on new notification (≤600ms, ease-out, single cycle, respects reduced-motion).
  - Ask Luka: **primary** button, label "Ask Luka", icon left, background **#0C2D55**, text **#FFFFFF** — must match Primary button criteria in §11.
- Header never wraps to a second row. On <1280px, hide Accessibility label (icon only); below 1024px, collapse Settings into overflow menu.
- Header is always visible — does not hide on scroll. No drop shadow.

---

## 3. LEFT NAVIGATION (SIDEBAR)

**Component:** `src/components/Sidebar.tsx`

### Structure
- Fixed left column, 100vh, dark navy surface (**#0C2D55** background), independent of route theme.
- Width: expanded = **240px**, collapsed = **64px**. State persists in `localStorage`.
- Sections, top → bottom: Logo → Primary nav tree → Spacer → Secondary nav (Templates, Design System) → User block.
- No visible scrollbar (scroll allowed but hidden globally).

### Logo
- Luka mark: white Zap icon on gradient orb, animated orb pulse (infinite, respects reduced-motion).
- Click on logo → routes to `/`.

### Nav items
- Inter **15px / weight 500**; icon **18px** left of label with **12px** gap.
- Default: text **#FFFFFF**, icon inherits.
- Hover: background rgba(255,255,255,0.06) (subtle navy lift, no scale, no shadow).
- Active route (NavLink `isActive`): background rgba(255,255,255,0.12), text/icon **#FFFFFF**, left **3px** navy indicator bar **#0C2D55**.
- Focus-visible: ring **2px #1C63A6**, no offset.
- Collapsed state: icon-only, centered in 64px column, tooltip on hover (right side, 8px gap).

### Folder / tree items
- Custom folder icons (open/closed) from `FolderIcons.tsx`; chevron right on collapsed, chevron down on expanded.
- Leaf items indented **24px** from parent.
- Expanded group containing active route stays open by default.

### Sidebar collapse toggle
- Circular button, **24×24px**, sits on right edge of sidebar at vertical center of viewport, visible only on hover over the sidebar edge (200ms fade).
- Click toggles expand/collapse with 200ms width transition.
- Does not overlap nav items at any width.

### Secondary panel (when a nav item opens one)
- Renders inside `#sidebar-secondary-portal` (right of sidebar, left of main).
- Width: resizable **280–480px**, persisted to localStorage.
- Background **#FFFFFF** (light) / **#1A2942** (dark).
- Rounded right side only (**20px / 1.25rem cockpit radius** outer, square against sidebar).
- Drag handle: **4px** wide, centered vertically, cursor `col-resize`, hover shows accent **#1C63A6**.

---

## 4. SECONDARY PANELS (RIGHT PANEL)

**Components:** `EngagementRightPanel.tsx`, `ClientRightPanel.tsx`

- Render inside `#right-panel-portal`, sit at right edge of content area.
- Width: **360px** default, resizable **320–560px**, persisted.
- Full content-area height, with **4px** bottom gutter matching main card.
- Background **#FFFFFF**; rounded left side only (**20px cockpit**); border **1px #D3DAE3** on the left edge only.
- Internal scroll, hidden scrollbar.
- Close button: secondary icon-sm (28×28px), top-right, **8px** inset.
- Expand handle: fixed centered on inner left edge, **24×48px**, no gap to panel.

---

## 5. PAGE CONTENT AREA (`<main>`)

- Padding: top **24px**, sides **24px**, bottom **24px** (overridden by full-bleed pages like Trial Balance).
- Default content width: full main width; opt-in `max-w-[1280px] mx-auto` for forms/settings.
- Section spacing: **24px** vertical rhythm between top-level blocks; **16px** between sub-blocks; **8px** between label/control pairs.
- Page title (when not in global header): H1 navy **#0C2D55**, Inter **24px / weight 700**, margin-top 0, margin-bottom **16px**.
- Sub-section headings: H2 **18px / 600** navy **#0C2D55**; H3 **16px / 600**.
- Body text: Inter **15px / 400**, color **#101828** (never gray).
- Helper text: **13px / 400**, color **#101828** at 70% opacity max — never `text-gray-*`.

---

## 6. TABLES

**Components:** `ChecklistTableView.tsx`, Trial Balance table, Clients table, Teams table.

- Borderless layout — only horizontal row dividers **1px #E5E7EB**.
- Header row: sticky to top of scroll container, background **#F5F7FA**, text navy **#0C2D55** **13px / 600** uppercase tracking-wide.
- Row height: **44px** standard; **56px** with avatar; never grows on edit.
- Cell padding: **12px** horizontal, **8px** vertical; first/last cell get **16px** outer padding.
- Text truncation: single line with ellipsis by default; tooltip on hover when truncated.
- Row hover: background **#F5F7FA**; no scale, no shadow.
- Selected row: background **#E8EFF7**, **2px** left navy bar **#0C2D55**.
- Sort headers: secondary-button-styled inline triggers with chevron; `aria-sort` reflected.
- Empty state: centered illustration + heading + secondary CTA, **64px** vertical padding.
- Action column: sticky right, transparent background, icon buttons only (secondary icon-sm 28×28px).

---

## 7. FORMS

**Components:** `Input`, `Textarea`, `Select`, `Calendar`, `DatePicker`, `RadioGroup`, `Checkbox`, `Switch`.

### Inputs & textareas
- Height **36px**; textarea min-height **80px**, auto-grow optional.
- Background **#FFFFFF**, border **1px #D3DAE3**, radius **10px**.
- Text **15px / 400** navy **#0C2D55**; placeholder **#101828** at 50%.
- Focus: **double border** — inner **2px #1C63A6** (blue), outer **2px** transparent offset ring.
- Disabled: 50% opacity, no border change.
- Error: border **#BC2828**, error text below **13px** in **#BC2828**.

### Select / DatePicker triggers
- Render as **secondary buttons** — must satisfy §12 (incl. `data-[state=open]` active token swap).
- Chevron icon **16px** right, rotates 180° on open (200ms).

### Date input
- Width `fit-content` (does not stretch to container).
- Calendar popover: background **#FFFFFF**, radius **12px**, **16px** padding, selected day = primary navy fill **#0C2D55**.

### Radio cards (Settings/Luka Autopilot)
- Card 100% width, **12px** padding, radius **10px**, border **1px #D3DAE3**.
- Selected: **2px** border **#0C2D55**, background **#0C2D55** at 8% opacity, no shadow.
- Hover (unselected): border darkens to **#A8B2C1**; no lift.

### Switch
- **36×20px**, track off **#E5E7EB** / on **#0C2D55**, thumb **16px** white with subtle border **#D3DAE3**.

### Labels
- **13px / 600** navy **#0C2D55**, **4px** above control. Required marker `*` in **#BC2828**.

### Form layout
- Fields stack vertically on mobile; 2-column grid ≥768px when grouped; **24px** gap.
- Inline help text **13px** below field.

---

## 8. DIALOGS / SHEETS / POPOVERS

### Dialog
- Centered, max-width **480px** (default) / **640px** (medium) / **800px** (large).
- Background **#FFFFFF**, radius **16px**, shadow `0 24px 48px rgba(12,45,85,0.25)`, padding **24px**.
- Overlay: **rgba(12,45,85,0.6)**, blur **4px**.
- Header: title **18px / 600**, optional description **14px / 400** color **#101828**.
- Footer: actions right-aligned, **8px** gap; primary on right, secondary on left.
- Close button: secondary icon-sm 28×28px, top-right **16px** inset.
- Escape closes; clicking overlay closes (unless `disableOutsideClose`).
- Focus trapped inside; focus returns to trigger on close.
- Destructive confirmations (delete, duplicate) use AlertDialog with destructive variant (background **#BC2828**, text **#FFFFFF**) on the confirm action.

### Sheet (Settings panel, Add Checklist)
- Slides from right, width **900px** (Settings) / **720px** (default), full height.
- Same header/footer rules as Dialog.
- Dual-pane layout where applicable (Settings) — left nav **240px**, right content scrolls.

### Popover / DropdownMenu
- Background **#FFFFFF**, border **1px #D3DAE3**, radius **10px**, shadow `0 8px 24px rgba(12,45,85,0.15)`, padding **4px**.
- Items: height **36px**, **12px** horizontal padding, **15px / 400**, hover background **#F5F7FA**, selected (checkmark) background **#E8EFF7**.
- Min-width matches trigger; max-width **320px**.

---

## 9. CARDS

- Background **#FFFFFF**, border **1px #D3DAE3**, radius **12px**, padding **16px**.
- **No hover scale, no vertical lift, no drop shadow.**
- Header (optional): title **16px / 600** navy **#0C2D55**, action slot right.
- Footer: **12px** top padding, separator **1px #D3DAE3** above when present.
- Status / summary cards (Dashboard, Teams): same rules, animations explicitly disabled.

---

## 10. BADGES / PILLS

- Height **22px**, radius **999px** (pill), padding **8px** horizontal, **12px / 600**.
- Variants:
  - info: bg **#E8EFF7**, text **#0C2D55**
  - success: bg **#E6F4EA**, text **#1E7E34**
  - warning: bg **#FFF4E5**, text **#9A5B00**
  - destructive: bg **#FCE8E8**, text **#BC2828**
  - neutral: bg **#F5F7FA**, text **#101828**
- Text wraps allowed for long labels (no single-line forcing).
- No border by default.

---

## 11. PRIMARY BUTTON

**Component:** `src/components/ui/button.tsx` variant `default`.

- Background **#0C2D55**, text **#FFFFFF**, border transparent, radius **10px**.
- Sizes: `sm` h-32px / px-12px, `default` h-36px / px-16px, `lg` h-44px / px-24px; icon variants 36×36 / 28×28 / 44×44.
- Font: Inter **15px / 600**, line-height 1.3, no letter-spacing.
- Icon: **18px**, color **#FFFFFF**, **8px** gap from label.
- **Hover:** background **#244266**, 200ms color transition; no scale, no lift, no shadow.
- **Active/pressed:** background **#081F3B**.
- **Focus-visible (keyboard):** background unchanged, ring **2px #A3A3A3** at 50% opacity, offset **2px** against **#FFFFFF**.
- **Disabled:** opacity 50%, pointer-events none, no state changes.
- Loading state (when used): spinner replaces icon, label stays, button disabled.

---

## 12. SECONDARY BUTTON (CRITICAL — global)

**Component:** `src/components/ui/button.tsx` variant `secondary`.

- Background **#F5F7FA**, text **#0C2D55**, border **1px #D3DAE3**, radius **10px**, height **36px**.
- Font / icon / sizes identical to Primary. Icon color **#0C2D55**.
- **Hover:** background **#E8EDF3**, border **#BFC8D4**; 200ms transition.
- **Active/pressed:** background **#DCE3EB**, border **#AEB9C7**.
- **Selected / open state (must apply to every dropdown, select, popover, toggle trigger):**
  - `data-[state=open]` → active token set (background **#DCE3EB**, border **#AEB9C7**).
  - `data-[state=on]` → active token set.
  - `aria-selected="true"` → active token set.
- **Focus-visible:** ring **2px #0C2D55** at 30%, no offset; border becomes **#0C2D55**.
- **Disabled:** 50% opacity, no state changes.
- **Dark mode (Sidebar / dark panels):** retains light-gray bg **#F5F7FA** + navy text **#0C2D55** — NOT inverted.

---

## 13. OTHER BUTTON VARIANTS

- **Outline:** border **1px #0A3159**, background transparent, text **#0C2D55**; hover background **#0C2D55** at 14%, active 22%. Dark mode swaps border to primary.
- **Ghost:** background transparent, text **#0C2D55**; hover **#0C2D55** at 14%, active 22%. Used inside dense toolbars.
- **Link:** color **#1C63A6**, no background, underline on hover only.
- **Tonal:** background **#E2E8F0**, text **#0C2D55**. For low-emphasis tertiary actions only.
- **Elevated:** background **#F9FAFC**, shadow `0 1px 2px rgba(0,0,0,0.15)`; text **#0C2D55**.
- **Destructive:** background **#BC2828**, text **#FFFFFF**, hover 75% opacity, active 65%. Reserved for delete/remove confirmations.
- All variants share Primary's radius (**10px**), sizing scale, focus-ring offset behavior, disabled rule, and the "no scale/lift/shadow on hover" rule.

---

## 14. EXPANDABLE ICON BUTTON

**Component:** `src/components/ui/expandable-icon-button.tsx`

- ≥1368px viewport: renders as full secondary button — icon + label, height **36px**, **12px** horizontal padding, **8px** gap.
- <1368px viewport: collapses to icon-only, **36×36px**, no padding/gap.
  - Hover smoothly expands to show label: padding **12px**, gap **8px**, 200ms ease-in-out grid-cols transition.
- `data-[state=open]` swaps to active secondary tokens (bg **#DCE3EB**, border **#AEB9C7**) regardless of viewport.
- Accessible name always present via `aria-label` (even when label visible).

---

## 15. EXPANDABLE SEARCH

**Component:** `src/components/ui/expandable-search.tsx`

- Collapsed: **36×36px** secondary icon button with search glyph.
- Click → expands to **256px** wide input, auto-focuses, retains double-border focus style (inner **2px #1C63A6**, outer **2px** offset).
- Esc / X / outside-click with empty value → collapses, clears value.
- Enter → fires `onSearch(value)`; X always clears and collapses.
- Transition: width + opacity 200ms ease-in-out.

---

## 16. TOGGLES / TOGGLE GROUPS / VIEW MODE TOGGLE

- Each toggle item is a secondary button with `data-[state=on]` semantics.
- Toggle group: items share a row, **0px** gap between (segmented look); first item radius-left **10px**, last radius-right **10px**, middle 0.
- Single border **1px #D3DAE3** around the group, dividers between items **1px #0C2D55** at 20%.
- Selected item: active secondary tokens (bg **#DCE3EB**, text **#0C2D55**); others: default.

---

## 17. TOOLBARS (Engagement, RichText, FAB)

- Inline flex row, **8px** gap, **8px** padding, background **#FFFFFF**, border **1px #D3DAE3**, radius **12px**.
- All buttons inside use secondary or expandable-icon-button variants.
- RichText toolbar: floating, anchored to selection; respects viewport bounds (flips above/below); 200ms fade-in.
- Floating Action Bar: draggable, snaps to bottom-left / bottom-center / bottom-right zones; position persisted; never overlaps sticky table headers.

---

## 18. NOTIFICATIONS (Sonner toasts + header popover)

- Toast: background **#FFFFFF**, border **1px #0C2D55**, radius **12px**, padding **16px**, shadow `0 8px 24px rgba(12,45,85,0.18)`.
- Shrinking progress bar **2px** at bottom indicating remaining time, color **#0C2D55**.
- Max 3 stacked, newest on top, **8px** gap.
- Action button inside toast: secondary `sm` (height **32px**).
- Header notification popover: list of items, each row **56px**, hover background **#F5F7FA**, action on click.

---

## 19. ASK LUKA OVERLAY

- Two modes: half-screen (right 50%) and full-screen; smooth transition 240ms.
- Background **#FFFFFF**, rounded-left **16px** (half-screen), radius 0 (full-screen).
- Sidebar inside overlay is collapsible; collapsed = icon strip.
- Prompt chips: secondary `sm` buttons (height **32px**), wrap to next row at gap **8px**.
- Send button: primary, icon-right (**#0C2D55** bg / **#FFFFFF** text).
- Voice button: secondary icon (36×36px), mic icon; recording overlay covers input row with waveform.
- Z-index above all page content, below dialogs.

---

## 20. ACCESSIBILITY (Global)

- Contrast: text on background ≥ 4.5:1; large text & icons ≥ 3:1; focus ring vs adjacent surface ≥ 3:1.
- Every interactive element has a visible focus indicator (per variant rules above).
- Every icon-only control has `aria-label`.
- Keyboard: full tab order matches visual order; Esc closes overlays; Enter/Space activate buttons; arrow keys navigate menus/toggle groups.
- Reduced motion: all decorative animations (orb pulse, swing, sparkle spin) disable; functional transitions (color, opacity, width) cap at 200ms.
- Font scaling toggle: **A (15px) / AA (16px) / AAA (17px)** applies a root class; all components must scale without clipping or overflow.
- ARIA roles correct on dialogs (`role="dialog"`, `aria-modal`), menus (`role="menu"`), tabs (`role="tablist"`), live regions for toasts (`role="status"`).

---

## 21. RESPONSIVE BEHAVIOR

- Breakpoints (px): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`; compact icon-button threshold **1368px**.
- ≥1280px: full sidebar (240px) + right panel (360px); header shows all labels.
- 1024–1280px: sidebar collapsible default-expanded; right panel default-collapsed.
- <1024px: sidebar becomes offcanvas drawer; right panel hidden, accessible via header button.
- <768px: header collapses action labels; dialogs become full-screen sheets; tables horizontal-scroll within their container (page does not scroll horizontally).

---

## 22. THEMING

- Single theme: **Navy Core**. No theme switcher.
- Brand colors: primary **#0C2D55**, accent navy **#0A3159**, link **#1C63A6**, surface **#FFFFFF**, body text **#101828**, divider **#D3DAE3**, soft surface **#F5F7FA**, error **#BC2828**.
- All colors defined as HSL triplets in `:root` and `.dark` blocks of `src/index.css`; the hex values above are the resolved equivalents.
- Components must reference semantic tokens — never raw Tailwind color classes (`text-white`, `bg-black`) except for the documented brand hex exceptions on Primary (#0C2D55, #244266, #081F3B) and known hardcoded brand colors.
- Dark mode applies only to: Sidebar, secondary side panels. Page content remains light (**#FFFFFF**).

---

## 23. MOTION

- Default transition: **200ms** ease-out for color / background / border / opacity / width / transform-rotate.
- Forbidden globally: hover scale, hover translate, hover drop-shadow on cards and buttons.
- Allowed signature motion: Luka logo orb pulse, notification swing (single cycle ≤600ms), sparkle icon infinite spin, RichText toolbar fade, sidebar width transition (200ms).

---

## 24. DEFINITION OF DONE (per page / per component)

A page or component passes acceptance when:
1. All states (default, hover, active, focus-visible, disabled, open, on, selected, error, loading, empty) match the criteria above with the exact colors and pixel values.
2. Hex/px values are sourced from this doc or `src/index.css` / `tailwind.config.ts` — no ad-hoc values.
3. Keyboard, screen-reader, and reduced-motion paths are verified.
4. Layout holds at **1920 / 1440 / 1374 / 1280 / 1024 / 768 / 390px** widths without horizontal scroll on the page shell.
5. Light/dark surfaces (where applicable) render correctly without color inversion regressions.
6. No console errors, no React key warnings, no a11y violations from axe at level AA.
