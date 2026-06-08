# Design System — UI Testing Acceptance Criteria

**Audience:** QA / UI Testers.
**Scope:** Every module/component below lists user-facing **Acceptance Criteria** written as testable Given/When/Then statements with exact pixel and hex values. A criterion passes only when the visible UI matches the stated value at the stated viewport, state, and interaction.
**Theme:** Locked to **Navy Core** (no theme switcher).
**Source of truth:** `src/index.css`, `tailwind.config.ts`. Values inlined below MUST match the rendered UI.

**How to read each section:**
- *Preconditions* — app state required before testing.
- *Acceptance Criteria* — numbered, verifiable checks. Each is PASS/FAIL.
- *Negative checks* — things that must NOT happen.

---

## 1. GLOBAL APP SHELL / LAYOUT
**File:** `src/components/Layout.tsx`

**Preconditions:** User is on any authenticated route at viewport ≥1024px wide.

**Acceptance Criteria**
1. Given the app loads, then the outer container fills the full viewport: width = 100vw, height = 100vh (no body scrollbar visible).
2. Given the page renders, then the background is the Navy Core radial gradient on base color **#0C2D55**; gradient stays fixed when inner content scrolls.
3. Given the shell renders, then three columns are present in this order: Sidebar (left) → Content wrapper (center) → Right panel portal (right).
4. Given the main content card renders, then it has: background **#FFFFFF**, border-radius **12px**, shadow `0 4px 24px rgba(0,0,0,0.35)`, **4px** gutter at bottom and **4px** gutter at right (gradient visible in those gutters).
5. Given content overflows, then only the inner `<main>` scrolls; the shell does NOT scroll.
6. Given a dialog opens, then z-order from back→front is: portals → main → header → sidebar overlays → dialogs → toasts.

**Negative checks**
- No horizontal scrollbar on the page shell at 1920 / 1440 / 1280 / 1024 / 768 / 390px.
- Right panel portal element exists in DOM even when empty (0px width).

---

## 2. GLOBAL HEADER
**File:** `src/components/GlobalHeader.tsx`

**Preconditions:** Any route. Viewport ≥1280px unless noted.

**Acceptance Criteria**
1. Header height is **56px**, spans full width of content area, background is transparent (Navy gradient visible).
2. Page title renders as a **single H1**, font Inter, size **18px**, weight **600**, color **#FFFFFF**; long titles truncate with ellipsis at header width.
3. When `showBackButton=true`, a secondary back button (28×28px) appears **8px** to the left of the title.
4. Right-side action order is fixed: Accessibility → Notifications → Settings → **Ask Luka**.
5. Accessibility / Notifications / Settings render as secondary icon buttons sized **36×36px** with transparent border over the header.
6. Notifications button shows a dot indicator when unread; on new notification it swings once (≤600ms ease-out); animation respects `prefers-reduced-motion`.
7. Ask Luka renders as a **Primary** button: background **#0C2D55**, text **#FFFFFF**, label "Ask Luka", icon on left.
8. At viewport <1280px the Accessibility label is hidden (icon only). At viewport <1024px Settings collapses into an overflow menu.
9. The header is always visible (does not hide on scroll) and has no drop shadow.

**Negative checks**
- Header never wraps to a second row at any supported width.

---

## 3. LEFT NAVIGATION (SIDEBAR)
**File:** `src/components/Sidebar.tsx`

**Preconditions:** Authenticated user, any route.

**Acceptance Criteria**
1. Sidebar is fixed to the left, height 100vh, background **#0C2D55** (dark navy) regardless of route.
2. Width = **240px** when expanded, **64px** when collapsed; state persists across reload via `localStorage`.
3. Top-to-bottom sections: Logo → Primary nav tree → Spacer → Secondary nav (Templates, Design System) → User block.
4. Scrollbar is NOT visible even when content overflows.
5. Logo: white Zap glyph on gradient orb; orb pulses infinitely (disabled with reduced-motion). Clicking the logo navigates to `/`.
6. Nav items: Inter **15px / 500**; icon **18px** with **12px** gap before label; default text color **#FFFFFF**.
7. Hover state on a nav item: background rgba(255,255,255,0.06); NO scale, NO translate, NO shadow.
8. Active route: background rgba(255,255,255,0.12), text/icon **#FFFFFF**, **3px** left indicator bar in **#0C2D55**.
9. Focus-visible: ring **2px #1C63A6**, no offset.
10. Collapsed sidebar shows icons only, centered in 64px column; hover shows tooltip **8px** right of the item.
11. Folder/tree items use custom open/closed folder icons; chevron right when collapsed, chevron down when expanded; leaf items are indented **24px** from parent.
12. Sidebar collapse toggle: **24×24px** circular button on right edge at vertical center; appears only on sidebar-edge hover (200ms fade); click toggles width with 200ms transition.
13. Trial Balance (TB) level-1 item uses the **folder** icon (same as Engagements), NOT the worksheet icon.

