
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import Finances from "./pages/Finances";
import Historical from "./pages/Historical";
import PropertyEdit from "./pages/PropertyEdit";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";
import FiscalReport from "./pages/FiscalReport";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/property/edit/:id" element={<PropertyEdit />} />
            <Route path="/property/:id/edit" element={<PropertyEdit />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/historical" element={<Historical />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/fiscal-report" element={<FiscalReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
