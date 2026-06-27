import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { buttonHover, buttonTap, DUR_REVEAL, EASE_REVEAL } from "@/lib/animations";

const links = ["Home", "About", "Skills", "Projects", "My Journey", "Certificates", "Contact"];

const sectionIds: Record<string, string> = {
  Home: "home",
  About: "about",
  Skills: "skills",
  Projects: "projects",
  "My Journey": "journey",
  Certificates: "certificates",
  Contact: "contact",
};

// Two springs with different stiffness produce the elastic leading-edge effect:
// the front (leading) edge arrives a touch sooner, the trailing edge follows.
const LEAD_SPRING = { stiffness: 340, damping: 32, mass: 0.9 };
const TRAIL_SPRING = { stiffness: 240, damping: 30, mass: 1 };

const MagneticLink = ({
  children,
  onClick,
  isActive,
  onHover,
  onLeave,
}: {
  children: string;
  onClick: () => void;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * 0.25,
      y: (e.clientY - cy) * 0.3,
    });
  }, []);

  const reset = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    onLeave();
  }, [onLeave]);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseEnter={onHover}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.5 }}
      className="relative font-body text-sm tracking-wider uppercase px-3 py-2 will-change-transform"
    >
      <span
        className={`relative z-10 transition-colors duration-300 ${
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {children}
      </span>
    </motion.button>
  );
};

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [ready, setReady] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Two independent motion values: left edge and right edge of the underline.
  // Animating edges (not x/width) lets us give each a different spring,
  // producing a refined elastic "leading edge arrives first" feel.
  const leftMV = useMotionValue(0);
  const rightMV = useMotionValue(0);
  const leftSpring = useSpring(leftMV, TRAIL_SPRING);
  const rightSpring = useSpring(rightMV, LEAD_SPRING);
  const xSpring = leftSpring;
  const widthSpring = useTransform([leftSpring, rightSpring] as any, ([l, r]: number[]) =>
    Math.max(0, r - l)
  );

  const measure = useCallback((key: string) => {
    const row = navRowRef.current;
    const el = itemRefs.current[key];
    if (!row || !el) return null;
    const r = el.getBoundingClientRect();
    const p = row.getBoundingClientRect();
    return { x: r.left - p.left, w: r.width };
  }, []);

  // Drive underline edges from (active, hovered). Hovered item creates a subtle
  // magnetic pull on the nearest edge — the bar doesn't leave the active item.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = requestAnimationFrame(() => {
        const a = measure(active);
        if (!a) return;
        // inset the bar slightly from the text padding for elegance
        const inset = 10;
        let left = a.x + inset;
        let right = a.x + a.w - inset;

        if (hovered && hovered !== active) {
          const h = measure(hovered);
          if (h) {
            const hCenter = h.x + h.w / 2;
            const aCenter = a.x + a.w / 2;
            const dir = hCenter > aCenter ? 1 : -1;
            // Tiny stretch toward hovered item — capped at 6px so it stays subtle.
            const pull = Math.min(6, Math.abs(hCenter - aCenter) * 0.04);
            if (dir > 0) right += pull;
            else left -= pull;
          }
        }

        if (!ready) {
          leftMV.jump(left);
          rightMV.jump(right);
          setReady(true);
        } else {
          leftMV.set(left);
          rightMV.set(right);
        }
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, [active, hovered, measure, leftMV, rightMV, ready]);

  // Tiny finishing pulse when the active item changes.
  useEffect(() => {
    setPulseKey((k) => k + 1);
  }, [active]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ids = Object.values(sectionIds);
    let pending: string | null = null;
    let timer: number | undefined;
    const commit = (name: string) => {
      pending = name;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (pending) setActive(pending);
      }, 80);
    };

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const linkName = Object.keys(sectionIds).find((k) => sectionIds[k] === id) || "Home";
            commit(linkName);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.clearTimeout(timer);
    };
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    setMobileOpen(false);
    const sectionId = sectionIds[id] || id.toLowerCase();
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-glass-border/20 backdrop-blur-2xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: DUR_REVEAL, delay: 0.2, ease: EASE_REVEAL }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <motion.span
          className="font-display text-lg tracking-wider text-primary neon-text cursor-pointer"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          AS
        </motion.span>

        <div
          ref={navRowRef}
          className="hidden md:flex relative items-center gap-2"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Thin underline — two-spring elastic motion, GPU-accelerated transforms. */}
          {ready && (
            <motion.div
              aria-hidden
              className="absolute pointer-events-none rounded-full bg-primary"
              style={{
                left: 0,
                bottom: 6,
                height: 2,
                width: widthSpring,
                x: xSpring,
                transformOrigin: "left center",
                boxShadow: "0 0 8px hsl(var(--primary) / 0.55)",
                willChange: "transform, width",
              }}
            >
              {/* Microscopic settle pulse on active change */}
              <motion.span
                key={pulseKey}
                className="absolute inset-0 rounded-full bg-primary"
                initial={{ opacity: 0.55, scaleY: 1.6 }}
                animate={{ opacity: 0, scaleY: 1 }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
              />
            </motion.div>
          )}
          {links.map((link) => (
            <div
              key={link}
              ref={(el) => (itemRefs.current[link] = el)}
              className="relative"
            >
              <MagneticLink
                onClick={() => scrollTo(link)}
                isActive={active === link}
                onHover={() => setHovered(link)}
                onLeave={() => setHovered((h) => (h === link ? null : h))}
              >
                {link}
              </MagneticLink>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            className="px-5 py-2 rounded-lg font-body text-sm tracking-wider neon-border text-primary hover:bg-primary/10 transition-all duration-200"
            whileHover={buttonHover}
            whileTap={buttonTap}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => scrollTo("Contact")}
          >
            Let's Talk
          </motion.button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          className="md:hidden glass-card border-t border-glass-border/20 p-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: EASE_REVEAL }}
        >
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className={`block w-full text-left font-body py-2 tracking-wider transition-colors duration-200 ${
                active === link ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
