import { useState, useEffect, useRef } from "react";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";

const themes = [
  "blue", "purple", "green", "red", "orange", "pink",
  "gold", "lime", "indigo", "rainbow", "light",
] as const;
type Theme = (typeof themes)[number];

const RAINBOW_HUES = [0, 30, 60, 120, 180, 210, 270, 330];

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("portfolio-theme") as Theme) || "blue";
    }
    return "blue";
  });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(`theme-${t}`));
    if (theme !== "blue") {
      root.classList.add(`theme-${theme}`);
    }
    localStorage.setItem("portfolio-theme", theme);

    // Rainbow cycling
    if (theme === "rainbow") {
      let start: number | null = null;
      const cycle = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const hue = Math.round(elapsed / 100) % 360;
        root.style.setProperty("--primary", `${hue} 100% 55%`);
        root.style.setProperty("--accent", `${(hue + 60) % 360} 100% 55%`);
        root.style.setProperty("--neon-blue", `${hue} 100% 55%`);
        root.style.setProperty("--neon-cyan", `${(hue + 120) % 360} 100% 50%`);
        root.style.setProperty("--neon-purple", `${(hue + 240) % 360} 100% 60%`);
        root.style.setProperty("--ring", `${hue} 100% 55%`);
        root.style.setProperty("--border", `${hue} 60% 25%`);
        root.style.setProperty("--glass-border", `${hue} 50% 28%`);
        rafRef.current = requestAnimationFrame(cycle);
      };
      rafRef.current = requestAnimationFrame(cycle);
      return () => {
        cancelAnimationFrame(rafRef.current);
        // Reset inline styles when leaving rainbow
        const vars = ["--primary", "--accent", "--neon-blue", "--neon-cyan", "--neon-purple", "--ring", "--border", "--glass-border"];
        vars.forEach((v) => root.style.removeProperty(v));
      };
    } else {
      // Clean up any leftover inline styles from rainbow
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
    purple: "text-[hsl(270,100%,60%)]",
    green: "text-[hsl(150,100%,45%)]",
    red: "text-[hsl(0,100%,55%)]",
    orange: "text-[hsl(30,100%,55%)]",
    pink: "text-[hsl(330,100%,60%)]",
    cyan: "text-[hsl(185,100%,50%)]",
    gold: "text-[hsl(45,100%,50%)]",
    lime: "text-[hsl(80,100%,45%)]",
    violet: "text-[hsl(290,100%,60%)]",
    rose: "text-[hsl(350,90%,55%)]",
    teal: "text-[hsl(170,100%,40%)]",
    amber: "text-[hsl(38,100%,55%)]",
    indigo: "text-[hsl(240,80%,60%)]",
    rainbow: "",
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
