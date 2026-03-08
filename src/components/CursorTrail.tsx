import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number }[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const isMobile = useIsMobile();

  const getThemeColor = useCallback(() => {
    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue("--primary").trim();
    if (!primary) return "0, 100%, 50%";
    return primary;
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (points.current.length > 50) points.current.shift();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const maxAge = 40;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hsl = getThemeColor();

      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i];
        p.age++;
        if (p.age > maxAge) {
          points.current.splice(i, 1);
          i--;
          continue;
        }
        const life = 1 - p.age / maxAge;
        const radius = life * 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hsl} / ${life * 0.6})`;
        ctx.fill();

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hsl} / ${life * 0.15})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isMobile, getThemeColor]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default CursorTrail;
