import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { validarCPF, formatarCPF } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Eye, EyeOff, Check, X, ArrowLeft, UserSearch, FileDown } from 'lucide-react';

const passwordRules = [
  { label: 'Mínimo de 6 caracteres', test: (p: string) => p.length >= 6 },
  { label: 'Pelo menos 1 letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Pelo menos 1 letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Pelo menos 1 símbolo', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

const glassStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
};

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '999px',
  height: '44px',
  paddingLeft: '20px',
  paddingRight: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

export default function CadastroPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nomeCompleto: '', email: '', cpf: '', telefone: '',
    senha: '', confirmarSenha: '',
    cep: '', numero: '', complemento: '',
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nomeCompleto.trim()) { toast.error('Informe o nome completo.'); return; }
    if (!form.email.trim()) { toast.error('Informe o e-mail.'); return; }
    if (!validarCPF(form.cpf)) { toast.error('CPF inválido.'); return; }
    if (!form.telefone.trim()) { toast.error('Informe o telefone.'); return; }

    const allRulesPass = passwordRules.every(r => r.test(form.senha));
    if (!allRulesPass) { toast.error('A senha não atende aos requisitos mínimos.'); return; }
    if (form.senha !== form.confirmarSenha) { toast.error('As senhas não coincidem.'); return; }

    setLoading(true);
    const { error } = await signUp(form.email, form.senha, {
      nome_completo: form.nomeCompleto,
      cpf: form.cpf.replace(/\D/g, ''),
      telefone: form.telefone,
    });
    setLoading(false);

    if (error) toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
    else { toast.success('Conta criada! Verifique seu e-mail para confirmar.'); navigate('/login'); }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#F5F5F5] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#0876D6]/40 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 h-[460px] w-[460px] rounded-full bg-[#1A827E]/40 blur-[130px]" />
        <div className="absolute -bottom-20 -right-10 h-[460px] w-[460px] rounded-full bg-[#8574C0]/40 blur-[130px]" />
      </div>

      <button onClick={() => navigate('/inicio')} className="relative z-10 text-[#043E6E] hover:opacity-70">
        <ArrowLeft className="h-7 w-7" />
      </button>

      <div className="relative mx-auto mt-4 grid h-[calc(100vh-96px)] max-w-6xl items-start gap-10 lg:grid-cols-2">
        {/* Left */}
        <div className="space-y-8 overflow-y-auto pr-2">
          <img src={logoBpaSemFundo} alt="BPA" className="h-32 w-auto object-contain" />
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1A827E, #0876D6)' }}>
                <UserSearch className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#043E6E]">Automação e Confiabilidade</h3>
                <p className="text-sm leading-relaxed text-[#043E6E]/80">
                  O sistema classifica automaticamente os procedimentos e realiza cálculos como idade do paciente, reduzindo erros e aumentando a precisão.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1A827E, #0876D6)' }}>
                <FileDown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#043E6E]">Relatórios e Prestação de Contas</h3>
                <p className="text-sm leading-relaxed text-[#043E6E]/80">
                  Gere relatórios por período e faça o download dos dados de maneira simples, garantindo organização e agilidade nas informações.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: glass card */}
        <div className="flex h-full flex-col overflow-hidden rounded-3xl p-8 sm:p-10" style={glassStyle}>
          <h1 className="mb-6 text-center text-3xl font-bold text-[#043E6E]">Criar Conta</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-[#043E6E]">Nome Completo *</Label>
              <Input value={form.nomeCompleto} onChange={e => set('nomeCompleto', e.target.value)} style={inputStyle} className="border-0" />
            </div>
            <div>
              <Label className="mb-1.5 block text-[#043E6E]">Email *</Label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} className="border-0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block text-[#043E6E]">CPF *</Label>
                <Input
                  value={form.cpf}
                  onChange={e => set('cpf', formatarCPF(e.target.value.replace(/\D/g, '').slice(0, 11)))}
                  style={inputStyle} className="border-0"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-[#043E6E]">Telefone *</Label>
                <Input
                  value={form.telefone}
                  onChange={e => set('telefone', e.target.value.replace(/\D/g, '').slice(0, 11))}
                  style={inputStyle} className="border-0"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block text-[#043E6E]">Senha *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={e => set('senha', e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }} className="border-0"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E6E]/70" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1 pl-2">
                {passwordRules.map((rule, i) => {
                  const passes = rule.test(form.senha);
                  return (
                    <div key={i} className={`flex items-center gap-2 text-xs ${passes ? 'text-[#1A827E]' : 'text-[#043E6E]/60'}`}>
                      {passes ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block text-[#043E6E]">Confirma Senha *</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmarSenha}
                onChange={e => set('confirmarSenha', e.target.value)}
                style={inputStyle} className="border-0"
              />
              {form.confirmarSenha && form.senha !== form.confirmarSenha && (
                <p className="mt-1 pl-2 text-xs text-destructive">As senhas não coincidem.</p>
              )}
            </div>

            <div className="border-t border-white/40 pt-4">
              <p className="mb-3 text-sm font-medium text-[#043E6E]/70">Endereço (Opcional)</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="mb-1.5 block text-xs text-[#043E6E]">CEP</Label>
                  <Input value={form.cep} onChange={e => set('cep', e.target.value.replace(/\D/g, '').slice(0, 8))} style={inputStyle} className="border-0" />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-[#043E6E]">Número</Label>
                  <Input value={form.numero} onChange={e => set('numero', e.target.value)} style={inputStyle} className="border-0" />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-[#043E6E]">Complemento</Label>
                  <Input value={form.complemento} onChange={e => set('complemento', e.target.value)} style={inputStyle} className="border-0" />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-56 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
              >
                {loading ? 'Criando...' : 'Cadastrar'}
              </Button>
            </div>
            <p className="text-center text-sm text-[#043E6E]/80">
              Já tem conta? <Link to="/login" className="font-medium text-[#043E6E] underline">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
