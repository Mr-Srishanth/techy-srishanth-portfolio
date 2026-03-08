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
import ScrollToTop from "@/components/ScrollToTop";

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
          <Navbar />
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <SkillRadarChart />
          <ProjectsSection />
          <LearningJourneySection />
          <AchievementsSection />
          <GitHubSection />
          <ScrollToTop />
          <ContactSection />
          <Footer />
        </motion.div>
      )}
    </>
  );
};

export default Index;
