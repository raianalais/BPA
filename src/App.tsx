import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import Dashboard from "@/pages/Dashboard";
import ProfissionaisPage from "@/pages/ProfissionaisPage";
import PacientesPage from "@/pages/PacientesPage";
import AtendimentosPage from "@/pages/AtendimentosPage";
import RelatoriosPage from "@/pages/RelatoriosPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const withLayout = (node: React.ReactNode) => <AppLayout>{node}</AppLayout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/home" element={withLayout(<Dashboard />)} />
            <Route path="/profissionais" element={withLayout(<ProfissionaisPage />)} />
            <Route path="/pacientes" element={withLayout(<PacientesPage />)} />
            <Route path="/atendimentos" element={withLayout(<AtendimentosPage />)} />
            <Route path="/relatorios" element={withLayout(<RelatoriosPage />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
