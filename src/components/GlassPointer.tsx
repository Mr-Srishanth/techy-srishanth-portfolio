import { useEffect } from "react";

/**
 * Feeds the global glass material system with a rAF-throttled pointer
 * position (--gx / --gy, 0-100). Powers the subtle traveling reflection
 * on every glass surface. Disabled for coarse pointers / reduced motion.
 */
const GlassPointer = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const root = document.documentElement;
    let raf = 0;
    let x = 50;
    let y = 0;

    const flush = () => {
      raf = 0;
      root.style.setProperty("--gx", x.toFixed(1));
      root.style.setProperty("--gy", y.toFixed(1));
    };

    const onMove = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 100;
      y = (e.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
};

export default GlassPointer;
