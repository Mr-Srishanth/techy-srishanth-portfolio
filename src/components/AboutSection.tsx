import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Code2, Brain } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { headingReveal, textReveal, cardReveal, cardHover, STAGGER } from "@/lib/animations";
import { usePortfolio } from "@/contexts/PortfolioContext";

const AboutSection = () => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data } = usePortfolio();

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div {...headingReveal(inView)} className="text-center mb-16">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// ABOUT ME"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Know Me Better
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...textReveal(inView, STAGGER)}>
            <h3 className="font-display text-2xl font-bold mb-4 text-foreground">
              {data.aboutTitle}
            </h3>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              {data.aboutP1}
            </p>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              {data.aboutP2}
            </p>
          </motion.div>

          <div className="grid gap-4">
            {[
              { icon: GraduationCap, title: "Education", desc: "B.Tech CSE (AI & ML) — VITS (2025–2029)" },
              { icon: Code2, title: "Focus Areas", desc: "Python, Data Structures & Algorithms" },
              { icon: Brain, title: "Interests", desc: "Artificial Intelligence & Machine Learning" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-6 flex gap-4 items-start group cursor-default"
                {...cardReveal(inView, i, 0.24)}
                whileHover={isMobile ? undefined : cardHover}
                whileTap={isMobile ? { scale: 0.98 } : undefined}
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:neon-glow transition-all duration-300">
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground tracking-wider">{item.title}</h4>
                  <p className="font-body text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
