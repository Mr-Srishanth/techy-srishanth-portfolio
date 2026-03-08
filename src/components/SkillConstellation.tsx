import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
  { name: "Python", level: 70, icon: "🐍", logo: pythonLogo, color: "200 100% 50%", description: "Backend development, scripting, and data analysis. My primary language for problem solving." },
  { name: "React", level: 75, icon: "⚛️", logo: reactLogo, color: "185 100% 50%", description: "Building modern, interactive UIs with hooks, state management, and component architecture." },
  { name: "Data Structures", level: 55, icon: "🏗️", color: "270 100% 60%", description: "Arrays, linked lists, trees, graphs, and algorithm design for efficient problem solving." },
  { name: "C Programming", level: 60, icon: "⚙️", color: "35 100% 55%", description: "Low-level programming, memory management, and understanding how computers work." },
  { name: "Machine Learning", level: 40, icon: "🤖", logo: aimlLogo, color: "320 80% 55%", description: "Exploring neural networks, regression models, and classification algorithms." },
  { name: "Git", level: 65, icon: "🧩", logo: gitLogo, color: "10 90% 55%", description: "Version control, branching strategies, and collaboration workflows." },
];

// Constellation connections (pairs of skill indices)
const connections: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [2, 4], [3, 5], [4, 5], [1, 4],
];

const SkillConstellation = () => {
  const [selected, setSelected] = useState<Skill | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const w = isMobile ? 360 : 700;
  const h = isMobile ? 400 : 500;

  // Star positions — arranged to form a pleasing constellation
  const positions = isMobile
    ? [
        { x: 80, y: 70 },
        { x: 280, y: 50 },
        { x: 180, y: 160 },
        { x: 60, y: 260 },
        { x: 300, y: 250 },
        { x: 180, y: 340 },
      ]
    : [
        { x: 120, y: 100 },
        { x: 420, y: 60 },
        { x: 280, y: 200 },
        { x: 100, y: 320 },
        { x: 520, y: 300 },
        { x: 320, y: 420 },
      ];

  // Check if a skill is connected to hovered skill
  const isConnectedToHovered = (idx: number) => {
    if (hoveredIdx === null) return false;
    return connections.some(
      ([a, b]) => (a === hoveredIdx && b === idx) || (b === hoveredIdx && a === idx)
    );
  };

  return (
    <section id="skill-constellation" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// SKILL MAP"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Skill Constellation
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Hover to reveal connections, click a star to explore
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mx-auto"
          style={{ width: w, height: h }}
        >
          {/* Background stars (decorative) */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={`bg-star-${i}`}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(var(--foreground) / ${0.15 + Math.random() * 0.2})`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* SVG constellation lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
            {connections.map(([a, b], i) => {
              const pa = positions[a];
              const pb = positions[b];
              const isHighlighted =
                hoveredIdx !== null && (a === hoveredIdx || b === hoveredIdx);
              const baseOpacity = isHighlighted ? 0.6 : 0.15;
              const lineColor = isHighlighted
                ? `hsl(var(--primary) / ${baseOpacity})`
                : `hsl(var(--foreground) / ${baseOpacity})`;

              return (
                <motion.line
                  key={`line-${i}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={lineColor}
                  strokeWidth={isHighlighted ? 2 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{
                    duration: 1.2,
                    delay: 0.8 + i * 0.15,
                    ease: "easeOut",
                  }}
                  style={{
                    filter: isHighlighted
                      ? `drop-shadow(0 0 6px hsl(var(--primary) / 0.4))`
                      : "none",
                    transition: "stroke 0.3s, stroke-width 0.3s, filter 0.3s",
                  }}
                />
              );
            })}
          </svg>

          {/* Skill star nodes */}
          {skills.map((skill, i) => {
            const pos = positions[i];
            const isHovered = hoveredIdx === i;
            const isLinked = isConnectedToHovered(i);
            const starSize = isMobile ? 44 : 56;
            const glowLevel = isHovered ? 1 : isLinked ? 0.6 : 0.25;

            return (
              <motion.button
                key={skill.name}
                className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                style={{
                  left: pos.x - starSize / 2,
                  top: pos.y - starSize / 2,
                  zIndex: isHovered ? 20 : 10,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * 0.12,
                  type: "spring",
                  damping: 12,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelected(skill)}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: starSize + 20,
                    height: starSize + 20,
                    left: -10,
                    top: -10,
                    background: `radial-gradient(circle, hsl(${skill.color} / ${0.15 * glowLevel}), transparent)`,
                    boxShadow: `0 0 ${20 * glowLevel}px hsl(${skill.color} / ${0.3 * glowLevel})`,
                  }}
                  animate={{
                    scale: isHovered ? [1, 1.15, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isHovered ? Infinity : 0,
                  }}
                />

                {/* Star body */}
                <div
                  className="relative rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    width: starSize,
                    height: starSize,
                    background: `radial-gradient(circle, hsl(${skill.color} / ${0.6 + glowLevel * 0.3}), hsl(${skill.color} / ${0.15 + glowLevel * 0.1}))`,
                    boxShadow: `0 0 ${10 + glowLevel * 15}px hsl(${skill.color} / ${0.2 + glowLevel * 0.2})`,
                    border: `1px solid hsl(${skill.color} / ${0.3 + glowLevel * 0.3})`,
                  }}
                >
                  {skill.logo ? (
                    <img src={skill.logo} alt={skill.name} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                  ) : (
                    <span className="text-lg md:text-xl">{skill.icon}</span>
                  )}
                </div>

                {/* Label */}
                <motion.span
                  className="font-mono text-[10px] md:text-xs whitespace-nowrap mt-1"
                  style={{
                    color: isHovered
                      ? `hsl(${skill.color})`
                      : `hsl(var(--muted-foreground))`,
                    textShadow: isHovered
                      ? `0 0 8px hsl(${skill.color} / 0.5)`
                      : "none",
                    transition: "color 0.3s, text-shadow 0.3s",
                  }}
                >
                  {skill.name}
                </motion.span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Detail modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
              <motion.div
                className="glass-card p-8 max-w-md w-full relative z-10"
                initial={{ scale: 0.7, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, hsl(${selected.color} / 0.8), hsl(${selected.color} / 0.3))`,
                      boxShadow: `0 0 20px hsl(${selected.color} / 0.4)`,
                    }}
                  >
                    {selected.logo ? (
                      <img src={selected.logo} alt={selected.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-2xl">{selected.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground tracking-wider">
                      {selected.name}
                    </h3>
                    <span className="font-mono text-sm" style={{ color: `hsl(${selected.color})` }}>
                      {selected.level}% proficiency
                    </span>
                  </div>
                </div>

                <p className="font-body text-muted-foreground leading-relaxed mb-6">
                  {selected.description}
                </p>

                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(${selected.color}), hsl(${selected.color} / 0.5))`,
                      boxShadow: `0 0 10px hsl(${selected.color} / 0.5)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selected.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SkillConstellation;
