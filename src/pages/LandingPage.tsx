import { Link } from "react-router-dom";
import { ClipboardCheck, UserSearch, TrendingUp, FileDown } from "lucide-react";
import logo from "@/assets/logo-bpa-semfundo.png";

const features = [
  {
    icon: ClipboardCheck,
    title: "Registro de Atendimentos",
    desc: "Registre procedimentos, dados do paciente e do profissional de forma rápida e segura, garantindo a identificação correta de cada atendimento.",
  },
  {
    icon: UserSearch,
    title: "Automação e Confiabilidade",
    desc: "O sistema classifica automaticamente os procedimentos e realiza cálculos como idade do paciente, reduzindo erros e aumentando a precisão.",
  },
  {
    icon: TrendingUp,
    title: "Gestão e Eficiência",
    desc: "Encontre e acompanhe informações com filtros e seleções inteligentes, otimizando o tempo e facilitando o trabalho da equipe.",
  },
  {
    icon: FileDown,
    title: "Relatórios e Prestação de Contas",
    desc: "Gere relatórios por período e faça o download dos dados de maneira simples, garantindo organização e agilidade nas informações.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-bpa-gradient flex flex-col items-center justify-center px-4 py-10">
      <img
        src={logo}
        alt="Logo BPA"
        className="h-28 md:h-36 w-auto object-contain mb-8 drop-shadow-xl"
      />

      <div className="w-full max-w-5xl rounded-3xl bg-glass backdrop-blur-xl border border-white/40 shadow-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="shrink-0 h-14 w-14 rounded-full bg-bpa-icon flex items-center justify-center shadow-lg">
                <Icon className="h-7 w-7 text-white" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-bpa-darkblue mb-1">{title}</h3>
                <p className="text-sm leading-relaxed text-bpa-darkblue/90">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/login"
            className="min-w-[180px] text-center px-10 py-3 rounded-full text-white font-semibold bg-bpa-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Login
          </Link>
          <Link
            to="/cadastro"
            className="min-w-[180px] text-center px-10 py-3 rounded-full text-white font-semibold bg-bpa-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Cadastro
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-xs text-bpa-darkblue/70">
        BPA — Boletim de Produção Ambulatorial
      </footer>
    </div>
  );
}
