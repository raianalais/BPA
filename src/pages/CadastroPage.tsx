import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { validarCPF } from '@/lib/validators';
import { CATEGORIAS_PROFISSIONAIS, UFS_BRASIL } from '@/types';

export default function CadastroPage() {
  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    registroProfissional: '',
    ufConselho: '',
    categoriaProfissional: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nomeCompleto, email, cpf, registroProfissional, ufConselho, categoriaProfissional, password, confirmPassword } = form;

    if (!nomeCompleto || !email || !cpf || !registroProfissional || !ufConselho || !categoriaProfissional || !password) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }
    if (!validarCPF(cpf)) {
      toast({ title: 'CPF inválido', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error, session: signUpSession } = await signUp(email, password, {
      nome_completo: nomeCompleto,
      cpf,
      registro_profissional: registroProfissional,
      uf_conselho: ufConselho,
      categoria_profissional: categoriaProfissional,
      role: 'profissional',
    });

    if (error) {
      setLoading(false);
      toast({ title: 'Erro ao cadastrar', description: error, variant: 'destructive' });
      return;
    }

    if (signUpSession) {
      setLoading(false);
      toast({ title: 'Cadastro realizado!', description: 'Conta criada e logada com sucesso.' });
      navigate('/dashboard');
      return;
    }

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (!signInError) {
      toast({ title: 'Cadastro realizado!', description: 'Conta criada e logada com sucesso.' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Cadastro realizado!', description: 'Conta criada com sucesso. Faça login para acessar.' });
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Cadastro de Profissional</h1>
          <p className="text-sm text-muted-foreground">Preencha os dados para criar sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Novo Cadastro
            </CardTitle>
            <CardDescription>Apenas profissionais podem se cadastrar diretamente. Alunos devem ser cadastrados por um profissional.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input value={form.nomeCompleto} onChange={e => update('nomeCompleto', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF *</Label>
                  <Input value={form.cpf} onChange={e => update('cpf', e.target.value)} placeholder="000.000.000-00" required />
                </div>
                <div className="space-y-2">
                  <Label>Registro Profissional *</Label>
                  <Input value={form.registroProfissional} onChange={e => update('registroProfissional', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>UF Conselho *</Label>
                  <Select value={form.ufConselho} onValueChange={v => update('ufConselho', v)}>
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      {UFS_BRASIL.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={form.categoriaProfissional} onValueChange={v => update('categoriaProfissional', v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_PROFISSIONAIS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Senha *</Label>
                  <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Digite sua senha" required />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Senha *</Label>
                  <Input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
              <Link to="/login" className="text-sm text-primary hover:underline">
                Já tenho uma conta
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
