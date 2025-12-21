import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Dates from "./pages/Dates";
import Journal from "./pages/Journal";
import Practices from "./pages/Practices";
import Learn from "./pages/Learn";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import Goals from "./pages/Goals";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Dua from "./pages/Dua";
import Quran from "./pages/Quran";
import Dhikr from "./pages/Dhikr";
import Fintech from "./pages/Fintech";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// No auth required - guest mode forever
const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing redirects to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Main app routes - no auth required */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dates" element={<Dates />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/practices" element={<Practices />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/dua" element={<Dua />} />
              <Route path="/quran" element={<Quran />} />
              <Route path="/dhikr" element={<Dhikr />} />
              <Route path="/fintech" element={<Fintech />} />
              
              {/* Legacy routes redirect */}
              <Route path="/calendar" element={<Navigate to="/dates" replace />} />
              <Route path="/habits" element={<Navigate to="/practices" replace />} />
              <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
