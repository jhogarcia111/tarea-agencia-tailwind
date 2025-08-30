import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/DataContext";
import NotificationList from "@/components/ui/NotificationList";

// Pages
import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Pending from "./pages/Pending";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ErrorLogs from "./pages/ErrorLogs";
import ActivityLogs from "./pages/ActivityLogs";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users/*" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/clients/*" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/tasks/new" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/tasks/edit/:id" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/error-logs" element={<ProtectedRoute requiredRole="admin"><ErrorLogs /></ProtectedRoute>} />
              <Route path="/activity-logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <NotificationList />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
