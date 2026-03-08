import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { headingReveal, cardReveal, cardHover } from "@/lib/animations";

const projects = [
  {
    title: "Python Calculator",
    desc: "A feature-rich calculator built with Python, supporting basic and scientific operations.",
    tags: ["Python", "CLI"],
  },
  {
    title: "Student Management System",
    desc: "A CRUD application for managing student records with file handling.",
    tags: ["Python", "File I/O"],
  },
  {
    title: "Portfolio Website",
    desc: "This futuristic portfolio built with React, TypeScript, and Framer Motion.",
    tags: ["React", "TypeScript", "Framer Motion"],
  },
  {
    title: "DSA Practice Tracker",
    desc: "A tool to track progress on Data Structures and Algorithms problems.",
    tags: ["Python", "Data Structures"],
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div {...headingReveal(inView)} className="text-center mb-16">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// PORTFOLIO"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            My Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="glass-card p-6 group cursor-default relative overflow-hidden"
              {...cardReveal(inView, i, 0.12)}
              whileHover={isMobile ? undefined : cardHover}
              whileTap={isMobile ? { scale: 0.98 } : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Folder className="text-primary" size={28} />
                  <div className="flex gap-3">
                    <Github size={18} className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer" />
                    <ExternalLink size={18} className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 tracking-wider group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
