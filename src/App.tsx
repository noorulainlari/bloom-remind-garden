import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Dashboard } from "@/components/Dashboard";
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { BlogList } from "@/pages/BlogList";
import { BlogPost } from "@/pages/BlogPost";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { AdsTxt } from "@/pages/AdsTxt";
import { SEOHead } from "@/components/SEOHead";
import PlantGallery from "@/pages/PlantGallery";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { OnboardingProvider } from "@/hooks/useOnboarding";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Set default SEO meta tags
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
    <BrowserRouter>
      <SEOHead />
      <OnboardingOverlay />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/welcome" element={<Index />} />
        <Route path="/gallery" element={<PlantGallery />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/ads.txt" element={<AdsTxt />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </OnboardingProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
