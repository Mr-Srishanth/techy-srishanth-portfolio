import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, User, FileText, Wrench, FolderOpen, Image, Plus, X, Upload,
  ArrowLeft, Save, Undo2, Redo2, Eye, History, Clock, RotateCcw, Trash2,
  Award, MessageSquare, LayoutGrid, AlertCircle, GripVertical, Search,
  BarChart3, Sun, Moon, Trophy, Link2
} from "lucide-react";
import { toast } from "sonner";
import { usePortfolio, type SkillData, type ProjectData, type CertificateData, type GreetingData, type AchievementData, type SectionVisibility } from "@/contexts/PortfolioContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Analytics ──
const ANALYTICS_KEY = "portfolio-analytics";
interface AnalyticsData { visits: number; lastUpdate: number; }
function getAnalytics(): AnalyticsData { try { const raw = localStorage.getItem(ANALYTICS_KEY); if (raw) return JSON.parse(raw); } catch {} return { visits: 0, lastUpdate: 0 }; }
function bumpVisit() { const a = getAnalytics(); a.visits += 1; localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a)); }
function setLastUpdate() { const a = getAnalytics(); a.lastUpdate = Date.now(); localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a)); }
bumpVisit();

// ── Admin theme ──
const ADMIN_THEME_KEY = "admin-theme";
function getAdminTheme(): "dark" | "light" { return (localStorage.getItem(ADMIN_THEME_KEY) as "dark" | "light") || "dark"; }

// ── Tabs ──
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About", icon: FileText },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "greetings", label: "Greetings", icon: MessageSquare },
  { id: "sections", label: "Sections", icon: LayoutGrid },
  { id: "images", label: "Images", icon: Image },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "history", label: "History", icon: History },
] as const;
type TabId = typeof TABS[number]["id"];

