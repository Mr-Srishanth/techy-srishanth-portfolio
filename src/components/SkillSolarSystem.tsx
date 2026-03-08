import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
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
  orbitRadius: number;
  orbitDuration: number;
  size: number;
  description: string;
}

const skills: Skill[] = [
  {
    name: "Python",
    level: 70,
    icon: "🐍",
    logo: pythonLogo,
    color: "200 100% 50%",
    orbitRadius: 100,
    orbitDuration: 12,
    size: 52,
    description: "Backend development, scripting, and data analysis. My primary language for problem solving.",
  },
  {
    name: "React",
    level: 75,
    icon: "⚛️",
    logo: reactLogo,
    color: "185 100% 50%",
    orbitRadius: 150,
    orbitDuration: 18,
    size: 56,
    description: "Building modern, interactive UIs with hooks, state management, and component architecture.",
  },
  {
    name: "Data Structures",
    level: 55,
    icon: "🏗️",
    color: "270 100% 60%",
    orbitRadius: 200,
    orbitDuration: 24,
    size: 46,
    description: "Arrays, linked lists, trees, graphs, and algorithm design for efficient problem solving.",
  },
  {
    name: "C Programming",
    level: 60,
    icon: "⚙️",
    color: "35 100% 55%",
    orbitRadius: 250,
    orbitDuration: 30,
    size: 44,
    description: "Low-level programming, memory management, and understanding how computers work under the hood.",
  },
  {
    name: "Machine Learning",
    level: 40,
    icon: "🤖",
    logo: aimlLogo,
    color: "320 80% 55%",
    orbitRadius: 300,
    orbitDuration: 36,
    size: 48,
    description: "Exploring neural networks, regression models, and classification algorithms with Python.",
  },
  {
    name: "Git",
    level: 65,
    icon: "🧩",
    logo: gitLogo,
    color: "10 90% 55%",
    orbitRadius: 350,
    orbitDuration: 42,
    size: 42,
    description: "Version control, branching strategies, collaboration workflows, and CI/CD pipelines.",
  },
];

const SkillSolarSystem = () => {
  const [selected, setSelected] = useState<Skill | null>(null);
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Scale orbits for mobile
  const scale = isMobile ? 0.55 : 1;
  const containerSize = isMobile ? 400 : 750;
  const center = containerSize / 2;

  return (
    <section id="skill-solar-system" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">
            {"// SKILL UNIVERSE"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Solar System of Skills
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Click any orbiting planet to explore the skill
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mx-auto"
          style={{ width: containerSize, height: containerSize }}
        >
          {/* Orbit rings */}
          {skills.map((skill) => (
            <div
              key={`orbit-${skill.name}`}
              className="absolute rounded-full border border-border/30"
              style={{
                width: skill.orbitRadius * 2 * scale,
                height: skill.orbitRadius * 2 * scale,
                left: center - skill.orbitRadius * scale,
                top: center - skill.orbitRadius * scale,
              }}
            />
          ))}

          {/* Sun (center) */}
          <motion.div
            className="absolute rounded-full flex items-center justify-center z-10"
            style={{
              width: isMobile ? 60 : 80,
              height: isMobile ? 60 : 80,
              left: center - (isMobile ? 30 : 40),
              top: center - (isMobile ? 30 : 40),
              background: `radial-gradient(circle, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.3))`,
              boxShadow: `0 0 40px hsl(var(--primary) / 0.5), 0 0 80px hsl(var(--primary) / 0.2)`,
            }}
            animate={{
              boxShadow: [
                `0 0 40px hsl(var(--primary) / 0.5), 0 0 80px hsl(var(--primary) / 0.2)`,
                `0 0 60px hsl(var(--primary) / 0.7), 0 0 100px hsl(var(--primary) / 0.3)`,
                `0 0 40px hsl(var(--primary) / 0.5), 0 0 80px hsl(var(--primary) / 0.2)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-display text-primary-foreground text-xs md:text-sm font-bold tracking-wider">
              ME
            </span>
          </motion.div>

          {/* Orbiting planets */}
          {skills.map((skill, i) => {
            const r = skill.orbitRadius * scale;
            const planetSize = skill.size * scale;

            return (
              <motion.div
                key={skill.name}
                className="absolute z-20"
                style={{
                  width: planetSize,
                  height: planetSize,
                  left: center - planetSize / 2,
                  top: center - planetSize / 2,
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: skill.orbitDuration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
                // Use a wrapper to handle orbit offset
              >
                <motion.div
                  style={{
                    position: "absolute",
                    width: planetSize,
                    height: planetSize,
                    // Offset from center by orbit radius
                    transform: `translateX(${r}px)`,
                    transformOrigin: `${-r + planetSize / 2}px ${planetSize / 2}px`,
                  }}
                  // Counter-rotate so content stays upright
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: skill.orbitDuration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                >
                  <motion.button
                    onClick={() => setSelected(skill)}
                    className="w-full h-full rounded-full flex items-center justify-center cursor-pointer relative group"
                    style={{
                      background: `radial-gradient(circle, hsl(${skill.color} / 0.8), hsl(${skill.color} / 0.3))`,
                      boxShadow: `0 0 15px hsl(${skill.color} / 0.4), 0 0 30px hsl(${skill.color} / 0.15)`,
                    }}
                    whileHover={{
                      scale: 1.3,
                      boxShadow: `0 0 25px hsl(${skill.color} / 0.6), 0 0 50px hsl(${skill.color} / 0.3)`,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {skill.logo ? (
                      <img
                        src={skill.logo}
                        alt={skill.name}
                        className="w-1/2 h-1/2 object-contain drop-shadow-lg"
                      />
                    ) : (
                      <span className="text-lg md:text-xl">{skill.icon}</span>
                    )}
                    {/* Tooltip */}
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-mono text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {skill.name}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Skill detail modal */}
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
                initial={{ scale: 0.7, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 30 }}
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

                {/* Progress bar */}
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

export default SkillSolarSystem;
