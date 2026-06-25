import { useState, useEffect, useRef } from "react";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";
import { themes, type Theme } from "@/components/CommandPalette";

const RAINBOW_HUES = [0, 30, 60, 120, 180, 210, 270, 330];

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-theme") as Theme | null;
      if (saved && themes.includes(saved)) return saved;
    }
    return "blue";
  });
  const rafRef = useRef<number>(0);

  // Listen for theme changes from CommandPalette
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "portfolio-theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (themes.includes(newTheme)) setTheme(newTheme);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(`theme-${t}`));
    if (theme !== "blue") {
      root.classList.add(`theme-${theme}`);
    }
    localStorage.setItem("portfolio-theme", theme);

    if (theme === "rainbow") {
      // Performance: update palette ~6x/sec instead of 60x/sec.
      // Each var change triggers a full-document style recalc + repaint
      // (every glow, border, glass card uses these tokens), so rAF here
      // was the source of the rainbow-mode jank. Slow ticking + change
      // detection keeps the visual cycle identical while freeing the
      // main thread for scrolling and animations.
      const STEP_MS = 160;          // ~6 updates / second
      const HUE_PER_STEP = 2;       // full 360° cycle in ~30s (same speed as before)
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      let hue = 0;
      let lastHue = -1;
      let intervalId: number | undefined;
      let idleId: number | undefined;
      let rafId: number | undefined;

      const apply = () => {
        if (hue === lastHue) return;
        lastHue = hue;
        const s = root.style;
        s.setProperty("--primary", `${hue} 100% 55%`);
        s.setProperty("--accent", `${(hue + 60) % 360} 100% 55%`);
        s.setProperty("--neon-blue", `${hue} 100% 55%`);
        s.setProperty("--neon-cyan", `${(hue + 120) % 360} 100% 50%`);
        s.setProperty("--neon-purple", `${(hue + 240) % 360} 100% 60%`);
        s.setProperty("--ring", `${hue} 100% 55%`);
        s.setProperty("--border", `${hue} 60% 25%`);
        s.setProperty("--glass-border", `${hue} 50% 28%`);
      };

      apply();

      if (!reduceMotion) {
        const tick = () => {
          hue = (hue + HUE_PER_STEP) % 360;
          // Defer the style write to an idle slot so it never competes
          // with scroll / framer-motion frames. Fall back to rAF.
          const ric = (window as any).requestIdleCallback as
            | ((cb: () => void, opts?: { timeout: number }) => number)
            | undefined;
          if (ric) {
            idleId = ric(apply, { timeout: 120 });
          } else {
            rafId = requestAnimationFrame(apply);
          }
        };
        intervalId = window.setInterval(tick, STEP_MS);
      }

      return () => {
        if (intervalId !== undefined) clearInterval(intervalId);
        if (rafId !== undefined) cancelAnimationFrame(rafId);
        if (idleId !== undefined && (window as any).cancelIdleCallback) {
          (window as any).cancelIdleCallback(idleId);
        }
        const vars = ["--primary", "--accent", "--neon-blue", "--neon-cyan", "--neon-purple", "--ring", "--border", "--glass-border"];
        vars.forEach((v) => root.style.removeProperty(v));
      };
    } else {
      const vars = ["--primary", "--accent", "--neon-blue", "--neon-cyan", "--neon-purple", "--ring", "--border", "--glass-border"];
      vars.forEach((v) => root.style.removeProperty(v));
    }
  }, [theme]);

  const cycle = () => {
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  const colorMap: Record<Theme, string> = {
    blue: "text-[hsl(200,100%,50%)]",
    rainbow: "",
    orange: "text-[hsl(30,100%,55%)]",
    green: "text-[hsl(150,100%,45%)]",
    gold: "text-[hsl(45,100%,50%)]",
    lime: "text-[hsl(80,100%,45%)]",
    purple: "text-[hsl(270,100%,60%)]",
    cyan: "text-[hsl(185,100%,45%)]",
    red: "text-[hsl(0,100%,55%)]",
    light: "text-[hsl(40,100%,50%)]",
  };

  const isRainbow = theme === "rainbow";

  return (
    <motion.button
      onClick={cycle}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-lg hover:bg-secondary/60 transition-colors ${isRainbow ? "" : colorMap[theme]}`}
      style={isRainbow ? {
        background: "linear-gradient(135deg, hsl(0,100%,55%), hsl(45,100%,50%), hsl(120,100%,45%), hsl(200,100%,50%), hsl(270,100%,60%), hsl(330,100%,60%))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      } : undefined}
      aria-label={`Switch theme — current: ${theme}`}
      title={`Theme: ${theme}`}
    >
      <Palette size={18} />
    </motion.button>
  );
};

export default ThemeToggle;
