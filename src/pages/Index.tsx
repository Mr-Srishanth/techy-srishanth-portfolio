import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
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
import AchievementsSection from "@/components/AchievementsSection";
import CertificatesSection from "@/components/CertificatesSection";
import ScrollToTop from "@/components/ScrollToTop";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";
import CustomCursor from "@/components/CustomCursor";
import SectionReveal from "@/components/SectionReveal";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import SpotlightGlow from "@/components/SpotlightGlow";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ScrollProgress />
          <ParticleBackground />
          <SpotlightGlow />
          <CommandPalette />
          <Navbar />
          <HeroSection />
          <SectionReveal>
            <AboutSection />
          </SectionReveal>
          <SectionReveal direction="left" delay={0.1}>
            <SkillsSection />
          </SectionReveal>
          <SectionReveal delay={0.05}>
            <SkillRadarChart />
          </SectionReveal>
          <SectionReveal direction="right" delay={0.1}>
            <ProjectsSection />
          </SectionReveal>
          <SectionReveal>
            <LearningJourneySection />
          </SectionReveal>
          <SectionReveal direction="left" delay={0.1}>
            <AchievementsSection />
          </SectionReveal>
          <SectionReveal>
            <CertificatesSection />
          </SectionReveal>
          <SectionReveal direction="right" delay={0.1}>
            <GitHubSection />
          </SectionReveal>
          <ScrollToTop />
          <KonamiEasterEgg />
          <CustomCursor />
          <SectionReveal>
            <ContactSection />
          </SectionReveal>
          <Footer />
        </motion.div>
      )}
    </>
  );
};

export default Index;
