import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Code2, Brain, Globe, ExternalLink } from "lucide-react";
import { useLightMotion } from "@/hooks/use-mobile";

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
    icon: Award,
    title: "Full-Stack Dev",
    issuer: "Udemy",
    link: "#",
  },
];

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const light = useLightMotion();

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
          {certificates.map((cert, i) => (
            <motion.a
              key={cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={light ? undefined : { opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={light ? undefined : { scale: 1.12 }}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              {/* Circular badge */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center glass-card border-2 border-primary/40 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)]">
                {/* Pulse ring on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/30 group-hover:animate-pulse-glow transition-all duration-300" />
                <cert.icon size={36} className="text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-display text-sm tracking-wider text-foreground">{cert.title}</h3>
                <p className="text-muted-foreground text-xs font-body">{cert.issuer}</p>
                <span className="inline-flex items-center gap-1 text-primary text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Verify <ExternalLink size={10} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
