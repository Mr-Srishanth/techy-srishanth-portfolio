import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export interface SkillData {
  id?: string;
  name: string;
  level: number;
  icon: string;
  logo?: string;
  upcoming?: boolean;
}

export interface ProjectData {
  id?: string;
  title: string;
  desc: string;
  tagline?: string;
  tags: string[];
  image?: string;
  live_url?: string;
  github_url?: string;
  doc_url?: string;
  problem?: string;
  solution?: string;
  impact?: string;
}

export interface CertificateData {
  id?: string;
  title: string;
  issuer: string;
  image?: string;
  link?: string;
}

export interface GreetingData {
  id?: string;
  title: string;
  message: string;
  image?: string;
  active: boolean;
}

export interface AchievementData {
  id?: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
  color: string;
  sort_order?: number;
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
  achievements: AchievementData[];
  sections: SectionVisibility;
  // Social links
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  email: string;
  resumeUrl: string;
}

export interface HistoryEntry {
  snapshot: PortfolioData;
  timestamp: number;
  label: string;
}

const DEFAULT_SECTIONS: SectionVisibility = {
  about: true, skills: true, skillRadar: true, rpgSkillTree: true, projects: true,
  timeline: true, learningJourney: true, achievements: true, certificates: true,
  github: true, contact: true,
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
  skills: [],
  projects: [],
  certificates: [],
  greetings: [],
  achievements: [],
  sections: { ...DEFAULT_SECTIONS },
  githubUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  email: "",
  resumeUrl: "",
};

const MAX_UNDO = 30;

interface PortfolioContextType {
  data: PortfolioData;
  draft: PortfolioData;
  loading: boolean;
  updateDraft: (partial: Partial<PortfolioData>) => void;
  savePermanently: () => Promise<void>;
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

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: dbData, loading, saveToDatabase, refetch } = usePortfolioData();
  const [draftOverride, setDraftOverride] = useState<PortfolioData | null>(null);
  const [undoStack, setUndoStack] = useState<PortfolioData[]>([]);
  const [redoStack, setRedoStack] = useState<PortfolioData[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const draftInitialized = useRef(false);

  const draft = draftOverride ?? dbData;

  if (!loading && !draftInitialized.current && dbData.heroName) {
    draftInitialized.current = true;
  }

  const updateDraft = useCallback((partial: Partial<PortfolioData>) => {
    setDraftOverride(prev => {
      const current = prev ?? dbData;
      setUndoStack(us => [...us.slice(-(MAX_UNDO - 1)), current]);
      setRedoStack([]);
      return { ...current, ...partial };
    });
  }, [dbData]);

  const savePermanently = useCallback(async () => {
    const toSave = draftOverride ?? dbData;
    await saveToDatabase(toSave);
    setHistory(prev => [{
      snapshot: { ...toSave },
      timestamp: Date.now(),
      label: "Published",
    }, ...prev].slice(0, 50));
    setDraftOverride(null);
  }, [draftOverride, dbData, saveToDatabase]);

  const resetData = useCallback(async () => {
    setDraftOverride(null);
    setUndoStack([]);
    setRedoStack([]);
    setHistory([]);
    await saveToDatabase(DEFAULT_DATA);
  }, [saveToDatabase]);

  const restoreFromHistory = useCallback((index: number) => {
    const entry = history[index];
    if (!entry) return;
    setUndoStack(us => [...us.slice(-(MAX_UNDO - 1)), draft]);
    setRedoStack([]);
    setDraftOverride({ ...DEFAULT_DATA, ...entry.snapshot });
  }, [history, draft]);

  const clearHistory = useCallback(() => { setHistory([]); }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(us => us.slice(0, -1));
    setRedoStack(rs => [...rs, draft]);
    setDraftOverride(prev);
  }, [undoStack, draft]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(rs => rs.slice(0, -1));
    setUndoStack(us => [...us, draft]);
    setDraftOverride(next);
  }, [redoStack, draft]);

  const visibleData = isPreview ? draft : dbData;

  return (
    <PortfolioContext.Provider value={{
      data: visibleData,
      draft,
      loading,
      updateDraft,
      savePermanently,
      resetData,
      history,
      restoreFromHistory,
      clearHistory,
      undo, redo,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      updateData: updateDraft,
      isPreview,
      setPreviewMode: setIsPreview,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export { DEFAULT_DATA, DEFAULT_SECTIONS };
