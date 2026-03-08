import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";
import { Shield, Zap, Brain, Code2, Database, GitBranch, Lock } from "lucide-react";

interface SkillNode {
  id: string;
  name: string;
  icon: React.ElementType;
  level: number;
  maxLevel: number;
  xp: number;
  maxXp: number;
  unlocked: boolean;
  description: string;
  tier: number;
  x: number;
  y: number;
  connections: string[];
}

const skillNodes: SkillNode[] = [
  {
    id: "python",
    name: "Python",
    icon: Code2,
    level: 7,
    maxLevel: 10,
    xp: 700,
    maxXp: 1000,
    unlocked: true,
    description: "Core programming language. Loops, functions, OOP mastered.",
    tier: 1,
    x: 50,
    y: 15,
    connections: ["dsa", "ml"],
  },
  {
    id: "c",
    name: "C Programming",
    icon: Shield,
    level: 10,
    maxLevel: 10,
    xp: 1000,
    maxXp: 1000,
    unlocked: true,
    description: "Low-level programming. Pointers and memory management.",
    tier: 1,
    x: 20,
    y: 15,
    connections: ["dsa"],
  },
  {
    id: "dsa",
    name: "Data Structures",
    icon: Database,
    level: 5,
    maxLevel: 10,
    xp: 550,
    maxXp: 1000,
    unlocked: true,
    description: "Arrays, linked lists, trees, and sorting algorithms.",
    tier: 2,
    x: 35,
    y: 40,
    connections: ["react"],
  },
  {
    id: "react",
    name: "React",
    icon: Zap,
    level: 7,
    maxLevel: 10,
    xp: 750,
    maxXp: 1000,
    unlocked: true,
    description: "Component-based UI development with hooks and state management.",
    tier: 2,
    x: 65,
    y: 40,
    connections: ["fullstack"],
  },
  {
    id: "git",
    name: "Git & GitHub",
    icon: GitBranch,
    level: 6,
    maxLevel: 10,
    xp: 650,
    maxXp: 1000,
    unlocked: true,
    description: "Version control, branching, and collaborative workflows.",
    tier: 2,
    x: 80,
    y: 15,
    connections: ["react"],
  },
  {
    id: "ml",
    name: "Machine Learning",
    icon: Brain,
    level: 4,
    maxLevel: 10,
    xp: 400,
    maxXp: 1000,
    unlocked: true,
    description: "Supervised learning basics. Exploring neural networks.",
    tier: 3,
    x: 50,
    y: 65,
    connections: ["fullstack"],
  },
  {
    id: "fullstack",
    name: "Full Stack",
    icon: Lock,
    level: 0,
    maxLevel: 10,
    xp: 0,
    maxXp: 1000,
    unlocked: false,
    description: "Locked — Complete React & ML paths to unlock this mastery.",
    tier: 4,
    x: 50,
    y: 88,
    connections: [],
  },
];

const tierColors: Record<number, string> = {
  1: "from-primary to-neon-cyan",
  2: "from-neon-cyan to-neon-purple",
  3: "from-neon-purple to-primary",
  4: "from-primary to-neon-cyan",
};

const RPGSkillTree = () => {
  const ref = useRef(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getNode = (id: string) => skillNodes.find((n) => n.id === id);

  return (
    <section id="skill-tree" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: light ? 0.5 : 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// SKILL TREE"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Level Up Your View
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Click any node to inspect skill details. Locked nodes require prerequisite mastery.
          </p>
        </motion.div>

        {/* Tree Container */}
        <div className="relative max-w-3xl mx-auto" style={{ height: isMobile ? 500 : 520 }}>
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {skillNodes.map((node) =>
              node.connections.map((targetId) => {
                const target = getNode(targetId);
                if (!target) return null;
                const isHighlighted = hoveredId === node.id || hoveredId === targetId;
                return (
                  <motion.line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={
                      isHighlighted
                        ? "hsl(var(--primary))"
                        : target.unlocked
                        ? "hsl(var(--primary) / 0.25)"
                        : "hsl(var(--muted-foreground) / 0.15)"
                    }
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={target.unlocked ? "none" : "6 4"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.3 + Math.random() * 0.5 }}
                  />
                );
              })
            )}
          </svg>

          {/* Skill Nodes */}
          {skillNodes.map((node, i) => {
            const Icon = node.icon;
            const xpPct = (node.xp / node.maxXp) * 100;
            const isHovered = hoveredId === node.id;

            return (
              <motion.div
                key={node.id}
                className="absolute z-10"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.5 + i * 0.12,
                }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelected(node)}
              >
                <motion.div
                  className={`relative flex flex-col items-center cursor-pointer group`}
                  whileHover={isMobile ? undefined : { scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Glow ring */}
                  {node.unlocked && (
                    <div
                      className={`absolute -inset-3 rounded-full bg-gradient-to-br ${tierColors[node.tier]} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500`}
                    />
                  )}

                  {/* Node circle */}
                  <div
                    className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      node.unlocked
                        ? "border-primary/60 bg-background/80 group-hover:border-primary group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                        : "border-muted-foreground/30 bg-muted/40"
                    }`}
                  >
                    <Icon
                      size={isMobile ? 22 : 26}
                      className={
                        node.unlocked
                          ? "text-primary transition-colors"
                          : "text-muted-foreground/50"
                      }
                    />

                    {/* Level badge */}
                    {node.unlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <span className="text-[10px] font-mono font-bold">{node.level}</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <span
                    className={`mt-1.5 font-mono text-[10px] md:text-xs tracking-wider text-center max-w-[80px] leading-tight ${
                      node.unlocked ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    {node.name}
                  </span>

                  {/* Mini XP bar */}
                  {node.unlocked && (
                    <div className="w-12 h-1 mt-1 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${tierColors[node.tier]}`}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${xpPct}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }}
                      />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
              <motion.div
                className="glass-card p-8 max-w-sm w-full relative z-10 rounded-2xl border border-primary/20"
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center border ${
                      selected.unlocked
                        ? "border-primary/40 bg-primary/10"
                        : "border-muted-foreground/30 bg-muted/20"
                    }`}
                  >
                    <selected.icon
                      size={28}
                      className={selected.unlocked ? "text-primary" : "text-muted-foreground/50"}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground tracking-wider">
                      {selected.name}
                    </h3>
                    <p className="font-mono text-xs text-primary">
                      {selected.unlocked
                        ? `Level ${selected.level} / ${selected.maxLevel}`
                        : "🔒 LOCKED"}
                    </p>
                  </div>
                </div>

                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-5">
                  {selected.description}
                </p>

                {selected.unlocked && (
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-mono text-xs text-muted-foreground">XP Progress</span>
                      <span className="font-mono text-xs text-primary">
                        {selected.xp} / {selected.maxXp}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${tierColors[selected.tier]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(selected.xp / selected.maxXp) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground/60 mt-2 text-center">
                      Tier {selected.tier} •{" "}
                      {selected.level === selected.maxLevel ? "MAXED" : `${selected.maxLevel - selected.level} levels to max`}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelected(null)}
                  className="mt-5 w-full py-2 rounded-lg border border-primary/30 text-primary font-mono text-sm hover:bg-primary/10 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RPGSkillTree;
