
Goal: Fix social links that open a “site is blocked” page in preview.

What I’ll build
1. Update social link handling in `src/components/ContactSection.tsx` from plain anchor navigation to a controlled external-link handler.
2. Keep `target="_blank"` behavior, but force opening with `window.open(url, "_blank", "noopener,noreferrer")` on click.
3. Add fallback behavior when opening is blocked:
   - show toast: “External link blocked in preview. Opening link copied to clipboard.”
   - copy URL to clipboard so you can paste it directly.
4. Normalize URLs to canonical HTTPS forms:
   - `https://github.com/Mr-Srishanth`
   - `https://www.linkedin.com/in/a-srishanth-300605397/`
   - `https://www.instagram.com/mr.srishanth14/`
5. Keep the same visual design/animations of icons.

Why this approach
- You confirmed all social links show a blocked page.
- In embedded preview environments, some external domains are blocked or forced into restricted contexts.
- Controlled opening + clipboard fallback gives a reliable path even when preview restrictions apply.

Technical details
- File: `src/components/ContactSection.tsx`
- Add helper like `openExternalLink(url: string)`:
  - `const win = window.open(url, "_blank", "noopener,noreferrer");`
  - if `!win`, fallback to clipboard + toast.
- Convert social icons to use `onClick` handler (and keep semantic anchor attributes for accessibility/SEO if desired).
- Add `aria-label` per icon for accessibility.
- Verify behavior:
  1) click each icon in preview (expect either new tab or fallback toast),
  2) paste copied URL in browser and confirm destination,
  3) check no regressions in hover/tap animations.
