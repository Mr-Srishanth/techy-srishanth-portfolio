
Goal
- Make the “Hire Me” CTA behave like a real button (clear hover/cursor/focus feedback + reliable click action), and remove layout layers that can block clicks.

What I found
- `HeroSection` uses full-cover absolute decorative layers (`grid-bg`, glow orbs) without `pointer-events-none` and without a raised content z-index. These layers can sit above interactive content and absorb clicks.
- The button works in code (`scrollIntoView` to `#contact`) but lacks stronger button affordances (cursor/focus semantics), which can make it feel non-interactive.

Implementation plan
1. Fix click-through layering in `HeroSection`
- Add `pointer-events-none` to decorative absolute elements:
  - background grid
  - both gradient orbs
- Raise the real content layer with `relative z-10` on the main `.container`.

2. Strengthen button semantics/affordance in `HeroSection`
- Add `type="button"` on “Hire Me”.
- Add `cursor-pointer` and visible keyboard focus styles (`focus-visible:ring...`) to make it clearly behave as a button.
- Keep existing `onClick` smooth scroll logic.

3. Prevent the same bug pattern in other sections (stability pass)
- Apply `pointer-events-none` to section-wide decorative grid overlays in:
  - `AboutSection`
  - `ProjectsSection`
  - `ContactSection`
- Keep section content above overlays (`relative z-10` where needed) so future links/forms/buttons remain clickable.

4. Quick interaction QA checklist
- Confirm “Hire Me” shows pointer cursor, hover animation, and clicks scroll to Contact.
- Confirm keyboard accessibility: Tab to button + Enter/Space triggers scroll.
- Confirm Contact form fields are focusable/clickable.
- Confirm behavior on mobile viewport.
- Confirm testing is done in normal preview mode (not Visual Edits mode), since Visual Edits can intercept clicks by design.

Technical details
- Root cause is stacking + hit-testing, not scroll logic.
- Decorative layers should be non-interactive:
  - `pointer-events-none` on purely visual absolute elements.
- Interactive layers should be explicitly above visuals:
  - `relative z-10` on content wrappers.
- This keeps the current visual design intact while restoring expected button behavior.
