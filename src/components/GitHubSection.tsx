import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Terminal } from "lucide-react";

const terminalLines = [
  { text: "$ git clone https://github.com/Mr-Srishanth", delay: 0, type: "command" as const },
  { text: "Cloning into 'portfolio'...", delay: 0.4, type: "dim" as const },
  { text: "$ cat profile.yml", delay: 0.8, type: "command" as const },
  { text: "name: Arrabola Srishanth", delay: 1.2, type: "dim" as const },
  { text: "role: AI & Software Developer", delay: 1.5, type: "dim" as const },
  { text: "stack: [Python, DSA, ML, C]", delay: 1.8, type: "dim" as const },
  { text: "$ git log --oneline --graph", delay: 2.4, type: "command" as const },
  { text: "✓ feat: python-calculator — CLI-based arithmetic tool", delay: 2.8, type: "success" as const },
  { text: "✓ feat: student-management-system — CRUD operations", delay: 3.2, type: "success" as const },
  { text: "✓ feat: dsa-practice-tracker — Algorithm solutions", delay: 3.6, type: "success" as const },
  { text: "✓ feat: portfolio-website — React + Tailwind showcase", delay: 4.0, type: "success" as const },
  { text: "$ echo $STATUS", delay: 4.6, type: "command" as const },
  { text: "✓ Open to collaborate — Let's build something great.", delay: 5.0, type: "success" as const },
];

const getLineColor = (type: string) => {
  switch (type) {
    case "success": return "text-emerald-400";
    case "dim": return "text-muted-foreground";
    default: return "text-primary";
  }
};

const GitHubSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// GITHUB"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Developer Terminal
          </h2>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto glass-card overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border/30">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 font-mono text-xs text-muted-foreground flex items-center gap-2">
              <Terminal size={12} /> srishanth@portfolio:~
            </span>
          </div>

          <div className="p-6 font-mono text-sm space-y-1 min-h-[280px]">
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={getLineColor(line.type)}
              >
                {line.text}
              </motion.div>
            ))}
            {visibleLines < terminalLines.length && (
              <motion.span
                className="inline-block w-2 h-4 bg-primary"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubSection;
