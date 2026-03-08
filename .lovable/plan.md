

## Fix: Hire Me Button Not Scrolling to Contact Section

### Analysis
The code looks correct — the `onClick` handler calls `document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })` and the contact section has `id="contact"`. This should work.

The likely issue is that the `motion.button` element's click event might be interfered with by framer-motion's `whileTap` animation, or there's a timing issue.

### Fix
Replace `document.getElementById("contact")?.scrollIntoView(...)` with a more robust approach using `scrollIntoView` with a slight delay, or switch to a standard `<button>` wrapped in motion for animations. The simplest fix:

**In `src/components/HeroSection.tsx` (line 102):**
- Add a small `setTimeout` wrapper to ensure the scroll fires after framer-motion's tap animation begins, preventing any event swallowing:

```tsx
onClick={() => {
  const el = document.getElementById("contact");
  if (el) {
    setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
  }
}}
```

**For the Download CV button (lines 106-112):**
- Make it visually indicate "Coming Soon" — add `opacity-50 cursor-not-allowed` styles and an `onClick` showing a toast notification saying "Resume coming soon!"

