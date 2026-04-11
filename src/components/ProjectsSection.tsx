import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, Folder, X, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { headingReveal, cardReveal, cardHover } from "@/lib/animations";
import { usePortfolio, type ProjectData } from "@/contexts/PortfolioContext";

const ProjectsSection = () => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!selectedProject) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProject]);

  const hasLink = (url?: string) => url && url.trim().length > 0;

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
          {data.projects.map((project, i) => (
            <motion.div
              key={`${project.title}-${i}`}
              className="glass-card p-6 group cursor-pointer relative overflow-hidden"
              {...cardReveal(inView, i, 0.12)}
              whileHover={isMobile ? undefined : cardHover}
              whileTap={isMobile ? { scale: 0.98 } : undefined}
              onClick={() => setSelectedProject(project)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {project.image && (
                <div className="relative z-10 mb-4 rounded-lg overflow-hidden h-40">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Folder className="text-primary" size={28} />
                  <div className="flex gap-3">
                    {hasLink(project.github_url) && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} tabIndex={0} aria-label="GitHub repository">
                        <Github size={18} className="text-muted-foreground hover:text-primary transition-colors duration-200" />
                      </a>
                    )}
                    {hasLink(project.live_url) && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} tabIndex={0} aria-label="Live demo">
                        <ExternalLink size={18} className="text-muted-foreground hover:text-primary transition-colors duration-200" />
                      </a>
                    )}
                    {hasLink(project.doc_url) && (
                      <a href={project.doc_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} tabIndex={0} aria-label="Documentation">
                        <FileText size={18} className="text-muted-foreground hover:text-primary transition-colors duration-200" />
                      </a>
                    )}
                    {!hasLink(project.github_url) && !hasLink(project.live_url) && !hasLink(project.doc_url) && (
                      <>
                        <Github size={18} className="text-muted-foreground/40" />
                        <ExternalLink size={18} className="text-muted-foreground/40" />
                      </>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 tracking-wider group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="font-body text-muted-foreground mb-4 leading-relaxed line-clamp-2">
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

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              className="relative glass-card p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-primary/20"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {selectedProject.image && (
                <div className="rounded-lg overflow-hidden mb-6 h-48 md:h-64">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              )}

              <h3 className="font-display text-2xl font-bold text-foreground mb-1">{selectedProject.title}</h3>
              {selectedProject.tagline && (
                <p className="font-mono text-sm text-primary mb-3">{selectedProject.tagline}</p>
              )}
              <p className="font-body text-muted-foreground leading-relaxed mb-6">{selectedProject.desc}</p>

              {/* Problem / Solution / Impact */}
              {(selectedProject.problem || selectedProject.solution || selectedProject.impact) && (
                <div className="space-y-4 mb-6">
                  {selectedProject.problem && (
                    <div className="space-y-1.5">
                      <h4 className="font-mono text-xs tracking-widest text-primary uppercase">Problem</h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{selectedProject.problem}</p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="space-y-1.5">
                      <h4 className="font-mono text-xs tracking-widest text-primary uppercase">Solution</h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{selectedProject.solution}</p>
                    </div>
                  )}
                  {selectedProject.impact && (
                    <div className="space-y-1.5">
                      <h4 className="font-mono text-xs tracking-widest text-primary uppercase">Impact</h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{selectedProject.impact}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {hasLink(selectedProject.live_url) && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:scale-105 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {hasLink(selectedProject.github_url) && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-mono text-sm hover:border-primary/50 hover:scale-105 active:scale-[0.98] transition-all duration-200"
                  >
                    <Github size={14} /> Source Code
                  </a>
                )}
                {hasLink(selectedProject.doc_url) && (
                  <a
                    href={selectedProject.doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-mono text-sm hover:border-primary/50 hover:scale-105 active:scale-[0.98] transition-all duration-200"
                  >
                    <FileText size={14} /> Docs
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
