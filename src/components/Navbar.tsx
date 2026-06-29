import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
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
  const [underlineReady, setUnderlineReady] = useState(false);
  const navRowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeRef = useRef("Home");
  const initializedRef = useRef(false);
  const skipFirstReactiveUpdateRef = useRef(true);
  const lastUnderlineKeyRef = useRef("");

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

  const jumpUnderline = useCallback(
    (left: number, right: number) => {
      leftMV.jump(left);
      rightMV.jump(right);
      leftSpring.jump(left);
      rightSpring.jump(right);
    },
    [leftMV, rightMV, leftSpring, rightSpring]
  );

  const updateActive = useCallback((next: string) => {
    if (activeRef.current === next) return false;
    activeRef.current = next;
    setActive(next);
    return true;
  }, []);

  const measure = useCallback((key: string) => {
    const row = navRowRef.current;
    const el = itemRefs.current[key];
    if (!row || !el) return null;
    const r = el.getBoundingClientRect();
    const p = row.getBoundingClientRect();
    return { x: r.left - p.left, w: r.width };
  }, []);

  const computeEdges = useCallback(
    (activeKey: string, hoveredKey: string | null) => {
      const a = measure(activeKey);
      if (!a) return null;
      const inset = 10;
      let left = a.x + inset;
      let right = a.x + a.w - inset;
      if (hoveredKey && hoveredKey !== activeKey) {
        const h = measure(hoveredKey);
        if (h) {
          const hCenter = h.x + h.w / 2;
          const aCenter = a.x + a.w / 2;
          const dir = hCenter > aCenter ? 1 : -1;
          const pull = Math.min(6, Math.abs(hCenter - aCenter) * 0.04);
          if (dir > 0) right += pull;
          else left -= pull;
        }
      }
      return { left, right };
    },
    [measure]
  );

  // Determine the actually-visible section synchronously on mount, place the
  // persistent underline before first paint, then allow later updates to animate.
  useLayoutEffect(() => {
    const ids = Object.values(sectionIds);
    const probe = window.scrollY + window.innerHeight * 0.35;
    let current = "Home";
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) {
        current = Object.keys(sectionIds).find((k) => sectionIds[k] === id) || current;
      }
    }
    const e = computeEdges(current, null);
    if (!e) return;

    activeRef.current = current;
    lastUnderlineKeyRef.current = `${current}:none`;
    jumpUnderline(e.left, e.right);
    initializedRef.current = true;
    setUnderlineReady(true);
    if (current !== active) setActive(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive underline edges from one persistent active/hover state. The first
  // reactive pass is intentionally ignored because mount already positioned it.
  useLayoutEffect(() => {
    if (!initializedRef.current) return;
    if (skipFirstReactiveUpdateRef.current) {
      skipFirstReactiveUpdateRef.current = false;
      return;
    }

    const key = `${active}:${hovered ?? "none"}`;
    if (lastUnderlineKeyRef.current === key) return;

    const e = computeEdges(active, hovered);
    if (!e) return;
    lastUnderlineKeyRef.current = key;
    leftMV.set(e.left);
    rightMV.set(e.right);
  }, [active, hovered, computeEdges, leftMV, rightMV]);

  useEffect(() => {
    const onResize = () => {
      if (!initializedRef.current) return;
      const e = computeEdges(activeRef.current, hovered);
      if (!e) return;
      jumpUnderline(e.left, e.right);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeEdges, hovered, jumpUnderline]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ids = Object.values(sectionIds);
    let pending: string | null = null;
    let timer: number | undefined;
    // Ignore the IntersectionObserver's initial synchronous callback burst:
    // on mount each observer fires once with the current intersection state,
    // which would otherwise overwrite the active section we already resolved
    // in useLayoutEffect. We only want genuine scroll-driven changes.
    let settled = false;
    const settleTimer = window.setTimeout(() => {
      settled = true;
    }, 0);
    const commit = (name: string) => {
      if (!settled) return;
      if (activeRef.current === name) return;
      pending = name;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (pending) updateActive(pending);
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
      window.clearTimeout(settleTimer);
    };
  }, [updateActive]);

  const scrollTo = (id: string) => {
    updateActive(id);
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
          {/* Thin underline — one persistent element, positioned before first paint. */}
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
              opacity: underlineReady ? 1 : 0,
              willChange: "transform, width",
            }}
          />
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
