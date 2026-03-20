import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const Preview = () => {
  const navigate = useNavigate();
  const { draft } = usePortfolio();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 inset-x-0 z-50 bg-primary/90 backdrop-blur-lg text-primary-foreground">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-sm font-mono font-semibold tracking-wider">PREVIEW MODE — Draft Data</span>
          <motion.button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-all text-sm font-mono" whileTap={{ scale: 0.95 }}>
            <ArrowLeft size={14} /> Back to Edit
          </motion.button>
        </div>
      </div>

      <div className="pt-16 pb-12 container mx-auto px-4 max-w-3xl space-y-8">
        {/* Hero */}
        <section className="glass-card p-8 text-center space-y-4">
          {draft.profileImage && <img src={draft.profileImage} alt="Profile" className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary/30" />}
          <h1 className="font-display text-3xl font-bold text-foreground">{draft.heroName}</h1>
          <p className="text-primary font-mono">{draft.heroSubtitle}</p>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">{draft.heroBio}</p>
        </section>

        {/* About */}
        <section className="glass-card p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">{draft.aboutTitle}</h2>
          <p className="text-muted-foreground text-sm">{draft.aboutP1}</p>
          <p className="text-muted-foreground text-sm">{draft.aboutP2}</p>
        </section>

        {/* Skills */}
        <section className="glass-card p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {draft.skills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-mono text-foreground">
                {s.name} {s.upcoming ? "🔒" : `${s.level}%`}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="glass-card p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground">Projects</h2>
          {draft.projects.map((p, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
              {p.image && <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-lg" />}
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t, j) => <span key={j} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">{t}</span>)}
              </div>
            </div>
          ))}
        </section>

        {/* Certificates */}
        {draft.certificates.length > 0 && (
          <section className="glass-card p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">Certificates</h2>
            {draft.certificates.map((c, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
                {c.image && <img src={c.image} alt={c.title} className="w-full h-32 object-cover rounded-lg" />}
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                {c.issuer && <p className="text-sm text-muted-foreground">{c.issuer}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Greetings */}
        {draft.greetings.length > 0 && (
          <section className="glass-card p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">Greetings</h2>
            {draft.greetings.map((g, i) => (
              <div key={i} className={`p-4 rounded-lg border space-y-2 ${g.active ? "bg-primary/10 border-primary/30" : "bg-secondary/30 border-border/50"}`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{g.title || "(untitled)"}</h3>
                  {g.active && <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-mono">Active</span>}
                </div>
                <p className="text-sm text-muted-foreground">{g.message}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Preview;
