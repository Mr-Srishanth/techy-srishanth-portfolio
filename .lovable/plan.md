

## Professional Animation System Upgrade

After reviewing all animation files, the current system already has many of the right pieces but with **inconsistent timing values, missing the specified easing curves, and some durations that don't match the spec**. This plan standardizes everything to the exact timing system requested.

### What changes

**1. Create a shared animation constants file** — `src/lib/animations.ts`
- Central source of truth for all timing/easing values:
  - `MICRO` (buttons/icons): `0.2s`, `ease-out`
  - `HOVER` (cards/links): `0.3s`, `cubic-bezier(0.4, 0, 0.2, 1)`
  - `REVEAL` (sections): `0.7s`, `ease-out`, stagger `0.08s`
  - `HERO`: `0.9s`, `cubic-bezier(0.22, 1, 0.36, 1)`
  - `TEXT_REVEAL`: `0.5s`, word delay `0.07s`
- Shared hover preset: `{ y: -6, scale: 1.02, boxShadow: "0 0 25px hsl(var(--primary) / 0.15)" }`
- Shared button preset: `{ scale: 1.04 }`

**2. Update HeroSection.tsx**
- Change easing from `[0.25, 0.1, 0.25, 1]` → `[0.22, 1, 0.36, 1]` (the cinematic overshoot curve)
- Adjust durations to `0.9s` for main content, stagger hero elements with `80ms` gaps
- Background blurs fade in softly over `0.8s`
- Button hover: `scale: 1.04` instead of `1.05`, duration `0.2s`

**3. Update SectionReveal.tsx**
- `duration: 0.7s`, `ease: "easeOut"`
- `y` offset: `30px` (currently `40px`)
- Parallax range reduced slightly for subtlety

**4. Update all section components** (About, Skills, Projects, Achievements, LearningJourney, Contact, TimeMachine)
- Standardize stagger pattern: heading first (`delay: 0`), paragraph (`+0.08s`), cards (`+0.08s` each)
- Card hover: `{ y: -6, scale: 1.02, boxShadow, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }`
- Button hover: `{ scale: 1.04, transition: { duration: 0.2 } }`
- Remove hardcoded `hsl(200 100% 50%)` in hover shadows → use `hsl(var(--primary))` for theme compatibility

**5. Update TextReveal.tsx**
- Word delay: `0.07s` (currently `0.08s`)
- Duration: `0.5s` (already correct)

**6. Update CustomCursor.tsx**
- Ripple duration tuned to `0.3s` equivalent (~18 frames at 60fps, currently 30 frames → reduce `maxLife` to 18)
- Ripple expands faster and fades smoother

**7. Update CSS in `src/index.css`**
- Add global transition utilities for interactive elements
- Ensure `transition-duration: 200ms` on buttons, `300ms` on cards
- Background grid animation: slow to `20s` (already correct)

**8. Update GenerativeArtBackground.tsx**
- Slow down time increment for more subtle movement (already `0.003`, keep as is)
- Reduce particle opacity cap for subtler effect

### Files to modify
- **New**: `src/lib/animations.ts`
- `src/components/HeroSection.tsx`
- `src/components/SectionReveal.tsx`
- `src/components/AboutSection.tsx`
- `src/components/SkillsSection.tsx`
- `src/components/ProjectsSection.tsx`
- `src/components/AchievementsSection.tsx`
- `src/components/LearningJourneySection.tsx`
- `src/components/ContactSection.tsx`
- `src/components/TimeMachineTimeline.tsx`
- `src/components/TextReveal.tsx`
- `src/components/CustomCursor.tsx`
- `src/components/Navbar.tsx`
- `src/index.css`

