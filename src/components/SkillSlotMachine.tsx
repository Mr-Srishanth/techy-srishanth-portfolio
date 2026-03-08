import { useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import pythonLogo from "@/assets/logos/python.svg";
import reactLogo from "@/assets/logos/react.svg";
import gitLogo from "@/assets/logos/git.svg";
import aimlLogo from "@/assets/logos/aiml.png";

interface Skill {
  name: string;
  level: number;
  icon: string;
  logo?: string;
  color: string;
  description: string;
}

const skills: Skill[] = [
  { name: "Python", level: 70, icon: "🐍", logo: pythonLogo, color: "200 100% 50%", description: "Backend development, scripting, and data analysis." },
  { name: "React", level: 75, icon: "⚛️", logo: reactLogo, color: "185 100% 50%", description: "Building modern, interactive UIs with hooks and components." },
  { name: "Data Structures", level: 55, icon: "🏗️", color: "270 100% 60%", description: "Arrays, trees, graphs, and algorithm design." },
  { name: "C Programming", level: 60, icon: "⚙️", color: "35 100% 55%", description: "Low-level programming and memory management." },
  { name: "Machine Learning", level: 40, icon: "🤖", logo: aimlLogo, color: "320 80% 55%", description: "Neural networks, regression, and classification." },
  { name: "Git", level: 65, icon: "🧩", logo: gitLogo, color: "10 90% 55%", description: "Version control and collaboration workflows." },
];

const REEL_ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 3;

const SkillSlotMachine = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Skill | null>(null);
  const [reelOffsets, setReelOffsets] = useState([0, 0, 0]);
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Build extended reel (repeat skills multiple times for scrolling effect)
  const extendedReel = [...skills, ...skills, ...skills, ...skills, ...skills];

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Pick a random winning skill
    const winIndex = Math.floor(Math.random() * skills.length);
    const winSkill = skills[winIndex];

    // Each reel lands on the same skill but with different spin amounts
    const baseSpins = skills.length * 3; // 3 full cycles minimum
    const newOffsets = [
      (baseSpins + winIndex) * REEL_ITEM_HEIGHT,
      (baseSpins + skills.length + winIndex) * REEL_ITEM_HEIGHT,
      (baseSpins + skills.length * 2 + winIndex) * REEL_ITEM_HEIGHT,
    ];

    setReelOffsets(newOffsets);

    // Reveal result after animation
    setTimeout(() => {
      setSpinning(false);
      setResult(winSkill);
    }, 2800);
  }, [spinning]);

  const renderReel = (reelIndex: number) => {
    const offset = reelOffsets[reelIndex];
    const duration = 1.8 + reelIndex * 0.4; // Staggered stop

    return (
      <div
        className="relative overflow-hidden rounded-xl border"
        style={{
          height: REEL_ITEM_HEIGHT * VISIBLE_ITEMS,
          width: isMobile ? 90 : 120,
          borderColor: spinning
            ? `hsl(var(--primary) / 0.6)`
            : `hsl(var(--border))`,
          boxShadow: spinning
            ? `0 0 20px hsl(var(--primary) / 0.2), inset 0 0 30px hsl(var(--primary) / 0.05)`
            : `inset 0 0 20px hsl(var(--background) / 0.5)`,
          transition: "border-color 0.3s, box-shadow 0.3s",
          background: `hsl(var(--card))`,
        }}
      >
        <motion.div
          animate={{ y: -offset }}
          transition={{
            duration: spinning ? duration : 0,
            ease: [0.15, 0.85, 0.35, 1.0],
          }}
        >
          {extendedReel.map((skill, i) => (
            <div
              key={`${reelIndex}-${i}`}
              className="flex flex-col items-center justify-center gap-1"
              style={{ height: REEL_ITEM_HEIGHT }}
            >
              {skill.logo ? (
                <img src={skill.logo} alt={skill.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              ) : (
                <span className="text-2xl md:text-3xl">{skill.icon}</span>
              )}
              <span className="font-mono text-[10px] md:text-xs text-muted-foreground truncate max-w-[80px] md:max-w-[110px]">
                {skill.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Center highlight line */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: REEL_ITEM_HEIGHT,
            height: REEL_ITEM_HEIGHT,
            borderTop: `2px solid hsl(var(--primary) / 0.5)`,
            borderBottom: `2px solid hsl(var(--primary) / 0.5)`,
            background: `hsl(var(--primary) / 0.05)`,
          }}
        />
      </div>
    );
  };

  return (
    <section id="skill-slot" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// FEELING LUCKY?"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Skill Slot Machine
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Pull the lever and discover a random skill
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Slot machine body */}
          <div
            className="glass-card p-6 md:p-8 relative"
            style={{
              boxShadow: spinning
                ? `0 0 40px hsl(var(--primary) / 0.15), 0 0 80px hsl(var(--primary) / 0.05)`
                : undefined,
              transition: "box-shadow 0.5s",
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: `hsl(var(--primary))` }}
                  animate={spinning ? {
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  } : { opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    repeat: spinning ? Infinity : 0,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Reels */}
            <div className="flex items-center gap-3 md:gap-4">
              {renderReel(0)}
              {renderReel(1)}
              {renderReel(2)}
            </div>

            {/* Bottom glow when spinning */}
            {spinning && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
                style={{ background: `hsl(var(--primary))` }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>

          {/* Spin button */}
          <motion.button
            onClick={spin}
            disabled={spinning}
            className="relative px-10 py-4 rounded-xl font-display text-sm md:text-base tracking-widest uppercase overflow-hidden disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))`,
              border: `2px solid hsl(var(--primary) / 0.5)`,
              color: `hsl(var(--primary))`,
              boxShadow: `0 0 20px hsl(var(--primary) / 0.15)`,
            }}
            whileHover={spinning ? undefined : {
              scale: 1.05,
              boxShadow: `0 0 30px hsl(var(--primary) / 0.3)`,
            }}
            whileTap={spinning ? undefined : { scale: 0.95 }}
          >
            {spinning ? (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                Spinning...
              </motion.span>
            ) : (
              "🎰 Spin!"
            )}

            {/* Shimmer effect */}
            {!spinning && (
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)`,
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.button>

          {/* Result display */}
          <AnimatePresence>
            {result && !spinning && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", damping: 15 }}
                className="glass-card p-6 max-w-sm w-full text-center"
                style={{
                  borderColor: `hsl(${result.color} / 0.4)`,
                  boxShadow: `0 0 30px hsl(${result.color} / 0.15)`,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mb-3"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {result.logo ? (
                    <img src={result.logo} alt={result.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-3xl">{result.icon}</span>
                  )}
                  <h3
                    className="font-display text-xl font-bold tracking-wider"
                    style={{ color: `hsl(${result.color})` }}
                  >
                    {result.name}
                  </h3>
                </div>
                <p className="font-body text-muted-foreground text-sm mb-4">{result.description}</p>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(${result.color}), hsl(${result.color} / 0.5))`,
                      boxShadow: `0 0 8px hsl(${result.color} / 0.5)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.level}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <span className="font-mono text-xs mt-2 inline-block" style={{ color: `hsl(${result.color})` }}>
                  {result.level}% proficiency
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillSlotMachine;
