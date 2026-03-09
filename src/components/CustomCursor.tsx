import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dot = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const ripples = useRef<{ x: number; y: number; t: number }[]>([]);
  const raf = useRef(0);
  const isMobile = useIsMobile();

  const getHue = useCallback(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    const m = v.match(/^(\d+)/);
    return m ? parseInt(m[1]) : 200;
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { target.current = { x: e.clientX, y: e.clientY }; };
    const onClick = (e: MouseEvent) => { ripples.current.push({ x: e.clientX, y: e.clientY, t: 1 }); };

    const checkHover = () => {
      const el = document.elementFromPoint(target.current.x, target.current.y);
      if (!el) { hovering.current = false; return; }
      const tag = el.tagName.toLowerCase();
      hovering.current = !!(tag === "a" || tag === "button" || el.closest("a") || el.closest("button") || el.closest("[role='button']"));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onClick);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hue = getHue();
      checkHover();

      dot.current.x = lerp(dot.current.x, target.current.x, 0.35);
      dot.current.y = lerp(dot.current.y, target.current.y, 0.35);
      ring.current.x = lerp(ring.current.x, target.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, target.current.y, 0.12);

      const isHover = hovering.current;
      const glowAlpha = isHover ? 0.5 : 0.25;

      // Ripples (0.3s = ~18 frames at 60fps)
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.t -= 1 / 18;
        if (r.t <= 0) { ripples.current.splice(i, 1); continue; }
        const radius = 18 + (1 - r.t) * 30;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${r.t * 0.35})`;
        ctx.lineWidth = 1.2 * r.t;
        ctx.stroke();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(ring.current.x, ring.current.y, 18, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${isHover ? 0.5 : 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dot glow
      const g = ctx.createRadialGradient(dot.current.x, dot.current.y, 0, dot.current.x, dot.current.y, 14);
      g.addColorStop(0, `hsla(${hue}, 100%, 70%, ${glowAlpha})`);
      g.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      ctx.beginPath();
      ctx.arc(dot.current.x, dot.current.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Dot core
      ctx.beginPath();
      ctx.arc(dot.current.x, dot.current.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 100%, 90%, 0.95)`;
      ctx.fill();

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      document.documentElement.style.cursor = "";
      style.remove();
    };
  }, [isMobile, getHue]);

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
