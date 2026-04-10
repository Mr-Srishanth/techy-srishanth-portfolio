import { motion, useScroll } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[55] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--neon-cyan)), hsl(var(--primary)))",
        boxShadow: "0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.2)",
      }}
    />
  );
};

export default ScrollProgress;
