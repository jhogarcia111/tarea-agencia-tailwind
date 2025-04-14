
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/*" element={<Users />} />
          <Route path="/users/new" element={<Users />} />
          <Route path="/users/edit/:id" element={<Users />} />
          <Route path="/clients/*" element={<Clients />} />
          <Route path="/clients/new" element={<Clients />} />
          <Route path="/clients/edit/:id" element={<Clients />} />
          <Route path="/tasks/*" element={<Tasks />} />
          <Route path="/tasks/new" element={<Tasks />} />
          <Route path="/tasks/edit/:id" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
