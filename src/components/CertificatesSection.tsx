import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Award, ExternalLink, X, Trophy, Brain, Code2, Cloud, Database, Globe,
  Shield, Cpu, Network, Rocket, Sparkles, Zap, Star, Bot, Terminal,
  GitBranch, Layers, Key, Lock, Atom, Binary, Wand2, Flame, Crown,
} from "lucide-react";
import { useLightMotion } from "@/hooks/use-mobile";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { headingReveal, EASE } from "@/lib/animations";
import type { CertificateData } from "@/contexts/PortfolioContext";

const ICON_MAP: Record<string, any> = {
  Award, Trophy, Brain, Code2, Cloud, Database, Globe, Shield, Cpu, Network,
  Rocket, Sparkles, Zap, Star, Bot, Terminal, GitBranch, Layers, Key, Lock,
  Atom, Binary, Wand2, Flame, Crown,
};

function pickIcon(cert: CertificateData) {
  if (cert.preset_icon && ICON_MAP[cert.preset_icon]) return ICON_MAP[cert.preset_icon];
  const hay = `${cert.title} ${cert.issuer} ${cert.category ?? ""}`.toLowerCase();
  if (/(ai|ml|machine|neural|brain)/.test(hay)) return Brain;
  if (/(cloud|aws|azure|gcp)/.test(hay)) return Cloud;
  if (/(data|sql|database)/.test(hay)) return Database;
  if (/(web|html|frontend|react|globe)/.test(hay)) return Globe;
  if (/(security|cyber|shield)/.test(hay)) return Shield;
  if (/(hack|trophy|win|finalist)/.test(hay)) return Trophy;
  if (/(python|code|developer|software)/.test(hay)) return Code2;
  return Award;
}

function normalizeCategory(raw?: string) {
  const v = (raw ?? "").trim().toLowerCase();
  return v || "general";
}

function prettyCategory(slug: string) {
  return slug
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map(w => w === "ai" || w === "ml" ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))
    .join(" / ");
}

const CertCard = ({ cert, onOpen, index, light }: { cert: CertificateData; onOpen: () => void; index: number; light: boolean }) => {
  const Icon = pickIcon(cert);
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05, ease: EASE }}
      whileHover={light ? undefined : { y: -6 }}
      className="group relative flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl"
      aria-label={`${cert.title} by ${cert.issuer}`}
    >
      {/* circular badge */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center bg-card/30 border-2 border-primary/40 backdrop-blur-md transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.55)]">
        {/* outer faint ring */}
        <div aria-hidden className="absolute -inset-1 rounded-full border border-primary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        {/* inner hover glow */}
        <div
          aria-hidden
          className="absolute inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-cyan) / 0.18), transparent 70%)" }}
        />
        {cert.logo_url ? (
          <img
            src={cert.logo_url}
            alt=""
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            className="w-14 h-14 object-contain relative z-10"
          />
        ) : (
          <Icon size={44} strokeWidth={1.5} className="text-primary relative z-10 drop-shadow-[0_0_10px_hsl(var(--neon-cyan)/0.6)]" />
        )}
      </div>

      <div className="mt-5 space-y-1 px-2 max-w-[180px]">
        <h3 className="font-display text-sm sm:text-base text-foreground leading-snug line-clamp-2">
          {cert.title || "Untitled"}
        </h3>
        {cert.issuer && (
          <p className="text-xs text-muted-foreground/80 font-body line-clamp-2">
            {cert.issuer}
          </p>
        )}
      </div>
    </motion.button>
  );
};

const CertificateModal = ({ cert, onClose }: { cert: CertificateData; onClose: () => void }) => {
  // ESC + lock body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const Icon = pickIcon(cert);

  return (
    <motion.div
      key="cert-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-background/70 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative max-w-2xl w-full max-h-[88vh] overflow-y-auto rounded-2xl border border-primary/40 bg-card/80 backdrop-blur-2xl shadow-[0_0_60px_hsl(var(--neon-cyan)/0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 border border-primary/40 text-primary hover:bg-primary/20 transition-all"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-background/60 border border-primary/40">
              {cert.logo_url ? (
                <img src={cert.logo_url} alt="" className="w-8 h-8 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <Icon size={26} className="text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl sm:text-2xl text-foreground neon-text truncate">{cert.title}</h3>
              {cert.issuer && <p className="text-sm text-muted-foreground">{cert.issuer}</p>}
            </div>
          </div>

          {cert.description && (
            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed font-body">{cert.description}</p>
          )}

          {cert.image && (
            <div className="relative rounded-xl overflow-hidden border border-primary/30">
              <img src={cert.image} alt={`${cert.title} certificate`} loading="lazy" className="w-full h-auto block" />
            </div>
          )}

          {cert.link && /^https?:\/\//i.test(cert.link) && (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 border border-primary/40 text-primary text-sm font-mono hover:bg-primary/25 transition-all"
            >
              Verify Certificate <ExternalLink size={14} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const light = useLightMotion();
  const { data } = usePortfolio();
  const [open, setOpen] = useState<CertificateData | null>(null);

  const grouped = useMemo(() => {
    const valid = (data.certificates ?? []).filter(c => c && (c.title || "").trim().length > 0);
    const map = new Map<string, CertificateData[]>();
    for (const c of valid) {
      const key = normalizeCategory(c.category);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries());
  }, [data.certificates]);

  const totalValid = grouped.reduce((n, [, arr]) => n + arr.length, 0);

  return (
    <section id="certificates" className="py-20 relative overflow-hidden" ref={ref}>
      {/* Futuristic background */}
      <div aria-hidden className="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, hsl(var(--neon-cyan) / 0.10), transparent 55%), radial-gradient(ellipse at 80% 100%, hsl(280 100% 65% / 0.08), transparent 55%)",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div {...headingReveal(inView)} className="text-center mb-14">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// CERTIFICATIONS"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            My Certificates
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto mt-3">
            Verified credentials, organized by domain.
          </p>
        </motion.div>

        {totalValid === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-md mx-auto text-center rounded-2xl border border-primary/30 bg-card/40 backdrop-blur-xl p-10"
          >
            <Sparkles size={28} className="mx-auto text-primary mb-3 drop-shadow-[0_0_10px_hsl(var(--neon-cyan)/0.7)]" />
            <p className="font-display text-lg text-foreground">No certifications available yet</p>
            <p className="text-sm text-muted-foreground mt-1">New credentials will materialize here.</p>
          </motion.div>
        ) : (
          <div className="space-y-14 max-w-6xl mx-auto">
            {grouped.map(([cat, items], gi) => (
              <div key={cat}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: gi * 0.05, ease: EASE }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-primary/10" />
                  <h3 className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-primary px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm shadow-[0_0_18px_hsl(var(--neon-cyan)/0.15)]">
                    {prettyCategory(cat)}
                    <span className="ml-2 text-primary/60">[{items.length}]</span>
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/40 to-primary/10" />
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 justify-items-center">
                  {items.map((cert, i) => (
                    <CertCard
                      key={cert.id ?? `${cat}-${i}`}
                      cert={cert}
                      index={i}
                      light={light}
                      onOpen={() => setOpen(cert)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && <CertificateModal cert={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;