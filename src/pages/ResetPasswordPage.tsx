import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import logoBpa from '@/assets/logo-bpa.png';
import { Check, X } from 'lucide-react';

const passwordRules = [
  { label: 'Mínimo de 6 caracteres', test: (p: string) => p.length >= 6 },
  { label: 'Pelo menos 1 letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Pelo menos 1 letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Pelo menos 1 símbolo', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      toast.error('Link de recuperação inválido.');
      navigate('/login');
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordRules.every(r => r.test(password))) { toast.error('A senha não atende aos requisitos.'); return; }
    if (password !== confirm) { toast.error('As senhas não coincidem.'); return; }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      toast.error('Erro ao redefinir senha.');
    } else {
      toast.success('Senha redefinida com sucesso!');
      navigate('/');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center space-y-3 pb-2">
          <img src={logoBpa} alt="BPA" className="h-14 w-14 object-contain" />
          <CardTitle className="text-2xl text-primary">Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nova Senha</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="mt-2 space-y-1">
                {passwordRules.map((rule, i) => {
                  const passes = rule.test(password);
                  return (
                    <div key={i} className={`flex items-center gap-2 text-xs ${passes ? 'text-success' : 'text-muted-foreground'}`}>
                      {passes ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Confirmar Nova Senha</Label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
              {confirm && password !== confirm && <p className="mt-1 text-xs text-destructive">As senhas não coincidem.</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
