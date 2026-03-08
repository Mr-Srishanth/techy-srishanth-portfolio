// Professional Animation System — single source of truth

// Easing curves
export const EASE_MICRO: [number, number, number, number] = [0, 0, 0.2, 1]; // ease-out
export const EASE_HOVER: [number, number, number, number] = [0.4, 0, 0.2, 1]; // material standard
export const EASE_REVEAL: [number, number, number, number] = [0, 0, 0.2, 1]; // ease-out
export const EASE_HERO: [number, number, number, number] = [0.22, 1, 0.36, 1]; // cinematic overshoot

// Durations (seconds)
export const DUR_MICRO = 0.2;
export const DUR_HOVER = 0.3;
export const DUR_REVEAL = 0.7;
export const DUR_HERO = 0.9;
export const DUR_TEXT_REVEAL = 0.5;
export const DUR_RIPPLE = 0.3;

// Stagger delays
export const STAGGER = 0.08; // 80ms between elements

// Reveal offsets
export const REVEAL_Y = 30;

// Shared hover preset for cards
export const cardHover = {
  y: -6,
  scale: 1.02,
  boxShadow: "0 0 25px hsl(var(--primary) / 0.15)",
  transition: { duration: DUR_HOVER, ease: EASE_HOVER },
};

// Shared button hover preset
export const buttonHover = {
  scale: 1.04,
  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
  transition: { duration: DUR_MICRO, ease: EASE_MICRO },
};

// Shared button tap
export const buttonTap = { scale: 0.97 };

// Section heading reveal
export const headingReveal = (inView: boolean, delay = 0) => ({
  initial: { opacity: 0, y: REVEAL_Y },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: DUR_REVEAL, delay, ease: EASE_REVEAL },
});

// Staggered card reveal
export const cardReveal = (inView: boolean, index: number, baseDelay = 0.16) => ({
  initial: { opacity: 0, y: 25 },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: 0.6, delay: baseDelay + index * STAGGER, ease: EASE_REVEAL },
});

// Text paragraph reveal (appears after heading)
export const textReveal = (inView: boolean, delay = 0.08) => ({
  initial: { opacity: 0, y: 20 },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: DUR_REVEAL, delay, ease: EASE_REVEAL },
});

// Word delay for TextReveal component
export const WORD_DELAY = 0.07;
