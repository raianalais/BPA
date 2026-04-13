import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import logoBpa from '@/assets/logo-bpa.png';

export default function EsqueciSenhaPage() {
  const { resetPassword } = useAuth();
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center space-y-3 pb-2">
          <img src={logoBpa} alt="BPA" className="h-14 w-14 object-contain" />
          <CardTitle className="text-2xl text-primary">Recuperar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">Um link de recuperação foi enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.</p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">Voltar ao login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>E-mail</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">Voltar ao login</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
