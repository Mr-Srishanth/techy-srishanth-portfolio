import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useIsMobile, useLightMotion } from "@/hooks/use-mobile";

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

const CardContent = ({ project }: { project: typeof projects[0] }) => (
  <div className="relative z-10">
    <div className="flex items-center justify-between mb-4">
      <Folder className="text-primary" size={28} />
      <div className="flex gap-3">
        <Github size={18} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
        <ExternalLink size={18} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
      </div>
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-2 tracking-wider">
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
);

const DepthCard = ({
  project,
  index,
  total,
  scrollYProgress,
}: {
  project: typeof projects[0];
  index: number;
  total: number;
  scrollYProgress: any;
}) => {
  // Each card activates in its own scroll segment
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;

  // Card starts stacked, then lifts to center, then flies up and away
  const y = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end],
    [80, 0, 0, -200]
  );

  const scale = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end],
    [0.85, 1, 1, 0.9]
  );

  const opacity = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.15, end - segmentSize * 0.15, end],
    [0, 1, 1, 0]
  );

  const rotateX = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end],
    [8, 0, 0, -5]
  );

  const zIndex = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.5, end],
    [total - index, total + 1, total - index]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4"
      style={{ y, scale, opacity, rotateX, zIndex: zIndex as any }}
    >
      <div className="glass-card p-6 w-full max-w-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
        <CardContent project={project} />
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const isMobile = useIsMobile();
  const light = useLightMotion();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mobile fallback: simple stacked list
  if (isMobile) {
    return (
      <section id="projects" className="py-24 relative">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// PORTFOLIO"}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
              My Projects
            </h2>
          </div>
          <div className="flex flex-col gap-6 max-w-xl mx-auto">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                className="glass-card p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                <CardContent project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative" ref={containerRef} style={{ height: `${projects.length * 100}vh` }}>
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center" style={{ perspective: "1200px" }}>
        <div className="mb-8 text-center z-20 relative">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// PORTFOLIO"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            My Projects
          </h2>
        </div>
        <div className="relative w-full" style={{ height: "280px" }}>
          {projects.map((project, i) => (
            <DepthCard
              key={project.title}
              project={project}
              index={i}
              total={projects.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
