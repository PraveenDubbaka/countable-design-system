

## Fix: Dark Mode Background for Side Panels

**Problem:** The left sidebar (Templates/Engagement Sections panels) and right panel use a hardcoded light gray `bg-[#f1f1f3]` which appears white/light in dark mode.

**Solution:** Add a `dark:` variant to all 4 occurrences of `bg-[#f1f1f3]` so they use the appropriate dark mode background.

### Changes

**1. `src/components/Sidebar.tsx`** (2 spots)
- Line 759 (Engagement Sections panel): Change `bg-[#f1f1f3]` to `bg-[#f1f1f3] dark:bg-gradient-to-b dark:from-muted dark:to-card`
- Line 919 (Templates panel): Same change

**2. `src/components/EngagementRightPanel.tsx`** (2 spots)
- Line 28 (Icon bar): Change `bg-[#f1f1f3]` to `bg-[#f1f1f3] dark:bg-muted`
- Line 66 (Expanded panel): Change `bg-[#f1f1f3]` to `bg-[#f1f1f3] dark:bg-muted`

This follows the existing dark mode pattern documented in the project memory: sidebar panels use a gradient from `hsl(var(--muted))` to `hsl(var(--card))` in dark mode.