**Negative checks**
- Collapse toggle never overlaps a nav item at any width.
- No visible scrollbar track anywhere in the sidebar.

---

## 4. SECONDARY PANELS (RIGHT PANEL)
**Files:** `EngagementRightPanel.tsx`, `ClientRightPanel.tsx`

**Acceptance Criteria**
1. Right panel renders inside `#right-panel-portal` at the right edge of content.
2. Default width **360px**, resizable between **320px** and **560px**; width persists across reload.
3. Panel height equals full content-area height with **4px** gutter at the bottom (matches main card).
4. Background **#FFFFFF**; left side rounded **20px** (cockpit radius); right side square; **1px** border in **#D3DAE3** on left edge only.
5. Internal scrolling works but no scrollbar is visible.
6. Close button: secondary icon-sm (**28×28px**), inset **8px** from top-right.
7. Expand handle is fixed at vertical center of the inner left edge, **24×48px**, with no visible gap between handle and panel.

---

## 5. PAGE CONTENT AREA (`<main>`)

**Acceptance Criteria**
1. Default padding: top/right/bottom/left all **24px** (overridden only on full-bleed pages such as Trial Balance).
2. Vertical spacing rhythm: **24px** between top-level blocks, **16px** between sub-blocks, **8px** between label and control.
3. In-page page title is H1, Inter **24px / 700**, color **#0C2D55**, margin-top 0, margin-bottom **16px**.
4. Sub-headings: H2 Inter **18px / 600** color **#0C2D55**; H3 Inter **16px / 600**.
5. Body text: Inter **15px / 400**, color **#101828**.
6. Helper/muted text: **13px / 400**, color **#101828** (max 70% opacity). Must never appear as `text-gray-*`.

