import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => onComplete(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const name = "ARRABOLA SRISHANTH";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated grid */}
        <div className="absolute inset-0 grid-bg animate-grid-move opacity-30" />

        {/* Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            initial={{ opacity: 0, x: Math.random() * 800 - 400, y: Math.random() * 600 - 300 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -100],
              scale: [0, 1.5, 0],
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Name reveal */}
        <motion.div className="relative z-10 flex flex-col items-center gap-6">
          {phase >= 0 && (
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-primary/50 border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ display: phase >= 1 ? "none" : "block" }}
            />
          )}

          {phase >= 1 && (
            <motion.h1
              className="font-display text-3xl md:text-5xl tracking-[0.3em] neon-text text-primary"
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {name.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          )}

          {phase >= 2 && (
            <motion.p
              className="font-mono text-sm text-muted-foreground tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              INITIALIZING PORTFOLIO...
            </motion.p>
          )}

          {/* Neon line */}
          {phase >= 1 && (
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 300 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
