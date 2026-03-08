import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const GenerativeArtBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const isMobile = useIsMobile();
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  const getThemeColor = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue("--primary").trim();
    return primary || "200 100% 50%";
  }, []);

  useEffect(() => {
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

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    if (!isMobile) window.addEventListener("mousemove", handleMouse);

    // Flow field parameters
    const cellSize = isMobile ? 25 : 18;
    const noiseScale = 0.003;
    const particleCount = isMobile ? 120 : 300;

    // Simple value noise
    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 256; i++) perm[256 + i] = perm[i];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
      const h = hash & 3;
      const u = h < 2 ? x : y;
      const v = h < 2 ? y : x;
      return (h & 1 ? -u : u) + (h & 2 ? -v : v);
    };

    const noise2D = (x: number, y: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const aa = perm[perm[X] + Y];
      const ab = perm[perm[X] + Y + 1];
      const ba = perm[perm[X + 1] + Y];
      const bb = perm[perm[X + 1] + Y + 1];
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      );
    };

    // Particles for flow field
    interface FlowParticle {
      x: number;
      y: number;
      prevX: number;
      prevY: number;
      speed: number;
      life: number;
      maxLife: number;
      hueOffset: number;
    }

    const createParticle = (): FlowParticle => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return {
        x, y, prevX: x, prevY: y,
        speed: Math.random() * 1.5 + 0.5,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        hueOffset: Math.random() * 60 - 30,
      };
    };

    const particles: FlowParticle[] = Array.from({ length: particleCount }, createParticle);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const color = getThemeColor();
      const baseHue = parseFloat(color.split(" ")[0]) || 200;
      timeRef.current += 0.003;
      const t = timeRef.current;

      // Fade trail effect
      ctx.fillStyle = "hsla(var(--background) / 0.06)";
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        p.prevX = p.x;
        p.prevY = p.y;

        // Flow field angle from noise
        const nx = p.x * noiseScale;
        const ny = p.y * noiseScale;
        let angle = noise2D(nx + t, ny + t * 0.7) * Math.PI * 4;

        // Mouse attraction
        if (mx >= 0 && !isMobile) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const influence = (200 - dist) / 200;
            angle += Math.atan2(dy, dx) * influence * 0.5;
          }
        }

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
        p.life++;

        // Wrap or reset
        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10 || p.life > p.maxLife) {
          Object.assign(p, createParticle());
          p.prevX = p.x;
          p.prevY = p.y;
          return;
        }

        // Draw flowing line
        const lifePct = p.life / p.maxLife;
        const alpha = Math.sin(lifePct * Math.PI) * 0.4;
        const hue = (baseHue + p.hueOffset + t * 10) % 360;

        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // Initial clear
    ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [isMobile, getThemeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

export default GenerativeArtBackground;
