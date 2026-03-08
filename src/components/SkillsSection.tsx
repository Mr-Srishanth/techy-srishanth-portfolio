import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";
import pythonLogo from "@/assets/logos/python.svg";
import reactLogo from "@/assets/logos/react.svg";
import gitLogo from "@/assets/logos/git.svg";
import aimlLogo from "@/assets/logos/aiml.png";

const skills = [
  { name: "Python", level: 70, icon: "🐍", logo: pythonLogo },
  { name: "Data Structures", level: 55, icon: "🏗️" },
  { name: "C Programming", level: 60, icon: "⚙️" },
  { name: "React", level: 75, icon: "⚛️", logo: reactLogo },
  { name: "Machine Learning (Basics)", level: 40, icon: "🤖", logo: aimlLogo },
  { name: "Git", level: 65, icon: "🧩", logo: gitLogo },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: light ? "-50px" : "-100px" });
  const yOff = light ? 20 : 40;

  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: yOff }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: light ? 0.5 : 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// MY SKILLS"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Technologies & Tools
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="glass-card p-6 group"
              initial={{ opacity: 0, y: light ? 15 : 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={isMobile ? undefined : { scale: 1.02 }}
              whileTap={isMobile ? { scale: 0.98 } : undefined}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="font-display text-sm font-semibold tracking-wider text-foreground">
                    {skill.name}
                  </span>
                </div>
                <span className="font-mono text-sm text-primary">{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-neon-cyan"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                  style={{ boxShadow: "0 0 10px hsl(200 100% 50% / 0.5)" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
