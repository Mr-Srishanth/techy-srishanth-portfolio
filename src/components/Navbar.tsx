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

const MagneticLink = ({ children, onClick, isActive }: { children: string; onClick: () => void; isActive: boolean }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * 0.3,
      y: (e.clientY - cy) * 0.4,
    });
  }, []);

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.5 }}
      className="relative font-body text-sm tracking-wider uppercase transition-colors duration-200"
    >
      <span className={isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
        {children}
      </span>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
          layoutId="nav-underline"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ids = Object.values(sectionIds);

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const linkName = Object.keys(sectionIds).find((k) => sectionIds[k] === id) || "Home";
            setActive(linkName);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
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

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <MagneticLink key={link} onClick={() => scrollTo(link)} isActive={active === link}>
              {link}
            </MagneticLink>
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
