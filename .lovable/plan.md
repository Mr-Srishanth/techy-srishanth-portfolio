

# Mobile Animations & Smoothness Improvements

## Current Issues on Mobile

1. **Heavy animations**: Loading screen has 20 particle elements, all animating continuously -- expensive on mobile GPUs
2. **Large motion offsets**: Many sections use `x: -60`, `x: 60`, `y: 40` initial offsets which cause jank on slower mobile devices
3. **Continuous infinite animations**: Skill icons bounce infinitely (`y: [0, -5, 0]`), timeline dots pulse infinitely, orbiting dot in hero -- drains battery and causes frame drops
4. **No reduced-motion support**: Users with `prefers-reduced-motion` get full animations
5. **`useInView` margin too aggressive**: `-100px` margin may not trigger well on small screens
6. **Loading screen duration**: 3 seconds is long on mobile; particles use absolute pixel positioning that overflows small screens
7. **`whileHover` on mobile**: Hover effects (scale, boxShadow) don't apply on touch devices -- wasted processing
8. **Float animation on profile image**: Combined with parallax mouse tracking, this is heavy

## Plan

### 1. Add a `useReducedMotion` hook + mobile detection utility
- Create a shared hook that checks both `prefers-reduced-motion` and mobile breakpoint
- Export a helper to simplify conditional animation values across all components

### 2. Optimize LoadingScreen for mobile
- Reduce particles from 20 to 8 on mobile
- Shorten total loading time from 3s to 2s on mobile
- Constrain particle positions to viewport-relative values instead of fixed px

### 3. Lighten HeroSection on mobile
- Reduce initial offsets from `x: ±60` to `x: ±30` on mobile
- Disable mouse parallax on touch devices (it does nothing anyway)
- Reduce or disable the orbiting dot animation on mobile

### 4. Reduce section entry animations on mobile
- Use smaller `y` offsets (20px instead of 40px) for section reveals
- Shorten animation durations slightly (0.6s instead of 0.8s)
- Reduce `useInView` margin from `-100px` to `-50px` on mobile for earlier triggering

### 5. Disable infinite animations on mobile
- Stop skill icon bouncing on mobile
- Stop timeline dot pulsing on mobile
- Replace continuous `neon-glow` pulse with static glow on mobile

### 6. Replace `whileHover` with `whileTap` on mobile
- Project cards, about cards, skill cards: use `whileTap` for touch feedback instead of hover
- Social link icons: keep `whileTap`, remove hover shadow on mobile

### 7. Add `will-change` and GPU hints
- Add `will-change: transform` to key animated elements in CSS
- Use `transform: translateZ(0)` on glass-card elements to promote to GPU layer

### 8. Add `prefers-reduced-motion` global support
- In `index.css`, add a media query to disable custom keyframe animations (float, pulse-glow, grid-move) when reduced motion is preferred

### Files to modify
- `src/hooks/use-mobile.tsx` -- add reduced motion detection
- `src/components/LoadingScreen.tsx` -- fewer particles, shorter timing on mobile
- `src/components/HeroSection.tsx` -- lighter parallax, smaller offsets
- `src/components/AboutSection.tsx` -- smaller offsets, tap instead of hover
- `src/components/SkillsSection.tsx` -- disable infinite icon bounce on mobile
- `src/components/ProjectsSection.tsx` -- tap feedback, smaller offsets
- `src/components/LearningJourneySection.tsx` -- disable dot pulse, smaller offsets
- `src/components/GitHubSection.tsx` -- smaller inView margin on mobile
- `src/components/ContactSection.tsx` -- smaller offsets
- `src/index.css` -- reduced-motion media query, will-change hints

