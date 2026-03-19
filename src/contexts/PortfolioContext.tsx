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
}

export interface HistoryEntry {
  snapshot: PortfolioData;
  timestamp: number;
  label: string;
}

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
};

const DRAFT_KEY = "portfolio-draft-data";
const PERMANENT_KEY = "portfolio-permanent-data";
const HISTORY_KEY = "portfolio-history-data";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

interface PortfolioContextType {
  /** The live data used by the website (permanent or default) */
  data: PortfolioData;
  /** The draft data used in admin editing */
  draft: PortfolioData;
  /** Update draft data */
  updateDraft: (partial: Partial<PortfolioData>) => void;
  /** Save draft → permanent */
  savePermanently: () => void;
  /** Reset everything to defaults */
  resetData: () => void;
  /** Version history */
  history: HistoryEntry[];
  /** Restore a history snapshot into draft */
  restoreFromHistory: (index: number) => void;
  /** Clear history */
  clearHistory: () => void;
  /** Undo */
  undo: () => void;
  /** Redo */
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** Legacy compat */
  updateData: (partial: Partial<PortfolioData>) => void;
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
  // Permanent data is what the website shows
  const [permanent, setPermanent] = useState<PortfolioData>(() => {
    return loadJson(PERMANENT_KEY, DEFAULT_DATA);
  });

  // Draft data is what admin edits
  const [draft, setDraft] = useState<PortfolioData>(() => {
    return loadJson(DRAFT_KEY, permanent);
  });

  // Version history
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    return loadJson(HISTORY_KEY, []);
  });

  // Undo/redo stacks
  const [undoStack, setUndoStack] = useState<PortfolioData[]>([]);
  const [redoStack, setRedoStack] = useState<PortfolioData[]>([]);

  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastDraftJson = useRef(JSON.stringify(draft));

  // Auto-save draft with 2s debounce + push history snapshot
  useEffect(() => {
    const currentJson = JSON.stringify(draft);
    if (currentJson === lastDraftJson.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, currentJson);

      // Push history snapshot
      const entry: HistoryEntry = {
        snapshot: JSON.parse(currentJson),
        timestamp: Date.now(),
        label: `Auto-save`,
      };
      setHistory(prev => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });

      lastDraftJson.current = currentJson;
    }, 2000);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [draft]);

  // Save permanent data when it changes
  useEffect(() => {
    localStorage.setItem(PERMANENT_KEY, JSON.stringify(permanent));
  }, [permanent]);

  const updateDraft = useCallback((partial: Partial<PortfolioData>) => {
    setDraft(prev => {
      // Push current state to undo stack
      setUndoStack(us => [...us.slice(-(MAX_UNDO - 1)), prev]);
      setRedoStack([]);
      return { ...prev, ...partial };
    });
  }, []);

  const savePermanently = useCallback(() => {
    setPermanent(draft);
  }, [draft]);

  const resetData = useCallback(() => {
    setDraft(DEFAULT_DATA);
    setPermanent(DEFAULT_DATA);
    setHistory([]);
    setUndoStack([]);
    setRedoStack([]);
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(PERMANENT_KEY);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const restoreFromHistory = useCallback((index: number) => {
    const entry = history[index];
    if (!entry) return;
    setUndoStack(us => [...us.slice(-(MAX_UNDO - 1)), draft]);
    setRedoStack([]);
    setDraft(entry.snapshot);
  }, [history, draft]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(us => us.slice(0, -1));
    setRedoStack(rs => [...rs, draft]);
    setDraft(prev);
  }, [undoStack, draft]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(rs => rs.slice(0, -1));
    setUndoStack(us => [...us, draft]);
    setDraft(next);
  }, [redoStack, draft]);

  return (
    <PortfolioContext.Provider value={{
      data: permanent,
      draft,
      updateDraft,
      savePermanently,
      resetData,
      history,
      restoreFromHistory,
      clearHistory,
      undo,
      redo,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      // Legacy compat: updateData maps to updateDraft
      updateData: updateDraft,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export { DEFAULT_DATA };
