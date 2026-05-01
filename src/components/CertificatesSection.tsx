import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, X } from "lucide-react";
import { useLightMotion } from "@/hooks/use-mobile";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { headingReveal } from "@/lib/animations";

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const light = useLightMotion();
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data } = usePortfolio();

  const certificates = data.certificates;

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          {...headingReveal(inView)}
          className="text-center mb-14"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// CERTIFICATIONS"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            My Certificates
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto mt-3">
            Verified certifications from top platforms.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto">
          {certificates.map((cert, i) => {
            const isExpanded = expanded === cert.title;
            const hasImage = !!cert.image;

            return (
              <motion.div
                key={cert.id || cert.title}
                initial={light ? undefined : { opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.button
                  onClick={() => hasImage && setExpanded(isExpanded ? null : cert.title)}
                  whileHover={light ? undefined : { scale: 1.12 }}
                  className="group flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center glass-card border-2 border-primary/40 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)]">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/30 group-hover:animate-pulse-glow transition-all duration-300" />
                    <Award size={36} className="text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="text-center">
                    <h3 className="font-display text-sm tracking-wider text-foreground">{cert.title}</h3>
                    <p className="text-muted-foreground text-xs font-body">{cert.issuer}</p>
                    {!hasImage && cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Verify <ExternalLink size={10} />
                      </a>
                    )}
                    {hasImage && (
                      <span className="inline-flex items-center gap-1 text-primary text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isExpanded ? "Close" : "View Certificate"}
                      </span>
                    )}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isExpanded && hasImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="relative w-[280px] sm:w-[400px] md:w-[500px] overflow-visible rounded-xl"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="absolute -inset-12 rounded-3xl pointer-events-none"
                        style={{
                          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.05) 40%, transparent 70%)",
                          animation: "breathe 4s ease-in-out infinite",
                        }}
                      />

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="absolute -inset-[3px] rounded-xl pointer-events-none overflow-hidden"
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "conic-gradient(from 0deg, transparent 0%, hsl(var(--primary)) 10%, transparent 20%, transparent 50%, hsl(var(--primary) / 0.6) 60%, transparent 70%)",
                            animation: "rotate-glow 3s linear infinite",
                          }}
                        />
                        <div className="absolute inset-[2px] rounded-[10px] bg-background" />
                      </motion.div>

                      <div className="relative glass-card rounded-xl p-2.5 border border-primary/25 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
                          <div className="w-1/2 h-full" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.8), transparent)", animation: "shimmer 2s ease-in-out infinite" }} />
                        </div>

                        <button
                          onClick={() => setExpanded(null)}
                          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/90 border border-primary/40 text-primary hover:bg-primary/20 hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                        <div className="relative rounded-lg overflow-hidden">
                          <img src={cert.image} alt={`${cert.title} certificate`} className="w-full rounded-lg" />
                          <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: "inset 0 0 40px hsl(var(--background) / 0.4), inset 0 0 80px hsl(var(--background) / 0.2)" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