// ── Validation ──
const validateNotEmpty = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} cannot be empty`;
  return null;
};
const FieldError = ({ error }: { error: string | null }) => {
  if (!error) return null;
  return <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle size={12} /> {error}</p>;
};

// ── Image drop zone with Storage upload ──
const ImageDropZone = ({ label, currentImage, onUpload, folder = "general" }: { label: string; currentImage?: string; onUpload: (url: string) => void; folder?: string }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) { toast.error("Only JPG/PNG files are accepted"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onUpload(url);
      toast.success("Image uploaded to cloud storage");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-mono text-muted-foreground">{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${dragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-border hover:border-primary/50 bg-secondary/20"} ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => handleFiles(e.target.files)} />
        {uploading ? (
          <motion.div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-2" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        ) : (
          <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground font-mono">{uploading ? "Uploading..." : dragging ? "Drop image here" : "Drag & drop or click to upload"}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG only (max 5MB)</p>
      </div>
      {currentImage && (
        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-border">
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

// ── Sortable item wrapper ──
const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button {...attributes} {...listeners} className="absolute left-2 top-3 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing z-10" title="Drag to reorder"><GripVertical size={16} /></button>
      <div className="pl-8">{children}</div>
    </div>
  );
};

// ── Section labels ──
const SECTION_LABELS: Record<keyof SectionVisibility, string> = {
  about: "About", skills: "Skills", skillRadar: "Skill Radar Chart", rpgSkillTree: "RPG Skill Tree",
  projects: "Projects", timeline: "Time Machine Timeline", learningJourney: "Learning Journey",
  achievements: "Achievements", certificates: "Certificates", github: "GitHub", contact: "Contact",
};

// ── Main Dashboard ──
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { draft, updateDraft, savePermanently, resetData, history, restoreFromHistory, clearHistory, undo, redo, canUndo, canRedo } = usePortfolio();
  const [tab, setTab] = useState<TabId>("profile");
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [adminTheme, setAdminTheme] = useState<"dark" | "light">(getAdminTheme);
  const [analytics, setAnalytics] = useState<AnalyticsData>(getAnalytics);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSaveRef = useRef(JSON.stringify(draft));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem(ADMIN_THEME_KEY, adminTheme);
    if (adminTheme === "light") document.documentElement.classList.add("admin-light");
    else document.documentElement.classList.remove("admin-light");
    return () => { document.documentElement.classList.remove("admin-light"); };
  }, [adminTheme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session) navigate("/admin"); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) navigate("/admin"); });
    return () => subscription.unsubscribe();
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

  useEffect(() => {
    const interval = setInterval(() => setAnalytics(getAnalytics()), 5000);
    return () => clearInterval(interval);
  }, []);

  const logout = async () => { await supabase.auth.signOut(); toast.success("Logged out"); navigate("/admin"); };

  const [publishing, setPublishing] = useState(false);
  const handleSavePermanently = async () => {
    const nameErr = validateNotEmpty(draft.heroName, "Name");
    const subtitleErr = validateNotEmpty(draft.heroSubtitle, "Subtitle");
    if (nameErr || subtitleErr) { setErrors({ heroName: nameErr, heroSubtitle: subtitleErr }); toast.error("Please fix validation errors before publishing"); setTab("profile"); return; }
    setErrors({});
    setPublishing(true);
    try { await savePermanently(); setLastUpdate(); setAnalytics(getAnalytics()); toast.success("Published to database — live everywhere!"); }
    catch (err) { console.error(err); toast.error("Failed to publish. Please try again."); }
    finally { setPublishing(false); }
  };

  const setFieldError = (key: string, value: string) => { setErrors(prev => ({ ...prev, [key]: validateNotEmpty(value, key) })); };
  const toggleAdminTheme = () => setAdminTheme(prev => prev === "dark" ? "light" : "dark");

  const field = (label: string, value: string, key: keyof typeof draft, required = false) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-sm font-mono text-muted-foreground">{label}{required && <span className="text-destructive ml-1">*</span>}</label>
      <input value={value} onChange={e => { updateDraft({ [key]: e.target.value }); if (required) setFieldError(key, e.target.value); }} className={`w-full px-4 py-2.5 rounded-lg bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm ${errors[key] ? "border-destructive" : "border-border"}`} />
      {required && <FieldError error={errors[key] ?? null} />}
    </div>
  );

  const textArea = (label: string, value: string, key: keyof typeof draft) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-sm font-mono text-muted-foreground">{label}</label>
      <textarea value={value} onChange={e => updateDraft({ [key]: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none" />
    </div>
  );

  // CRUD helpers
  const addSkill = () => { if (!newSkill.trim()) { toast.error("Skill name cannot be empty"); return; } updateDraft({ skills: [...draft.skills, { name: newSkill.trim(), level: 50, icon: "💡" }] }); setNewSkill(""); toast.success(`Added "${newSkill.trim()}"`); };
  const removeSkill = (idx: number) => updateDraft({ skills: draft.skills.filter((_, i) => i !== idx) });
  const updateSkill = (idx: number, partial: Partial<SkillData>) => updateDraft({ skills: draft.skills.map((s, i) => i === idx ? { ...s, ...partial } : s) });

  const addProject = () => updateDraft({ projects: [...draft.projects, { title: "New Project", desc: "Description here", tags: [], live_url: "", github_url: "" }] });
  const removeProject = (idx: number) => updateDraft({ projects: draft.projects.filter((_, i) => i !== idx) });
  const updateProject = (idx: number, partial: Partial<ProjectData>) => updateDraft({ projects: draft.projects.map((p, i) => i === idx ? { ...p, ...partial } : p) });

  const addCertificate = () => updateDraft({ certificates: [...draft.certificates, { title: "", issuer: "", image: "", link: "" }] });
  const removeCertificate = (idx: number) => updateDraft({ certificates: draft.certificates.filter((_, i) => i !== idx) });
  const updateCertificate = (idx: number, partial: Partial<CertificateData>) => updateDraft({ certificates: draft.certificates.map((c, i) => i === idx ? { ...c, ...partial } : c) });

  const addGreeting = () => updateDraft({ greetings: [...draft.greetings, { title: "", message: "", image: "", active: false }] });
  const removeGreeting = (idx: number) => updateDraft({ greetings: draft.greetings.filter((_, i) => i !== idx) });
  const updateGreeting = (idx: number, partial: Partial<GreetingData>) => {
    let updated = draft.greetings.map((g, i) => i === idx ? { ...g, ...partial } : g);
    if (partial.active) updated = updated.map((g, i) => ({ ...g, active: i === idx }));
    updateDraft({ greetings: updated });
  };

  const addAchievement = () => updateDraft({ achievements: [...draft.achievements, { title: "New Achievement", description: "", icon: "🏆", color: "text-primary" }] });
  const removeAchievement = (idx: number) => updateDraft({ achievements: draft.achievements.filter((_, i) => i !== idx) });
  const updateAchievement = (idx: number, partial: Partial<AchievementData>) => updateDraft({ achievements: draft.achievements.map((a, i) => i === idx ? { ...a, ...partial } : a) });

  const toggleSection = (key: keyof SectionVisibility) => updateDraft({ sections: { ...draft.sections, [key]: !draft.sections[key] } });

  // DnD handlers
  const handleSkillDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { const oldIdx = draft.skills.findIndex((_, i) => `skill-${i}` === active.id); const newIdx = draft.skills.findIndex((_, i) => `skill-${i}` === over.id); if (oldIdx !== -1 && newIdx !== -1) updateDraft({ skills: arrayMove(draft.skills, oldIdx, newIdx) }); } };
  const handleProjectDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { const oldIdx = draft.projects.findIndex((_, i) => `project-${i}` === active.id); const newIdx = draft.projects.findIndex((_, i) => `project-${i}` === over.id); if (oldIdx !== -1 && newIdx !== -1) updateDraft({ projects: arrayMove(draft.projects, oldIdx, newIdx) }); } };
  const handleCertDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { const oldIdx = draft.certificates.findIndex((_, i) => `cert-${i}` === active.id); const newIdx = draft.certificates.findIndex((_, i) => `cert-${i}` === over.id); if (oldIdx !== -1 && newIdx !== -1) updateDraft({ certificates: arrayMove(draft.certificates, oldIdx, newIdx) }); } };
  const handleAchievementDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { const oldIdx = draft.achievements.findIndex((_, i) => `ach-${i}` === active.id); const newIdx = draft.achievements.findIndex((_, i) => `ach-${i}` === over.id); if (oldIdx !== -1 && newIdx !== -1) updateDraft({ achievements: arrayMove(draft.achievements, oldIdx, newIdx) }); } };

  // Search filtering
  const q = searchQuery.toLowerCase();
  const filteredSkills = useMemo(() => q ? draft.skills.map((s, i) => ({ s, i })).filter(({ s }) => s.name.toLowerCase().includes(q)) : draft.skills.map((s, i) => ({ s, i })), [draft.skills, q]);
  const filteredProjects = useMemo(() => q ? draft.projects.map((p, i) => ({ p, i })).filter(({ p }) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))) : draft.projects.map((p, i) => ({ p, i })), [draft.projects, q]);
  const filteredCerts = useMemo(() => q ? draft.certificates.map((c, i) => ({ c, i })).filter(({ c }) => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)) : draft.certificates.map((c, i) => ({ c, i })), [draft.certificates, q]);

  const formatTime = (ts: number) => ts ? new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "Never";

  const showSearch = ["skills", "projects", "certificates"].includes(tab);

  return (
    <div className={`min-h-screen ${adminTheme === "light" ? "bg-gray-50 text-gray-900" : "bg-background"}`}>
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b border-border/50 ${adminTheme === "light" ? "bg-white/80" : "bg-background/80"}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-sm font-mono" whileTap={{ scale: 0.95 }}><ArrowLeft size={16} /> Back</motion.button>
            <h1 className="font-display text-lg font-bold text-primary tracking-wider hidden sm:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button onClick={toggleAdminTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all" whileTap={{ scale: 0.95 }} title="Toggle admin theme">{adminTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</motion.button>
            <motion.button onClick={undo} disabled={!canUndo} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed" whileTap={{ scale: 0.95 }} title="Undo (Ctrl+Z)"><Undo2 size={16} /></motion.button>
            <motion.button onClick={redo} disabled={!canRedo} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed" whileTap={{ scale: 0.95 }} title="Redo (Ctrl+Y)"><Redo2 size={16} /></motion.button>
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
            <motion.button onClick={() => window.open("/preview", "_blank")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-all text-sm font-mono" whileTap={{ scale: 0.95 }}><Eye size={14} /> Preview</motion.button>
            <motion.button onClick={handleSavePermanently} disabled={publishing} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm neon-glow disabled:opacity-50" whileTap={{ scale: 0.95 }}><Save size={14} /> {publishing ? "Publishing..." : "Publish"}</motion.button>
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
          {showSearch && (
            <div className="mb-4 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search items..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono" />
              {searchQuery && (<button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={14} /></button>)}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className={`glass-card p-6 space-y-6 ${adminTheme === "light" ? "!bg-white/80 !border-gray-200" : ""}`}>

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

              {tab === "social" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Social Links & Contact</h2>
                  <p className="text-xs text-muted-foreground font-mono">These are shown in the Contact section and used for CTA buttons.</p>
                  {field("GitHub URL", draft.githubUrl, "githubUrl")}
                  {field("LinkedIn URL", draft.linkedinUrl, "linkedinUrl")}
                  {field("Instagram URL", draft.instagramUrl, "instagramUrl")}
                  {field("Email", draft.email, "email")}
                  {field("Resume URL", draft.resumeUrl, "resumeUrl")}
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
                    {filteredSkills.map(({ s: skill, i }) => (
                      <motion.div key={`${skill.name}-${i}`} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="group flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                        <span className="text-foreground font-mono">{skill.name}</span>
                        <span className="text-primary text-xs">{skill.upcoming ? "Soon" : `${skill.level}%`}</span>
                        <button onClick={() => removeSkill(i)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Drag to reorder. Edit levels below.</p>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSkillDragEnd}>
                    <SortableContext items={draft.skills.map((_, i) => `skill-${i}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {(q ? filteredSkills : draft.skills.map((s, i) => ({ s, i }))).map(({ s: skill, i }) => (
                          <SortableItem key={`skill-${i}`} id={`skill-${i}`}>
                            <div className="flex items-center gap-3">
                              <input value={skill.name} onChange={e => updateSkill(i, { name: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" />
                              <input type="number" min={0} max={100} value={skill.level} onChange={e => updateSkill(i, { level: Number(e.target.value) })} className="w-20 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm text-center" />
                              <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={!!skill.upcoming} onChange={e => updateSkill(i, { upcoming: e.target.checked })} className="accent-primary" /> Soon</label>
                            </div>
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}

              {tab === "projects" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Projects</h2>
                    <motion.button onClick={addProject} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add</motion.button>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
                    <SortableContext items={draft.projects.map((_, i) => `project-${i}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {filteredProjects.map(({ p: project, i }) => (
                          <SortableItem key={`project-${i}`} id={`project-${i}`}>
                            <div className="glass-card p-4 space-y-3 relative">
                              <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
                              <input value={project.title} onChange={e => updateProject(i, { title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold" placeholder="Project title" />
                              <textarea value={project.desc} onChange={e => updateProject(i, { desc: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm resize-none" rows={2} placeholder="Description" />
                              <input value={project.tags.join(", ")} onChange={e => updateProject(i, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Tags (comma separated)" />
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-xs font-mono text-muted-foreground">Live URL</label>
                                  <input value={project.live_url || ""} onChange={e => updateProject(i, { live_url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="https://..." />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-mono text-muted-foreground">GitHub URL</label>
                                  <input value={project.github_url || ""} onChange={e => updateProject(i, { github_url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="https://github.com/..." />
                                </div>
                              </div>
                              <ImageDropZone label="Project Image" currentImage={project.image} onUpload={url => updateProject(i, { image: url })} folder="projects" />
                            </div>
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}

              {tab === "certificates" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Certificates</h2>
                    <motion.button onClick={addCertificate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add</motion.button>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCertDragEnd}>
                    <SortableContext items={draft.certificates.map((_, i) => `cert-${i}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {filteredCerts.map(({ c: cert, i }) => (
                          <SortableItem key={`cert-${i}`} id={`cert-${i}`}>
                            <div className="glass-card p-4 space-y-3 relative">
                              <button onClick={() => removeCertificate(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
                              <input value={cert.title} onChange={e => { if (!e.target.value.trim()) toast.error("Title cannot be empty"); updateCertificate(i, { title: e.target.value }); }} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold" placeholder="Certificate title *" />
                              <input value={cert.issuer} onChange={e => updateCertificate(i, { issuer: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Issuer (e.g. Coursera)" />
                              <input value={cert.link || ""} onChange={e => updateCertificate(i, { link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Link (optional)" />
                              <ImageDropZone label="Certificate Image" currentImage={cert.image} onUpload={url => updateCertificate(i, { image: url })} folder="certificates" />
                            </div>
                          </SortableItem>
                        ))}
                        {draft.certificates.length === 0 && <p className="text-sm text-muted-foreground font-mono py-8 text-center">No certificates yet.</p>}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}

              {tab === "achievements" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Achievements</h2>
                    <motion.button onClick={addAchievement} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add</motion.button>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAchievementDragEnd}>
                    <SortableContext items={draft.achievements.map((_, i) => `ach-${i}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {draft.achievements.map((a, i) => (
                          <SortableItem key={`ach-${i}`} id={`ach-${i}`}>
                            <div className="glass-card p-4 space-y-3 relative">
                              <button onClick={() => removeAchievement(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
                              <div className="grid grid-cols-[auto_1fr] gap-3">
                                <div className="space-y-1">
                                  <label className="text-xs font-mono text-muted-foreground">Icon</label>
                                  <input value={a.icon} onChange={e => updateAchievement(i, { icon: e.target.value })} className="w-16 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm text-center" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-mono text-muted-foreground">Title</label>
                                  <input value={a.title} onChange={e => updateAchievement(i, { title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold" placeholder="Achievement title" />
                                </div>
                              </div>
                              <textarea value={a.description} onChange={e => updateAchievement(i, { description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm resize-none" rows={2} placeholder="Description" />
                              <input value={a.link || ""} onChange={e => updateAchievement(i, { link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm" placeholder="Link (optional)" />
                            </div>
                          </SortableItem>
                        ))}
                        {draft.achievements.length === 0 && <p className="text-sm text-muted-foreground font-mono py-8 text-center">No achievements yet. Add your milestones!</p>}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}

              {tab === "greetings" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Greetings</h2>
                    <motion.button onClick={addGreeting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><Plus size={14} /> Add</motion.button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Only one greeting can be active at a time.</p>
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
                        <ImageDropZone label="Greeting Image (optional)" currentImage={g.image} onUpload={url => updateGreeting(i, { image: url })} folder="greetings" />
                      </motion.div>
                    ))}
                    {draft.greetings.length === 0 && <p className="text-sm text-muted-foreground font-mono py-8 text-center">No greetings yet.</p>}
                  </div>
                </>
              )}

              {tab === "sections" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Section Visibility</h2>
                  <p className="text-xs text-muted-foreground font-mono">Toggle sections on or off.</p>
                  <div className="space-y-2">
                    {(Object.keys(SECTION_LABELS) as Array<keyof SectionVisibility>).map(key => (
                      <div key={key} className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all">
                        <span className="text-sm font-mono text-foreground">{SECTION_LABELS[key]}</span>
                        <button onClick={() => toggleSection(key)} className={`relative w-11 h-6 rounded-full transition-colors ${draft.sections[key] ? "bg-primary" : "bg-muted"}`}>
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
                  <ImageDropZone label="Profile Image" currentImage={draft.profileImage || undefined} onUpload={url => updateDraft({ profileImage: url })} folder="profile" />
                  <p className="text-xs text-muted-foreground font-mono mt-4">Project and certificate images can be uploaded in their respective tabs.</p>
                </>
              )}

              {tab === "analytics" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Analytics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card p-6 text-center space-y-2">
                      <BarChart3 size={28} className="mx-auto text-primary" />
                      <p className="text-3xl font-display font-bold text-foreground">{analytics.visits}</p>
                      <p className="text-xs text-muted-foreground font-mono">Admin Visits</p>
                    </div>
                    <div className="glass-card p-6 text-center space-y-2">
                      <Clock size={28} className="mx-auto text-primary" />
                      <p className="text-sm font-mono font-bold text-foreground">{formatTime(analytics.lastUpdate)}</p>
                      <p className="text-xs text-muted-foreground font-mono">Last Published</p>
                    </div>
                  </div>
                  <div className="glass-card p-4 space-y-2">
                    <p className="text-sm font-mono text-muted-foreground">Content Summary</p>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div><p className="text-xl font-bold text-foreground">{draft.skills.length}</p><p className="text-xs text-muted-foreground">Skills</p></div>
                      <div><p className="text-xl font-bold text-foreground">{draft.projects.length}</p><p className="text-xs text-muted-foreground">Projects</p></div>
                      <div><p className="text-xl font-bold text-foreground">{draft.certificates.length}</p><p className="text-xs text-muted-foreground">Certificates</p></div>
                      <div><p className="text-xl font-bold text-foreground">{draft.achievements.length}</p><p className="text-xs text-muted-foreground">Achievements</p></div>
                    </div>
                  </div>
                </>
              )}

              {tab === "history" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-foreground">Version History</h2>
                    {history.length > 0 && (<button onClick={() => { clearHistory(); toast.success("History cleared"); }} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={12} /> Clear</button>)}
                  </div>
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-mono py-8 text-center">No history yet.</p>
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
                          <motion.button onClick={() => { restoreFromHistory(i); toast.success("Snapshot restored to draft"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-mono hover:bg-primary/20 transition-all" whileTap={{ scale: 0.95 }}><RotateCcw size={12} /> Restore</motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground font-mono mt-2">Restoring updates draft only. Click "Publish" to go live.</p>
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
