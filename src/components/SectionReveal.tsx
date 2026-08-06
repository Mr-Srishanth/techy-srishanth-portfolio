import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { DUR, EASE, IN_VIEW, PARALLAX_SCROLL_PX, REVEAL_BLUR, REVEAL_SCALE, REVEAL_Y } from "@/lib/animations";

type Variant = "section" | "card" | "media" | "text" | "control" | "ambient";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
  parallax?: boolean;
  variant?: Variant;
}

const smooth = { stiffness: 60, damping: 30, restDelta: 0.001 };

const hiddenFor = (variant: Variant, direction: "up" | "left" | "right") => {
  const dirOffset = {
    up: { x: 0, y: REVEAL_Y },
    left: { x: -REVEAL_Y, y: 0 },
    right: { x: REVEAL_Y, y: 0 },
  }[direction];

  switch (variant) {
    case "media":
      return { opacity: 0, x: 0, y: 0, scale: 1.035, filter: `blur(${REVEAL_BLUR + 2}px)` };
    case "text":
      return { opacity: 0, x: dirOffset.x * 0.5, y: dirOffset.y * 0.5, scale: 1, filter: `blur(${REVEAL_BLUR}px)` };
    case "control":
      return { opacity: 0, x: 0, y: 12, scale: 0.97, filter: "blur(0px)" };
    case "ambient":
      return { opacity: 0, x: 0, y: 0, scale: 1, filter: "blur(0px)" };
    case "card":
      return { ...dirOffset, opacity: 0, scale: REVEAL_SCALE, filter: "blur(6px)" };
    default:
      return { ...dirOffset, opacity: 0, scale: REVEAL_SCALE, filter: `blur(${REVEAL_BLUR}px)` };
  }
};

const durationFor = (variant: Variant) =>
  variant === "control" ? DUR.medium : variant === "media" || variant === "ambient" ? DUR.hero : DUR.reveal;

const SectionReveal = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  parallax = true,
  variant = "section",
}: SectionRevealProps) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, IN_VIEW);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [PARALLAX_SCROLL_PX / 2, -PARALLAX_SCROLL_PX / 2]);
  const bgY = useSpring(rawY, smooth);

  if (reduced) {
    return <div ref={ref} className={`relative ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={hiddenFor(variant, direction)}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" } : undefined}
      transition={{ duration: durationFor(variant), delay, ease: EASE }}
      className={`relative ${className}`}
      style={parallax ? { y: bgY, willChange: "transform" } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
