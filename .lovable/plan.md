

# Plan: Add 4 New Features (No Changes to Existing Code)

All four features are **additive only** — no existing files will be modified except `Index.tsx` (to add new sections) and `Navbar.tsx` (to add the theme toggle button). Existing section components remain untouched.

---

## 1. Scroll-to-Top Button
**New file:** `src/components/ScrollToTop.tsx`
- A fixed floating button (bottom-right) that appears after scrolling 400px
- Smooth scroll to top on click
- Neon glow styling matching the cyberpunk theme
- Fade in/out with framer-motion
- Uses `ChevronUp` icon from lucide-react

## 2. Skill Radar Chart
**New file:** `src/components/SkillRadarChart.tsx`
- Uses Recharts `RadarChart` component (already installed)
- Displays the same 6 skills in a spider/radar visualization
- Placed **below** the existing SkillsSection (as a separate section or added to Index)
- Cyberpunk-styled: dark fill, neon-blue stroke, transparent background
- Mobile-responsive with `useLightMotion` for animation gating

## 3. Achievements Section
**New file:** `src/components/AchievementsSection.tsx`
- Grid of achievement/certification cards with glass-card styling
- Each card: icon/emoji, title, description, optional link
- Placeholder data (user can customize later)
- Placed between LearningJourneySection and GitHubSection in the page layout
- Framer-motion entry animations, respects `useLightMotion`

## 4. Theme Toggle
**Modified file:** `src/components/Navbar.tsx` (minimal addition — add a toggle button)
**New file:** `src/components/ThemeToggle.tsx`
**Modified file:** `src/index.css` (add alternate theme CSS variables under a class like `.theme-purple` and `.theme-green`)
- Toggle cycles through 3 color themes: Blue (default), Purple, Green
- Stores preference in localStorage
- Applies a CSS class to `<html>` that overrides `--primary`, `--neon-blue`, `--neon-cyan`, `--accent` etc.
- Icon: `Palette` from lucide-react

## 5. Wire into Index.tsx
**Modified file:** `src/pages/Index.tsx`
- Import and add `SkillRadarChart` after `SkillsSection`
- Import and add `AchievementsSection` after `LearningJourneySection`
- Import and add `ScrollToTop` inside the main content div

### Files changed (existing):
- `src/pages/Index.tsx` — add 3 new component imports and placements
- `src/components/Navbar.tsx` — add ThemeToggle component in the nav bar
- `src/index.css` — add `.theme-purple` and `.theme-green` CSS variable overrides

### Files created (new):
- `src/components/ScrollToTop.tsx`
- `src/components/SkillRadarChart.tsx`
- `src/components/AchievementsSection.tsx`
- `src/components/ThemeToggle.tsx`

