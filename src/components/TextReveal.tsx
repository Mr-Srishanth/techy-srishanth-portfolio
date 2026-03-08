import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DUR_TEXT_REVEAL, WORD_DELAY } from "@/lib/animations";

interface TextRevealProps {
  text: string;
  className?: string;
  highlightWord?: string;
  highlightClass?: string;
}

const TextReveal = ({ text, className = "", highlightWord, highlightClass = "text-primary neon-text" }: TextRevealProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWord && word.toLowerCase() === highlightWord.toLowerCase();
        return (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
            <motion.span
              className={`inline-block ${isHighlight ? highlightClass : ""}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : undefined}
              transition={{
                duration: DUR_TEXT_REVEAL,
                delay: i * WORD_DELAY,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

export default TextReveal;
