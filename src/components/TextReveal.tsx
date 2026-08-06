import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DUR_TEXT_REVEAL, EASE, IN_VIEW, WORD_DELAY } from "@/lib/animations";

interface TextRevealProps {
  text: string;
  className?: string;
  highlightWord?: string;
  highlightClass?: string;
}

/** Premium mask + blur-to-clear word reveal. */
const TextReveal = ({ text, className = "", highlightWord, highlightClass = "text-primary neon-text" }: TextRevealProps) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, IN_VIEW);
  const words = text.split(" ");

  if (reduced) return <span ref={ref} className={className}>{text}</span>;

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWord && word.toLowerCase() === highlightWord.toLowerCase();
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.3em] pb-[0.06em]">
            <motion.span
              className={`inline-block will-change-transform ${isHighlight ? highlightClass : ""}`}
              initial={{ y: "108%", opacity: 0, filter: "blur(8px)" }}
              animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : undefined}
              transition={{
                duration: DUR_TEXT_REVEAL,
                delay: i * WORD_DELAY,
                ease: EASE,
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
