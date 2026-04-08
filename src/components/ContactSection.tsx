import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Send, Github, Linkedin, Instagram, CheckCircle, X } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { headingReveal, cardReveal, buttonHover, buttonTap, DUR_REVEAL, EASE_REVEAL, STAGGER } from "@/lib/animations";
import { usePortfolio } from "@/contexts/PortfolioContext";

const ContactSection = () => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const { data } = usePortfolio();
  const socialLinkTarget =
    typeof window !== "undefined" && window.top !== window.self ? "_top" : "_blank";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const honeypot = formRef.current.querySelector<HTMLInputElement>('[name="website_url"]');
    if (honeypot && honeypot.value) return;

    const now = Date.now();
    if (now - lastSubmitTime < 60000) {
      toast.error("Please wait a moment before sending another message.");
      return;
    }

    setSending(true);
    setLastSubmitTime(now);
    emailjs
      .sendForm("service_mxd1a9e", "template_qpqqc1k", formRef.current, "JTN6BSs5DTYJqVJbL")
      .then(() => {
        setShowSuccess(true);
        formRef.current?.reset();
      })
      .catch(() => {
        toast.error("Failed to send message. Please try again.");
      })
      .finally(() => setSending(false));
  };

  const displayEmail = data.email || "a.srishanth1733@gmail.com";

  const contactInfo = [
    { icon: Mail, label: "Email", value: displayEmail },
    { icon: MapPin, label: "Location", value: "Hyderabad, India" },
  ];

  const socialLinks = [
    { Icon: Github, href: data.githubUrl || "https://github.com/Mr-Srishanth", label: "GitHub" },
    { Icon: Linkedin, href: data.linkedinUrl || "https://www.linkedin.com/in/a-srishanth-300605397", label: "LinkedIn" },
    { Icon: Instagram, href: data.instagramUrl || "https://www.instagram.com/mr.srishanth14", label: "Instagram" },
  ].filter(l => l.href);

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div {...headingReveal(inView)} className="text-center mb-16">
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// CONTACT"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Get In Touch
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: STAGGER, duration: DUR_REVEAL, ease: EASE_REVEAL }}
          >
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to learn and grow.
            </p>

            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-4 group cursor-default"
                {...cardReveal(inView, i, 0.24)}
              >
                <motion.div
                  className="p-3 rounded-lg glass-card text-primary group-hover:neon-glow transition-all duration-300"
                  whileHover={isMobile ? undefined : { scale: 1.1 }}
                  whileTap={isMobile ? { scale: 0.95 } : undefined}
                >
                  <item.icon size={20} />
                </motion.div>
                <div>
                  <p className="font-display text-xs tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="font-body text-foreground">{item.value}</p>
                </div>
              </motion.div>
            ))}

            <div className="flex gap-4 pt-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={socialLinkTarget}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-lg glass-card text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  whileHover={isMobile ? undefined : buttonHover}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-5"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: STAGGER * 2, duration: DUR_REVEAL, ease: EASE_REVEAL }}
          >
            <input type="text" name="website_url" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }} />
            {[
              { label: "Name", name: "from_name", type: "text" },
              { label: "Email", name: "from_email", type: "email" },
              { label: "Subject", name: "subject", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">{field.label}</label>
                <input type={field.type} name={field.name} required className="w-full bg-secondary/50 border border-glass-border/30 rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200" placeholder={`Your ${field.label.toLowerCase()}`} />
              </div>
            ))}
            <div>
              <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">Message</label>
              <textarea name="message" required rows={4} className="w-full bg-secondary/50 border border-glass-border/30 rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none" placeholder="Your message" />
            </div>
            <motion.button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm tracking-wider flex items-center justify-center gap-2 neon-glow" whileHover={isMobile ? undefined : buttonHover} whileTap={buttonTap} disabled={sending}>
              {sending ? (
                <motion.div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
              ) : (
                <>Send Message <Send size={16} /></>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowSuccess(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative glass-card p-8 md:p-10 max-w-md w-full text-center space-y-6 border border-primary/30" initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 300 }}>
              <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200"><X size={20} /></button>
              <motion.div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center neon-glow" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", damping: 12 }}><CheckCircle className="text-primary" size={32} /></motion.div>
              <motion.h3 className="font-display text-2xl font-bold neon-text text-primary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>Message Sent!</motion.h3>
              <motion.p className="font-body text-muted-foreground leading-relaxed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Thank you for reaching out! I'll get back to you as soon as possible.</motion.p>
              <motion.button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm tracking-wider neon-glow" onClick={() => setShowSuccess(false)} whileHover={isMobile ? undefined : buttonHover} whileTap={buttonTap} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>Got it!</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
