import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { DUR_REVEAL, EASE_REVEAL, REVEAL_Y } from "@/lib/animations";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
  parallax?: boolean;
}

const smooth = { stiffness: 60, damping: 30, restDelta: 0.001 };

const SectionReveal = ({ children, className = "", direction = "up", delay = 0, parallax = true }: SectionRevealProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const bgY = useSpring(rawY, smooth);

  const offsets = {
    up: { x: 0, y: REVEAL_Y },
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: DUR_REVEAL, delay, ease: EASE_REVEAL }}
      className={`relative ${className}`}
      style={parallax ? { y: bgY } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
