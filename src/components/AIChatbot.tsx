import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { buttonHover, buttonTap, EASE } from "@/lib/animations";

interface Message {
  role: "user" | "ai";
  text: string;
}

const knowledgeBase: Record<string, string> = {
  who: "Srishanth is an engineering student passionate about AI, technology, and creative digital projects. He loves building tools that merge tech with creativity.",
  project: "Srishanth has built Python mini projects, explored AI/ML experiments, and created this interactive developer portfolio with games, animations, and easter eggs.",
  tech: "Srishanth knows Python, C Programming, JavaScript, HTML, CSS, and AI tools. He's currently learning Data Structures, Machine Learning, and plans to pick up React and Git soon.",
  skill: "His strongest skill is C Programming (90%), followed by Python (50%), Data Structures (25%), and Machine Learning (10%). React and Git are on his learning roadmap.",
  interest: "Srishanth is deeply interested in AI development, tech experiments, building creative tools, and exploring the intersection of technology and art.",
  contact: "You can reach out to Srishanth through the Contact section on this website. Scroll down or use the navigation to find it!",
  education: "Srishanth is currently pursuing his engineering degree, focusing on computer science and AI-related subjects.",
  goal: "Srishanth aims to become a skilled AI developer and build intelligent systems that solve real-world problems.",
  hello: "Hey there! 👋 I'm Srishanth's AI assistant. Ask me anything about his skills, projects, or interests!",
  default: "That's an interesting question! Srishanth is always exploring new things. Try asking about his skills, projects, technologies, or interests for more specific info.",
};

function getResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) return knowledgeBase.hello;
  if (q.includes("who") || q.includes("about") || q.includes("srishanth")) return knowledgeBase.who;
  if (q.includes("project") || q.includes("built") || q.includes("portfolio")) return knowledgeBase.project;
  if (q.includes("tech") || q.includes("know") || q.includes("language") || q.includes("stack")) return knowledgeBase.tech;
  if (q.includes("skill") || q.includes("good at") || q.includes("proficien")) return knowledgeBase.skill;
  if (q.includes("interest") || q.includes("hobby") || q.includes("passion")) return knowledgeBase.interest;
  if (q.includes("contact") || q.includes("reach") || q.includes("email") || q.includes("hire")) return knowledgeBase.contact;
  if (q.includes("education") || q.includes("study") || q.includes("college") || q.includes("degree")) return knowledgeBase.education;
  if (q.includes("goal") || q.includes("aim") || q.includes("future") || q.includes("dream")) return knowledgeBase.goal;
  return knowledgeBase.default;
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hey! 👋 I'm Srishanth's AI assistant. Ask me anything about his skills, projects, or interests!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = useCallback(() => {
    const q = input.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: getResponse(q) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  }, [input]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        whileHover={buttonHover}
        whileTap={buttonTap}
        aria-label="Open AI chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] max-h-[500px] flex flex-col glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-primary/10 bg-primary/5">
              <h3 className="font-display text-sm tracking-wider text-primary neon-text">
                Ask AI About Srishanth
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mt-0.5">
                Powered by knowledge base
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px] max-h-[340px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground border border-border/50 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 border border-border/50 px-4 py-2.5 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary/60"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-primary/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask anything about Srishanth..."
                  className="flex-1 bg-background/50 border border-border/50 rounded-xl px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <motion.button
                  onClick={send}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
