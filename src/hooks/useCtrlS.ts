import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useCtrlS = () => {
  const navigate = useNavigate();
  const sCountRef = useRef(0);
  const sTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+S shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        navigate("/admin");
        return;
      }

      // Secret S×7 sequence
      if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger when typing in inputs
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

        sCountRef.current += 1;
        if (sTimerRef.current) clearTimeout(sTimerRef.current);
        sTimerRef.current = setTimeout(() => { sCountRef.current = 0; }, 2000);

        if (sCountRef.current >= 7) {
          sCountRef.current = 0;
          navigate("/admin");
        }
      } else if (!e.ctrlKey && !e.metaKey) {
        sCountRef.current = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (sTimerRef.current) clearTimeout(sTimerRef.current);
    };
  }, [navigate]);
};
