

## Add "Journey" Nav Link

**One-line change in `src/components/Navbar.tsx`:**

Update the `links` array on line 5 from:
```ts
const links = ["Home", "About", "Skills", "Projects", "Contact"];
```
to:
```ts
const links = ["Home", "About", "Skills", "Projects", "Journey", "Contact"];
```

The existing `scrollTo` function already calls `id.toLowerCase()`, which will map "Journey" → `#journey` — matching the `id="journey"` already set on `LearningJourneySection`.

No other files need changes.

