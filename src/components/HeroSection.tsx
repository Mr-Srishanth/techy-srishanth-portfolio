import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import profileImg from "@/assets/profile.jpg";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";


const titles = ["AI & Software Developer", "Learning Python & DSA", "B.Tech CSE (AI & ML)"];

const HeroSection = () => {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useTransform(mouseX, [-300, 300], [10, -10]);
  const imgY = useTransform(mouseY, [-300, 300], [10, -10]);
  const isMobile = useIsMobile();
  const light = useLightMotion();
  const playClick = useTypingSound();

  useEffect(() => {
    const target = titles[titleIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
          playClick();
        }, 60);
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
        setTitleIdx((i) => (i + 1) % titles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, titleIdx]);

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
          <motion.p
            className="font-mono text-sm text-primary mb-4 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {"< Hello World />"}
          </motion.p>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
            <span className="text-foreground">I'm </span>
            <span className="text-primary neon-text">Arrabola</span>
            <br />
            <span className="text-foreground">Srishanth</span>
          </h1>

          <div className="h-12 mt-4 mb-6">
            <span className="font-mono text-lg md:text-xl text-muted-foreground">
              {displayed}
              <motion.span
                className="inline-block w-[2px] h-5 bg-primary ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </span>
          </div>

          <p className="font-body text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
            A passionate student pursuing B.Tech in CSE (AI & ML) at Vignan Institute of Technology and Science (2025–2029), building the future with code.
          </p>

          <div className="flex gap-4">
            <motion.button
              type="button"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold tracking-wider neon-glow inline-block text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              whileHover={isMobile ? undefined : { scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Hire Me
            </motion.button>
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
