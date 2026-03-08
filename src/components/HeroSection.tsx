import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import profileImg from "@/assets/profile.jpg";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";


const terminalLines = [
  { type: "command" as const, text: "whoami" },
  { type: "output" as const, text: "Arrabola Srishanth" },
  { type: "command" as const, text: "cat role.txt" },
  { type: "output" as const, text: "AI & Software Developer" },
  { type: "command" as const, text: "cat education.txt" },
  { type: "output" as const, text: "B.Tech CSE (AI & ML) — VITS 2025-2029" },
  { type: "command" as const, text: "cat skills.txt" },
  { type: "output" as const, text: "Python • React • DSA • Machine Learning" },
];

const HeroSection = () => {
  const [visibleLines, setVisibleLines] = useState<typeof terminalLines>([]);
  const [currentChar, setCurrentChar] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "done">("typing");
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useTransform(mouseX, [-300, 300], [10, -10]);
  const imgY = useTransform(mouseY, [-300, 300], [10, -10]);
  const isMobile = useIsMobile();
  const light = useLightMotion();

  // Terminal typing effect
  useEffect(() => {
    if (lineIndex >= terminalLines.length) {
      setPhase("done");
      return;
    }
    const line = terminalLines[lineIndex];
    const speed = line.type === "command" ? 45 : 20;

    if (charIndex < line.text.length) {
      const t = setTimeout(() => {
        setCurrentChar(line.text.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      const delay = line.type === "command" ? 300 : 600;
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setCurrentChar("");
        setCharIndex(0);
        setLineIndex(lineIndex + 1);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [lineIndex, charIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const offset = light ? 30 : 60;

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg animate-grid-move opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -offset }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: light ? 0.5 : 0.8, delay: 0.3 }}
        >
          {/* Terminal window */}
          <div className="glass-card rounded-xl border border-border overflow-hidden mb-6">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="w-3 h-3 rounded-full bg-destructive/70" />
              <div className="w-3 h-3 rounded-full bg-[hsl(45,100%,50%)]/70" />
              <div className="w-3 h-3 rounded-full bg-[hsl(150,100%,45%)]/70" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">srishanth@portfolio:~</span>
            </div>
            {/* Terminal body */}
            <div className="p-4 font-mono text-sm leading-relaxed min-h-[200px] max-h-[280px] overflow-y-auto">
              {visibleLines.map((line, i) => (
                <div key={i} className="mb-1">
                  {line.type === "command" ? (
                    <span>
                      <span className="text-primary">❯</span>{" "}
                      <span className="text-foreground">{line.text}</span>
                    </span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-muted-foreground pl-4 block"
                    >
                      {line.text}
                    </motion.span>
                  )}
                </div>
              ))}
              {/* Currently typing line */}
              {lineIndex < terminalLines.length && (
                <div className="mb-1">
                  {terminalLines[lineIndex].type === "command" ? (
                    <span>
                      <span className="text-primary">❯</span>{" "}
                      <span className="text-foreground">{currentChar}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground pl-4">{currentChar}</span>
                  )}
                  <motion.span
                    className="inline-block w-[2px] h-4 bg-primary ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </div>
              )}
              {/* Blinking cursor after done */}
              {phase === "done" && (
                <div>
                  <span className="text-primary">❯</span>{" "}
                  <motion.span
                    className="inline-block w-[2px] h-4 bg-primary align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </div>
              )}
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
            <span className="text-foreground">I'm </span>
            <span className="text-primary neon-text">Arrabola</span>
            <br />
            <span className="text-foreground">Srishanth</span>
          </h1>

          <p className="font-body text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
            A passionate student pursuing B.Tech in CSE (AI & ML) at Vignan Institute of Technology and Science (2025–2029), building the future with code.
          </p>

          <div className="flex gap-4">
            <motion.a
              href="mailto:a.srishanth1733@gmail.com"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold tracking-wider neon-glow inline-block text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              whileHover={isMobile ? undefined : { scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Hire Me
            </motion.a>
            <motion.button
              className="px-8 py-3 rounded-lg neon-border text-muted-foreground font-body font-semibold tracking-wider opacity-50 cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
              onClick={() => toast("Resume coming soon!")}
            >
              Download CV
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: offset }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: light ? 0.5 : 0.8, delay: 0.5 }}
        >
          <div className="relative">
            {!light && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20 blur-[60px]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            )}
            <motion.div
              className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden neon-border ${light ? "" : "animate-float"}`}
              style={isMobile ? undefined : { x: imgX, y: imgY }}
            >
              <img src={profileImg} alt="Arrabola Srishanth" className="w-full h-full object-cover" />
            </motion.div>
            {!light && (
              <motion.div
                className="absolute w-3 h-3 rounded-full bg-primary neon-glow"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ top: "50%", left: "50%", transformOrigin: "0 -160px" }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
