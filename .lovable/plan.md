

## Parallax Depth Card Stack — Projects Section

Replace the current 2-column grid with a **vertical scroll-driven card stack** where project cards overlap and separate with 3D depth as the user scrolls.

### How it works
- Cards are laid out vertically in a **sticky container** with `perspective` applied
- Each card uses `useScroll` + `useTransform` to control its `translateZ`, `translateY`, `scale`, and `opacity` based on scroll progress
- As the user scrolls, the top card slides up and shrinks into the background while the next card comes forward — creating a "deck of cards" peeling effect
- Each card has a slight rotation and shadow shift for depth realism

### Technical approach

**Container**: A tall section (`min-h-[300vh]`) with a `sticky` inner wrapper centered on screen, applying `perspective: 1200px`

**Per-card transforms** (driven by `scrollYProgress`):
- `translateY`: cards start stacked, then spread apart as scroll progresses
- `scale`: front card = 1.0, cards behind scale down (0.95, 0.9, 0.85)
- `opacity`: cards further back fade slightly
- `z-index`: dynamically assigned so the "active" card is on top

**Mobile fallback**: On mobile, fall back to a simple vertical stack with staggered fade-in (no 3D transforms) to avoid performance issues.

### Files to change
- **`src/components/ProjectsSection.tsx`** — Full rewrite of the layout/animation logic, keep same project data and card content

