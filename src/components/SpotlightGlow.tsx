import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const SpotlightGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const el = glowRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };

    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
      style={{
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, hsl(var(--primary) / 0.02) 30%, transparent 70%)",
      }}
    />
  );
};

export default SpotlightGlow;
