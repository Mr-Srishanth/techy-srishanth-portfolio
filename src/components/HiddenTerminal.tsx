import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X } from "lucide-react";
import { EASE } from "@/lib/animations";

const RESPONSES: Record<string, string> = {
  "sudo hire srishanth": "Access granted. Welcome to the future. 🚀",
  help: "Available commands: help, whoami, skills, projects, sudo hire srishanth",
  whoami: "Srishanth — Engineering student | AI enthusiast | Creative developer",
  skills: "Python ██████░░░░ 50%\nC Prog █████████░ 90%\nDSA    ███░░░░░░░ 25%\nML     █░░░░░░░░░ 10%",
  projects: "→ Interactive Portfolio (this site!)\n→ Python Mini Projects\n→ AI/ML Experiments",
  clear: "__CLEAR__",
};

const HiddenTerminal = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Array<{ text: string; type: "input" | "output" }>>([
    { text: "Welcome to Srishanth's terminal. Type 'help' for commands.", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [typingOutput, setTypingOutput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typingOutput]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keyboard shortcut: Ctrl + `
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const typeOutput = useCallback((text: string) => {
    setIsTyping(true);
    let i = 0;
    setTypingOutput("");
    const interval = setInterval(() => {
      i++;
      setTypingOutput(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTypingOutput("");
        setLines((prev) => [...prev, { text, type: "output" }]);
      }
    }, 25);
  }, []);

  const handleSubmit = useCallback(() => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    setLines((prev) => [...prev, { text: `$ ${cmd}`, type: "input" }]);
    setInput("");

    const response = RESPONSES[cmd];
    if (response === "__CLEAR__") {
      setLines([]);
      return;
    }

    setTimeout(() => {
      typeOutput(response || `Command not found: ${cmd}. Type 'help' for available commands.`);
    }, 200);
  }, [input, typeOutput]);

  return (
    <>
      {/* Hint text - subtle */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="font-mono text-[10px] text-muted-foreground/30 tracking-wider cursor-pointer hover:text-muted-foreground/60 transition-colors"
          onClick={() => setOpen(true)}
        >
          Try Ctrl + ` to open terminal
        </motion.p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-4 bottom-20 sm:inset-auto sm:bottom-16 sm:left-6 z-50 sm:w-[520px] max-h-[360px] flex flex-col rounded-xl overflow-hidden border border-green-500/30 shadow-2xl shadow-green-500/10"
            style={{ background: "rgba(0, 10, 0, 0.95)" }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-500/20" style={{ background: "rgba(0, 20, 0, 0.8)" }}>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-green-400" />
                <span className="font-mono text-xs text-green-400 tracking-wider">srishanth@portfolio:~</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-green-500/50 hover:text-green-400 transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Output */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed min-h-[200px] max-h-[260px]">
              {lines.map((line, i) => (
                <div key={i} className={`mb-1 ${line.type === "input" ? "text-green-300" : "text-green-500/80"}`} style={{ whiteSpace: "pre-wrap" }}>
                  {line.text}
                </div>
              ))}
              {isTyping && (
                <div className="text-green-500/80" style={{ whiteSpace: "pre-wrap" }}>
                  {typingOutput}
                  <span className="animate-pulse">▊</span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-green-500/20">
              <span className="text-green-400 font-mono text-xs">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={isTyping}
                className="flex-1 bg-transparent font-mono text-xs text-green-300 placeholder:text-green-500/30 focus:outline-none"
                placeholder="Type a command..."
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HiddenTerminal;
