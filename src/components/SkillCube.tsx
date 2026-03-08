import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CubeFace {
  label: string;
  icon: string;
  skills: string[];
  color: string;
}

const faces: CubeFace[] = [
  { label: "Languages", icon: "💻", skills: ["Python", "C", "JavaScript", "TypeScript"], color: "200 100% 50%" },
  { label: "Frontend", icon: "🎨", skills: ["React", "Tailwind CSS", "Framer Motion", "HTML/CSS"], color: "185 100% 50%" },
  { label: "Backend", icon: "⚙️", skills: ["Node.js (Basics)", "REST APIs", "File I/O", "CLI Tools"], color: "270 100% 60%" },
  { label: "AI / ML", icon: "🤖", skills: ["Regression", "Classification", "Neural Networks", "Pandas"], color: "320 80% 55%" },
  { label: "Tools", icon: "🛠️", skills: ["Git", "VS Code", "Linux", "GitHub"], color: "35 100% 55%" },
  { label: "Concepts", icon: "🧠", skills: ["DSA", "OOP", "Problem Solving", "Algorithms"], color: "10 90% 55%" },
];

// CSS class names for each face transform
const faceTransforms = [
  "translateZ(var(--half))",                    // front
  "rotateY(180deg) translateZ(var(--half))",    // back
  "rotateY(90deg) translateZ(var(--half))",     // right
  "rotateY(-90deg) translateZ(var(--half))",    // left
  "rotateX(90deg) translateZ(var(--half))",     // top
  "rotateX(-90deg) translateZ(var(--half))",    // bottom
];

const cubeRotations = [
  "rotateY(0deg)",        // front
  "rotateY(-180deg)",     // back
  "rotateY(-90deg)",      // right
  "rotateY(90deg)",       // left
  "rotateX(-90deg)",      // top
  "rotateX(90deg)",       // bottom
];

const SkillCube = () => {
  const [activeFace, setActiveFace] = useState(0);
  const [selectedFace, setSelectedFace] = useState<CubeFace | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cubeSize = isMobile ? 200 : 280;

  const handleFaceClick = (face: CubeFace, index: number) => {
    setActiveFace(index);
    setIsAutoRotating(false);
    setSelectedFace(face);
  };

  return (
    <section id="skill-cube" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// SKILL MATRIX"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            The Skill Cube
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
            Click faces or use buttons below to explore skill categories
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
          className="flex flex-col items-center gap-10"
        >
          {/* Cube viewport */}
          <div
            className="relative"
            style={{
              width: cubeSize,
              height: cubeSize,
              perspective: cubeSize * 3,
            }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{
                transformStyle: "preserve-3d",
                // @ts-ignore
                "--half": `${cubeSize / 2}px`,
                transform: isAutoRotating
                  ? undefined
                  : cubeRotations[activeFace],
                animation: isAutoRotating ? "cube-spin 12s linear infinite" : undefined,
              } as React.CSSProperties}
            >
              {faces.map((face, i) => (
                <button
                  key={face.label}
                  onClick={() => handleFaceClick(face, i)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border cursor-pointer transition-all duration-300 hover:brightness-125 backface-visible"
                  style={{
                    transform: faceTransforms[i],
                    backfaceVisibility: "hidden",
                    background: `linear-gradient(135deg, hsl(${face.color} / 0.15), hsl(${face.color} / 0.05))`,
                    borderColor: `hsl(${face.color} / 0.4)`,
                    boxShadow: `inset 0 0 30px hsl(${face.color} / 0.1), 0 0 15px hsl(${face.color} / 0.1)`,
                  }}
                >
                  <span className="text-4xl md:text-5xl">{face.icon}</span>
                  <span
                    className="font-display text-sm md:text-base font-bold tracking-widest"
                    style={{ color: `hsl(${face.color})` }}
                  >
                    {face.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Face selector buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {faces.map((face, i) => (
              <motion.button
                key={face.label}
                onClick={() => handleFaceClick(face, i)}
                className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider border transition-all"
                style={{
                  borderColor: activeFace === i && !isAutoRotating
                    ? `hsl(${face.color})`
                    : `hsl(${face.color} / 0.2)`,
                  background: activeFace === i && !isAutoRotating
                    ? `hsl(${face.color} / 0.15)`
                    : "transparent",
                  color: `hsl(${face.color})`,
                  boxShadow: activeFace === i && !isAutoRotating
                    ? `0 0 15px hsl(${face.color} / 0.2)`
                    : "none",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {face.icon} {face.label}
              </motion.button>
            ))}
          </div>

          {/* Auto-rotate toggle */}
          {!isAutoRotating && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsAutoRotating(true)}
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              ↻ Resume auto-rotate
            </motion.button>
          )}
        </motion.div>

        {/* Expanded detail modal */}
        <AnimatePresence>
          {selectedFace && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFace(null)}
            >
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
              <motion.div
                className="glass-card p-8 max-w-sm w-full relative z-10"
                initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.7, opacity: 0, rotateY: 90 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedFace(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-6">
                  <span className="text-5xl mb-3 block">{selectedFace.icon}</span>
                  <h3
                    className="font-display text-xl font-bold tracking-widest"
                    style={{ color: `hsl(${selectedFace.color})` }}
                  >
                    {selectedFace.label}
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedFace.skills.map((skill, i) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg border"
                      style={{
                        borderColor: `hsl(${selectedFace.color} / 0.2)`,
                        background: `hsl(${selectedFace.color} / 0.05)`,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: `hsl(${selectedFace.color})`, boxShadow: `0 0 6px hsl(${selectedFace.color} / 0.6)` }}
                      />
                      <span className="font-body text-foreground text-sm">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SkillCube;
