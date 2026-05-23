import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Eye, EyeOff, ArrowLeft, ClipboardCheck, TrendingUp } from 'lucide-react';

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
  height: '48px',
  paddingLeft: '20px',
  paddingRight: '44px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { toast.error('Informe o e-mail.'); return; }
    if (!password) { toast.error('Informe a senha.'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast.error('E-mail ou senha inválidos. Tente novamente.');
    else navigate('/');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F5F5] px-4 py-8">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#0876D6]/40 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 h-[460px] w-[460px] rounded-full bg-[#1A827E]/40 blur-[130px]" />
        <div className="absolute -bottom-20 -right-10 h-[460px] w-[460px] rounded-full bg-[#8574C0]/40 blur-[130px]" />
      </div>

      {/* Back */}
      <button onClick={() => navigate('/inicio')} className="relative z-10 text-[#043E6E] hover:opacity-70">
        <ArrowLeft className="h-7 w-7" />
      </button>

      <div className="relative mx-auto mt-4 grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        {/* Left: logo + info */}
        <div className="space-y-8">
          <img src={logoBpaSemFundo} alt="BPA" className="h-32 w-auto object-contain" />
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1A827E, #0876D6)' }}>
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#043E6E]">Registro de Atendimentos</h3>
                <p className="text-sm leading-relaxed text-[#043E6E]/80">
                  Registre procedimentos, dados do paciente e do profissional de forma rápida e segura, garantindo a identificação correta de cada atendimento.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1A827E, #0876D6)' }}>
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#043E6E]">Gestão e Eficiência</h3>
                <p className="text-sm leading-relaxed text-[#043E6E]/80">
                  Encontre e acompanhe informações com filtros e seleções inteligentes, otimizando o tempo e facilitando o trabalho da equipe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: glass card */}
        <div className="rounded-3xl p-8 sm:p-10" style={glassStyle}>
          <h1 className="mb-8 text-center text-4xl font-bold text-[#043E6E]">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="mb-2 block text-[#043E6E]">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} className="border-0 focus-visible:ring-2 focus-visible:ring-[#0876D6]/40" />
            </div>
            <div>
              <Label className="mb-2 block text-[#043E6E]">Senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                  className="border-0 focus-visible:ring-2 focus-visible:ring-[#0876D6]/40"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E6E]/70" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/esqueci-senha" className="text-sm text-[#043E6E] underline hover:opacity-70">Recuperar Senha</Link>
            </div>
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-56 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
              >
                {loading ? 'Entrando...' : 'Login'}
              </Button>
            </div>
            <p className="text-center text-sm text-[#043E6E]/80">
              Não tem conta? <Link to="/cadastro" className="font-medium text-[#043E6E] underline">Criar conta</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
