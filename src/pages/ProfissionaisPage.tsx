import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Profissional, UFS_BRASIL } from '@/types';
import { validarCPF, formatarCPF, validarRegistroProfissional } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  nomeCompleto: string;
  cpf: string;
  registroProfissional: string;
  ufConselho: string;
  cbo: string;
  cnsProfissional: string;
}

const emptyForm: FormData = { nomeCompleto: '', cpf: '', registroProfissional: '', ufConselho: '', cbo: '', cnsProfissional: '' };

export default function ProfissionaisPage() {
  const { profissionais, addProfissional, updateProfissional, deleteProfissional } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [search, setSearch] = useState('');

  const filtered = profissionais.filter(p =>
    p.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search)
  );

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.nomeCompleto.trim()) e.nomeCompleto = 'Nome é obrigatório';
    if (!validarCPF(form.cpf)) e.cpf = 'CPF inválido';
    if (!validarRegistroProfissional(form.registroProfissional)) e.registroProfissional = 'Registro profissional inválido (4-10 dígitos)';
    if (!form.ufConselho) e.ufConselho = 'UF do conselho é obrigatória';
    if (!form.cbo.trim()) e.cbo = 'CBO é obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const data = {
      nomeCompleto: form.nomeCompleto,
      cpf: form.cpf.replace(/\D/g, ''),
      registroProfissional: form.registroProfissional,
      ufConselho: form.ufConselho,
      cbo: form.cbo,
      cnsProfissional: form.cnsProfissional || undefined,
    };
    if (editingId) {
      updateProfissional(editingId, data);
      toast.success('Profissional atualizado com sucesso!');
    } else {
      addProfissional(data);
      toast.success('Profissional cadastrado com sucesso!');
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  function handleEdit(p: Profissional) {
    setEditingId(p.id);
    setForm({
      nomeCompleto: p.nomeCompleto,
      cpf: formatarCPF(p.cpf),
      registroProfissional: p.registroProfissional,
      ufConselho: p.ufConselho,
      cbo: p.cbo,
      cnsProfissional: p.cnsProfissional || '',
    });
    setErrors({});
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    const result = deleteProfissional(id);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
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
          <h1 className="text-2xl font-bold text-foreground">Profissionais</h1>
          <p className="text-sm text-muted-foreground">Gerencie os profissionais de saúde</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Profissional
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou CPF..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {profissionais.length === 0 ? 'Nenhum profissional cadastrado.' : 'Nenhum resultado encontrado.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">CPF</TableHead>
                  <TableHead className="hidden md:table-cell">Registro</TableHead>
                  <TableHead className="hidden lg:table-cell">CBO</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nomeCompleto}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatarCPF(p.cpf)}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.registroProfissional} ({p.ufConselho})</TableCell>
                    <TableCell className="hidden lg:table-cell">{p.cbo}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
            <DialogTitle>{editingId ? 'Editar Profissional' : 'Novo Profissional'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome Completo *</Label>
              <Input value={form.nomeCompleto} onChange={e => setForm(f => ({ ...f, nomeCompleto: e.target.value }))} />
              {errors.nomeCompleto && <p className="mt-1 text-xs text-destructive">{errors.nomeCompleto}</p>}
            </div>
            <div>
              <Label>CPF *</Label>
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
              <Label>Registro Profissional *</Label>
              <Input value={form.registroProfissional} onChange={e => setForm(f => ({ ...f, registroProfissional: e.target.value }))} placeholder="Ex: CRO-12345" />
              {errors.registroProfissional && <p className="mt-1 text-xs text-destructive">{errors.registroProfissional}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>UF do Conselho *</Label>
                <Select value={form.ufConselho} onValueChange={v => setForm(f => ({ ...f, ufConselho: v }))}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>
                    {UFS_BRASIL.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.ufConselho && <p className="mt-1 text-xs text-destructive">{errors.ufConselho}</p>}
              </div>
              <div>
                <Label>CBO - Ocupação Profissional *</Label>
                <Input value={form.cbo} onChange={e => setForm(f => ({ ...f, cbo: e.target.value }))} placeholder="Ex: 2232-08" />
                {errors.cbo && <p className="mt-1 text-xs text-destructive">{errors.cbo}</p>}
              </div>
            </div>
            <div>
              <Label>CNS do Profissional</Label>
              <Input value={form.cnsProfissional} onChange={e => setForm(f => ({ ...f, cnsProfissional: e.target.value.replace(/\D/g, '').slice(0, 15) }))} placeholder="000000000000000" />
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
