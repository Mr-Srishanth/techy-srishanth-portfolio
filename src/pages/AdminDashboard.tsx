import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, User, FileText, Wrench, FolderOpen, Image, Plus, X, Upload,
  ArrowLeft, Save, Undo2, Redo2, Eye, History, Clock, RotateCcw, Trash2,
  Award, MessageSquare, LayoutGrid, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { usePortfolio, type SkillData, type ProjectData, type CertificateData, type GreetingData, type SectionVisibility } from "@/contexts/PortfolioContext";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About", icon: FileText },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "greetings", label: "Greetings", icon: MessageSquare },
  { id: "sections", label: "Sections", icon: LayoutGrid },
  { id: "images", label: "Images", icon: Image },
  { id: "history", label: "History", icon: History },
] as const;

type TabId = typeof TABS[number]["id"];

// ── Validation helper ──
const validateNotEmpty = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} cannot be empty`;
  return null;
};

const FieldError = ({ error }: { error: string | null }) => {
  if (!error) return null;
  return (
    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
      <AlertCircle size={12} /> {error}
    </p>
  );
};

// ── Image drop zone ──
const ImageDropZone = ({ label, currentImage, onUpload }: { label: string; currentImage?: string; onUpload: (b64: string) => void }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPG/PNG files are accepted");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { onUpload(reader.result as string); toast.success("Image uploaded"); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-mono text-muted-foreground">{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${dragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-border hover:border-primary/50 bg-secondary/20"}`}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => handleFiles(e.target.files)} />
        <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground font-mono">{dragging ? "Drop image here" : "Drag & drop or click to upload"}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG only</p>
      </div>
      {currentImage && (
        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-border">
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

// ── Section label map ──
const SECTION_LABELS: Record<keyof SectionVisibility, string> = {
  about: "About",
  skills: "Skills",
  skillRadar: "Skill Radar Chart",
  rpgSkillTree: "RPG Skill Tree",
  projects: "Projects",
  timeline: "Time Machine Timeline",
  learningJourney: "Learning Journey",
  achievements: "Achievements",
  certificates: "Certificates",
  github: "GitHub",
  contact: "Contact",
};

// ── Main Dashboard ──
const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    draft, updateDraft, savePermanently, resetData,
    history, restoreFromHistory, clearHistory,
    undo, redo, canUndo, canRedo
  } = usePortfolio();
  const [tab, setTab] = useState<TabId>("profile");
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSaveRef = useRef(JSON.stringify(draft));

  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") !== "true") navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    const current = JSON.stringify(draft);
    if (current === lastSaveRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { lastSaveRef.current = current; toast.success("Draft saved"); }, 2100);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [draft]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const logout = () => { sessionStorage.removeItem("admin-auth"); toast.success("Logged out"); navigate("/admin"); };

  const handleSavePermanently = () => {
    // Validate required fields
    const nameErr = validateNotEmpty(draft.heroName, "Name");
    const subtitleErr = validateNotEmpty(draft.heroSubtitle, "Subtitle");
    if (nameErr || subtitleErr) {
      setErrors({ heroName: nameErr, heroSubtitle: subtitleErr });
      toast.error("Please fix validation errors before publishing");
      setTab("profile");
      return;
    }
    setErrors({});
    savePermanently();
    toast.success("Saved permanently — live on website!");
  };

  const setFieldError = (key: string, value: string) => {
    const err = validateNotEmpty(value, key);
    setErrors(prev => ({ ...prev, [key]: err }));
  };

  // ── Field helpers ──
  const field = (label: string, value: string, key: keyof typeof draft, required = false) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-sm font-mono text-muted-foreground">{label}{required && <span className="text-destructive ml-1">*</span>}</label>
      <input
        value={value}
        onChange={e => {
          updateDraft({ [key]: e.target.value });
          if (required) setFieldError(key, e.target.value);
        }}
        className={`w-full px-4 py-2.5 rounded-lg bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm ${errors[key] ? "border-destructive" : "border-border"}`}
      />
      {required && <FieldError error={errors[key] ?? null} />}
    </div>
  );

  const textArea = (label: string, value: string, key: keyof typeof draft) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-sm font-mono text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={e => updateDraft({ [key]: e.target.value })}
        rows={4}
        className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
      />
    </div>
  );

  // ── Skills ──
  const addSkill = () => {
    if (!newSkill.trim()) { toast.error("Skill name cannot be empty"); return; }
    updateDraft({ skills: [...draft.skills, { name: newSkill.trim(), level: 50, icon: "💡" }] });
    setNewSkill(""); toast.success(`Added "${newSkill.trim()}"`);
  };
  const removeSkill = (idx: number) => updateDraft({ skills: draft.skills.filter((_, i) => i !== idx) });
  const updateSkill = (idx: number, partial: Partial<SkillData>) => updateDraft({ skills: draft.skills.map((s, i) => i === idx ? { ...s, ...partial } : s) });

  // ── Projects ──
  const addProject = () => updateDraft({ projects: [...draft.projects, { title: "New Project", desc: "Description here", tags: [] }] });
  const removeProject = (idx: number) => updateDraft({ projects: draft.projects.filter((_, i) => i !== idx) });
  const updateProject = (idx: number, partial: Partial<ProjectData>) => updateDraft({ projects: draft.projects.map((p, i) => i === idx ? { ...p, ...partial } : p) });

  // ── Certificates ──
  const addCertificate = () => updateDraft({ certificates: [...draft.certificates, { title: "", issuer: "", image: "", link: "" }] });
  const removeCertificate = (idx: number) => updateDraft({ certificates: draft.certificates.filter((_, i) => i !== idx) });
  const updateCertificate = (idx: number, partial: Partial<CertificateData>) => updateDraft({ certificates: draft.certificates.map((c, i) => i === idx ? { ...c, ...partial } : c) });

  // ── Greetings ──
  const addGreeting = () => updateDraft({ greetings: [...draft.greetings, { title: "", message: "", image: "", active: false }] });
  const removeGreeting = (idx: number) => updateDraft({ greetings: draft.greetings.filter((_, i) => i !== idx) });
  const updateGreeting = (idx: number, partial: Partial<GreetingData>) => {
    let updated = draft.greetings.map((g, i) => i === idx ? { ...g, ...partial } : g);
    // Only one active at a time
    if (partial.active) {
      updated = updated.map((g, i) => ({ ...g, active: i === idx }));
    }
    updateDraft({ greetings: updated });
  };

  // ── Sections ──
  const toggleSection = (key: keyof SectionVisibility) => {
    updateDraft({ sections: { ...draft.sections, [key]: !draft.sections[key] } });
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-sm font-mono" whileTap={{ scale: 0.95 }}>
              <ArrowLeft size={16} /> Back
            </motion.button>
            <h1 className="font-display text-lg font-bold text-primary tracking-wider hidden sm:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button onClick={undo} disabled={!canUndo} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed" whileTap={{ scale: 0.95 }} title="Undo (Ctrl+Z)"><Undo2 size={16} /></motion.button>
            <motion.button onClick={redo} disabled={!canRedo} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed" whileTap={{ scale: 0.95 }} title="Redo (Ctrl+Y)"><Redo2 size={16} /></motion.button>
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
            <motion.button onClick={() => window.open("/preview", "_blank")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-all text-sm font-mono" whileTap={{ scale: 0.95 }}><Eye size={14} /> Preview</motion.button>
            <motion.button onClick={handleSavePermanently} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm neon-glow" whileTap={{ scale: 0.95 }}><Save size={14} /> Publish</motion.button>
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
            <button onClick={resetData} className="text-xs font-mono text-muted-foreground hover:text-destructive transition-colors">Reset</button>
            <motion.button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm font-mono" whileTap={{ scale: 0.95 }}><LogOut size={14} /></motion.button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-6 relative z-10">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 space-y-1 hidden md:block">
          {TABS.map(t => (
            <motion.button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all ${tab === t.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`} whileTap={{ scale: 0.97 }}>
              <t.icon size={16} /> {t.label}
            </motion.button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 w-full absolute top-0 left-0 px-4 -mt-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 px-3 py-2 rounded-lg text-xs font-mono transition-all ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-card p-6 space-y-6">

              {tab === "profile" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Profile Info</h2>
                  {field("Display Name", draft.heroName, "heroName", true)}
                  {field("Subtitle / Role", draft.heroSubtitle, "heroSubtitle", true)}
                  {textArea("Bio", draft.heroBio, "heroBio")}
                  {field("Current Focus", draft.currentFocus, "currentFocus")}
                </>
              )}

              {tab === "about" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">About Section</h2>
                  {field("Section Title", draft.aboutTitle, "aboutTitle")}
                  {textArea("Paragraph 1", draft.aboutP1, "aboutP1")}
                  {textArea("Paragraph 2", draft.aboutP2, "aboutP2")}
                </>
              )}

              {tab === "skills" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Skills</h2>
                  <div className="flex gap-2">
                    <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} placeholder="Add new skill..." className="flex-1 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <motion.button onClick={addSkill} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm" whileTap={{ scale: 0.95 }}><Plus size={16} /></motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {draft.skills.map((skill, i) => (
                      <motion.div key={`${skill.name}-${i}`} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="group flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                        <span className="text-foreground font-mono">{skill.name}</span>
                        <span className="text-primary text-xs">{skill.upcoming ? "Soon" : `${skill.level}%`}</span>
                        <button onClick={() => removeSkill(i)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-3 mt-4">
                    <p className="text-sm font-mono text-muted-foreground">Edit skill levels:</p>
                    {draft.skills.map((skill, i) => (
                      <div key={`edit-${i}`} className="flex items-center gap-3">
                        <input value={skill.name} onChange={e => updateSkill(i, { name: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" />
                        <input type="number" min={0} max={100} value={skill.level} onChange={e => updateSkill(i, { level: Number(e.target.value) })} className="w-20 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm text-center" />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground">
                          <input type="checkbox" checked={!!skill.upcoming} onChange={e => updateSkill(i, { upcoming: e.target.checked })} className="accent-primary" /> Soon
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === "projects" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Projects</h2>
                    <motion.button onClick={addProject} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add Project</motion.button>
                  </div>
                  <div className="space-y-4">
                    {draft.projects.map((project, i) => (
                      <motion.div key={i} layout className="glass-card p-4 space-y-3 relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
                        <input value={project.title} onChange={e => updateProject(i, { title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold" placeholder="Project title" />
                        <textarea value={project.desc} onChange={e => updateProject(i, { desc: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm resize-none" rows={2} placeholder="Description" />
                        <input value={project.tags.join(", ")} onChange={e => updateProject(i, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Tags (comma separated)" />
                        <ImageDropZone label="Project Image" currentImage={project.image} onUpload={b64 => updateProject(i, { image: b64 })} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {tab === "certificates" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Certificates</h2>
                    <motion.button onClick={addCertificate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add</motion.button>
                  </div>
                  <div className="space-y-4">
                    {draft.certificates.map((cert, i) => (
                      <motion.div key={i} layout className="glass-card p-4 space-y-3 relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <button onClick={() => removeCertificate(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
                        <input value={cert.title} onChange={e => { if (!e.target.value.trim()) toast.error("Title cannot be empty"); updateCertificate(i, { title: e.target.value }); }} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold" placeholder="Certificate title *" />
                        <input value={cert.issuer} onChange={e => updateCertificate(i, { issuer: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Issuer (e.g. Coursera)" />
                        <input value={cert.link || ""} onChange={e => updateCertificate(i, { link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Link (optional)" />
                        <ImageDropZone label="Certificate Image" currentImage={cert.image} onUpload={b64 => updateCertificate(i, { image: b64 })} />
                      </motion.div>
                    ))}
                    {draft.certificates.length === 0 && (
                      <p className="text-sm text-muted-foreground font-mono py-8 text-center">No certificates yet. Click "Add" to create one.</p>
                    )}
                  </div>
                </>
              )}

              {tab === "greetings" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Greetings</h2>
                    <motion.button onClick={addGreeting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add</motion.button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Only one greeting can be active at a time. It will display as a banner on the website.</p>
                  <div className="space-y-4">
                    {draft.greetings.map((g, i) => (
                      <motion.div key={i} layout className={`glass-card p-4 space-y-3 relative ${g.active ? "border-primary/40" : ""}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm font-mono cursor-pointer">
                            <input type="checkbox" checked={g.active} onChange={e => updateGreeting(i, { active: e.target.checked })} className="accent-primary" />
                            <span className={g.active ? "text-primary" : "text-muted-foreground"}>{g.active ? "Active" : "Inactive"}</span>
                          </label>
                          <button onClick={() => removeGreeting(i)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
                        </div>
                        <input value={g.title} onChange={e => updateGreeting(i, { title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold" placeholder="Greeting title *" />
                        <textarea value={g.message} onChange={e => updateGreeting(i, { message: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm resize-none" rows={2} placeholder="Message" />
                        <ImageDropZone label="Greeting Image (optional)" currentImage={g.image} onUpload={b64 => updateGreeting(i, { image: b64 })} />
                      </motion.div>
                    ))}
                    {draft.greetings.length === 0 && (
                      <p className="text-sm text-muted-foreground font-mono py-8 text-center">No greetings yet. Add one to show a banner on your website.</p>
                    )}
                  </div>
                </>
              )}

              {tab === "sections" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Section Visibility</h2>
                  <p className="text-xs text-muted-foreground font-mono">Toggle sections on or off. Hidden sections won't appear on the website.</p>
                  <div className="space-y-2">
                    {(Object.keys(SECTION_LABELS) as Array<keyof SectionVisibility>).map(key => (
                      <div key={key} className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all">
                        <span className="text-sm font-mono text-foreground">{SECTION_LABELS[key]}</span>
                        <button
                          onClick={() => toggleSection(key)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${draft.sections[key] ? "bg-primary" : "bg-muted"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${draft.sections[key] ? "translate-x-5" : ""}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === "images" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Images</h2>
                  <ImageDropZone label="Profile Image" currentImage={draft.profileImage || undefined} onUpload={b64 => updateDraft({ profileImage: b64 })} />
                  <p className="text-xs text-muted-foreground font-mono mt-4">Project and certificate images can be uploaded in their respective tabs.</p>
                </>
              )}

              {tab === "history" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Version History</h2>
                    {history.length > 0 && (
                      <button onClick={() => { clearHistory(); toast.success("History cleared"); }} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={12} /> Clear</button>
                    )}
                  </div>
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-mono py-8 text-center">No history yet. Start editing to create snapshots.</p>
                  ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {history.map((entry, i) => (
                        <motion.div key={`${entry.timestamp}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all">
                          <div className="flex items-center gap-3">
                            <Clock size={14} className="text-muted-foreground" />
                            <div>
                              <p className="text-sm font-mono text-foreground">{entry.label}</p>
                              <p className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</p>
                            </div>
                          </div>
                          <motion.button onClick={() => { restoreFromHistory(i); toast.success("Snapshot restored to draft"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}>
                            <RotateCcw size={12} /> Restore
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground font-mono mt-2">Restoring a snapshot updates your draft only. Click "Publish" to make it live.</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
