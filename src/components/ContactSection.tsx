import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    emailjs
      .sendForm("service_mxd1a9e", "template_qpqqc1k", formRef.current, "JTN6BSs5DTYJqVJbL")
      .then(() => {
        toast.success("Message sent successfully!");
        formRef.current?.reset();
      })
      .catch(() => {
        toast.error("Failed to send message. Please try again.");
      })
      .finally(() => setSending(false));
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "srishanth@example.com" },
    { icon: Phone, label: "Phone", value: "+91 XXXXX XXXXX" },
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
              {[Github, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
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
    </section>
  );
};

export default ContactSection;
