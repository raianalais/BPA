import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Paciente } from '@/types';
import { validarCPF, formatarCPF, validarCNS } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Search } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  cns: string;
}

const emptyForm: FormData = { nomeCompleto: '', dataNascimento: '', cpf: '', cns: '' };

export default function PacientesPage() {
  const { pacientes, addPaciente, updatePaciente } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'documento', string>>>({});
  const [search, setSearch] = useState('');

  const filtered = pacientes.filter(p =>
    p.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
    (p.cpf && p.cpf.includes(search)) ||
    (p.cns && p.cns.includes(search))
  );

  function validate(): boolean {
    const e: Partial<Record<keyof FormData | 'documento', string>> = {};
    if (!form.nomeCompleto.trim()) e.nomeCompleto = 'Nome é obrigatório';
    if (!form.dataNascimento) e.dataNascimento = 'Data de nascimento é obrigatória';
    const hasCpf = form.cpf.replace(/\D/g, '').length > 0;
    const hasCns = form.cns.replace(/\D/g, '').length > 0;
    if (!hasCpf && !hasCns) {
      e.documento = 'Informe CPF ou CNS';
    } else {
      if (hasCpf && !validarCPF(form.cpf)) e.cpf = 'CPF inválido';
      if (hasCns && !validarCNS(form.cns)) e.cns = 'CNS inválido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const data = {
      nomeCompleto: form.nomeCompleto,
      dataNascimento: form.dataNascimento,
      cpf: form.cpf.replace(/\D/g, '') || undefined,
      cns: form.cns.replace(/\D/g, '') || undefined,
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
      dataNascimento: p.dataNascimento,
      cpf: p.cpf ? formatarCPF(p.cpf) : '',
      cns: p.cns || '',
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
                  <TableHead className="hidden sm:table-cell">Data Nasc.</TableHead>
                  <TableHead className="hidden md:table-cell">CPF</TableHead>
                  <TableHead className="hidden md:table-cell">CNS</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nomeCompleto}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(p.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.cpf ? formatarCPF(p.cpf) : '—'}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.cns || '—'}</TableCell>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome Completo *</Label>
              <Input value={form.nomeCompleto} onChange={e => setForm(f => ({ ...f, nomeCompleto: e.target.value }))} />
              {errors.nomeCompleto && <p className="mt-1 text-xs text-destructive">{errors.nomeCompleto}</p>}
            </div>
            <div>
              <Label>Data de Nascimento *</Label>
              <Input type="date" value={form.dataNascimento} onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))} />
              {errors.dataNascimento && <p className="mt-1 text-xs text-destructive">{errors.dataNascimento}</p>}
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
            <div>
              <Label>CNS (Cartão Nacional de Saúde)</Label>
              <Input
                value={form.cns}
                onChange={e => setForm(f => ({ ...f, cns: e.target.value.replace(/\D/g, '').slice(0, 15) }))}
                placeholder="000000000000000"
              />
              {errors.cns && <p className="mt-1 text-xs text-destructive">{errors.cns}</p>}
            </div>
            {errors.documento && <p className="text-xs text-destructive">{errors.documento}</p>}
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
