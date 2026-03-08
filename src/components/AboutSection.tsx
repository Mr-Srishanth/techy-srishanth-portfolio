import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Code2, Brain } from "lucide-react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const AboutSection = () => {
  const ref = useRef(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// ABOUT ME"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Know Me Better
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text block — staggered after heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <h3 className="font-display text-2xl font-bold mb-4 text-foreground">
              Aspiring AI & Software Developer
            </h3>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              I'm Arrabola Srishanth, a first-year B.Tech student in Computer Science (AI & ML) at Vignan Institute of Technology and Science. I'm passionate about artificial intelligence, machine learning, and building software that makes a difference.
            </p>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              Currently learning Python and Data Structures, I'm dedicated to mastering the foundations of computer science while exploring the exciting frontiers of AI technology.
            </p>
          </motion.div>

          {/* Cards — staggered after text */}
          <div className="grid gap-4">
            {[
              { icon: GraduationCap, title: "Education", desc: "B.Tech CSE (AI & ML) — VITS (2025–2029)" },
              { icon: Code2, title: "Focus Areas", desc: "Python, Data Structures & Algorithms" },
              { icon: Brain, title: "Interests", desc: "Artificial Intelligence & Machine Learning" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-6 flex gap-4 items-start group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease }}
                whileHover={isMobile ? undefined : {
                  y: -6,
                  boxShadow: "0 0 25px hsl(var(--primary) / 0.15)",
                  borderColor: "hsl(200 100% 50% / 0.4)",
                  transition: { duration: 0.25 },
                }}
                whileTap={isMobile ? { scale: 0.98 } : undefined}
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:neon-glow transition-all duration-250">
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
