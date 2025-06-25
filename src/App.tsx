
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Dashboard } from "@/components/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free Plant Watering Reminder Tool – Indoor Plant Care Tracker";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create a plant care schedule and get free email reminders. No signup needed.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Create a plant care schedule and get free email reminders. No signup needed.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <BrowserRouter basename="/bloom-remind-garden">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/welcome" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
