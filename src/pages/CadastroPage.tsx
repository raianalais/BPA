import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { validarCPF, formatarCPF } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const passwordRules = [
  { label: 'Mínimo de 6 caracteres', test: (p: string) => p.length >= 6 },
  { label: 'Pelo menos 1 letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Pelo menos 1 letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Pelo menos 1 símbolo', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

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

    if (error) {
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
    } else {
      toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      navigate('/login');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center space-y-3 pb-2">
          <img src={logoBpa} alt="BPA" className="h-14 w-14 object-contain" />
          <CardTitle className="text-2xl text-primary">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome Completo *</Label>
              <Input value={form.nomeCompleto} onChange={e => set('nomeCompleto', e.target.value)} />
            </div>
            <div>
              <Label>E-mail *</Label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CPF *</Label>
                <Input
                  value={form.cpf}
                  onChange={e => set('cpf', formatarCPF(e.target.value.replace(/\D/g, '').slice(0, 11)))}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label>Telefone *</Label>
                <Input
                  value={form.telefone}
                  onChange={e => set('telefone', e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="11999999999"
                />
              </div>
            </div>

            <div>
              <Label>Senha *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={e => set('senha', e.target.value)}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {passwordRules.map((rule, i) => {
                  const passes = rule.test(form.senha);
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
              <Label>Confirmar Senha *</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmarSenha}
                onChange={e => set('confirmarSenha', e.target.value)}
              />
              {form.confirmarSenha && form.senha !== form.confirmarSenha && (
                <p className="mt-1 text-xs text-destructive">As senhas não coincidem.</p>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Endereço (opcional)</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>CEP</Label>
                  <Input value={form.cep} onChange={e => set('cep', e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="00000000" />
                </div>
                <div>
                  <Label>Número</Label>
                  <Input value={form.numero} onChange={e => set('numero', e.target.value)} />
                </div>
                <div>
                  <Label>Complemento</Label>
                  <Input value={form.complemento} onChange={e => set('complemento', e.target.value)} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem conta? <Link to="/login" className="font-medium text-primary hover:underline">Entrar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
