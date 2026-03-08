import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Send, Github, Linkedin, Instagram, CheckCircle, X } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
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

  const contactInfo = [
    { icon: Mail, label: "Email", value: "a.srishanth1733@gmail.com" },
    { icon: MapPin, label: "Location", value: "Hyderabad, India" },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-2">{"// CONTACT"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold neon-text text-primary">
            Get In Touch
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to learn and grow.
            </p>

            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-4 group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <motion.div
                  className="p-3 rounded-lg glass-card text-primary group-hover:neon-glow transition-all"
                  whileHover={{ scale: 1.1 }}
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
              {[
                { Icon: Github, href: "https://github.com/Mr-Srishanth" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/a-srishanth-300605397" },
                { Icon: Instagram, href: "https://instagram.com/mr.srishanth14" },
              ].map(({ Icon, href }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg glass-card text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px hsl(200 100% 50% / 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-5"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {[
              { label: "Name", name: "from_name", type: "text" },
              { label: "Email", name: "from_email", type: "email" },
              { label: "Subject", name: "subject", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  className="w-full bg-secondary/50 border border-glass-border/30 rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder={`Your ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
            <div>
              <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full bg-secondary/50 border border-glass-border/30 rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                placeholder="Your message"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm tracking-wider flex items-center justify-center gap-2 neon-glow"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(200 100% 50% / 0.5)" }}
              whileTap={{ scale: 0.98 }}
              disabled={sending}
            >
              {sending ? (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowSuccess(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative glass-card p-8 md:p-10 max-w-md w-full text-center space-y-6 border border-primary/30"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <motion.div
                className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center neon-glow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
              >
                <CheckCircle className="text-primary" size={32} />
              </motion.div>

              <motion.h3
                className="font-display text-2xl font-bold neon-text text-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Message Sent!
              </motion.h3>

              <motion.p
                className="font-body text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Thank you for reaching out! I'll get back to you as soon as possible.
              </motion.p>

              <motion.button
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm tracking-wider neon-glow"
                onClick={() => setShowSuccess(false)}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(200 100% 50% / 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
