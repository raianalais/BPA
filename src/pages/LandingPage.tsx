import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ClipboardList, FileBarChart, Users } from 'lucide-react';

const features = [
  { icon: ClipboardList, title: 'Registro de Atendimentos', desc: 'Cadastre procedimentos odontológicos seguindo o padrão BPA do SUS.' },
  { icon: Users, title: 'Gestão de Profissionais', desc: 'Controle completo de profissionais e equipes de saúde bucal.' },
  { icon: FileBarChart, title: 'Relatórios BPA', desc: 'Gere relatórios BPA-C e BPA-I prontos para envio ao DATASUS.' },
  { icon: Shield, title: 'Segurança', desc: 'Controle de acesso por perfis: profissional, aluno, gestor e mais.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center lg:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-lg">🦷</span>
            <span className="text-sm font-medium text-primary">Sistema de Gestão Odontológica</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Odonto<span className="text-primary">SUS</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Plataforma completa para gestão de atendimentos odontológicos ambulatoriais,
            registro de procedimentos e geração de relatórios no padrão BPA do SUS.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="min-w-[200px] text-base" onClick={() => navigate('/login')}>
              Acessar o Sistema
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px] text-base" onClick={() => navigate('/cadastro')}>
              Cadastrar-se
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">OdontoSUS v1.0 — Sistema de Produção Ambulatorial</p>
      </footer>
    </div>
  );
}
