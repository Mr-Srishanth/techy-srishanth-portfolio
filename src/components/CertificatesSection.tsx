import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Award, Code2, Brain, Globe, ExternalLink, Trophy, X } from "lucide-react";
import { useLightMotion } from "@/hooks/use-mobile";
import vhackCert from "@/assets/certificates/vhack-certificate.png";

const certificates = [
  {
    icon: Code2,
    title: "Python Basics",
    issuer: "Coursera",
    link: "#",
  },
  {
    icon: Globe,
    title: "Web Development",
    issuer: "freeCodeCamp",
    link: "#",
  },
  {
    icon: Brain,
    title: "AI Fundamentals",
    issuer: "Google",
    link: "#",
  },
  {
    icon: Trophy,
    title: "Hackathon",
    issuer: "",
    image: vhackCert,
  },
];

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const light = useLightMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="certificates" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={light ? undefined : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display tracking-wider text-foreground mb-4">
            My <span className="text-primary neon-text">Certificates</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Verified certifications from top platforms.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto">
          {certificates.map((cert, i) => {
            const isExpanded = expanded === cert.title;
            const hasImage = "image" in cert && cert.image;

            return (
              <motion.div
                key={cert.title}
                initial={light ? undefined : { opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center gap-3"
              >
                {/* Circular badge */}
                <motion.button
                  onClick={() => hasImage && setExpanded(isExpanded ? null : cert.title)}
                  whileHover={light ? undefined : { scale: 1.12 }}
                  className="group flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center glass-card border-2 border-primary/40 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)]">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/30 group-hover:animate-pulse-glow transition-all duration-300" />
                    <cert.icon size={36} className="text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="text-center">
                    <h3 className="font-display text-sm tracking-wider text-foreground">{cert.title}</h3>
                    <p className="text-muted-foreground text-xs font-body">{cert.issuer}</p>
                    {!hasImage && "link" in cert && (
                      <a
                        href={(cert as any).link}
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

                {/* Expand in place */}
                <AnimatePresence>
                  {isExpanded && hasImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="relative w-[280px] sm:w-[400px] md:w-[500px] overflow-hidden rounded-xl"
                    >
                      {/* Outer soft radial glow */}
                      <div className="absolute -inset-8 rounded-3xl pointer-events-none opacity-60"
                        style={{
                          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.2) 0%, hsl(var(--primary) / 0.08) 40%, transparent 70%)",
                        }}
                      />
                      {/* Mid glow ring */}
                      <div className="absolute -inset-4 rounded-2xl pointer-events-none animate-pulse-glow"
                        style={{
                          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.12) 0%, transparent 60%)",
                          boxShadow: "0 0 60px hsl(var(--primary) / 0.15), 0 0 120px hsl(var(--primary) / 0.06)",
                        }}
                      />
                      {/* Inner neon border frame */}
                      <div className="absolute -inset-1 rounded-xl pointer-events-none border border-primary/40"
                        style={{
                          boxShadow: "inset 0 0 20px hsl(var(--primary) / 0.08), 0 0 30px hsl(var(--primary) / 0.2), 0 0 60px hsl(var(--primary) / 0.1), 0 2px 20px hsl(var(--primary) / 0.15)",
                        }}
                      />
                      {/* Corner accent dots */}
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.5)] pointer-events-none" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.5)] pointer-events-none" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.5)] pointer-events-none" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.5)] pointer-events-none" />

                      <div className="relative glass-card rounded-xl p-2.5 border border-primary/25 backdrop-blur-sm">
                        <button
                          onClick={() => setExpanded(null)}
                          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/90 border border-primary/40 text-primary hover:bg-primary/20 hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                        <img
                          src={cert.image}
                          alt={`${cert.title} certificate`}
                          className="w-full rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                        />
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
