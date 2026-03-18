import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "srishanth" && password === "srishanth@portfolio") {
      sessionStorage.setItem("admin-auth", "true");
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 20px hsl(var(--primary)/0.2)", "0 0 40px hsl(var(--primary)/0.4)", "0 0 20px hsl(var(--primary)/0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock className="text-primary" size={28} />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">Restricted area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              autoFocus
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold tracking-wider neon-glow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Access Dashboard
          </motion.button>
        </form>

        <p className="text-center text-muted-foreground text-xs mt-6 font-mono">
          Press Ctrl+S from main site to access
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
