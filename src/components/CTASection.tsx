import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-neon-purple/5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="glass-card max-w-3xl mx-auto p-10 md:p-14 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <p className="font-mono text-primary text-sm tracking-widest mb-3">
              {"// LET'S CONNECT"}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Interested in working together?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              I'm always open to new opportunities, collaborations, and interesting projects.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                type="button"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold tracking-wider neon-glow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Hire Me
              </motion.button>
              <motion.button
                type="button"
                className="px-8 py-3 rounded-lg neon-border text-primary font-body font-semibold tracking-wider cursor-pointer hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Let's Talk
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
