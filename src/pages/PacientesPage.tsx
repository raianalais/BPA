import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Paciente, RACAS_CORES, NACIONALIDADES } from '@/types';
import { validarCPF, formatarCPF, validarCNS } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Search } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  nomeCompleto: string;
  idade: string;
  sexo: string;
  dataNascimento: string;
  racaCor: string;
  etnia: string;
  cns: string;
  cpf: string;
  nacionalidade: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
}

const emptyForm: FormData = {
  nomeCompleto: '', idade: '', sexo: '', dataNascimento: '',
  racaCor: '', etnia: '', cns: '', cpf: '', nacionalidade: '',
  cep: '', logradouro: '', numero: '', bairro: '', complemento: '',
};

function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nasc = new Date(dataNascimento + 'T00:00:00');
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export default function PacientesPage() {
  const { pacientes, addPaciente, updatePaciente } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [search, setSearch] = useState('');

  const filtered = pacientes.filter(p =>
    p.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
    (p.cpf && p.cpf.includes(search)) ||
    p.cns.includes(search)
  );

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.nomeCompleto.trim()) e.nomeCompleto = 'Nome é obrigatório';
    if (!form.dataNascimento) e.dataNascimento = 'Data de nascimento é obrigatória';
    if (!form.sexo) e.sexo = 'Sexo é obrigatório';
    if (!form.racaCor) e.racaCor = 'Raça/Cor é obrigatória';
    if (form.racaCor === 'Indígena' && !form.etnia.trim()) e.etnia = 'Etnia é obrigatória para indígenas';
    if (!validarCNS(form.cns)) e.cns = 'CNS inválido (15 dígitos)';
    if (!form.nacionalidade) e.nacionalidade = 'Nacionalidade é obrigatória';
    if (!form.cep.trim()) e.cep = 'CEP é obrigatório';
    if (!form.logradouro.trim()) e.logradouro = 'Logradouro é obrigatório';
    if (!form.numero.trim()) e.numero = 'Número é obrigatório';
    if (!form.bairro.trim()) e.bairro = 'Bairro é obrigatório';
    if (form.cpf && !validarCPF(form.cpf)) e.cpf = 'CPF inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const idade = calcularIdade(form.dataNascimento);
    const data: Omit<Paciente, 'id' | 'criadoEm'> = {
      nomeCompleto: form.nomeCompleto,
      idade,
      sexo: form.sexo as 'M' | 'F' | 'I',
      dataNascimento: form.dataNascimento,
      racaCor: form.racaCor,
      etnia: form.racaCor === 'Indígena' ? form.etnia : undefined,
      cns: form.cns.replace(/\D/g, ''),
      cpf: form.cpf.replace(/\D/g, '') || undefined,
      nacionalidade: form.nacionalidade,
      cep: form.cep,
      logradouro: form.logradouro,
      numero: form.numero,
      bairro: form.bairro,
      complemento: form.complemento || undefined,
    };
    if (editingId) {
      updatePaciente(editingId, data);
      toast.success('Paciente atualizado com sucesso!');
    } else {
      addPaciente(data);
      toast.success('Paciente cadastrado com sucesso!');
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  function handleEdit(p: Paciente) {
    setEditingId(p.id);
    setForm({
      nomeCompleto: p.nomeCompleto,
      idade: String(p.idade),
      sexo: p.sexo,
      dataNascimento: p.dataNascimento,
      racaCor: p.racaCor,
      etnia: p.etnia || '',
      cns: p.cns,
      cpf: p.cpf ? formatarCPF(p.cpf) : '',
      nacionalidade: p.nacionalidade,
      cep: p.cep || '',
      logradouro: p.logradouro || '',
      numero: p.numero || '',
      bairro: p.bairro || '',
      complemento: p.complemento || '',
    });
    setErrors({});
    setDialogOpen(true);
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie os pacientes cadastrados</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Paciente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome, CPF ou CNS..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {pacientes.length === 0 ? 'Nenhum paciente cadastrado.' : 'Nenhum resultado encontrado.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">Sexo</TableHead>
                  <TableHead className="hidden sm:table-cell">Data Nasc.</TableHead>
                  <TableHead className="hidden md:table-cell">CNS</TableHead>
                  <TableHead className="hidden lg:table-cell">Raça/Cor</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nomeCompleto}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Feminino' : 'Ignorado'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(p.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.cns}</TableCell>
                    <TableCell className="hidden lg:table-cell">{p.racaCor}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome Completo *</Label>
              <Input value={form.nomeCompleto} onChange={e => setForm(f => ({ ...f, nomeCompleto: e.target.value }))} />
              {errors.nomeCompleto && <p className="mt-1 text-xs text-destructive">{errors.nomeCompleto}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <Label>Data de Nascimento *</Label>
                <Input type="date" value={form.dataNascimento} onChange={e => {
                  const v = e.target.value;
                  setForm(f => ({ ...f, dataNascimento: v, idade: v ? String(calcularIdade(v)) : '' }));
                }} />
                {errors.dataNascimento && <p className="mt-1 text-xs text-destructive">{errors.dataNascimento}</p>}
              </div>
              <div>
                <Label>Idade</Label>
                <Input value={form.idade} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Sexo *</Label>
                <Select value={form.sexo} onValueChange={v => setForm(f => ({ ...f, sexo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="I">Ignorado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sexo && <p className="mt-1 text-xs text-destructive">{errors.sexo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <Label>Raça/Cor *</Label>
                <Select value={form.racaCor} onValueChange={v => setForm(f => ({ ...f, racaCor: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {RACAS_CORES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.racaCor && <p className="mt-1 text-xs text-destructive">{errors.racaCor}</p>}
              </div>
              {form.racaCor === 'Indígena' && (
                <div>
                  <Label>Etnia *</Label>
                  <Input value={form.etnia} onChange={e => setForm(f => ({ ...f, etnia: e.target.value }))} />
                  {errors.etnia && <p className="mt-1 text-xs text-destructive">{errors.etnia}</p>}
                </div>
              )}
              <div>
                <Label>Nacionalidade *</Label>
                <Select value={form.nacionalidade} onValueChange={v => setForm(f => ({ ...f, nacionalidade: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {NACIONALIDADES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.nacionalidade && <p className="mt-1 text-xs text-destructive">{errors.nacionalidade}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CNS (Cartão Nacional de Saúde) *</Label>
                <Input value={form.cns} onChange={e => setForm(f => ({ ...f, cns: e.target.value.replace(/\D/g, '').slice(0, 15) }))} placeholder="000000000000000" />
                {errors.cns && <p className="mt-1 text-xs text-destructive">{errors.cns}</p>}
              </div>
              <div>
                <Label>CPF</Label>
                <Input
                  value={form.cpf}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setForm(f => ({ ...f, cpf: formatarCPF(v) }));
                  }}
                  placeholder="000.000.000-00"
                />
                {errors.cpf && <p className="mt-1 text-xs text-destructive">{errors.cpf}</p>}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Endereço</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <Label>CEP *</Label>
                  <Input value={form.cep} onChange={e => setForm(f => ({ ...f, cep: e.target.value.replace(/\D/g, '').slice(0, 8) }))} placeholder="00000000" />
                  {errors.cep && <p className="mt-1 text-xs text-destructive">{errors.cep}</p>}
                </div>
                <div className="col-span-2">
                  <Label>Logradouro *</Label>
                  <Input value={form.logradouro} onChange={e => setForm(f => ({ ...f, logradouro: e.target.value }))} />
                  {errors.logradouro && <p className="mt-1 text-xs text-destructive">{errors.logradouro}</p>}
                </div>
                <div>
                  <Label>Número *</Label>
                  <Input value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} />
                  {errors.numero && <p className="mt-1 text-xs text-destructive">{errors.numero}</p>}
                </div>
                <div>
                  <Label>Bairro *</Label>
                  <Input value={form.bairro} onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))} />
                  {errors.bairro && <p className="mt-1 text-xs text-destructive">{errors.bairro}</p>}
                </div>
                <div>
                  <Label>Complemento</Label>
                  <Input value={form.complemento} onChange={e => setForm(f => ({ ...f, complemento: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editingId ? 'Salvar' : 'Cadastrar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
