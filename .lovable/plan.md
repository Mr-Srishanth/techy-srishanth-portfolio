

## Problem

The `window.open()` fix we applied is still being intercepted by the Lovable preview iframe sandbox. Inside an iframe, `window.open()` can still be captured by the parent frame, causing external sites like Instagram to load inside the preview (where they get blocked).

## Solution

Use `window.top?.open()` instead of `window.open()` to break out of the iframe and open links in the actual browser. If `window.top` is inaccessible (cross-origin), fall back to `window.open()`.

## Changes

### 1. `src/components/ContactSection.tsx` (line 96)
Change the onClick handler from:
```ts
window.open(href, '_blank', 'noopener,noreferrer')
```
to:
```ts
(window.top || window).open(href, '_blank', 'noopener,noreferrer')
```

### 2. `src/components/Footer.tsx` (line 21)
Same change — use `(window.top || window).open(...)`.

This ensures links always open in a real browser tab, even when viewed inside the Lovable preview iframe.

