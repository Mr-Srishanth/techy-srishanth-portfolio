import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
  parallax?: boolean;
}

const SectionReveal = ({ children, className = "", direction = "up", delay = 0, parallax = true }: SectionRevealProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const offsets = {
    up: { x: 0, y: 60 },
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative ${className}`}
      style={parallax ? { y: bgY } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
