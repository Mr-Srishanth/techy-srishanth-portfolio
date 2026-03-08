

## Problem

The social links (GitHub, LinkedIn, Instagram) are opening **inside the Lovable preview iframe**. Instagram (and potentially others) block being loaded in iframes, causing the "www.instagram.com is blocked / ERR_BLOCKED_BY_RESPONSE" error. The URLs themselves are correct -- the issue is that `target="_blank"` doesn't always work reliably inside an iframe context.

## Solution

Use `window.open()` via an `onClick` handler instead of relying on the `<a>` tag's default behavior. This forces a real browser tab to open, bypassing iframe restrictions. Apply this to all social links in both `ContactSection.tsx` and `Footer.tsx`.

## Changes

### 1. `src/components/ContactSection.tsx`
- Add an `onClick` handler to the social link `<motion.a>` elements that calls `window.open(href, '_blank', 'noopener,noreferrer')` and prevents default behavior.

### 2. `src/components/Footer.tsx`
- Same change: add `onClick` with `window.open()` and `e.preventDefault()` to the social link `<motion.a>` elements.

Both files use the same pattern, so the fix is identical in both places.

