import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao redefinir senha', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Senha redefinida com sucesso!' });
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> Nova Senha
            </CardTitle>
            <CardDescription>Defina sua nova senha de acesso</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite sua nova senha" required />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Redefinir Senha'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
