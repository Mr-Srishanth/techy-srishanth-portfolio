import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Gamepad2, RotateCcw } from "lucide-react";
import { headingReveal, textReveal, STAGGER, EASE, buttonHover, buttonTap } from "@/lib/animations";

const ICONS = ["</>", "{ }", "JS", "PY", "AI", "C", "fn", "=>"];
const GAME_W = 400;
const GAME_H = 300;
const PLAYER_SIZE = 28;
const ICON_SIZE = 22;
const SPEED = 4;

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  label: string;
  vy: number;
  vx: number;
}

const MiniGameSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [time, setTime] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const playerRef = useRef({ x: GAME_W / 2, y: GAME_H / 2 });
  const keysRef = useRef<Set<string>>(new Set());
  const iconsRef = useRef<FloatingIcon[]>([]);
  const scoreRef = useRef(0);
  const rafRef = useRef(0);
  const idCounter = useRef(0);

  const spawnIcon = useCallback((): FloatingIcon => {
    return {
      id: idCounter.current++,
      x: Math.random() * (GAME_W - ICON_SIZE * 2) + ICON_SIZE,
      y: Math.random() * (GAME_H - ICON_SIZE * 2) + ICON_SIZE,
      label: ICONS[Math.floor(Math.random() * ICONS.length)],
      vy: (Math.random() - 0.5) * 1.5,
      vx: (Math.random() - 0.5) * 1.5,
    };
  }, []);

  const startGame = useCallback(() => {
    playerRef.current = { x: GAME_W / 2, y: GAME_H / 2 };
    iconsRef.current = Array.from({ length: 6 }, spawnIcon);
    scoreRef.current = 0;
    setScore(0);
    setTime(30);
    setGameOver(false);
    setPlaying(true);
  }, [spawnIcon]);

  // Game loop
  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setPlaying(false);
          setGameOver(true);
          setHighScore((h) => Math.max(h, scoreRef.current));
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const loop = () => {
      const p = playerRef.current;
      const keys = keysRef.current;

      if (keys.has("ArrowUp") || keys.has("w")) p.y = Math.max(PLAYER_SIZE / 2, p.y - SPEED);
      if (keys.has("ArrowDown") || keys.has("s")) p.y = Math.min(GAME_H - PLAYER_SIZE / 2, p.y + SPEED);
      if (keys.has("ArrowLeft") || keys.has("a")) p.x = Math.max(PLAYER_SIZE / 2, p.x - SPEED);
      if (keys.has("ArrowRight") || keys.has("d")) p.x = Math.min(GAME_W - PLAYER_SIZE / 2, p.x + SPEED);

      // Move icons & check collisions
      const remaining: FloatingIcon[] = [];
      let collected = false;
      for (const icon of iconsRef.current) {
        icon.x += icon.vx;
        icon.y += icon.vy;
        if (icon.x < ICON_SIZE || icon.x > GAME_W - ICON_SIZE) icon.vx *= -1;
        if (icon.y < ICON_SIZE || icon.y > GAME_H - ICON_SIZE) icon.vy *= -1;

        const dx = p.x - icon.x;
        const dy = p.y - icon.y;
        if (Math.sqrt(dx * dx + dy * dy) < (PLAYER_SIZE + ICON_SIZE) / 2) {
          collected = true;
          scoreRef.current++;
        } else {
          remaining.push(icon);
        }
      }

      if (collected) {
        setScore(scoreRef.current);
        remaining.push(spawnIcon());
      }
      iconsRef.current = remaining;

      // Render
      const el = canvasRef.current;
      if (el) {
        const playerEl = el.querySelector("[data-player]") as HTMLElement;
        if (playerEl) {
          playerEl.style.left = `${p.x - PLAYER_SIZE / 2}px`;
          playerEl.style.top = `${p.y - PLAYER_SIZE / 2}px`;
        }
        el.querySelectorAll("[data-icon]").forEach((iconEl, i) => {
          const icon = iconsRef.current[i];
          if (icon && iconEl instanceof HTMLElement) {
            iconEl.style.left = `${icon.x - ICON_SIZE / 2}px`;
            iconEl.style.top = `${icon.y - ICON_SIZE / 2}px`;
          }
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [playing, spawnIcon]);

  return (
    <section className="py-24 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div {...headingReveal(inView)} className="text-center mb-10">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">
            {"// PLAY A MINI GAME"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Code Collector
          </h2>
          <motion.p
            className="font-body text-muted-foreground mt-4 max-w-lg mx-auto"
            {...textReveal(inView, STAGGER * 2)}
          >
            Developers don't just code… we play too.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="max-w-[440px] mx-auto"
        >
          <div className="glass-card rounded-xl p-5 border border-primary/20">
            {/* HUD */}
            <div className="flex items-center justify-between mb-3 font-mono text-xs tracking-wider">
              <div className="flex items-center gap-2 text-primary">
                <Gamepad2 size={16} />
                <span>Score: {score}</span>
              </div>
              <span className="text-muted-foreground">
                {playing ? `⏱ ${time}s` : highScore > 0 ? `Best: ${highScore}` : ""}
              </span>
            </div>

            {/* Game area */}
            <div
              ref={canvasRef}
              className="relative bg-background/80 border border-border/30 rounded-lg overflow-hidden mx-auto"
              style={{ width: GAME_W, height: GAME_H, maxWidth: "100%" }}
            >
              {!playing && !gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <p className="font-mono text-sm text-muted-foreground">Use arrow keys or WASD</p>
                  <motion.button
                    onClick={startGame}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    className="px-6 py-2.5 rounded-lg font-display text-sm tracking-wider neon-border text-primary hover:bg-primary/10 transition-colors"
                  >
                    Start Game
                  </motion.button>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 z-20">
                  <p className="font-display text-xl text-primary neon-text">Game Over!</p>
                  <p className="font-mono text-sm text-muted-foreground">Score: {score}</p>
                  <motion.button
                    onClick={startGame}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg font-display text-sm tracking-wider neon-border text-primary hover:bg-primary/10 transition-colors"
                  >
                    <RotateCcw size={14} />
                    Play Again
                  </motion.button>
                </div>
              )}

              {playing && (
                <>
                  {/* Player */}
                  <div
                    data-player
                    className="absolute rounded-md bg-primary neon-glow flex items-center justify-center font-mono text-[10px] text-primary-foreground font-bold z-10 transition-none"
                    style={{ width: PLAYER_SIZE, height: PLAYER_SIZE, left: GAME_W / 2 - PLAYER_SIZE / 2, top: GAME_H / 2 - PLAYER_SIZE / 2 }}
                  >
                    {"</>"}
                  </div>
                  {/* Icons rendered via refs for perf */}
                  {iconsRef.current.map((icon) => (
                    <div
                      key={icon.id}
                      data-icon
                      className="absolute rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center font-mono text-[9px] text-primary transition-none"
                      style={{ width: ICON_SIZE, height: ICON_SIZE, left: icon.x - ICON_SIZE / 2, top: icon.y - ICON_SIZE / 2 }}
                    >
                      {icon.label}
                    </div>
                  ))}
                </>
              )}
            </div>

            <p className="text-center font-mono text-[10px] text-muted-foreground/50 mt-3 tracking-wider">
              Collect code icons before time runs out!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MiniGameSection;
