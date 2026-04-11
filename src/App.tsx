import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ProfissionaisPage from "@/pages/ProfissionaisPage";
import PacientesPage from "@/pages/PacientesPage";
import AtendimentosPage from "@/pages/AtendimentosPage";
import RelatoriosPage from "@/pages/RelatoriosPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import EsqueciSenhaPage from "@/pages/EsqueciSenhaPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/inicio" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/profissionais" element={
                <ProtectedRoute>
                  <AppLayout><ProfissionaisPage /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/pacientes" element={
                <ProtectedRoute>
                  <AppLayout><PacientesPage /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/atendimentos" element={
                <ProtectedRoute>
                  <AppLayout><AtendimentosPage /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/relatorios" element={
                <ProtectedRoute>
                  <AppLayout><RelatoriosPage /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
