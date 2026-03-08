import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Brain, Code2, Rocket } from "lucide-react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";

const updates = [
  {
    icon: Code2,
    title: "Learning Python & Data Structures",
    desc: "Currently improving programming fundamentals and problem-solving skills.",
    date: "Ongoing",
  },
  {
    icon: Brain,
    title: "Exploring Artificial Intelligence",
    desc: "Studying AI and Machine Learning concepts to build intelligent systems.",
    date: "In Progress",
  },
  {
    icon: Rocket,
    title: "Building Python Mini Projects",
    desc: "Creating small applications to strengthen coding skills and apply theory.",
    date: "Active",
  },
  {
    icon: BookOpen,
    title: "Mastering DSA Fundamentals",
    desc: "Working through arrays, linked lists, trees, and sorting algorithms.",
    date: "Ongoing",
  },
];

const LearningJourneySection = () => {
  const ref = useRef(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: light ? "-50px" : "-100px" });
  const yOff = light ? 20 : 40;
  const dur = light ? 0.5 : 0.8;

  return (
    <section id="journey" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: yOff }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: dur }}
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
                  initial={{ opacity: 0, y: light ? 15 : 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 z-20">
                    <div className="w-4 h-4 rounded-full bg-primary neon-glow border-2 border-background" />
                  </div>

                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-0 md:mr-auto md:pl-0" : "md:pl-0 md:ml-auto md:pr-0"
                    }`}
                  >
                    <motion.div
                      className="glass-card p-6 group cursor-default relative overflow-hidden"
                      whileHover={isMobile ? undefined : {
                        y: -4,
                        boxShadow: "0 0 30px hsl(var(--primary) / 0.2)",
                        borderColor: "hsl(var(--primary) / 0.5)",
                      }}
                      whileTap={isMobile ? { scale: 0.98 } : undefined}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
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
