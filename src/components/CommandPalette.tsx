import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Palette, Navigation, Download } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const sections = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Achievements", id: "achievements" },
  { label: "My Journey", id: "journey" },
  { label: "Certificates", id: "certificates" },
  { label: "Contact", id: "contact" },
];

export const themes = [
  "blue", "rainbow", "orange", "green", "gold",
  "lime", "purple", "cyan", "red", "light",
] as const;
export type Theme = (typeof themes)[number];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data } = usePortfolio();

  const toggle = useCallback(() => {
    setOpen((v) => !v);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const q = query.toLowerCase();
  const filteredSections = sections.filter((s) => s.label.toLowerCase().includes(q));
  const filteredThemes = themes.filter((t) => t.includes(q));
  const showSections = q === "" || filteredSections.length > 0;
  const showThemes = q === "" || filteredThemes.length > 0;

  // Actions
  const hasResume = !!data.resumeUrl;
  const showResume = hasResume && (q === "" || "download resume".includes(q));

  type Item = { type: "section"; id: string; label: string } | { type: "theme"; name: string } | { type: "action"; action: string; label: string };
  const items: Item[] = [];
  if (showSections) filteredSections.forEach((s) => items.push({ type: "section", id: s.id, label: s.label }));
  if (showResume) items.push({ type: "action", action: "resume", label: "Download Resume" });
  if (showThemes) filteredThemes.forEach((t) => items.push({ type: "theme", name: t }));

  const totalItems = items.length;

  const navigateTo = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const applyTheme = useCallback((theme: string) => {
    setOpen(false);
    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(`theme-${t}`));
    if (theme !== "blue") root.classList.add(`theme-${theme}`);
    localStorage.setItem("portfolio-theme", theme);
    window.dispatchEvent(new StorageEvent("storage", { key: "portfolio-theme", newValue: theme }));
  }, []);

  const executeItem = useCallback((item: Item) => {
    if (item.type === "section") navigateTo(item.id);
    else if (item.type === "theme") applyTheme(item.name);
    else if (item.type === "action" && item.action === "resume" && data.resumeUrl) {
      setOpen(false);
      window.open(data.resumeUrl, "_blank");
    }
  }, [navigateTo, applyTheme, data.resumeUrl]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
        return;
      }
      if (!open) return;

      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => (i + 1) % totalItems); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => (i - 1 + totalItems) % totalItems); }
      else if (e.key === "Enter") { e.preventDefault(); if (items[selectedIndex]) executeItem(items[selectedIndex]); }
      else if (e.key >= "1" && e.key <= "9") {
        const themeIndex = parseInt(e.key) - 1;
        if (themeIndex < themes.length) { e.preventDefault(); applyTheme(themes[themeIndex]); }
      } else if (e.key === "0") {
        if (themes.length >= 10) { e.preventDefault(); applyTheme(themes[9]); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, open, totalItems, selectedIndex, items, executeItem, applyTheme]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[9998] bg-background/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div className="fixed top-[20%] left-1/2 z-[9999] w-[90vw] max-w-lg -translate-x-1/2" initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.2 }}>
            <div className="glass-card rounded-xl border border-border overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command or search..." className="flex-1 bg-transparent text-foreground font-body text-sm outline-none placeholder:text-muted-foreground" />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground border border-border bg-muted/30">ESC</kbd>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2" ref={scrollRef}>
                {showSections && (
                  <div className="mb-2">
                    <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Navigate</p>
                    {filteredSections.map((s) => {
                      const idx = items.findIndex((i) => i.type === "section" && i.id === s.id);
                      const isSelected = idx === selectedIndex;
                      return (
                        <button key={s.id} onClick={() => navigateTo(s.id)} onMouseEnter={() => setSelectedIndex(idx)} className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-body transition-colors ${isSelected ? "bg-primary/20 text-primary" : "text-foreground hover:bg-primary/10 hover:text-primary"}`}>
                          <Navigation size={14} className="text-muted-foreground" />
                          {s.label}
                          <ArrowRight size={12} className="ml-auto text-muted-foreground" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {showResume && (
                  <div className="mb-2">
                    <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Actions</p>
                    <button onClick={() => { setOpen(false); window.open(data.resumeUrl, "_blank"); }} onMouseEnter={() => setSelectedIndex(items.findIndex(i => i.type === "action"))} className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-body transition-colors ${items.findIndex(i => i.type === "action") === selectedIndex ? "bg-primary/20 text-primary" : "text-foreground hover:bg-primary/10 hover:text-primary"}`}>
                      <Download size={14} className="text-muted-foreground" />
                      Download Resume
                      <ArrowRight size={12} className="ml-auto text-muted-foreground" />
                    </button>
                  </div>
                )}

                {showThemes && (
                  <div>
                    <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Themes (1-0)</p>
                    <div className="grid grid-cols-2 gap-1">
                      {filteredThemes.map((t) => {
                        const idx = items.findIndex((i) => i.type === "theme" && i.name === t);
                        const isSelected = idx === selectedIndex;
                        const themeNum = themes.indexOf(t) + 1;
                        return (
                          <button key={t} onClick={() => applyTheme(t)} onMouseEnter={() => setSelectedIndex(idx)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body transition-colors capitalize ${isSelected ? "bg-primary/20 text-primary" : "text-foreground hover:bg-primary/10 hover:text-primary"}`}>
                            <Palette size={14} className="text-muted-foreground" />
                            {t}
                            <span className="ml-auto text-[10px] font-mono text-muted-foreground">{themeNum <= 9 ? themeNum : 0}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!showSections && !showThemes && !showResume && (
                  <p className="text-center text-sm text-muted-foreground py-6 font-body">No results found</p>
                )}
              </div>

              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>1-0 Theme</span>
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
