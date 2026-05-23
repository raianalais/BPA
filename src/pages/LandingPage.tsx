import { useNavigate } from 'react-router-dom';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, UserSearch, TrendingUp, FileDown } from 'lucide-react';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Registro de Atendimentos',
    desc: 'Registre procedimentos, dados do paciente e do profissional de forma rápida e segura, garantindo a identificação correta de cada atendimento.',
  },
  {
    icon: UserSearch,
    title: 'Automação e Confiabilidade',
    desc: 'O sistema classifica automaticamente os procedimentos e realiza cálculos como idade do paciente, reduzindo erros e aumentando a precisão.',
  },
  {
    icon: TrendingUp,
    title: 'Gestão e Eficiência',
    desc: 'Encontre e acompanhe informações com filtros e seleções inteligentes, otimizando o tempo e facilitando o trabalho da equipe.',
  },
  {
    icon: FileDown,
    title: 'Relatórios e Prestação de Contas',
    desc: 'Gere relatórios por período e faça o download dos dados de maneira simples, garantindo organização e agilidade nas informações.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F5F5] px-4 py-10">
      {/* Background blurred blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#0876D6]/40 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 h-[460px] w-[460px] rounded-full bg-[#1A827E]/40 blur-[130px]" />
        <div className="absolute -bottom-20 -right-10 h-[460px] w-[460px] rounded-full bg-[#8574C0]/40 blur-[130px]" />
        <div className="absolute top-10 right-1/4 h-[300px] w-[300px] rounded-full bg-[#64CFBB]/30 blur-[110px]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center">
        {/* Logo */}
        <img src={logoBpaSemFundo} alt="BPA" className="mb-6 h-28 w-auto object-contain drop-shadow-md" />

        {/* Glass card */}
        <div
          className="w-full rounded-3xl border p-8 sm:p-12"
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1A827E, #0876D6)' }}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-bold text-[#043E6E]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[#043E6E]/80">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => navigate('/login')}
              className="h-12 w-48 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/cadastro')}
              className="h-12 w-48 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
            >
              Cadastro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
