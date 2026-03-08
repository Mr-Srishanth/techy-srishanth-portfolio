import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";

const themes = ["blue", "purple", "green", "red", "orange", "pink", "cyan"] as const;
type Theme = (typeof themes)[number];

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("portfolio-theme") as Theme) || "blue";
    }
    return "blue";
  });

  useEffect(() => {
    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(`theme-${t}`));
    if (theme !== "blue") {
      root.classList.add(`theme-${theme}`);
    }
    localStorage.setItem("portfolio-theme", theme);
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
  };

  return (
    <motion.button
      onClick={cycle}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-lg hover:bg-secondary/60 transition-colors ${colorMap[theme]}`}
      aria-label={`Switch theme — current: ${theme}`}
      title={`Theme: ${theme}`}
    >
      <Palette size={18} />
    </motion.button>
  );
};

export default ThemeToggle;
