import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Code2, Brain } from "lucide-react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";

const AboutSection = () => {
  const ref = useRef(null);
  const light = useLightMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: light ? "-50px" : "-100px" });
  const dur = light ? 0.5 : 0.8;
  const yOff = light ? 20 : 40;

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: yOff }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: dur }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// ABOUT ME"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Know Me Better
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: light ? -20 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: dur, delay: 0.2 }}
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

          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0, x: light ? 20 : 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: dur, delay: 0.4 }}
          >
            {[
              { icon: GraduationCap, title: "Education", desc: "B.Tech CSE (AI & ML) — VITS (2025–2029)" },
              { icon: Code2, title: "Focus Areas", desc: "Python, Data Structures & Algorithms" },
              { icon: Brain, title: "Interests", desc: "Artificial Intelligence & Machine Learning" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-6 flex gap-4 items-start group cursor-default"
                whileHover={isMobile ? undefined : { scale: 1.02, borderColor: "hsl(200 100% 50% / 0.5)" }}
                whileTap={isMobile ? { scale: 0.98 } : undefined}
                initial={{ opacity: 0, y: light ? 10 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:neon-glow transition-all">
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground tracking-wider">{item.title}</h4>
                  <p className="font-body text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
