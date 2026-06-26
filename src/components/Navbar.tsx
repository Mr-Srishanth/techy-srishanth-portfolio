import { motion } from "framer-motion";
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

// Premium spring used for the indicator pill — fast onset, natural settle.
const PILL_SPRING = { type: "spring" as const, stiffness: 380, damping: 34, mass: 0.9 };

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
      className="relative font-body text-sm tracking-wider uppercase px-3 py-2 rounded-full will-change-transform"
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
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const [hoverRect, setHoverRect] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback((key: string) => {
    const row = navRowRef.current;
    const el = itemRefs.current[key];
    if (!row || !el) return null;
    const r = el.getBoundingClientRect();
    const p = row.getBoundingClientRect();
    return { x: r.left - p.left, w: r.width };
  }, []);

  // Track active pill position, re-measure on resize/font load.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = requestAnimationFrame(() => {
        const m = measure(active);
        if (m) setIndicator(m);
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, [active, measure]);

  useEffect(() => {
    if (!hovered) {
      setHoverRect(null);
      return;
    }
    const m = measure(hovered);
    if (m) setHoverRect(m);
  }, [hovered, measure]);

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
          {/* Hover pill — soft, follows cursor across items */}
          {hoverRect && (
            <motion.div
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-foreground/[0.06] backdrop-blur-sm pointer-events-none"
              initial={false}
              animate={{ x: hoverRect.x, width: hoverRect.w, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PILL_SPRING}
              style={{ left: 0 }}
            />
          )}
          {/* Active pill — primary glow, morphs width + position together */}
          {indicator && (
            <motion.div
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full pointer-events-none"
              initial={false}
              animate={{ x: indicator.x, width: indicator.w }}
              transition={PILL_SPRING}
              style={{
                left: 0,
                background:
                  "linear-gradient(180deg, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.08))",
                boxShadow:
                  "0 0 0 1px hsl(var(--primary) / 0.35), 0 8px 24px -8px hsl(var(--primary) / 0.45), inset 0 1px 0 hsl(var(--primary) / 0.25)",
              }}
            />
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
