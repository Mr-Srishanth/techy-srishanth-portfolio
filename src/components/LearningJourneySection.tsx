import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BookOpen, Brain, Code2, Rocket, GripHorizontal } from "lucide-react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";

const updates = [
  {
    icon: Code2,
    title: "Learning Python & Data Structures",
    desc: "Currently improving programming fundamentals and problem-solving skills.",
    date: "Ongoing",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Brain,
    title: "Exploring Artificial Intelligence",
    desc: "Studying AI and Machine Learning concepts to build intelligent systems.",
    date: "In Progress",
    color: "from-neon-purple/20 to-neon-purple/5",
  },
  {
    icon: Rocket,
    title: "Building Python Mini Projects",
    desc: "Creating small applications to strengthen coding skills and apply theory.",
    date: "Active",
    color: "from-neon-cyan/20 to-neon-cyan/5",
  },
  {
    icon: BookOpen,
    title: "Mastering DSA Fundamentals",
    desc: "Working through arrays, linked lists, trees, and sorting algorithms.",
    date: "Ongoing",
    color: "from-primary/20 to-primary/5",
  },
];

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const LearningJourneySection = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.pageX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section id="journey" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">
            {"// MY LEARNING JOURNEY"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Continuous Growth
          </h2>
          <motion.p
            className="font-body text-muted-foreground mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease }}
          >
            Tracking my progress as I build skills and explore new technologies every day.
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2 mt-3 text-muted-foreground/50"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.5, ease }}
          >
            <GripHorizontal size={16} />
            <span className="font-mono text-xs tracking-wider">Drag to explore</span>
          </motion.div>
        </motion.div>

        {/* Draggable horizontal timeline */}
        <div className="relative">
          <div className="absolute top-[60px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-0" />

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-hide ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
            style={{ scrollBehavior: isDragging ? "auto" : "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="shrink-0 w-[calc(50vw-200px)] hidden md:block" />

            {updates.map((item, i) => (
              <motion.div
                key={item.title}
                className="shrink-0 w-[280px] sm:w-[320px] relative pt-[40px]"
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease }}
              >
                <div className="absolute top-[52px] left-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-primary neon-glow border-2 border-background" />
                </div>
                <div className="absolute top-[68px] left-1/2 -translate-x-px w-[2px] h-6 bg-gradient-to-b from-primary/60 to-transparent" />

                <motion.div
                  className="glass-card p-6 mt-10 group cursor-default relative overflow-hidden rounded-xl"
                  whileHover={isMobile ? undefined : {
                    y: -6,
                    boxShadow: "0 0 30px hsl(var(--primary) / 0.2)",
                    borderColor: "hsl(var(--primary) / 0.5)",
                    transition: { duration: 0.25 },
                  }}
                  whileTap={isMobile ? { scale: 0.98 } : undefined}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                        <item.icon size={20} className="text-primary" />
                      </div>
                      <span className="font-mono text-xs text-primary/70 tracking-wider">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-2 tracking-wider group-hover:text-primary transition-colors duration-250">
                      {item.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            <div className="shrink-0 w-[calc(50vw-200px)] hidden md:block" />
          </div>
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default LearningJourneySection;
