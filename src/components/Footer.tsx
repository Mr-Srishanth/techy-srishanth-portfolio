import { motion } from "framer-motion";

const Footer = () => (
  <footer className="py-8 border-t border-glass-border/20">
    <div className="container mx-auto px-4 text-center">
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
