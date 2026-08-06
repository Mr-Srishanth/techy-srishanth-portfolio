// ============================================================
// MOTION SYSTEM V2.0 — one motion language for the whole site
// Elegant · Confident · Smooth · Premium
// ============================================================

// ---- Easing (ONE curve family) ----
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0]; // exits only

// Legacy aliases — all resolve to the single curve
export const EASE_MICRO = EASE;
export const EASE_HOVER = EASE;
export const EASE_REVEAL = EASE;
export const EASE_HERO = EASE;

// ---- Duration tokens (seconds) ----
export const DUR = {
  micro: 0.18,
  fast: 0.28,
  medium: 0.45,
  slow: 0.7,
  reveal: 0.8,
  hero: 1.0,
  modal: 0.4,
} as const;

// Legacy duration aliases
export const DUR_MICRO = DUR.micro;
export const DUR_HOVER = DUR.medium;
export const DUR_REVEAL = DUR.reveal;
export const DUR_HERO = DUR.hero;
export const DUR_TEXT_REVEAL = 0.65;
export const DUR_RIPPLE = DUR.fast;
export const DUR_SKILL_BAR = DUR.slow;
export const DUR_BG_MOTION = 20;

// ---- Spring tokens (physical, never bouncy-cheap) ----
export const SPRING = {
  soft: { type: "spring", stiffness: 180, damping: 26, mass: 1 },
  snappy: { type: "spring", stiffness: 380, damping: 30, mass: 0.8 },
  liquid: { type: "spring", stiffness: 300, damping: 34, mass: 0.9 },
} as const;

// ---- Stagger tokens ----
export const STAGGER = 0.07;
export const STAGGER_TIGHT = 0.045;
export const STAGGER_LOOSE = 0.1;

// ---- Reveal geometry ----
export const REVEAL_Y = 28;
export const REVEAL_BLUR = 10; // px
export const REVEAL_SCALE = 0.985;

// Shared viewport config so every reveal starts *before* entering view
export const VIEWPORT = { once: true, margin: "-12% 0px -8% 0px" } as const;
export const IN_VIEW = { once: true, margin: "-80px" } as const;

const t = (duration: number, delay = 0) => ({ duration, delay, ease: EASE });

// ============================================================
// Variants — differentiated per element type, one language
// ============================================================

export const containerVariants = (stagger = STAGGER, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

// Text / headings: blur-to-clear + tiny rise
export const textVariants = {
  hidden: { opacity: 0, y: 16, filter: `blur(${REVEAL_BLUR}px)` },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: t(DUR.reveal) },
};

// Cards: depth-in — rise + subtle scale
export const cardVariants = {
  hidden: { opacity: 0, y: REVEAL_Y, scale: REVEAL_SCALE, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: t(DUR.reveal) },
};

// Images / media: settle from slight scale-up
export const mediaVariants = {
  hidden: { opacity: 0, scale: 1.035, filter: "blur(12px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: t(DUR.hero) },
};

// Buttons / small controls: quick, confident
export const controlVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: t(DUR.medium) },
};

// Ambient / background details: last, softest
export const ambientVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: t(DUR.hero, 0.15) },
};

// ---- Modal choreography: backdrop → panel → content ----
export const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  show: { opacity: 1, backdropFilter: "blur(14px)", transition: t(DUR.modal) },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: DUR.fast, ease: EASE_IN } },
};

export const panelVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { ...t(DUR.modal, 0.06) } },
  exit: { opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)", transition: { duration: DUR.fast, ease: EASE_IN } },
};

export const modalContentVariants = containerVariants(STAGGER_TIGHT, 0.14);

// ============================================================
// Interaction presets
// ============================================================

// Cards breathe — no aggressive scaling
export const cardHover = {
  y: -4,
  boxShadow:
    "0 18px 50px -22px hsl(var(--primary) / 0.32), 0 0 0 1px hsl(var(--primary) / 0.14)",
  transition: { duration: DUR.medium, ease: EASE },
};

// Buttons feel physical
export const buttonHover = {
  y: -2,
  scale: 1.02,
  filter: "brightness(1.06)",
  boxShadow: "0 0 24px hsl(var(--primary) / 0.3), 0 10px 26px -14px hsl(var(--primary) / 0.45)",
  transition: { duration: DUR.fast, ease: EASE },
};

export const buttonTap = { scale: 0.975, y: 0, transition: { duration: DUR.micro, ease: EASE } };

// ============================================================
// Legacy helpers (kept for backward compatibility)
// ============================================================

export const headingReveal = (inView: boolean, delay = 0) => ({
  initial: { opacity: 0, y: 18, filter: `blur(${REVEAL_BLUR}px)` },
  animate: inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
  transition: t(DUR.reveal, delay),
});

export const cardReveal = (inView: boolean, index: number, baseDelay = 0.12) => ({
  initial: { opacity: 0, y: REVEAL_Y, scale: REVEAL_SCALE },
  animate: inView ? { opacity: 1, y: 0, scale: 1 } : {},
  transition: t(DUR.reveal, baseDelay + index * STAGGER),
});

export const textReveal = (inView: boolean, delay = 0.08) => ({
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
  transition: t(DUR.reveal, delay),
});

export const WORD_DELAY = 0.05;

// Parallax bounds (depth only)
export const PARALLAX_SCROLL_PX = 24; // ≈ max 5% drift
export const PARALLAX_MOUSE_PX = 8;
