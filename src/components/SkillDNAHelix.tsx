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

const NODE_SPACING = 120;
const HELIX_RADIUS = 140;
const HELIX_TURNS = 1.5;

const SkillDNAHelix = () => {
  const [selected, setSelected] = useState<Skill | null>(null);
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const helixRadius = isMobile ? 80 : HELIX_RADIUS;
  const totalHeight = skills.length * NODE_SPACING + 60;

  // Generate helix positions for two strands
  const getHelixPos = (index: number, strand: 0 | 1) => {
    const progress = index / (skills.length - 1);
    const angle = progress * Math.PI * 2 * HELIX_TURNS + (strand * Math.PI);
    const x = Math.cos(angle) * helixRadius;
    const z = Math.sin(angle); // -1 to 1, used for depth/opacity
    const y = index * NODE_SPACING + 30;
    return { x, y, z };
  };

  // Build connector paths between paired nodes
  const connectorPairs = skills.map((_, i) => {
    const a = getHelixPos(i, 0);
    const b = getHelixPos(i, 1);
    return { a, b, index: i };
  });

  return (
    <section id="skill-dna" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// SKILL DNA"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            The Skill Helix
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Click any node to explore the skill
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mx-auto"
          style={{
            width: helixRadius * 2 + 160,
            height: totalHeight,
          }}
        >
          {/* SVG connectors (rungs between strands) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            {connectorPairs.map(({ a, b, index }) => {
              const centerX = helixRadius + 80;
              const avgZ = (a.z + b.z) / 2;
              const opacity = 0.15 + (avgZ + 1) * 0.15;
              return (
                <motion.line
                  key={`rung-${index}`}
                  x1={centerX + a.x}
                  y1={a.y}
                  x2={centerX + b.x}
                  y2={b.y}
                  stroke={`hsl(var(--primary) / ${opacity})`}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                />
              );
            })}

            {/* Backbone lines for each strand */}
            {[0, 1].map((strand) => {
              const points = skills.map((_, i) => {
                const pos = getHelixPos(i, strand as 0 | 1);
                return `${helixRadius + 80 + pos.x},${pos.y}`;
              });
              const d = `M ${points.join(" L ")}`;
              return (
                <motion.path
                  key={`backbone-${strand}`}
                  d={d}
                  fill="none"
                  stroke={`hsl(var(--primary) / 0.2)`}
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
              );
            })}
          </svg>

          {/* Strand 0 — skill nodes */}
          {skills.map((skill, i) => {
            const pos = getHelixPos(i, 0);
            const depthScale = 0.7 + (pos.z + 1) * 0.2;
            const depthOpacity = 0.5 + (pos.z + 1) * 0.3;
            const nodeSize = isMobile ? 50 : 60;

            return (
              <motion.button
                key={`strand0-${skill.name}`}
                className="absolute rounded-full flex items-center justify-center cursor-pointer group"
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  left: helixRadius + 80 + pos.x - nodeSize / 2,
                  top: pos.y - nodeSize / 2,
                  zIndex: Math.round((pos.z + 1) * 10),
                  background: `radial-gradient(circle, hsl(${skill.color} / ${0.7 * depthOpacity}), hsl(${skill.color} / ${0.2 * depthOpacity}))`,
                  boxShadow: `0 0 ${12 * depthScale}px hsl(${skill.color} / ${0.3 * depthOpacity})`,
                  transform: `scale(${depthScale})`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: depthOpacity, scale: depthScale } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
                whileHover={{
                  scale: depthScale * 1.25,
                  boxShadow: `0 0 25px hsl(${skill.color} / 0.5)`,
                }}
                whileTap={{ scale: depthScale * 0.9 }}
                onClick={() => setSelected(skill)}
              >
                {skill.logo ? (
                  <img src={skill.logo} alt={skill.name} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                ) : (
                  <span className="text-lg md:text-xl">{skill.icon}</span>
                )}
                {/* Tooltip */}
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {skill.name}
                </span>
              </motion.button>
            );
          })}

          {/* Strand 1 — mirror decorative nodes */}
          {skills.map((skill, i) => {
            const pos = getHelixPos(i, 1);
            const depthScale = 0.6 + (pos.z + 1) * 0.15;
            const depthOpacity = 0.3 + (pos.z + 1) * 0.2;
            const nodeSize = isMobile ? 34 : 40;

            return (
              <motion.div
                key={`strand1-${skill.name}`}
                className="absolute rounded-full"
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  left: helixRadius + 80 + pos.x - nodeSize / 2,
                  top: pos.y - nodeSize / 2,
                  zIndex: Math.round((pos.z + 1) * 10),
                  background: `radial-gradient(circle, hsl(${skill.color} / ${0.4 * depthOpacity}), hsl(${skill.color} / ${0.1 * depthOpacity}))`,
                  border: `1px solid hsl(${skill.color} / ${0.2 * depthOpacity})`,
                  transform: `scale(${depthScale})`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: depthOpacity * 0.6, scale: depthScale } : {}}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.12 }}
              />
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
                initial={{ scale: 0.7, opacity: 0, rotateX: 30 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.7, opacity: 0, rotateX: -30 }}
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

export default SkillDNAHelix;
