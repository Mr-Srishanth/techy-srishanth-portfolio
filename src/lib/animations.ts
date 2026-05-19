// Professional Animation System — single source of truth

// Unified easing curve — cinematic ease-out for all motion
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Legacy aliases (all point to the unified curve)
export const EASE_MICRO = EASE;
export const EASE_HOVER = EASE;
export const EASE_REVEAL = EASE;
export const EASE_HERO = EASE;

// Durations (seconds)
export const DUR_MICRO = 0.2;
export const DUR_HOVER = 0.4;
export const DUR_REVEAL = 0.9;
export const DUR_HERO = 1.0;
export const DUR_TEXT_REVEAL = 0.7;
export const DUR_RIPPLE = 0.3;
export const DUR_SKILL_BAR = 0.8;
export const DUR_BG_MOTION = 20;

// Stagger delays
export const STAGGER = 0.09; // ~90ms between elements

// Reveal offsets
export const REVEAL_Y = 40;

// Shared hover preset for cards
export const cardHover = {
  y: -8,
  scale: 1.015,
  boxShadow: "0 18px 50px -18px hsl(var(--primary) / 0.35), 0 0 30px hsl(var(--primary) / 0.18)",
  transition: { duration: DUR_HOVER, ease: EASE },
};

// Shared button hover preset
export const buttonHover = {
  y: -2,
  scale: 1.03,
  boxShadow: "0 0 22px hsl(var(--primary) / 0.35), 0 8px 24px -12px hsl(var(--primary) / 0.4)",
  transition: { duration: 0.28, ease: EASE },
};

// Shared button tap
export const buttonTap = { scale: 0.96, transition: { duration: 0.15, ease: EASE } };

// Section heading reveal
export const headingReveal = (inView: boolean, delay = 0) => ({
  initial: { opacity: 0, y: REVEAL_Y },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: DUR_REVEAL, delay, ease: EASE },
});

// Staggered card reveal
export const cardReveal = (inView: boolean, index: number, baseDelay = 0.16) => ({
  initial: { opacity: 0, y: 25 },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: DUR_REVEAL, delay: baseDelay + index * STAGGER, ease: EASE },
});

// Text paragraph reveal (appears after heading)
export const textReveal = (inView: boolean, delay = 0.08) => ({
  initial: { opacity: 0, y: 20 },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: DUR_REVEAL, delay, ease: EASE },
});

// Word delay for TextReveal component
export const WORD_DELAY = 0.06;
