import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Code2, GraduationCap, Trophy, ExternalLink } from "lucide-react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";

const achievements = [
  {
    icon: GraduationCap,
    title: "B.Tech in Computer Science",
    description: "Currently pursuing my degree with a focus on full-stack development and AI.",
    color: "text-primary",
  },
  {
    icon: Trophy,
    title: "Hackathon Finalist",
    description: "Reached the finals in a national-level coding hackathon.",
    color: "text-[hsl(var(--neon-cyan))]",
  },
  {
    icon: Code2,
    title: "500+ GitHub Contributions",
    description: "Consistent open-source contributions and personal project commits.",
    color: "text-[hsl(var(--neon-purple))]",
  },
  {
    icon: Award,
    title: "Web Dev Certification",
    description: "Completed an advanced full-stack web development certification.",
    link: "#",
    color: "text-primary",
  },
];

const ease = [0.25, 0.1, 0.25, 1];

const AchievementsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();
  const light = useLightMotion();

  return (
    <section id="achievements" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display tracking-wider text-foreground mb-4">
            Achievements & <span className="text-primary neon-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Milestones, awards, and certifications I've earned along the way.
          </p>
        </motion.div>

        {/* Cards with stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.1, ease }}
              whileHover={isMobile ? undefined : {
                y: -6,
                boxShadow: "0 0 25px hsl(var(--primary) / 0.15)",
                transition: { duration: 0.25 },
              }}
              className="glass-card p-6 flex flex-col items-center text-center gap-3"
            >
              <div className="p-3 rounded-xl bg-secondary/60">
                <a.icon size={28} className={a.color} />
              </div>
              <h3 className="font-display text-sm tracking-wider text-foreground">{a.title}</h3>
              <p className="text-muted-foreground text-xs font-body leading-relaxed">{a.description}</p>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary text-xs mt-1 hover:underline"
                >
                  Verify <ExternalLink size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
