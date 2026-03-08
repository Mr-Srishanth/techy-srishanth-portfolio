import { motion } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  { Icon: Github, href: "https://github.com/Mr-Srishanth", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/a-srishanth-300605397", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/mr.srishanth14", label: "Instagram" },
];

const Footer = () => (
  <footer className="py-8 border-t border-glass-border/20">
    <div className="container mx-auto px-4 flex flex-col items-center gap-4">
      <div className="flex gap-4">
        {socialLinks.map(({ Icon, href, label }) => (
          <motion.a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onClick={(e) => { e.preventDefault(); (window.top || window).open(href, '_blank', 'noopener,noreferrer'); }}
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
        © 2025 <span className="text-primary">Arrabola Srishanth</span>. Built with passion & code.
      </motion.p>
    </div>
  </footer>
);

export default Footer;
