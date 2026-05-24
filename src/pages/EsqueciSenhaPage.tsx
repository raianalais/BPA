import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { ArrowLeft, KeyRound, MailCheck } from 'lucide-react';

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
  paddingRight: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

export default function EsqueciSenhaPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { toast.error('Informe o e-mail.'); return; }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast.error('Erro ao enviar e-mail. Verifique o endereço informado.');
    } else {
      setSent(true);
      toast.success('E-mail de recuperação enviado!');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F5F5] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#0876D6]/40 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 h-[460px] w-[460px] rounded-full bg-[#1A827E]/40 blur-[130px]" />
        <div className="absolute -bottom-20 -right-10 h-[460px] w-[460px] rounded-full bg-[#8574C0]/40 blur-[130px]" />
      </div>

      <button onClick={() => navigate('/login')} className="relative z-10 text-[#043E6E] hover:opacity-70">
        <ArrowLeft className="h-7 w-7" />
      </button>

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center">
        {/* Centered glass card */}
        <div className="w-full rounded-3xl p-8 sm:p-10" style={glassStyle}>
          <div className="mb-6 flex justify-center">
            <img src={logoBpaSemFundo} alt="BPA" className="h-24 w-auto object-contain" />
          </div>
          <h1 className="mb-8 text-center text-4xl font-bold text-[#043E6E]">Recuperar Senha</h1>

          {sent ? (
            <div className="space-y-6 text-center">
              <p className="text-sm text-[#043E6E]/90">
                Um link de recuperação foi enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="flex h-12 w-56 items-center justify-center rounded-full text-base font-medium text-white shadow-lg hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
                >
                  Voltar ao login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="mb-2 block text-[#043E6E]">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={inputStyle}
                  className="border-0 focus-visible:ring-2 focus-visible:ring-[#0876D6]/40"
                />
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-56 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </Button>
              </div>
              <p className="text-center text-sm text-[#043E6E]/80">
                Lembrou a senha?{' '}
                <Link to="/login" className="font-medium text-[#043E6E] underline">Voltar ao login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
