import { useNavigate } from 'react-router-dom';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Users, ClipboardList, Shield, FileText, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-12">
        <div className="flex items-center gap-3">
          <img src={logoBpaSemFundo} alt="BPA Logo" className="h-10 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/login')} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Entrar
          </Button>
          <Button onClick={() => navigate('/cadastro')} className="bg-primary hover:bg-primary/90">
            Criar Conta
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-info/5 to-success/5" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-info/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-success/10 blur-3xl" />
        
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center lg:py-32">
          <img src={logoBpaSemFundo} alt="BPA Logo" className="mb-10 h-36 w-auto object-contain drop-shadow-lg lg:h-44" />
          
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground lg:text-6xl">
            Página Inicial
          </h1>
          
          <p className="mb-3 max-w-2xl text-xl font-medium text-primary lg:text-2xl">
            BPA — Boletim de Produção Ambulatorial
          </p>
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
            Sistema completo para gestão e geração de relatórios BPA-C e BPA-I,
            com cadastro de pacientes, profissionais e atendimentos ambulatoriais.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-10 text-base shadow-lg shadow-primary/25" onClick={() => navigate('/login')}>
              Acessar o Sistema <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-10 text-base border-primary text-primary" onClick={() => navigate('/cadastro')}>
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="mb-14 text-center text-muted-foreground">
            Gerencie toda a produção ambulatorial de forma simples, rápida e segura.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Pacientes', desc: 'Cadastro completo com dados do SUS, CNS, raça/cor, etnia e endereço.', color: 'text-info' },
              { icon: Activity, title: 'Profissionais', desc: 'Registro de profissionais com CBO, registro de conselho e CNS.', color: 'text-success' },
              { icon: ClipboardList, title: 'Atendimentos', desc: 'Registro detalhado de procedimentos ambulatoriais com classificação BPA.', color: 'text-primary' },
              { icon: BarChart3, title: 'Relatórios BPA', desc: 'Exportação de relatórios BPA-C, BPA-I e Geral em CSV e TXT.', color: 'text-accent' },
              { icon: Shield, title: 'Segurança', desc: 'Autenticação segura com controle de acesso por perfil profissional.', color: 'text-destructive' },
              { icon: FileText, title: 'Conformidade SUS', desc: 'Layouts de exportação compatíveis com os padrões do DATASUS.', color: 'text-info' },
            ].map((f, i) => (
              <div key={i} className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/30">
                <div className={`mb-4 inline-flex rounded-xl bg-muted p-3 ${f.color}`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Comece a usar agora
          </h2>
          <p className="mb-8 text-muted-foreground">
            Cadastre-se gratuitamente e comece a gerenciar sua produção ambulatorial.
          </p>
          <Button size="lg" className="gap-2 px-10 text-base shadow-lg shadow-primary/25" onClick={() => navigate('/cadastro')}>
            Criar Conta <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-6 text-center text-xs text-muted-foreground">
        BPA — Boletim de Produção Ambulatorial © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
