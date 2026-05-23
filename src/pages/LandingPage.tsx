import { useNavigate } from 'react-router-dom';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Activity, ClipboardList, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Cadastro de Pacientes',
    desc: 'Gerencie dados completos dos pacientes com CNS, endereço e informações do SUS.',
    color: 'from-[#0876D6] to-[#043E6E]',
  },
  {
    icon: Activity,
    title: 'Gestão de Profissionais',
    desc: 'Controle CBO, registro profissional e vínculo com atendimentos realizados.',
    color: 'from-[#1A827E] to-[#64CFBB]',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Completos',
    desc: 'Exporte relatórios BPA-C, BPA-I e Geral nos formatos CSV e TXT.',
    color: 'from-[#8574C0] to-[#0876D6]',
  },
  {
    icon: ClipboardList,
    title: 'Organização Eficiente',
    desc: 'Atendimentos ambulatoriais organizados e prontos para auditoria do DATASUS.',
    color: 'from-[#043E6E] to-[#1A827E]',
  },
];

const highlights = [
  'Interface moderna e intuitiva',
  'Exportação compatível com DATASUS',
  'Gestão completa de produção ambulatorial',
  'Controle por perfil profissional',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#043E6E]/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src={logoBpaSemFundo} alt="BPA Logo" className="h-11 w-auto object-contain" />
            <span className="text-lg font-bold text-[#043E6E]">BPA</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-[#0876D6] text-[#0876D6] hover:bg-[#0876D6] hover:text-white transition-all"
            >
              Entrar
            </Button>
            <Button
              onClick={() => navigate('/cadastro')}
              className="bg-[#043E6E] text-white hover:bg-[#0876D6] transition-all"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#043E6E]/[0.03] via-white to-[#64CFBB]/[0.06]" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#0876D6]/[0.07] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#64CFBB]/[0.1] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#8574C0]/[0.04] blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center lg:py-28">
          <div className="mb-8 rounded-2xl bg-white p-4 shadow-xl shadow-[#043E6E]/10 ring-1 ring-[#043E6E]/5">
            <img src={logoBpaSemFundo} alt="BPA Logo" className="h-28 w-auto object-contain lg:h-36" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#64CFBB]/15 px-4 py-1.5 text-sm font-medium text-[#1A827E]">
            <Sparkles className="h-4 w-4" />
            Sistema de Produção Ambulatorial
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-[#043E6E] lg:text-6xl">
            Boletim de Produção
            <br />
            <span className="bg-gradient-to-r from-[#0876D6] to-[#1A827E] bg-clip-text text-transparent">
              Ambulatorial
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[#043E6E]/70">
            Sistema completo para gestão e geração de relatórios BPA-C e BPA-I,
            com cadastro de pacientes, profissionais e atendimentos ambulatoriais
            para clínicas odontológicas especializadas.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-[#043E6E] px-10 text-base text-white shadow-lg shadow-[#043E6E]/30 hover:bg-[#0876D6] transition-all"
              onClick={() => navigate('/login')}
            >
              Entrar no Sistema <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl border-[#1A827E] px-10 text-base text-[#1A827E] hover:bg-[#1A827E] hover:text-white transition-all"
              onClick={() => navigate('/cadastro')}
            >
              Criar Conta Gratuita
            </Button>
          </div>

          {/* Mini highlights */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-sm text-[#043E6E]/60">
                <CheckCircle2 className="h-4 w-4 text-[#1A827E]" />
                {h}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#043E6E]/5 bg-[#f8fafb] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-[#0876D6]">
            Funcionalidades
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold text-[#043E6E]">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-[#043E6E]/60">
            Gerencie toda a produção ambulatorial de forma simples, rápida e segura.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-[#043E6E]/[0.07] bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-[#043E6E]/[0.08] hover:-translate-y-1"
              >
                <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 text-white shadow-md`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#043E6E]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#043E6E]/60">{f.desc}</p>
                <div className="absolute -bottom-1 -right-1 h-24 w-24 rounded-tl-[3rem] bg-gradient-to-tl from-[#64CFBB]/[0.06] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#043E6E] to-[#0876D6]" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#64CFBB]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#8574C0]/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Comece a usar agora
          </h2>
          <p className="mb-8 text-white/70">
            Cadastre-se gratuitamente e comece a gerenciar sua produção ambulatorial com eficiência.
          </p>
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-white px-10 text-base font-semibold text-[#043E6E] shadow-xl hover:bg-[#64CFBB] hover:text-white transition-all"
            onClick={() => navigate('/cadastro')}
          >
            Criar Conta <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#043E6E]/10 bg-[#043E6E] px-6 py-8 text-center">
        <img src={logoBpaSemFundo} alt="BPA" className="mx-auto mb-3 h-10 w-auto object-contain brightness-0 invert" />
        <p className="text-sm font-medium text-white/80">BPA — Boletim de Produção Ambulatorial</p>
        <p className="mt-1 text-xs text-white/40">
          Sistema de gestão para clínicas odontológicas especializadas © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
