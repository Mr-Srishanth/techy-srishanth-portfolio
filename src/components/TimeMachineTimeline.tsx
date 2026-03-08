import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { useRef } from "react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";
import { Rocket, GraduationCap, Code2, Brain, Trophy, Star, Shield, CheckCircle } from "lucide-react";

const events = [
  {
    year: "2025",
    title: "Started B.Tech CSE (AI & ML)",
    desc: "Joined Vignan Institute of Technology and Science. The journey begins.",
    icon: GraduationCap,
    accent: "primary",
  },
  {
    year: "2025",
    title: "Started C Programming",
    desc: "Began learning C language — pointers, memory management, and low-level programming fundamentals.",
    icon: Shield,
    accent: "neon-cyan",
  },
  {
    year: "2025",
    title: "First Python Program",
    desc: "Wrote my first 'Hello World' and fell in love with coding.",
    icon: Code2,
    accent: "primary",
  },
  {
    year: "2025",
    title: "Completed C Programming",
    desc: "Mastered C fundamentals — arrays, structures, file handling, and dynamic memory allocation.",
    icon: CheckCircle,
    accent: "neon-cyan",
  },
  {
    year: "27 Feb 2026",
    title: "Hackathon Debut — VHack",
    desc: "Participated in my first hackathon. Built a project under 24 hours.",
    icon: Trophy,
    accent: "neon-purple",
  },
  {
    year: "2025",
    title: "Exploring AI & Machine Learning",
    desc: "Began studying neural networks, supervised learning, and data science.",
    icon: Brain,
    accent: "primary",
  },
  {
    year: "2025",
    title: "Built This Portfolio",
    desc: "Created a futuristic portfolio with React, TypeScript & Framer Motion.",
    icon: Star,
    accent: "neon-cyan",
  },
  {
    year: "Future",
    title: "What's Next?",
    desc: "Full-stack mastery, open source contributions, and building impactful products.",
    icon: Rocket,
    accent: "neon-purple",
  },
];

const accentMap: Record<string, string> = {
  primary: "hsl(var(--primary))",
  "neon-cyan": "hsl(var(--neon-cyan))",
  "neon-purple": "hsl(var(--neon-purple))",
};

const accentBg: Record<string, string> = {
  primary: "bg-primary/10 border-primary/30",
  "neon-cyan": "bg-neon-cyan/10 border-neon-cyan/30",
  "neon-purple": "bg-neon-purple/10 border-neon-purple/30",
};

const accentText: Record<string, string> = {
  primary: "text-primary",
  "neon-cyan": "text-neon-cyan",
  "neon-purple": "text-neon-purple",
};

const TimeMachineTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.3"],
  });

  // Parallax layers
  const bgY1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Parallax blurs */}
      <motion.div
        className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
        style={{ y: bgY1 }}
      />
      <motion.div
        className="absolute bottom-0 -right-40 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none"
        style={{ y: bgY2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: light ? 0.5 : 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// TIME MACHINE"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            My Journey Through Time
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Scroll to rewind through the milestones that shaped my path.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto">
          {/* Animated center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-muted/20 md:-translate-x-px">
            <motion.div
              className="w-full bg-gradient-to-b from-primary via-neon-cyan to-neon-purple"
              style={{ height: lineHeight }}
            />
          </div>

          {events.map((event, i) => {
            const isLeft = !isMobile && i % 2 === 0;
            const Icon = event.icon;

            return (
              <motion.div
                key={i}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isMobile
                    ? "pl-16"
                    : isLeft
                    ? "md:flex-row-reverse md:text-right"
                    : ""
                }`}
                initial={{ opacity: 0, x: isMobile ? -20 : isLeft ? 40 : -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute z-10 ${
                    isMobile ? "left-4" : "left-1/2"
                  } -translate-x-1/2`}
                >
                  <motion.div
                    className={`w-5 h-5 rounded-full border-[3px] border-background flex items-center justify-center`}
                    style={{ backgroundColor: accentMap[event.accent] }}
                    whileHover={{ scale: 1.4 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </motion.div>
                </div>

                {/* Content card */}
                <motion.div
                  className={`glass-card p-5 rounded-xl group cursor-default relative overflow-hidden ${
                    isMobile
                      ? "w-full"
                      : isLeft
                      ? "md:w-[calc(50%-30px)] md:mr-auto"
                      : "md:w-[calc(50%-30px)] md:ml-auto"
                  }`}
                  whileHover={
                    isMobile
                      ? undefined
                      : {
                          y: -4,
                          boxShadow: `0 0 30px ${accentMap[event.accent]}33`,
                        }
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className={`flex items-center gap-3 mb-2 ${isLeft && !isMobile ? "flex-row-reverse" : ""}`}>
                      <div className={`p-2 rounded-lg border ${accentBg[event.accent]}`}>
                        <Icon size={18} className={accentText[event.accent]} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground tracking-wider">
                        {event.year}
                      </span>
                    </div>
                    <h3 className="font-display text-sm md:text-base font-semibold text-foreground tracking-wider mb-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimeMachineTimeline;
