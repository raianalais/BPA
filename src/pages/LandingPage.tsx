import { useNavigate } from 'react-router-dom';
import logoBpa from '@/assets/logo-bpa.png';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Users, ClipboardList } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <img src={logoBpa} alt="BPA Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-primary">BPA</span>
        </div>
        <Button onClick={() => navigate('/login')} variant="outline">
          Entrar
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <img src={logoBpa} alt="BPA Logo" className="mb-8 h-24 w-24 object-contain" />
        <h1 className="mb-4 text-4xl font-bold text-primary lg:text-5xl">
          Página Inicial
        </h1>
        <p className="mb-2 max-w-xl text-lg text-muted-foreground">
          BPA — Boletim de Produção Ambulatorial
        </p>
        <p className="mb-8 max-w-xl text-muted-foreground">
          Sistema completo para gestão e geração de relatórios BPA-C e BPA-I,
          com cadastro de pacientes, profissionais e atendimentos ambulatoriais.
        </p>

        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 shadow-sm">
            <Users className="h-8 w-8 text-info" />
            <h3 className="font-semibold text-foreground">Pacientes</h3>
            <p className="text-sm text-muted-foreground">Cadastro completo com dados do SUS</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 shadow-sm">
            <ClipboardList className="h-8 w-8 text-success" />
            <h3 className="font-semibold text-foreground">Atendimentos</h3>
            <p className="text-sm text-muted-foreground">Registro de procedimentos ambulatoriais</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 shadow-sm">
            <BarChart3 className="h-8 w-8 text-accent" />
            <h3 className="font-semibold text-foreground">Relatórios</h3>
            <p className="text-sm text-muted-foreground">Exportação BPA-C e BPA-I em CSV/TXT</p>
          </div>
        </div>

        <Button size="lg" className="gap-2 px-8" onClick={() => navigate('/login')}>
          Acessar o Sistema <ArrowRight className="h-5 w-5" />
        </Button>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        BPA — Boletim de Produção Ambulatorial © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
