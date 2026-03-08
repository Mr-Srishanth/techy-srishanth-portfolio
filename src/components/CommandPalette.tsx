import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Palette, Navigation } from "lucide-react";

const sections = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "My Journey", id: "journey" },
  { label: "Certificates", id: "certificates" },
  { label: "Contact", id: "contact" },
];

const themes = [
  "blue", "purple", "green", "red", "orange", "pink",
  "gold", "lime", "indigo", "rainbow", "light",
] as const;

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggle = useCallback(() => {
    setOpen((v) => !v);
    setQuery("");
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  const q = query.toLowerCase();

  const filteredSections = sections.filter((s) =>
    s.label.toLowerCase().includes(q)
  );
  const filteredThemes = themes.filter((t) => t.includes(q));
  const showThemes = q === "" || filteredThemes.length > 0;
  const showSections = q === "" || filteredSections.length > 0;

  const navigateTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const applyTheme = (theme: string) => {
    setOpen(false);
    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(`theme-${t}`));
    if (theme !== "blue") root.classList.add(`theme-${theme}`);
    localStorage.setItem("portfolio-theme", theme);
    // Force re-render of ThemeToggle by dispatching storage event
    window.dispatchEvent(new StorageEvent("storage", { key: "portfolio-theme", newValue: theme }));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed top-[20%] left-1/2 z-[9999] w-[90vw] max-w-lg -translate-x-1/2"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-card rounded-xl border border-border overflow-hidden shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-foreground font-body text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground border border-border bg-muted/30">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {/* Navigate section */}
                {showSections && (
                  <div className="mb-2">
                    <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                      Navigate
                    </p>
                    {filteredSections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigateTo(s.id)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-body text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Navigation size={14} className="text-muted-foreground" />
                        {s.label}
                        <ArrowRight size={12} className="ml-auto text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Themes section */}
                {showThemes && (
                  <div>
                    <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                      Themes
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {filteredThemes.map((t) => (
                        <button
                          key={t}
                          onClick={() => applyTheme(t)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-foreground hover:bg-primary/10 hover:text-primary transition-colors capitalize"
                        >
                          <Palette size={14} className="text-muted-foreground" />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!showSections && !showThemes && (
                  <p className="text-center text-sm text-muted-foreground py-6 font-body">
                    No results found
                  </p>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
