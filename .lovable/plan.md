

## Fix: Timeline Icons Disappearing on Theme Change

**Problem**: The icon container background uses gradients like `from-primary to-neon-cyan`, and the icon itself uses `text-primary`. When themes change, the icon color blends into its background, becoming invisible.

**Solution**: Change the icon container to use a subtle, semi-transparent background (`bg-primary/10`) instead of a full-color gradient. Keep the icon as `text-primary` so it's always visible against the lighter background.

### Changes in `src/components/LearningJourneySection.tsx`

1. **Remove `accent` field** from each update object (lines 7-35) — no longer needed.

2. **Update icon container** (line 107): Replace `bg-gradient-to-br ${item.accent} bg-opacity-10` with a simple `bg-primary/10` background, ensuring the icon always contrasts against its container regardless of theme.

```tsx
// Before
<div className={`p-2.5 rounded-lg bg-gradient-to-br ${item.accent} bg-opacity-10`}>
  <item.icon size={20} className="text-primary" />

// After
<div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
  <item.icon size={20} className="text-primary" />
```

This ensures the icon is always clearly visible since `primary/10` (10% opacity) can never overpower the full `text-primary` icon color, across all themes.

