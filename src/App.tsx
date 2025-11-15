import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatHead from "./components/ChatHead";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Journal from "./pages/Journal";
import HabitTracker from "./pages/HabitTracker";
import HabitCategory from "./pages/HabitCategory";
import HabitDetail from "./pages/HabitDetail";
import Duas from "./pages/Duas";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CompanionSetup from "./pages/CompanionSetup";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-inkMuted">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatHead />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/companion-setup" element={<CompanionSetup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <HabitTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits/category/:category"
              element={
                <ProtectedRoute>
                  <HabitCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits/detail/:habitId"
              element={
                <ProtectedRoute>
                  <HabitDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/duas"
              element={
                <ProtectedRoute>
                  <Duas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
