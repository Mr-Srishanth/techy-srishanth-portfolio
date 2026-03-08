import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

interface Drop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  chars: string;
}

const MatrixRain = ({ onComplete }: { onComplete: () => void }) => {
  const drops = useRef<Drop[]>([]);

  if (drops.current.length === 0) {
    const cols = Math.floor(window.innerWidth / 20);
    drops.current = Array.from({ length: cols }, (_, i) => ({
      id: i,
      x: i * 20,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      chars: Array.from({ length: 25 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("\n"),
    }));
  }

  useEffect(() => {
    const timer = setTimeout(onComplete, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      {drops.current.map((drop) => (
        <motion.pre
          key={drop.id}
          className="absolute top-0 text-xs leading-5 font-mono"
          style={{
            left: drop.x,
            color: "hsl(var(--primary))",
            textShadow: "0 0 8px hsl(var(--primary) / 0.8)",
            whiteSpace: "pre",
          }}
          initial={{ y: "-100%" }}
          animate={{ y: "110vh" }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            ease: "linear",
            repeat: 1,
          }}
        >
          {drop.chars}
        </motion.pre>
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span
          className="font-display text-2xl md:text-4xl tracking-widest text-primary neon-text"
        >
          YOU FOUND THE SECRET 🐇
        </span>
      </motion.div>
    </motion.div>
  );
};

const KonamiEasterEgg = () => {
  const [active, setActive] = useState(false);
  const inputRef = useRef<string[]>([]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    inputRef.current.push(e.key);
    inputRef.current = inputRef.current.slice(-KONAMI.length);
    if (inputRef.current.join(",") === KONAMI.join(",")) {
      setActive(true);
      inputRef.current = [];
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {active && <MatrixRain onComplete={() => setActive(false)} />}
    </AnimatePresence>
  );
};

export default KonamiEasterEgg;
