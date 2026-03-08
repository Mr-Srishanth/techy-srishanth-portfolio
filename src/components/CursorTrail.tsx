import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hueOffset: number;
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const prevMouse = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const isMobile = useIsMobile();

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
      prevMouse.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const getHSL = () => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue("--primary").trim() || "200 100% 50%";
    };

    const spawnParticles = () => {
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const count = Math.min(Math.floor(speed / 3) + 1, 8);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const v = 0.5 + Math.random() * 2;
        const life = 30 + Math.random() * 30;
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 8,
          y: mouse.current.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * v + dx * 0.1,
          vy: Math.sin(angle) * v + dy * 0.1,
          life,
          maxLife: life,
          size: 2 + Math.random() * 4,
          hueOffset: (Math.random() - 0.5) * 30,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hsl = getHSL();
      const hueMatch = hsl.match(/^(\d+)/);
      const baseHue = hueMatch ? parseInt(hueMatch[1]) : 200;

      spawnParticles();

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.current.length; i++) {
        const a = particles.current[i];
        for (let j = i + 1; j < particles.current.length; j++) {
          const b = particles.current[j];
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 60) {
            const alpha = (1 - dist / 60) * 0.15 * (a.life / a.maxLife) * (b.life / b.maxLife);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${baseHue}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += 0.02; // slight gravity
        p.life--;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        const t = p.life / p.maxLife;
        const hue = (baseHue + p.hueOffset) % 360;
        const size = p.size * t;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${t * 0.3})`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${t * 0.9})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 95%, ${t})`;
        ctx.fill();
      }

      // Mouse glow
      const mg = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, 30
      );
      mg.addColorStop(0, `hsla(${baseHue}, 100%, 70%, 0.15)`);
      mg.addColorStop(1, `hsla(${baseHue}, 100%, 50%, 0)`);
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isMobile]);

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
