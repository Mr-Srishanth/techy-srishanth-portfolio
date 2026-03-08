

## "Currently Working On" Status Banner

Add an animated status banner below the hero's bio paragraph, showing your current focus area with a pulsing dot indicator.

### What it looks like
A compact glass-card strip with a green pulsing dot, label "Currently working on:", and the focus topic — styled consistently with the portfolio's neon/glass aesthetic.

### Implementation

**Edit `src/components/HeroSection.tsx`:**
- Add a new `motion.div` between the bio paragraph and the buttons (between lines 111 and 113)
- Glass-card styled banner with:
  - A small green pulsing dot (animated with framer-motion)
  - "🔥 Currently working on:" label in mono font
  - Bold text: **"Data Structures & Algorithms"**
- Subtle entrance animation (fade + slide up, delayed after hero content)
- Responsive: full-width on mobile, max-w-md on desktop

### Visual concept
```text
┌─────────────────────────────────────────┐
│  🟢  Currently working on: DSA & Python │
└─────────────────────────────────────────┘
```

The status text can be easily changed later by editing a single string constant at the top of the file.

