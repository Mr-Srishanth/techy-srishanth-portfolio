import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = ["Home", "About", "Skills", "Projects", "My Journey", "Contact"];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActive(id);
    setMobileOpen(false);
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-glass-border/20 backdrop-blur-2xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <motion.span
          className="font-display text-lg tracking-wider text-primary neon-text cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          AS
        </motion.span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="relative font-body text-sm tracking-wider uppercase transition-colors"
            >
              <span className={active === link ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
                {link}
              </span>
              {active === link && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                  layoutId="nav-underline"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.button
          className="hidden md:block px-5 py-2 rounded-lg font-body text-sm tracking-wider neon-border text-primary hover:bg-primary/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollTo("Contact")}
        >
          Let's Talk
        </motion.button>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden glass-card border-t border-glass-border/20 p-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="block w-full text-left font-body text-muted-foreground hover:text-primary py-2 tracking-wider"
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
