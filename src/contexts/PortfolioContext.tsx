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

const STORAGE_KEY = "portfolio-data";

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_DATA, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_DATA;
  });

  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Auto-save with 2s debounce
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 2000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data]);

  const updateData = useCallback((partial: Partial<PortfolioData>) => {
    setData(prev => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    setData(DEFAULT_DATA);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export { DEFAULT_DATA };
