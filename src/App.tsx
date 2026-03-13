import React, { useEffect, useState, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { NavigationProvider } from "./components/NavigationProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

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
import Ramadan from "./pages/Ramadan";
import Pilgrimage from "./pages/Pilgrimage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Auth context to cache session app-wide
interface AuthContextType {
  session: any | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, isLoading: true });

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session check — only once
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setIsLoading(false);
    });

    // Listen for changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected route wrapper — reads cached session, no extra getSession calls
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/auth", { replace: true });
    }
  }, [isLoading, session, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return session ? <>{children}</> : null;
}

// Wrapper to call hooks at top level
function AppWithPush() {
  usePushNotifications();
  return null;
}

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <NavigationProvider>
                <AppWithPush />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  
                  
                  {/* Protected routes */}
                  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dates" element={<ProtectedRoute><Dates /></ProtectedRoute>} />
                  <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                  <Route path="/practices" element={<ProtectedRoute><Practices /></ProtectedRoute>} />
                  <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
                  <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                  <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                  <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                  <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                  <Route path="/dua" element={<ProtectedRoute><Dua /></ProtectedRoute>} />
                  <Route path="/quran" element={<ProtectedRoute><Quran /></ProtectedRoute>} />
                  <Route path="/dhikr" element={<ProtectedRoute><Dhikr /></ProtectedRoute>} />
                  <Route path="/fintech" element={<ProtectedRoute><Fintech /></ProtectedRoute>} />
                  <Route path="/ramadan" element={<ProtectedRoute><Ramadan /></ProtectedRoute>} />
                  
                  {/* Legacy routes redirect */}
                  <Route path="/calendar" element={<Navigate to="/dates" replace />} />
                  <Route path="/habits" element={<Navigate to="/practices" replace />} />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NavigationProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
