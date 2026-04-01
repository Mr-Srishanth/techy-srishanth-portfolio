import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { PortfolioData, SkillData, ProjectData, CertificateData, GreetingData, SectionVisibility } from "@/contexts/PortfolioContext";

// Map DB rows to app types
function mapSkill(row: Tables<"skills">): SkillData & { id: string } {
  return { id: row.id, name: row.name, level: row.level, icon: row.icon, logo: row.logo ?? undefined, upcoming: row.upcoming };
}

function mapProject(row: Tables<"projects">): ProjectData & { id: string } {
  return { id: row.id, title: row.title, desc: row.description, tags: row.tags, image: row.image ?? undefined };
}

function mapCertificate(row: Tables<"certificates">): CertificateData & { id: string } {
  return { id: row.id, title: row.title, issuer: row.issuer, image: row.image ?? undefined, link: row.link ?? undefined };
}

function mapGreeting(row: Tables<"greetings">): GreetingData & { id: string } {
  return { id: row.id, title: row.title, message: row.message, image: row.image ?? undefined, active: row.active };
}

function mapSections(row: Tables<"section_visibility">): SectionVisibility {
  return {
    about: row.about, skills: row.skills, skillRadar: row.skill_radar,
    rpgSkillTree: row.rpg_skill_tree, projects: row.projects, timeline: row.timeline,
    learningJourney: row.learning_journey, achievements: row.achievements,
    certificates: row.certificates, github: row.github, contact: row.contact,
  };
}

const DEFAULT_SECTIONS: SectionVisibility = {
  about: true, skills: true, skillRadar: true, rpgSkillTree: true, projects: true,
  timeline: true, learningJourney: true, achievements: true, certificates: true,
  github: true, contact: true,
};

const DEFAULT_DATA: PortfolioData = {
  heroName: "Arrabola Srishanth",
  heroSubtitle: "AI & Software Developer",
  heroBio: "",
  currentFocus: "Data Structures & Algorithms",
  aboutTitle: "Aspiring AI & Software Developer",
  aboutP1: "", aboutP2: "", profileImage: "",
  skills: [], projects: [], certificates: [], greetings: [],
  sections: { ...DEFAULT_SECTIONS },
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [contentId, setContentId] = useState<string | null>(null);
  const [sectionsId, setSectionsId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [contentRes, skillsRes, projectsRes, certsRes, greetingsRes, sectionsRes] = await Promise.all([
        supabase.from("portfolio_content").select("*").limit(1).single(),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("certificates").select("*").order("sort_order"),
        supabase.from("greetings").select("*"),
        supabase.from("section_visibility").select("*").limit(1).single(),
      ]);

      const content = contentRes.data;
      const sections = sectionsRes.data;

      if (content) setContentId(content.id);
      if (sections) setSectionsId(sections.id);

      setData({
        heroName: content?.hero_name ?? DEFAULT_DATA.heroName,
        heroSubtitle: content?.hero_subtitle ?? DEFAULT_DATA.heroSubtitle,
        heroBio: content?.hero_bio ?? DEFAULT_DATA.heroBio,
        currentFocus: content?.current_focus ?? DEFAULT_DATA.currentFocus,
        aboutTitle: content?.about_title ?? DEFAULT_DATA.aboutTitle,
        aboutP1: content?.about_p1 ?? DEFAULT_DATA.aboutP1,
        aboutP2: content?.about_p2 ?? DEFAULT_DATA.aboutP2,
        profileImage: content?.profile_image ?? "",
        skills: (skillsRes.data ?? []).map(mapSkill),
        projects: (projectsRes.data ?? []).map(mapProject),
        certificates: (certsRes.data ?? []).map(mapCertificate),
        greetings: (greetingsRes.data ?? []).map(mapGreeting),
        sections: sections ? mapSections(sections) : { ...DEFAULT_SECTIONS },
      });
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Real-time subscriptions for public visitors
  useEffect(() => {
    const channel = supabase
      .channel("portfolio-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_content" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "skills" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "greetings" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "section_visibility" }, () => fetchAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  // Save all data to Supabase
  const saveToDatabase = useCallback(async (portfolioData: PortfolioData) => {
    const skills = portfolioData.skills as (SkillData & { id?: string })[];
    const projects = portfolioData.projects as (ProjectData & { id?: string })[];
    const certificates = portfolioData.certificates as (CertificateData & { id?: string })[];
    const greetings = portfolioData.greetings as (GreetingData & { id?: string })[];

    // Update portfolio content
    const contentPayload = {
      hero_name: portfolioData.heroName,
      hero_subtitle: portfolioData.heroSubtitle,
      hero_bio: portfolioData.heroBio,
      current_focus: portfolioData.currentFocus,
      about_title: portfolioData.aboutTitle,
      about_p1: portfolioData.aboutP1,
      about_p2: portfolioData.aboutP2,
      profile_image: portfolioData.profileImage,
    };

    if (contentId) {
      await supabase.from("portfolio_content").update(contentPayload).eq("id", contentId);
    } else {
      const { data: newContent } = await supabase.from("portfolio_content").insert(contentPayload).select("id").single();
      if (newContent) setContentId(newContent.id);
    }

    // Sync skills: delete all, re-insert with sort_order
    await supabase.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (skills.length > 0) {
      await supabase.from("skills").insert(
        skills.map((s, i) => ({
          name: s.name, level: s.level, icon: s.icon,
          logo: s.logo ?? null, upcoming: s.upcoming ?? false, sort_order: i,
        }))
      );
    }

    // Sync projects
    await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (projects.length > 0) {
      await supabase.from("projects").insert(
        projects.map((p, i) => ({
          title: p.title, description: p.desc, tags: p.tags,
          image: p.image ?? null, sort_order: i,
        }))
      );
    }

    // Sync certificates
    await supabase.from("certificates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (certificates.length > 0) {
      await supabase.from("certificates").insert(
        certificates.map((c, i) => ({
          title: c.title, issuer: c.issuer,
          image: c.image ?? null, link: c.link ?? null, sort_order: i,
        }))
      );
    }

    // Sync greetings
    await supabase.from("greetings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (greetings.length > 0) {
      await supabase.from("greetings").insert(
        greetings.map(g => ({
          title: g.title, message: g.message,
          image: g.image ?? null, active: g.active,
        }))
      );
    }

    // Update section visibility
    const sectionsPayload = {
      about: portfolioData.sections.about,
      skills: portfolioData.sections.skills,
      skill_radar: portfolioData.sections.skillRadar,
      rpg_skill_tree: portfolioData.sections.rpgSkillTree,
      projects: portfolioData.sections.projects,
      timeline: portfolioData.sections.timeline,
      learning_journey: portfolioData.sections.learningJourney,
      achievements: portfolioData.sections.achievements,
      certificates: portfolioData.sections.certificates,
      github: portfolioData.sections.github,
      contact: portfolioData.sections.contact,
    };

    if (sectionsId) {
      await supabase.from("section_visibility").update(sectionsPayload).eq("id", sectionsId);
    } else {
      const { data: newSections } = await supabase.from("section_visibility").insert(sectionsPayload).select("id").single();
      if (newSections) setSectionsId(newSections.id);
    }

    // Refetch to get fresh IDs
    await fetchAll();
  }, [contentId, sectionsId, fetchAll]);

  return { data, loading, saveToDatabase, refetch: fetchAll };
}
