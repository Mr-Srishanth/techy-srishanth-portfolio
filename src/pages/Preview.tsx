import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

// Import actual site components
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubSection from "@/components/GitHubSection";
import LearningJourneySection from "@/components/LearningJourneySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SkillRadarChart from "@/components/SkillRadarChart";
import RPGSkillTree from "@/components/RPGSkillTree";
import TimeMachineTimeline from "@/components/TimeMachineTimeline";
import AchievementsSection from "@/components/AchievementsSection";
import CertificatesSection from "@/components/CertificatesSection";
import ScrollToTop from "@/components/ScrollToTop";
import SectionReveal from "@/components/SectionReveal";
import GenerativeArtBackground from "@/components/GenerativeArtBackground";
import ScrollProgress from "@/components/ScrollProgress";
import SpotlightGlow from "@/components/SpotlightGlow";

const Preview = () => {
  const navigate = useNavigate();
  const { draft, setPreviewMode } = usePortfolio();
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    setPreviewMode(true);
    return () => setPreviewMode(false);
  }, [setPreviewMode]);

  const s = draft.sections ?? {
    about: true, skills: true, skillRadar: true, rpgSkillTree: true,
    projects: true, timeline: true, learningJourney: true,
    achievements: true, certificates: true, github: true, contact: true,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Preview Toolbar */}
      <div className="fixed top-0 inset-x-0 z-[70] bg-primary/95 backdrop-blur-lg text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors text-sm font-mono"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={14} /> Back to Edit
            </motion.button>
            <span className="text-xs font-mono opacity-70 hidden sm:inline">PREVIEW MODE — Showing draft data</span>
          </div>

          <div className="flex items-center gap-1 bg-primary-foreground/10 rounded-lg p-0.5">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-md transition-colors ${viewport === "desktop" ? "bg-primary-foreground/25" : "hover:bg-primary-foreground/10"}`}
              title="Desktop view"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-md transition-colors ${viewport === "mobile" ? "bg-primary-foreground/25" : "hover:bg-primary-foreground/10"}`}
              title="Mobile view"
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="pt-12">
        <div
          className={`mx-auto transition-all duration-500 ease-out ${
            viewport === "mobile"
              ? "max-w-[390px] shadow-2xl border-x border-border/50"
              : "w-full"
          }`}
          style={{ minHeight: "calc(100vh - 3rem)" }}
        >
          <div className="relative bg-background overflow-hidden">
            <ScrollProgress />
            <GenerativeArtBackground />
            <SpotlightGlow />
            <Navbar />
            <HeroSection />
            {s.about && <SectionReveal><AboutSection /></SectionReveal>}
            {s.skills && <SectionReveal direction="left" delay={0.1}><SkillsSection /></SectionReveal>}
            {s.skillRadar && <SectionReveal delay={0.05}><SkillRadarChart /></SectionReveal>}
            {s.rpgSkillTree && <SectionReveal direction="left" delay={0.1}><RPGSkillTree /></SectionReveal>}
            {s.projects && <SectionReveal direction="right" delay={0.1}><ProjectsSection /></SectionReveal>}
            {s.timeline && <SectionReveal parallax={false}><TimeMachineTimeline /></SectionReveal>}
            {s.learningJourney && <SectionReveal><LearningJourneySection /></SectionReveal>}
            {s.achievements && <SectionReveal direction="left" delay={0.1}><AchievementsSection /></SectionReveal>}
            {s.certificates && <SectionReveal><CertificatesSection /></SectionReveal>}
            {s.github && <SectionReveal direction="right" delay={0.1}><GitHubSection /></SectionReveal>}
            <ScrollToTop />
            {s.contact && <SectionReveal><ContactSection /></SectionReveal>}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
