import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Preview from "./pages/Preview";

const queryClient = new QueryClient();

const App = () => {
  // Scroll watchdog: if something leaves body/html in a locked state without
  // the explicit `data-scroll-locked` marker, release it. Prevents the whole
  // page becoming un-scrollable after a modal/animation glitch.
  useEffect(() => {
    const release = () => {
      const html = document.documentElement;
      if (html.getAttribute("data-scroll-locked") === "true") return;
      if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
      if (document.body.style.position === "fixed") document.body.style.position = "";
      if (html.style.overflow === "hidden") html.style.overflow = "";
    };
    const id = window.setInterval(release, 500);
    return () => window.clearInterval(id);
  }, []);
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PortfolioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/preview" element={<Preview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
