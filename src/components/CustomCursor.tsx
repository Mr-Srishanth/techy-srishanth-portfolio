import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef({ x: -100, y: -100 });
  const glowRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const ripples = useRef<{ x: number; y: number; life: number; maxLife: number }[]>([]);
  const rafRef = useRef(0);
  const isMobile = useIsMobile();

  const getThemeHue = useCallback(() => {
    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue("--primary").trim();
    const match = primary.match(/^(\d+)/);
    return match ? parseInt(match[1]) : 200;
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.style.cursor = "none";
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(styleSheet);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = (e: MouseEvent) => {
      ripples.current.push({ x: e.clientX, y: e.clientY, life: 18, maxLife: 18 });
    };

    const checkHover = () => {
      const el = document.elementFromPoint(targetRef.current.x, targetRef.current.y);
      if (!el) { hovering.current = false; return; }
      const tag = el.tagName.toLowerCase();
      hovering.current = !!(
        tag === "a" || tag === "button" ||
        el.closest("a") || el.closest("button") ||
        el.closest("[role='button']")
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const DOT_SIZE = 3.5;
    const RIPPLE_MAX_R = 22;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hue = getThemeHue();
      checkHover();

      // Dot follows precisely, glow trails with delay
      dotRef.current.x = lerp(dotRef.current.x, targetRef.current.x, 0.4);
      dotRef.current.y = lerp(dotRef.current.y, targetRef.current.y, 0.4);
      glowRef.current.x = lerp(glowRef.current.x, targetRef.current.x, 0.15);
      glowRef.current.y = lerp(glowRef.current.y, targetRef.current.y, 0.15);

      const glowAlpha = hovering.current ? 0.45 : 0.25;

      // Ripples on click
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.life--;
        if (r.life <= 0) { ripples.current.splice(i, 1); continue; }
        const t = 1 - r.life / r.maxLife;
        const radius = DOT_SIZE + t * RIPPLE_MAX_R;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${(1 - t) * 0.35})`;
        ctx.lineWidth = 1.2 * (1 - t);
        ctx.stroke();
      }

      // Outer glow (trails behind)
      const glow = ctx.createRadialGradient(
        glowRef.current.x, glowRef.current.y, 0,
        glowRef.current.x, glowRef.current.y, 18
      );
      glow.addColorStop(0, `hsla(${hue}, 100%, 65%, ${glowAlpha * 0.5})`);
      glow.addColorStop(0.5, `hsla(${hue}, 100%, 55%, ${glowAlpha * 0.15})`);
      glow.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      ctx.beginPath();
      ctx.arc(glowRef.current.x, glowRef.current.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Dot core
      ctx.beginPath();
      ctx.arc(dotRef.current.x, dotRef.current.y, DOT_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 100%, 90%, 0.95)`;
      ctx.fill();

      // Inner bright point
      ctx.beginPath();
      ctx.arc(dotRef.current.x, dotRef.current.y, DOT_SIZE * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 100%, 100%, 1)`;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.style.cursor = "";
      styleSheet.remove();
    };
  }, [isMobile, getThemeHue]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default CustomCursor;
