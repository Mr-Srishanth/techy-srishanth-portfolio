import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Brain, Code2, Rocket } from "lucide-react";

const updates = [
  {
    icon: Code2,
    title: "Learning Python & Data Structures",
    desc: "Currently improving programming fundamentals and problem-solving skills.",
    date: "Ongoing",
    accent: "from-primary to-neon-cyan",
  },
  {
    icon: Brain,
    title: "Exploring Artificial Intelligence",
    desc: "Studying AI and Machine Learning concepts to build intelligent systems.",
    date: "In Progress",
    accent: "from-neon-purple to-primary",
  },
  {
    icon: Rocket,
    title: "Building Python Mini Projects",
    desc: "Creating small applications to strengthen coding skills and apply theory.",
    date: "Active",
    accent: "from-neon-cyan to-neon-purple",
  },
  {
    icon: BookOpen,
    title: "Mastering DSA Fundamentals",
    desc: "Working through arrays, linked lists, trees, and sorting algorithms.",
    date: "Ongoing",
    accent: "from-primary to-neon-purple",
  },
];

const LearningJourneySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="journey" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">
            {"// MY LEARNING JOURNEY"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Continuous Growth
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Tracking my progress as I build skills and explore new technologies every day.
          </p>
        </motion.div>

        {/* Timeline line */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/60 via-primary/20 to-transparent pointer-events-none" />

          <div className="flex flex-col gap-10">
            {updates.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.title}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 z-20">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-primary neon-glow border-2 border-background"
                      animate={inView ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-0 md:mr-auto md:pl-0" : "md:pl-0 md:ml-auto md:pr-0"
                    }`}
                  >
                    <motion.div
                      className="glass-card p-6 group cursor-default relative overflow-hidden"
                      whileHover={{
                        y: -4,
                        boxShadow: "0 0 30px hsl(var(--primary) / 0.2)",
                        borderColor: "hsl(var(--primary) / 0.5)",
                      }}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${item.accent} bg-opacity-10`}>
                            <item.icon size={20} className="text-primary" />
                          </div>
                          <span className="font-mono text-xs text-primary/70 tracking-wider">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-semibold text-foreground mb-2 tracking-wider group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="font-body text-muted-foreground text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningJourneySection;
