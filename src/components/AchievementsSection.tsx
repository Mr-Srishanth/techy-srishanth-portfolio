import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { headingReveal, cardReveal, cardHover } from "@/lib/animations";
import { usePortfolio } from "@/contexts/PortfolioContext";

const AchievementsSection = () => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data } = usePortfolio();

  const achievements = data.achievements;

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div {...headingReveal(inView)} className="text-center mb-16">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// ACHIEVEMENTS"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Milestones & Awards
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id || a.title}
              className="glass-card p-6 group cursor-default relative overflow-hidden"
              {...cardReveal(inView, i, 0.12)}
              whileHover={isMobile ? undefined : cardHover}
              whileTap={isMobile ? { scale: 0.98 } : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{a.icon}</span>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2 tracking-wider group-hover:text-primary transition-colors duration-300">
                  {a.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {a.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
