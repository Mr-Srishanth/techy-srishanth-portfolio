import { useEffect, useRef } from "react";

const ScrollWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollSpeed = useRef(0);
  const lastScroll = useRef(0);
  const phase = useRef(0);
  const rafRef = useRef(0);

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

    const getHue = () => {
      const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      const match = primary.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 200;
    };

    const onScroll = () => {
      const current = window.scrollY;
      scrollSpeed.current = Math.abs(current - lastScroll.current);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hue = getHue();

      // Decay scroll speed
      scrollSpeed.current *= 0.95;
      const speed = Math.min(scrollSpeed.current, 50);
      const intensity = speed / 50;

      // Phase advances faster with scroll
      phase.current += 0.02 + intensity * 0.08;

      const w = canvas.width;
      const h = canvas.height;
      const waves = 3;

      for (let wave = 0; wave < waves; wave++) {
        const yBase = h * 0.5;
        const amplitude = 30 + wave * 15 + intensity * 40;
        const frequency = 0.003 + wave * 0.001;
        const wavePhase = phase.current + wave * 1.2;
        const alpha = (0.12 + intensity * 0.25) * (1 - wave * 0.25);
        const hueShift = wave * 30;

        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 3) {
          const y = yBase +
            Math.sin(x * frequency + wavePhase) * amplitude +
            Math.sin(x * frequency * 2.5 + wavePhase * 1.3) * (amplitude * 0.3);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yBase - amplitude, 0, h);
        grad.addColorStop(0, `hsla(${hue + hueShift}, 100%, 60%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${hue + hueShift + 20}, 100%, 50%, ${alpha * 0.4})`);
        grad.addColorStop(1, `hsla(${hue + hueShift}, 100%, 40%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();

        // Glow line on top
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const y = yBase +
            Math.sin(x * frequency + wavePhase) * amplitude +
            Math.sin(x * frequency * 2.5 + wavePhase * 1.3) * (amplitude * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue + hueShift}, 100%, 70%, ${alpha * 1.5})`;
        ctx.lineWidth = 1.5 + intensity * 2;
        ctx.shadowColor = `hsla(${hue + hueShift}, 100%, 60%, ${alpha})`;
        ctx.shadowBlur = 10 + intensity * 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none opacity-40"
      aria-hidden="true"
    />
  );
};

export default ScrollWave;
