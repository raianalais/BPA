import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, TrendingUp } from "lucide-react";
import logo from "@/assets/logo-bpa-semfundo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação preservada (no momento navega ao sistema)
    navigate("/home");
  };

  return (
    <div className="min-h-screen w-full bg-bpa-gradient px-4 py-8 relative">
      <Link to="/" aria-label="Voltar" className="absolute top-6 left-6 text-bpa-darkblue hover:opacity-70">
        <ArrowLeft className="h-7 w-7" />
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-4rem)]">
        {/* Esquerda */}
        <div className="flex flex-col items-center lg:items-start gap-10">
          <img src={logo} alt="Logo BPA" className="h-28 md:h-36 w-auto object-contain drop-shadow-xl" />

          <div className="space-y-8 max-w-md">
            <Info
              icon={ClipboardCheck}
              title="Registro de Atendimentos"
              text="Registre procedimentos, dados do paciente e do profissional de forma rápida e segura, garantindo a identificação correta de cada atendimento."
            />
            <Info
              icon={TrendingUp}
              title="Gestão e Eficiência"
              text="Encontre e acompanhe informações com filtros e seleções inteligentes, otimizando o tempo e facilitando o trabalho da equipe."
            />
          </div>
        </div>

        {/* Direita - card login */}
        <div className="w-full max-w-md mx-auto rounded-3xl bg-glass backdrop-blur-xl border border-white/40 shadow-2xl p-8 md:p-10">
          <h1 className="text-4xl font-bold text-bpa-darkblue text-center mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-full bg-white/70 px-5 outline-none focus:ring-2 focus:ring-bpa-teal/60 shadow-inner"
              />
            </Field>

            <Field label="Senha">
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full h-12 rounded-full bg-white/70 px-5 outline-none focus:ring-2 focus:ring-bpa-teal/60 shadow-inner"
              />
            </Field>

            <div className="flex justify-end">
              <Link to="/esqueci-senha" className="text-sm text-bpa-darkblue underline hover:opacity-80">
                Recuperar Senha
              </Link>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="min-w-[200px] px-10 py-3 rounded-full text-white font-semibold bg-bpa-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Login
              </button>
            </div>

            <p className="text-center text-sm text-bpa-darkblue/80 pt-2">
              Não tem conta?{" "}
              <Link to="/cadastro" className="font-semibold underline">Criar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-bpa-darkblue mb-2 ml-2">{label}</span>
      {children}
    </label>
  );
}

function Info({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 h-14 w-14 rounded-full bg-bpa-icon flex items-center justify-center shadow-lg">
        <Icon className="h-7 w-7 text-white" strokeWidth={2.2} />
      </div>
      <div>
        <h3 className="font-bold text-bpa-darkblue mb-1">{title}</h3>
        <p className="text-sm leading-relaxed text-bpa-darkblue/90">{text}</p>
      </div>
    </div>
  );
}
