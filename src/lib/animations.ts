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
export const DUR_HOVER = 0.3;
export const DUR_REVEAL = 0.6;
export const DUR_HERO = 0.8;
export const DUR_TEXT_REVEAL = 0.5;
export const DUR_RIPPLE = 0.3;
export const DUR_SKILL_BAR = 0.8;
export const DUR_BG_MOTION = 20;

// Stagger delays
export const STAGGER = 0.08; // 80ms between elements

// Reveal offsets
export const REVEAL_Y = 30;

// Shared hover preset for cards
export const cardHover = {
  y: -6,
  scale: 1.02,
  boxShadow: "0 0 25px hsl(var(--primary) / 0.15)",
  transition: { duration: DUR_HOVER, ease: EASE },
};

// Shared button hover preset
export const buttonHover = {
  scale: 1.04,
  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
  transition: { duration: DUR_MICRO, ease: EASE },
};

// Shared button tap
export const buttonTap = { scale: 0.97 };

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
export const WORD_DELAY = 0.07;
