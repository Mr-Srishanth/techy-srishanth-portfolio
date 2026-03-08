import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Brain, Code2, Rocket, Zap, Database } from "lucide-react";
import { useLightMotion, useIsMobile } from "@/hooks/use-mobile";

const milestones = [
  { icon: Code2, title: "Python Basics", desc: "Programming fundamentals" },
  { icon: Database, title: "DSA", desc: "Arrays, Trees & Sorting" },
  { icon: Brain, title: "AI & ML", desc: "Intelligent systems" },
  { icon: Rocket, title: "Mini Projects", desc: "Hands-on building" },
  { icon: Zap, title: "VHack 2025", desc: "Hackathon winner" },
  { icon: BookOpen, title: "B.Tech CSE", desc: "AI & ML specialization" },
];

const LearningJourneySection = () => {
  const ref = useRef(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const dur = light ? 0.5 : 0.8;
  const yOff = light ? 20 : 40;

  // Double milestones for seamless loop
  const loopItems = [...milestones, ...milestones];
  const cabinWidth = isMobile ? 160 : 200;
  const gap = isMobile ? 80 : 120;
  const totalWidth = milestones.length * (cabinWidth + gap);
  const animDuration = light ? 30 : 20;

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
          className="text-center mb-20"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">
            {"// MY LEARNING JOURNEY"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Continuous Growth
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Skills and milestones riding along my journey — always moving forward.
          </p>
        </motion.div>

        {/* Ropeway system */}
        <motion.div
          className="relative h-[280px] md:h-[320px]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Support towers */}
          {[0, 25, 50, 75, 100].map((pos) => (
            <div
              key={pos}
              className="absolute bottom-0 z-10"
              style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
            >
              {/* Tower pole */}
              <div className="w-1 h-[220px] md:h-[260px] bg-gradient-to-t from-muted/60 via-muted-foreground/30 to-primary/40 mx-auto rounded-full" />
              {/* Tower top cap */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-primary/60 neon-glow" />
              {/* Tower base */}
              <div className="w-4 h-1 bg-muted-foreground/20 rounded-full mx-auto" />
            </div>
          ))}

          {/* Cable/Rope */}
          <div className="absolute top-[8px] left-0 right-0 z-20">
            {/* Main cable */}
            <div className="h-[2px] bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 w-full" />
            {/* Cable glow */}
            {!light && (
              <div className="h-[1px] bg-primary/30 blur-[2px] w-full -mt-[1px]" />
            )}
          </div>

          {/* Moving cabins container */}
          <div className="absolute top-[10px] left-0 right-0 overflow-hidden h-[260px] md:h-[300px] z-30">
            <motion.div
              className="flex items-start"
              animate={{
                x: [0, -totalWidth],
              }}
              transition={{
                x: {
                  duration: animDuration,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{ width: totalWidth * 2 }}
            >
              {loopItems.map((item, i) => (
                <div
                  key={i}
                  className="shrink-0 flex flex-col items-center"
                  style={{ width: cabinWidth + gap }}
                >
                  {/* Cable connector */}
                  <div className="w-[2px] h-8 bg-gradient-to-b from-primary/60 to-primary/20" />
                  {/* Connector knob */}
                  <div className="w-3 h-3 rounded-full border-2 border-primary/50 bg-background -mt-1 mb-1 z-10" />

                  {/* Cabin */}
                  <motion.div
                    className="glass-card rounded-xl p-4 group cursor-default relative overflow-hidden"
                    style={{ width: cabinWidth }}
                    whileHover={isMobile ? undefined : {
                      scale: 1.08,
                      boxShadow: "0 0 30px hsl(var(--primary) / 0.3)",
                    }}
                  >
                    {/* Cabin roof */}
                    <div className="absolute top-0 left-2 right-2 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <item.icon size={isMobile ? 18 : 22} className="text-primary" />
                      </div>
                      <h3 className="font-display text-sm font-semibold text-foreground tracking-wider group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-body text-muted-foreground text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Swing animation */}
                    {!light && (
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-xl"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                      />
                    )}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningJourneySection;
