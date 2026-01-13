import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AIAssistant from "./pages/AIAssistant";
import CVBuilder from "./pages/CVBuilder";
import DecisionEngine from "./pages/DecisionEngine";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import LearningPlanner from "./pages/LearningPlanner";
import KnowledgeHub from "./pages/KnowledgeHub";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/cv-builder" element={<CVBuilder />} />
              <Route path="/decision-engine" element={<DecisionEngine />} />
              <Route path="/document-analyzer" element={<DocumentAnalyzer />} />
              <Route path="/report-analyzer" element={<ReportAnalyzer />} />
              <Route path="/learning-planner" element={<LearningPlanner />} />
              <Route path="/knowledge-hub" element={<KnowledgeHub />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
