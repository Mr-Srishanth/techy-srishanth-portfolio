import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useLightMotion } from "@/hooks/use-mobile";

const data = [
  { skill: "Python", level: 70 },
  { skill: "Data Structures", level: 55 },
  { skill: "C Programming", level: 60 },
  { skill: "React", level: 75 },
  { skill: "ML Basics", level: 40 },
  { skill: "Git", level: 65 },
];

const SkillRadarChart = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const light = useLightMotion();

  return (
    <section className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={light ? undefined : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display tracking-wider text-foreground mb-4">
            Skill <span className="text-primary neon-text">Radar</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            A bird's-eye view of my current proficiency across key technologies.
          </p>
        </motion.div>

        <motion.div
          initial={light ? undefined : { opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 md:p-10 max-w-xl mx-auto"
        >
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "Rajdhani" }}
              />
              <Radar
                name="Proficiency"
                dataKey="level"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillRadarChart;
