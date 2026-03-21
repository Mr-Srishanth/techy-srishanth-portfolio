import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface SkillData {
  name: string;
  level: number;
  icon: string;
  logo?: string;
  upcoming?: boolean;
}

export interface ProjectData {
  title: string;
  desc: string;
  tags: string[];
  image?: string;
}

export interface CertificateData {
  title: string;
  issuer: string;
  image?: string;
  link?: string;
}

export interface GreetingData {
  title: string;
  message: string;
  image?: string;
  active: boolean;
}

export interface SectionVisibility {
  about: boolean;
  skills: boolean;
  skillRadar: boolean;
  rpgSkillTree: boolean;
  projects: boolean;
  timeline: boolean;
  learningJourney: boolean;
  achievements: boolean;
  certificates: boolean;
  github: boolean;
  contact: boolean;
}

export interface PortfolioData {
  heroName: string;
  heroSubtitle: string;
  heroBio: string;
  currentFocus: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  profileImage: string;
  skills: SkillData[];
  projects: ProjectData[];
  certificates: CertificateData[];
  greetings: GreetingData[];
  sections: SectionVisibility;
}

export interface HistoryEntry {
  snapshot: PortfolioData;
  timestamp: number;
  label: string;
}

const DEFAULT_SECTIONS: SectionVisibility = {
  about: true,
  skills: true,
  skillRadar: true,
  rpgSkillTree: true,
  projects: true,
  timeline: true,
  learningJourney: true,
  achievements: true,
  certificates: true,
  github: true,
  contact: true,
};

const DEFAULT_DATA: PortfolioData = {
  heroName: "Arrabola Srishanth",
  heroSubtitle: "AI & Software Developer",
  heroBio: "A passionate student pursuing B.Tech in CSE (AI & ML) at Vignan Institute of Technology and Science (2025–2029), building the future with code.",
  currentFocus: "Data Structures & Algorithms",
  aboutTitle: "Aspiring AI & Software Developer",
  aboutP1: "I'm Arrabola Srishanth, a first-year B.Tech student in Computer Science (AI & ML) at Vignan Institute of Technology and Science. I'm passionate about artificial intelligence, machine learning, and building software that makes a difference.",
  aboutP2: "Currently learning Python and Data Structures, I'm dedicated to mastering the foundations of computer science while exploring the exciting frontiers of AI technology.",
  profileImage: "",
  skills: [
    { name: "C Programming", level: 90, icon: "⚙️" },
    { name: "Python", level: 50, icon: "🐍" },
    { name: "Data Structures", level: 25, icon: "🏗️" },
    { name: "Machine Learning", level: 10, icon: "🤖" },
    { name: "React", level: 0, icon: "⚛️", upcoming: true },
    { name: "Git", level: 0, icon: "🧩", upcoming: true },
  ],
  projects: [
    { title: "Python Calculator", desc: "A feature-rich calculator built with Python, supporting basic and scientific operations.", tags: ["Python", "CLI"] },
    { title: "Student Management System", desc: "A CRUD application for managing student records with file handling.", tags: ["Python", "File I/O"] },
    { title: "Portfolio Website", desc: "This futuristic portfolio built with React, TypeScript, and Framer Motion.", tags: ["React", "TypeScript", "Framer Motion"] },
    { title: "DSA Practice Tracker", desc: "A tool to track progress on Data Structures and Algorithms problems.", tags: ["Python", "Data Structures"] },
  ],
  certificates: [
    { title: "Python Basics", issuer: "Coursera", link: "#" },
    { title: "Web Development", issuer: "freeCodeCamp", link: "#" },
    { title: "AI Fundamentals", issuer: "Google", link: "#" },
    { title: "Hackathon", issuer: "", image: "" },
  ],
  greetings: [],
  sections: { ...DEFAULT_SECTIONS },
};

const DRAFT_KEY = "portfolio-draft-data";
const PERMANENT_KEY = "portfolio-permanent-data";
const HISTORY_KEY = "portfolio-history-data";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...fallback, ...JSON.parse(raw) };
  } catch {}
  return fallback;
}

interface PortfolioContextType {
  data: PortfolioData;
  draft: PortfolioData;
  updateDraft: (partial: Partial<PortfolioData>) => void;
  savePermanently: () => void;
  resetData: () => void;
  history: HistoryEntry[];
  restoreFromHistory: (index: number) => void;
  clearHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateData: (partial: Partial<PortfolioData>) => void;
  isPreview: boolean;
  setPreviewMode: (v: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
};

const MAX_HISTORY = 50;
const MAX_UNDO = 30;

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permanent, setPermanent] = useState<PortfolioData>(() => loadJson(PERMANENT_KEY, DEFAULT_DATA));
  const [draft, setDraft] = useState<PortfolioData>(() => loadJson(DRAFT_KEY, loadJson(PERMANENT_KEY, DEFAULT_DATA)));
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { const raw = localStorage.getItem(HISTORY_KEY); if (raw) return JSON.parse(raw); } catch {} return [];
  });
  const [undoStack, setUndoStack] = useState<PortfolioData[]>([]);
  const [redoStack, setRedoStack] = useState<PortfolioData[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastDraftJson = useRef(JSON.stringify(draft));

  useEffect(() => {
    const currentJson = JSON.stringify(draft);
    if (currentJson === lastDraftJson.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, currentJson);
      const entry: HistoryEntry = { snapshot: JSON.parse(currentJson), timestamp: Date.now(), label: "Auto-save" };
      setHistory(prev => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
      lastDraftJson.current = currentJson;
    }, 2000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [draft]);

  useEffect(() => { localStorage.setItem(PERMANENT_KEY, JSON.stringify(permanent)); }, [permanent]);

  const updateDraft = useCallback((partial: Partial<PortfolioData>) => {
    setDraft(prev => {
      setUndoStack(us => [...us.slice(-(MAX_UNDO - 1)), prev]);
      setRedoStack([]);
      return { ...prev, ...partial };
    });
  }, []);

  const savePermanently = useCallback(() => { setPermanent(draft); }, [draft]);

  const resetData = useCallback(() => {
    setDraft(DEFAULT_DATA); setPermanent(DEFAULT_DATA); setHistory([]); setUndoStack([]); setRedoStack([]);
    localStorage.removeItem(DRAFT_KEY); localStorage.removeItem(PERMANENT_KEY); localStorage.removeItem(HISTORY_KEY);
  }, []);

  const restoreFromHistory = useCallback((index: number) => {
    const entry = history[index]; if (!entry) return;
    setUndoStack(us => [...us.slice(-(MAX_UNDO - 1)), draft]); setRedoStack([]);
    setDraft({ ...DEFAULT_DATA, ...entry.snapshot });
  }, [history, draft]);

  const clearHistory = useCallback(() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(us => us.slice(0, -1)); setRedoStack(rs => [...rs, draft]); setDraft(prev);
  }, [undoStack, draft]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(rs => rs.slice(0, -1)); setUndoStack(us => [...us, draft]); setDraft(next);
  }, [redoStack, draft]);

  return (
    <PortfolioContext.Provider value={{
      data: permanent, draft, updateDraft, savePermanently, resetData,
      history, restoreFromHistory, clearHistory,
      undo, redo, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0,
      updateData: updateDraft,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export { DEFAULT_DATA, DEFAULT_SECTIONS };
