import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "Python", level: 70, icon: "🐍" },
  { name: "Data Structures", level: 55, icon: "🏗️" },
  { name: "C Programming", level: 60, icon: "⚙️" },
  { name: "HTML & CSS", level: 75, icon: "🌐" },
  { name: "Machine Learning (Basics)", level: 40, icon: "🤖" },
  { name: "Problem Solving", level: 65, icon: "🧩" },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-2xl"
                    animate={inView ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {skill.icon}
                  </motion.span>
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
