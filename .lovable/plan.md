

## Plan: Replace CY/PY labels with year numbers, remove comparison dropdown, enhance toggle

### 1. Fix build error
Change `package.json` `dev` script from `"vite"` to `"npx vite"` (same fix as before — it was reverted).

### 2. Replace CY/PY labels with actual years in `GrossMarginResponse.tsx`

**Annual table headers:**
- `CY` → `2025`, `PY1` → `2024`, `PY2` → `2023`
- `CY (%)` → `2025 (%)`, `PY1 (%)` → `2024 (%)`, `PY2 (%)` → `2023 (%)`
- `CY vs PY1 (%)` → `2025 vs 2024 (%)`

**Quarterly/Monthly table headers:**
- `CY Revenue` → `2025 Revenue`, `CY COS` → `2025 COS`, `CY GM` → `2025 GM`, `CY GM (%)` → `2025 GM (%)`
- `PY1 GM` → `2024 GM`, `PY1 GM (%)` → `2024 GM (%)`, `PY2 GM` → `2023 GM`, `PY2 GM (%)` → `2023 GM (%)`

**Chart legends** (in AnnualChart, QuarterlyChart, MonthlyChart):
- All `dataKey` labels: `CY` → `2025`, `PY1` → `2024`, `PY2` → `2023`
- Chart data keys like `"CY GM"` → `"2025 GM"`, `"PY1 GM"` → `"2024 GM"`, etc.

**Summary text:** Replace mentions of "CY", "PY1", "PY2" with "2025", "2024", "2023".

### 3. Remove comparison dropdown entirely

- Delete the `ComparisonDropdown` component and its usage
- Remove the `comparison` state and `ComparisonView` type
- Always show all three years (`showPy2` always `true`)

### 4. Enhance the table/graph toggle design

Replace the current Switch + icon buttons with a polished segmented pill toggle:
- Two segments: icon + "Table" and icon + "Graph" labels
- Active segment gets `bg-primary text-white` with rounded-full pill shape
- Container has a subtle `bg-muted` background with rounded-full border
- Smooth transition animation between states
- Remove the separate Switch component and tooltip wrappers

### Technical Details

All changes are in a single file: `src/components/luka/GrossMarginResponse.tsx`, plus the one-line fix in `package.json`.

