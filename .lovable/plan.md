

## Enhanced Certificate Lighting

The current glow system has 4 layers (outer radial, mid ring, neon border, corner dots). Here's how to make it significantly more impressive:

### Improvements

1. **Animated gradient border** — Replace the static neon border with a rotating conic-gradient border that sweeps around the certificate frame, creating a "scanning" light effect.

2. **Staggered entrance glow** — Add a secondary motion.div that fades in slightly delayed, creating a "light turns on" effect when the certificate expands.

3. **Top/bottom light bars** — Add thin horizontal accent lines at the top and bottom edges with a shimmer animation (translateX keyframe), like a light scanning across.

4. **Corner dots → animated corner lines** — Replace the 4 corner dots with short L-shaped corner brackets that pulse, giving a more futuristic "targeting" feel.

5. **Soft vignette on the image** — Add an inset shadow on the image itself so edges fade into the dark card, making it feel more embedded.

6. **Breathing ambient glow** — A larger, slower pulsing background glow (separate from the mid ring) that breathes at a different rate for depth.

### Technical approach
- Add a new `@keyframes shimmer` in `src/index.css` for the scanning light bar effect
- Update the expanded certificate markup in `CertificatesSection.tsx` with the new layered lighting elements
- Use framer-motion `transition.delay` for staggered entrance
- All CSS-only animations for performance

### Files to modify
- `src/index.css` — Add `shimmer` and `rotate-glow` keyframes
- `src/components/CertificatesSection.tsx` — Replace current glow layers with enhanced version

