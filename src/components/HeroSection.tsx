import { motion, useMotionValue, useTransform, useScroll, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import defaultProfileImg from "@/assets/profile.jpg";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";
import { EASE_HERO, DUR_HERO, STAGGER, buttonHover, buttonTap } from "@/lib/animations";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Download, ChevronDown } from "lucide-react";

const roles = ["Developer", "Builder", "Problem Solver", "AI Enthusiast"];

const HeroSection = () => {
  const { data } = usePortfolio();
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const imgX = useTransform(smoothMouseX, [-300, 300], [8, -8]);
  const imgY = useTransform(smoothMouseY, [-300, 300], [8, -8]);
  const isMobile = useIsMobile();
  const light = useLightMotion();

  const profileImg = data.profileImage || defaultProfileImg;
  const nameParts = data.heroName.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  // Typing animation for roles
  useEffect(() => {
    const target = roles[roleIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const { scrollY } = useScroll();
  const bgY1 = useTransform(scrollY, [0, 600], [0, -120]);
  const bgY2 = useTransform(scrollY, [0, 600], [0, -80]);
  const gridY = useTransform(scrollY, [0, 600], [0, -50]);

  const d = (i: number) => i * STAGGER;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      <motion.div className="absolute inset-0 grid-bg animate-grid-move opacity-20 pointer-events-none" style={{ y: gridY }} />
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        style={{ y: bgY1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_HERO }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none"
        style={{ y: bgY2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE_HERO }}
      />

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: DUR_HERO, delay: d(0), ease: EASE_HERO }}
        >
          {(() => {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
            return (
              <motion.p
                className="font-mono text-sm text-primary mb-4 tracking-widest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: d(1), duration: 0.6, ease: EASE_HERO }}
              >
                {`< ${greeting} />`}
              </motion.p>
            );
          })()}

          <motion.h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(2), duration: DUR_HERO, ease: EASE_HERO }}
          >
            <span className="text-foreground">I'm </span>
            <span className="bg-gradient-to-r from-primary via-[hsl(var(--neon-cyan))] to-primary bg-clip-text text-transparent neon-text">
              {firstName}
            </span>
            {lastName && (
              <>
                <br />
                <span className="text-foreground">{lastName}</span>
              </>
            )}
          </motion.h1>

          {/* Bold tagline */}
          <motion.p
            className="font-display text-xl md:text-2xl font-bold text-foreground mt-3 mb-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(2.5), duration: 0.6, ease: EASE_HERO }}
          >
            I build systems, not just projects.
          </motion.p>

          <motion.p
            className="font-body text-base md:text-lg text-muted-foreground mb-4 max-w-md"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(3), duration: 0.6, ease: EASE_HERO }}
          >
            AI-powered apps, automation, and real-world solutions.
          </motion.p>

          {/* Typing roles */}
          <motion.div
            className="h-10 mb-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: d(3.5), duration: 0.6, ease: EASE_HERO }}
          >
            <span className="font-mono text-sm text-muted-foreground/60">{">"}</span>
            <span className="font-mono text-lg text-primary">
              {displayed}
              <motion.span
                className="inline-block w-[2px] h-5 bg-primary ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </span>
          </motion.div>

          <motion.p
            className="font-body text-muted-foreground text-lg mb-8 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(4), duration: 0.7, ease: EASE_HERO }}
          >
            {data.heroBio}
          </motion.p>

          <motion.div
            className="glass-card px-4 py-2.5 rounded-lg flex items-center gap-3 max-w-md mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: d(5), ease: EASE_HERO }}
          >
            <motion.span
              className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-xs text-muted-foreground">
              🔥 Currently working on:{" "}
              <span className="font-semibold text-foreground">{data.currentFocus}</span>
            </span>
          </motion.div>

          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(6), duration: 0.6, ease: EASE_HERO }}
          >
            <motion.button
              onClick={() => scrollTo("projects")}
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold tracking-wider neon-glow inline-block text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              whileHover={isMobile ? undefined : buttonHover}
              whileTap={buttonTap}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Explore My Work
            </motion.button>
            <motion.button
              onClick={() => scrollTo("contact")}
              className="px-8 py-3 rounded-lg neon-border text-foreground font-body font-semibold tracking-wider hover:bg-primary/10 transition-colors"
              whileHover={isMobile ? undefined : buttonHover}
              whileTap={buttonTap}
            >
              Contact Me
            </motion.button>
            {data.resumeUrl && (
              <motion.a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-border text-muted-foreground font-body font-semibold tracking-wider hover:text-foreground hover:border-primary/50 transition-colors inline-flex items-center gap-2"
                whileHover={isMobile ? undefined : buttonHover}
                whileTap={buttonTap}
              >
                <Download size={16} /> Resume
              </motion.a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DUR_HERO, delay: d(2), ease: EASE_HERO }}
        >
          <div className="relative">
            {!light && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20 blur-[60px]"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.div
              className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden neon-border ${light ? "" : "animate-float"}`}
              style={isMobile ? undefined : { x: imgX, y: imgY }}
            >
              <img src={profileImg} alt={data.heroName} className="w-full h-full object-cover" />
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

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: EASE_HERO }}
      >
        <span className="font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-primary/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
