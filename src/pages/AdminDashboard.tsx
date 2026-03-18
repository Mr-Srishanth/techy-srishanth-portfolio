import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, FileText, Wrench, FolderOpen, Image, Plus, X, Upload, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { usePortfolio, type SkillData, type ProjectData } from "@/contexts/PortfolioContext";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About", icon: FileText },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "images", label: "Images", icon: Image },
] as const;

type TabId = typeof TABS[number]["id"];

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
    reader.onload = () => {
      onUpload(reader.result as string);
      toast.success("Image uploaded");
    };
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
        <p className="text-sm text-muted-foreground font-mono">
          {dragging ? "Drop image here" : "Drag & drop or click to upload"}
        </p>
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

// ── Main Dashboard ──
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, updateData, resetData } = usePortfolio();
  const [tab, setTab] = useState<TabId>("profile");
  const [newSkill, setNewSkill] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSaveRef = useRef(JSON.stringify(data));

  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Auto-save toast
  useEffect(() => {
    const current = JSON.stringify(data);
    if (current === lastSaveRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      lastSaveRef.current = current;
      toast.success("Saved successfully");
    }, 2100); // slightly after the 2s context save
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [data]);

  const logout = () => {
    sessionStorage.removeItem("admin-auth");
    toast.success("Logged out");
    navigate("/admin");
  };

  const field = (label: string, value: string, key: keyof typeof data) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-sm font-mono text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={e => updateData({ [key]: e.target.value })}
        className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
      />
    </div>
  );

  const textArea = (label: string, value: string, key: keyof typeof data) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-sm font-mono text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={e => updateData({ [key]: e.target.value })}
        rows={4}
        className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
      />
    </div>
  );

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill: SkillData = { name: newSkill.trim(), level: 50, icon: "💡" };
    updateData({ skills: [...data.skills, skill] });
    setNewSkill("");
    toast.success(`Added "${skill.name}"`);
  };

  const removeSkill = (idx: number) => {
    const updated = data.skills.filter((_, i) => i !== idx);
    updateData({ skills: updated });
  };

  const updateSkill = (idx: number, partial: Partial<SkillData>) => {
    const updated = data.skills.map((s, i) => i === idx ? { ...s, ...partial } : s);
    updateData({ skills: updated });
  };

  const addProject = () => {
    const p: ProjectData = { title: "New Project", desc: "Description here", tags: [] };
    updateData({ projects: [...data.projects, p] });
  };

  const removeProject = (idx: number) => {
    updateData({ projects: data.projects.filter((_, i) => i !== idx) });
  };

  const updateProject = (idx: number, partial: Partial<ProjectData>) => {
    const updated = data.projects.map((p, i) => i === idx ? { ...p, ...partial } : p);
    updateData({ projects: updated });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-primary tracking-wider">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={resetData} className="text-xs font-mono text-muted-foreground hover:text-destructive transition-colors">Reset All</button>
            <motion.button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm font-mono"
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={14} /> Logout
            </motion.button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-6 relative z-10">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 space-y-1 hidden md:block">
          {TABS.map(t => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all ${tab === t.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
              whileTap={{ scale: 0.97 }}
            >
              <t.icon size={16} /> {t.label}
            </motion.button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 w-full absolute top-0 left-0 px-4 -mt-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-mono transition-all ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 space-y-6"
            >
              {tab === "profile" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Profile Info</h2>
                  {field("Display Name", data.heroName, "heroName")}
                  {field("Subtitle / Role", data.heroSubtitle, "heroSubtitle")}
                  {textArea("Bio", data.heroBio, "heroBio")}
                  {field("Current Focus", data.currentFocus, "currentFocus")}
                </>
              )}

              {tab === "about" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">About Section</h2>
                  {field("Section Title", data.aboutTitle, "aboutTitle")}
                  {textArea("Paragraph 1", data.aboutP1, "aboutP1")}
                  {textArea("Paragraph 2", data.aboutP2, "aboutP2")}
                </>
              )}

              {tab === "skills" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Skills</h2>
                  <div className="flex gap-2">
                    <input
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addSkill()}
                      placeholder="Add new skill..."
                      className="flex-1 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <motion.button
                      onClick={addSkill}
                      className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <motion.div
                        key={`${skill.name}-${i}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="group flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm"
                      >
                        <span className="text-foreground font-mono">{skill.name}</span>
                        <span className="text-primary text-xs">{skill.upcoming ? "Soon" : `${skill.level}%`}</span>
                        <button onClick={() => removeSkill(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-3 mt-4">
                    <p className="text-sm font-mono text-muted-foreground">Edit skill levels:</p>
                    {data.skills.map((skill, i) => (
                      <div key={`edit-${i}`} className="flex items-center gap-3">
                        <input
                          value={skill.name}
                          onChange={e => updateSkill(i, { name: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={skill.level}
                          onChange={e => updateSkill(i, { level: Number(e.target.value) })}
                          className="w-20 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm text-center"
                        />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={!!skill.upcoming}
                            onChange={e => updateSkill(i, { upcoming: e.target.checked })}
                            className="accent-primary"
                          />
                          Soon
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
                    <motion.button
                      onClick={addProject}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition-all"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={14} /> Add Project
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {data.projects.map((project, i) => (
                      <motion.div
                        key={i}
                        layout
                        className="glass-card p-4 space-y-3 relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
                          <X size={16} />
                        </button>
                        <input
                          value={project.title}
                          onChange={e => updateProject(i, { title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-semibold"
                          placeholder="Project title"
                        />
                        <textarea
                          value={project.desc}
                          onChange={e => updateProject(i, { desc: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm resize-none"
                          rows={2}
                          placeholder="Description"
                        />
                        <input
                          value={project.tags.join(", ")}
                          onChange={e => updateProject(i, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm"
                          placeholder="Tags (comma separated)"
                        />
                        <ImageDropZone
                          label="Project Image"
                          currentImage={project.image}
                          onUpload={b64 => updateProject(i, { image: b64 })}
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {tab === "images" && (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Images</h2>
                  <ImageDropZone
                    label="Profile Image"
                    currentImage={data.profileImage || undefined}
                    onUpload={b64 => updateData({ profileImage: b64 })}
                  />
                  <p className="text-xs text-muted-foreground font-mono mt-4">
                    Project images can be uploaded in the Projects tab.
                  </p>
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
