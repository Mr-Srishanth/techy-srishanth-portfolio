import { motion } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const Footer = () => {
  const { data } = usePortfolio();
  const socialLinkTarget =
    typeof window !== "undefined" && window.top !== window.self ? "_top" : "_blank";

  const socialLinks = [
    { Icon: Github, href: data.githubUrl || "https://github.com/Mr-Srishanth", label: "GitHub" },
    { Icon: Linkedin, href: data.linkedinUrl || "https://www.linkedin.com/in/a-srishanth-300605397", label: "LinkedIn" },
    { Icon: Instagram, href: data.instagramUrl || "https://www.instagram.com/mr.srishanth14", label: "Instagram" },
  ].filter(l => l.href);

  return (
    <footer className="py-8 border-t border-glass-border/20">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {socialLinks.map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target={socialLinkTarget}
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>
        <motion.p
          className="font-mono text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          © 2025 <span className="text-primary">{data.heroName}</span>. Built with passion & code.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