**Negative checks**
- No gray (#9CA3AF / #6B7280 / etc.) text anywhere; muted text is always **#101828**.

---

## 6. TABLES
**Files:** `ChecklistTableView.tsx`, Trial Balance, Clients, Teams.

**Acceptance Criteria**
1. Table has no outer borders; only horizontal row dividers visible at **1px #E5E7EB**.
2. Header row sticks to top of scroll container; background **#F5F7FA**; text Inter **13px / 600**, color **#0C2D55**, uppercase, wide tracking.
3. Standard row height **44px**; rows with avatar **56px**. Row height does NOT change when a cell enters edit mode.
4. Cell padding: **12px** horizontal × **8px** vertical; first and last cells additionally get **16px** outer padding.
5. Long cell text truncates with ellipsis on one line; hovering a truncated cell shows a tooltip with full text.
6. Row hover background: **#F5F7FA**; NO scale, NO shadow.
7. Selected row: background **#E8EFF7** with **2px** left bar in **#0C2D55**.
8. Sort header buttons render as secondary buttons with chevron; `aria-sort` attribute reflects the current sort.
9. Empty state: centered illustration + heading + secondary CTA; **64px** vertical padding.
10. Action column is sticky right with transparent background and only secondary icon-sm (**28×28px**) buttons.

---

## 7. FORMS

**Acceptance Criteria — Inputs & textareas**
1. Input height **36px**; textarea min-height **80px**.
2. Background **#FFFFFF**, border **1px #D3DAE3**, border-radius **10px**.
3. Text Inter **15px / 400** color **#0C2D55**; placeholder color **#101828** at 50% opacity.
4. Focus: inner border **2px #1C63A6** + outer **2px** transparent offset ring (double-border look).
5. Disabled: opacity 50%, border unchanged, pointer-events none.
6. Error: border **#BC2828**; error message below in **13px #BC2828**.

**Acceptance Criteria — Select / DatePicker triggers**
7. Triggers are styled as secondary buttons (see §12) and visibly switch to "active" tokens when `data-[state=open]`.
8. Chevron icon is **16px** on the right and rotates 180° (200ms) when opened.

**Acceptance Criteria — Date input**
9. Date input width = `fit-content`; it does NOT stretch to fill its container.
10. Calendar popover: background **#FFFFFF**, radius **12px**, padding **16px**; the selected day is filled with **#0C2D55**.

**Acceptance Criteria — Radio cards (e.g. Settings → Luka Autopilot)**
11. Card fills row width; padding **12px**; radius **10px**; border **1px #D3DAE3**.
12. Selected card: border **2px #0C2D55**; background **#0C2D55** at 8% opacity; no shadow.
13. Hover (unselected): border darkens to **#A8B2C1**; no lift.

**Acceptance Criteria — Switch**
14. Track **36×20px**; off color **#E5E7EB**, on color **#0C2D55**; thumb **16px**, white with **#D3DAE3** border.

**Acceptance Criteria — Labels / layout**
15. Labels Inter **13px / 600** in **#0C2D55**, sitting **4px** above the control. Required marker `*` rendered in **#BC2828**.
16. Form layout: 1-column on mobile, 2-column grid ≥768px when grouped, with **24px** gap.

---

## 8. DIALOGS / SHEETS / POPOVERS

**Acceptance Criteria — Dialog**
1. Centered; max-width **480px** default / **640px** medium / **800px** large.
2. Background **#FFFFFF**, radius **16px**, shadow `0 24px 48px rgba(12,45,85,0.25)`, padding **24px**.
3. Overlay color rgba(12,45,85,0.6) with backdrop blur **4px**.
4. Header title **18px / 600**; optional description **14px / 400** in **#101828**.
5. Footer actions are right-aligned with **8px** gap; primary on right, secondary on left.
6. Close button: secondary icon-sm (**28×28px**), inset **16px** from top-right.
7. Pressing Escape closes the dialog; clicking the overlay closes it unless `disableOutsideClose` is set.
8. Focus is trapped while open and returns to the trigger element on close.
9. Destructive confirms (delete, duplicate) use AlertDialog; the confirm action is destructive variant (background **#BC2828**, text **#FFFFFF**).

**Acceptance Criteria — Sheet**
10. Settings sheet slides from right, width **900px**, full height, dual-pane (left nav 240px + right scroll area).
11. Default sheet width is **720px**.

**Acceptance Criteria — Popover / DropdownMenu**
12. Background **#FFFFFF**, border **1px #D3DAE3**, radius **10px**, shadow `0 8px 24px rgba(12,45,85,0.15)`, padding **4px**.
13. Items: height **36px**, horizontal padding **12px**, text **15px / 400**; hover background **#F5F7FA**; selected item background **#E8EFF7** with checkmark.
14. Popover min-width matches trigger width; max-width **320px**.

---

## 9. CARDS

**Acceptance Criteria**
1. Background **#FFFFFF**, border **1px #D3DAE3**, radius **12px**, padding **16px**.
2. Hovering a card does NOT scale, lift, or add shadow.
3. Optional card header: title **16px / 600** color **#0C2D55**; action slot on right.
4. Optional footer: **12px** top padding with **1px #D3DAE3** separator above.
5. Dashboard / Teams status cards follow the same rules and have all animations explicitly disabled.

---

## 10. BADGES / PILLS

**Acceptance Criteria**
1. Height **22px**, radius **999px** (pill), horizontal padding **8px**, text **12px / 600**, no border.
2. Variant colors:
   - info — bg **#E8EFF7**, text **#0C2D55**
   - success — bg **#E6F4EA**, text **#1E7E34**
   - warning — bg **#FFF4E5**, text **#9A5B00**
   - destructive — bg **#FCE8E8**, text **#BC2828**
   - neutral — bg **#F5F7FA**, text **#101828**
3. Long labels wrap to a second line (badges are NOT forced single-line).

---

## 11. PRIMARY BUTTON
**File:** `src/components/ui/button.tsx` variant `default`

**Acceptance Criteria**
1. Background **#0C2D55**, text **#FFFFFF**, border transparent, radius **10px**.
2. Sizes: sm h-32px / px-12px; default h-36px / px-16px; lg h-44px / px-24px; icon variants 36×36 / 28×28 / 44×44.
3. Font Inter **15px / 600**, line-height 1.3.
4. Icon **18px**, color **#FFFFFF**, **8px** gap from label.
5. Hover: background changes to **#244266** with 200ms transition; NO scale, NO lift, NO shadow.
6. Active/pressed: background **#081F3B**.
7. Focus-visible (keyboard): background unchanged; ring **2px #A3A3A3** at 50% opacity, offset **2px** on **#FFFFFF**.
8. Disabled: opacity 50%, pointer-events none, hover state does NOT change.
9. Loading: spinner replaces icon, label remains, button becomes disabled.

---

## 12. SECONDARY BUTTON (CRITICAL — global)
**File:** `src/components/ui/button.tsx` variant `secondary`

**Acceptance Criteria**
1. Background **#F5F7FA**, text **#0C2D55**, border **1px #D3DAE3**, radius **10px**, height **36px**.
2. Icon color **#0C2D55** (matches text exactly — never gray).
3. Hover: background **#E8EDF3**, border **#BFC8D4**; 200ms transition.
4. Active/pressed: background **#DCE3EB**, border **#AEB9C7**.
5. Open / selected state — must apply on EVERY dropdown trigger, select, popover trigger, toggle:
   - `data-[state=open]` → active tokens (bg **#DCE3EB**, border **#AEB9C7**).
   - `data-[state=on]` → active tokens.
   - `aria-selected="true"` → active tokens.
6. Focus-visible: ring **2px #0C2D55** at 30%, no offset; border becomes **#0C2D55**.
7. Disabled: opacity 50%, no state changes on hover.
8. Dark mode (Sidebar, dark panels): keeps light bg **#F5F7FA** and navy text **#0C2D55** — must NOT invert to dark bg / light text.

**Negative checks**
- Secondary button text or icon is NEVER gray; always **#0C2D55**.

---

## 13. OTHER BUTTON VARIANTS

**Acceptance Criteria**
1. **Outline:** border **1px #0A3159**, transparent background, text **#0C2D55**; hover bg **#0C2D55** at 14%, active at 22%.
2. **Ghost:** transparent background, text **#0C2D55**; hover bg **#0C2D55** at 14%, active at 22%.
3. **Link:** color **#1C63A6**, no background; underline only on hover.
4. **Tonal:** background **#E2E8F0**, text **#0C2D55**.
5. **Elevated:** background **#F9FAFC**, shadow `0 1px 2px rgba(0,0,0,0.15)`, text **#0C2D55**.
6. **Destructive:** background **#BC2828**, text **#FFFFFF**, hover 75% opacity, active 65%; used only for delete/remove confirmations.
7. All variants share radius **10px**, sizing scale, focus-ring behavior, disabled rule, and the "no scale/lift/shadow on hover" rule.

---

## 14. EXPANDABLE ICON BUTTON
**File:** `src/components/ui/expandable-icon-button.tsx`

**Acceptance Criteria**
1. At viewport ≥1368px: renders as full secondary button (icon + label), height **36px**, horizontal padding **12px**, **8px** gap.
2. At viewport <1368px: renders as icon-only, **36×36px**, no padding/gap.
3. On hover at <1368px: smoothly expands to show label (padding 12px, gap 8px, 200ms ease-in-out grid-cols transition).
4. `data-[state=open]` applies active secondary tokens (bg **#DCE3EB**, border **#AEB9C7**) regardless of viewport.
5. `aria-label` is always present, including when the visible label is rendered.

---

## 15. EXPANDABLE SEARCH
**File:** `src/components/ui/expandable-search.tsx`

**Acceptance Criteria**
1. Collapsed state: **36×36px** secondary icon button with search glyph.
2. Click expands to a **256px** wide input, auto-focuses, and shows the double-border focus style (inner **2px #1C63A6** + outer **2px** offset).
3. Pressing Escape, clicking ×, or clicking outside with empty value → collapses and clears value.
4. Pressing Enter triggers `onSearch(value)`; clicking × always clears AND collapses.
5. Transition: width + opacity 200ms ease-in-out.

---

## 16. TOGGLES / TOGGLE GROUPS / VIEW MODE TOGGLE

**Acceptance Criteria**
1. Each item is a secondary button with `data-[state=on]` semantics.
2. Toggle group has **0px** gap (segmented look); first item radius **10px** on left, last item radius **10px** on right, middle items 0 radius.
3. Group has a single outer border **1px #D3DAE3**; dividers between items **1px #0C2D55** at 20% opacity.
4. Selected item uses active secondary tokens (bg **#DCE3EB**, text **#0C2D55**); unselected items use defaults.

---

## 17. TOOLBARS (Engagement, RichText, FAB)

**Acceptance Criteria**
1. Inline flex row with **8px** gap and **8px** padding; background **#FFFFFF**; border **1px #D3DAE3**; radius **12px**.
2. All buttons inside use secondary or expandable-icon-button variants.
3. RichText toolbar is floating and anchored to the current selection; if it would overflow the viewport it flips above/below; fade-in 200ms.
4. Floating Action Bar: draggable; snaps to bottom-left, bottom-center, or bottom-right; position persists; must NEVER overlap sticky table headers.

---

## 18. NOTIFICATIONS (Sonner toasts + header popover)

**Acceptance Criteria**
1. Toast: background **#FFFFFF**, border **1px #0C2D55**, radius **12px**, padding **16px**, shadow `0 8px 24px rgba(12,45,85,0.18)`.
2. **2px** progress bar at bottom shrinks from full→empty matching time remaining; color **#0C2D55**.
3. Max 3 toasts stacked, newest on top, **8px** vertical gap.
4. Toast action button: secondary `sm` size (height **32px**).
5. Header notification popover: each row **56px** tall; hover background **#F5F7FA**; clicking a row triggers the row action.

---

## 19. ASK LUKA OVERLAY

**Acceptance Criteria**
1. Two modes: half-screen (right 50%) and full-screen; mode transition takes 240ms.
2. Background **#FFFFFF**; half-screen has left radius **16px**; full-screen has radius **0**.
3. Internal sidebar is collapsible; when collapsed it becomes an icon strip.
4. Prompt chips: secondary `sm` buttons (height **32px**), wrap to next row with **8px** gap.
5. Send button: primary variant, icon on right (bg **#0C2D55**, text **#FFFFFF**).
6. Voice button: secondary icon (**36×36px**) with mic icon; while recording, an overlay covers the input row with a waveform.
7. Overlay z-index is above all page content but below dialogs.

---

## 20. ACCESSIBILITY (Global)

**Acceptance Criteria**
1. Text-on-background contrast ratio ≥ **4.5:1**; large text and icons ≥ **3:1**; focus ring vs adjacent surface ≥ **3:1**.
2. Every interactive element shows a visible focus indicator that matches its variant rule.
3. Every icon-only control has a non-empty `aria-label`.
4. Tab order matches visual order; Esc closes overlays; Enter/Space activate buttons; arrow keys navigate menus and toggle groups.
5. With `prefers-reduced-motion: reduce`: orb pulse, swing, and sparkle spin are disabled; functional transitions (color, opacity, width) are capped at 200ms.
6. Font scaling toggle (A=15px / AA=16px / AAA=17px) applies a root class; no component clips or overflows when toggled.
7. ARIA roles are correct: dialogs use `role="dialog"` + `aria-modal`; menus `role="menu"`; tabs `role="tablist"`; toasts `role="status"`.

---

## 21. RESPONSIVE BEHAVIOR

**Acceptance Criteria** — tested at breakpoints **sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536**, plus icon-button threshold **1368px**.

1. ≥1280px: sidebar 240px + right panel 360px both expanded; header shows all labels.
2. 1024–1280px: sidebar collapsible default-expanded; right panel default-collapsed.
3. <1024px: sidebar becomes an offcanvas drawer; right panel hidden, accessible via a header button.
4. <768px: header collapses action labels; dialogs become full-screen sheets; tables scroll horizontally within their own container (page itself does NOT scroll horizontally).

---

## 22. THEMING

**Acceptance Criteria**
1. Only one theme — **Navy Core**. No theme switcher visible.
2. Brand palette is used exactly: primary **#0C2D55**, accent navy **#0A3159**, link **#1C63A6**, surface **#FFFFFF**, body text **#101828**, divider **#D3DAE3**, soft surface **#F5F7FA**, error **#BC2828**.
3. Components reference semantic tokens — raw Tailwind color utilities (`text-white`, `bg-black`, etc.) only appear for documented brand exceptions on Primary (#0C2D55, #244266, #081F3B).
4. Dark surfaces apply only to: Sidebar and secondary side panels. Page content remains **#FFFFFF**.

---

## 23. MOTION

**Acceptance Criteria**
1. Default transition for color / background / border / opacity / width / rotate = **200ms** ease-out.
2. Forbidden globally: hover scale, hover translate, hover drop-shadow on cards and buttons.
3. Allowed signature motion: Luka logo orb pulse, notification swing (single cycle ≤600ms), sparkle icon infinite spin, RichText toolbar fade, sidebar width transition (200ms).

---

## 24. DEFINITION OF DONE (per page / per component)

A page or component passes QA when **all** of the following hold:
1. Every state — default, hover, active, focus-visible, disabled, open, on, selected, error, loading, empty — matches the exact hex and pixel values above.
2. All hex/px values trace back to this doc or `src/index.css` / `tailwind.config.ts` (no ad-hoc values in components).
3. Keyboard navigation, screen-reader announcements, and reduced-motion behavior have been verified manually.
4. Layout holds at **1920 / 1440 / 1374 / 1280 / 1024 / 768 / 390px** with no page-shell horizontal scroll.
5. Light and dark surfaces render correctly with no color inversion regressions.
6. No console errors, no React key warnings, axe reports zero AA-level a11y violations.
