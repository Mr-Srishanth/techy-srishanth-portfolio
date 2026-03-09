import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const clicking = useRef(false);
  const sparks = useRef<Spark[]>([]);
  const ripples = useRef<{ x: number; y: number; life: number; maxLife: number }[]>([]);
  const pulsePhase = useRef(0);
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

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `;
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
      clicking.current = true;
      const hue = getThemeHue();
      // Spawn click sparks
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        const life = 20 + Math.random() * 20;
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          size: 1.5 + Math.random() * 2,
          hue: hue + (Math.random() - 0.5) * 40,
        });
      }
      // Spawn click ripple
      ripples.current.push({ x: e.clientX, y: e.clientY, life: 18, maxLife: 18 });
    };

    const onUp = () => {
      clicking.current = false;
    };

    const checkHover = () => {
      const el = document.elementFromPoint(targetRef.current.x, targetRef.current.y);
      if (!el) { hovering.current = false; return; }
      const tag = el.tagName.toLowerCase();
      const isInteractive = tag === "a" || tag === "button" ||
        el.closest("a") || el.closest("button") ||
        el.closest("[role='button']") ||
        (el as HTMLElement).classList?.contains("glass-card");
      hovering.current = !!isInteractive;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hue = getThemeHue();
      pulsePhase.current += 0.04;
      checkHover();

      // Smooth follow
      dotRef.current.x = lerp(dotRef.current.x, targetRef.current.x, 0.35);
      dotRef.current.y = lerp(dotRef.current.y, targetRef.current.y, 0.35);
      ringRef.current.x = lerp(ringRef.current.x, targetRef.current.x, 0.12);
      ringRef.current.y = lerp(ringRef.current.y, targetRef.current.y, 0.12);

      const isHover = hovering.current;
      const pulse = Math.sin(pulsePhase.current) * 0.3 + 0.7;
      const ringSize = isHover ? 28 : 18;
      const dotSize = isHover ? 5 : 3.5;
      const glowIntensity = isHover ? 0.5 : 0.3;

      // Draw ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.life--;
        if (r.life <= 0) { ripples.current.splice(i, 1); continue; }
        const t = 1 - r.life / r.maxLife;
        const radius = ringSize + t * 40;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${(1 - t) * 0.4})`;
        ctx.lineWidth = 1.5 * (1 - t);
        ctx.stroke();
      }

      // Draw sparks
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.vy += 0.08;
        s.life--;
        if (s.life <= 0) { sparks.current.splice(i, 1); continue; }
        const t = s.life / s.maxLife;
        // Spark glow
        const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        sg.addColorStop(0, `hsla(${s.hue}, 100%, 70%, ${t * 0.4})`);
        sg.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
        // Spark core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * t, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 90%, ${t})`;
        ctx.fill();
      }

      // Ring outer glow
      const outerGlow = ctx.createRadialGradient(
        ringRef.current.x, ringRef.current.y, ringSize - 2,
        ringRef.current.x, ringRef.current.y, ringSize + 15
      );
      outerGlow.addColorStop(0, `hsla(${hue}, 100%, 60%, ${glowIntensity * pulse * 0.3})`);
      outerGlow.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      ctx.beginPath();
      ctx.arc(ringRef.current.x, ringRef.current.y, ringSize + 15, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(ringRef.current.x, ringRef.current.y, ringSize, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${0.4 + pulse * 0.2})`;
      ctx.lineWidth = isHover ? 2 : 1.5;
      ctx.stroke();

      // Dot glow
      const dotGlow = ctx.createRadialGradient(
        dotRef.current.x, dotRef.current.y, 0,
        dotRef.current.x, dotRef.current.y, dotSize * 5
      );
      dotGlow.addColorStop(0, `hsla(${hue}, 100%, 70%, ${glowIntensity * pulse})`);
      dotGlow.addColorStop(0.4, `hsla(${hue}, 100%, 60%, ${glowIntensity * pulse * 0.3})`);
      dotGlow.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      ctx.beginPath();
      ctx.arc(dotRef.current.x, dotRef.current.y, dotSize * 5, 0, Math.PI * 2);
      ctx.fillStyle = dotGlow;
      ctx.fill();

      // Dot core
      ctx.beginPath();
      ctx.arc(dotRef.current.x, dotRef.current.y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 100%, 90%, 0.95)`;
      ctx.fill();

      // Inner bright point
      ctx.beginPath();
      ctx.arc(dotRef.current.x, dotRef.current.y, dotSize * 0.4, 0, Math.PI * 2);
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
      window.removeEventListener("mouseup", onUp);
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
