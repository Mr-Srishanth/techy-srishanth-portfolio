import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { headingReveal, cardReveal, cardHover } from "@/lib/animations";
import { usePortfolio } from "@/contexts/PortfolioContext";

const AchievementsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();
  const { data } = usePortfolio();

  const achievements = data.achievements.length > 0
    ? data.achievements
    : [
        { title: "B.Tech in Computer Science", description: "Currently pursuing my degree with a focus on full-stack development and AI.", icon: "🎓", color: "text-primary" },
        { title: "Hackathon Finalist", description: "Reached the finals in a national-level coding hackathon.", icon: "🏆", color: "text-[hsl(var(--neon-cyan))]" },
        { title: "500+ GitHub Contributions", description: "Consistent open-source contributions and personal project commits.", icon: "💻", color: "text-[hsl(var(--neon-purple))]" },
        { title: "Web Dev Certification", description: "Completed an advanced full-stack web development certification.", icon: "🏅", color: "text-primary", link: "#" },
      ];

  return (
    <section id="achievements" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div {...headingReveal(inView)} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display tracking-wider text-foreground mb-4">
            Achievements & <span className="text-primary neon-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Milestones, awards, and certifications I've earned along the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {achievements.map((a, i) => (
            <motion.div
              key={`${a.title}-${i}`}
              {...cardReveal(inView, i, 0.12)}
              whileHover={isMobile ? undefined : cardHover}
              className="glass-card p-6 flex flex-col items-center text-center gap-3"
            >
              <div className="p-3 rounded-xl bg-secondary/60">
                <span className={`text-2xl ${a.color}`}>{a.icon}</span>
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
