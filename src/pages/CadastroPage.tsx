import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserSearch, FileDown, X, Check } from "lucide-react";
import logo from "@/assets/logo-bpa-semfundo.png";

export default function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "", email: "", cpf: "", telefone: "",
    senha: "", confirma: "",
    cep: "", numero: "", complemento: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const rules = {
    min: form.senha.length >= 6,
    upper: /[A-Z]/.test(form.senha),
    lower: /[a-z]/.test(form.senha),
    symbol: /[^A-Za-z0-9]/.test(form.senha),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rules.min || !rules.upper || !rules.lower || !rules.symbol) return;
    if (form.senha !== form.confirma) return;
    // Lógica de cadastro preservada
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-bpa-gradient px-4 py-8 relative">
      <Link to="/" aria-label="Voltar" className="absolute top-6 left-6 text-bpa-darkblue hover:opacity-70">
        <ArrowLeft className="h-7 w-7" />
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start lg:items-center min-h-[calc(100vh-4rem)] py-8">
        {/* Esquerda */}
        <div className="flex flex-col items-center lg:items-start gap-10">
          <img src={logo} alt="Logo BPA" className="h-28 md:h-36 w-auto object-contain drop-shadow-xl" />
          <div className="space-y-8 max-w-md">
            <Info
              icon={UserSearch}
              title="Automação e Confiabilidade"
              text="O sistema classifica automaticamente os procedimentos e realiza cálculos como idade do paciente, reduzindo erros e aumentando a precisão."
            />
            <Info
              icon={FileDown}
              title="Relatórios e Prestação de Contas"
              text="Gere relatórios por período e faça o download dos dados de maneira simples, garantindo organização e agilidade nas informações."
            />
          </div>
        </div>

        {/* Direita - card cadastro */}
        <div className="w-full max-w-xl mx-auto rounded-3xl bg-glass backdrop-blur-xl border border-white/40 shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-bpa-darkblue text-center mb-8">Criar Conta</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Nome Completo *">
              <Input value={form.nome} onChange={(v) => set("nome", v)} required />
            </Field>

            <Field label="Email *">
              <Input type="email" value={form.email} onChange={(v) => set("email", v)} required />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="CPF *">
                <Input value={form.cpf} onChange={(v) => set("cpf", v)} required />
              </Field>
              <Field label="Telefone *">
                <Input value={form.telefone} onChange={(v) => set("telefone", v)} required />
              </Field>
            </div>

            <Field label="Senha *">
              <Input type="password" value={form.senha} onChange={(v) => set("senha", v)} required />
            </Field>

            <ul className="text-sm space-y-1 ml-2">
              <Rule ok={rules.min}>Mínimo de 6 caracteres</Rule>
              <Rule ok={rules.upper}>Pelo menos 1 letra maiúscula</Rule>
              <Rule ok={rules.lower}>Pelo menos 1 letra minúscula</Rule>
              <Rule ok={rules.symbol}>Pelo menos 1 símbolo</Rule>
            </ul>

            <Field label="Confirma Senha *">
              <Input type="password" value={form.confirma} onChange={(v) => set("confirma", v)} required />
            </Field>

            <div className="pt-2 border-t border-white/40">
              <p className="text-sm font-semibold text-bpa-darkblue mt-4 mb-3">Endereço (Opcional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="CEP">
                  <Input value={form.cep} onChange={(v) => set("cep", v)} />
                </Field>
                <Field label="Número">
                  <Input value={form.numero} onChange={(v) => set("numero", v)} />
                </Field>
                <Field label="Complemento">
                  <Input value={form.complemento} onChange={(v) => set("complemento", v)} />
                </Field>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="min-w-[200px] px-10 py-3 rounded-full text-white font-semibold bg-bpa-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Criar Conta
              </button>
            </div>

            <p className="text-center text-sm text-bpa-darkblue/80">
              Já tem conta? <Link to="/login" className="font-semibold underline">Entrar</Link>
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

function Input({
  value, onChange, type = "text", required = false,
}: { value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 rounded-full bg-white/70 px-5 outline-none focus:ring-2 focus:ring-bpa-teal/60 shadow-inner"
    />
  );
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-bpa-teal" : "text-bpa-darkblue/60"}`}>
      {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{children}</span>
    </li>
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
