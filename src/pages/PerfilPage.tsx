import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProfileData {
  nome_completo: string;
  cpf: string | null;
  registro_profissional: string | null;
  uf_conselho: string | null;
  categoria_profissional: string | null;
}

const emptyProfile: ProfileData = {
  nome_completo: '',
  cpf: '',
  registro_profissional: '',
  uf_conselho: '',
  categoria_profissional: '',
};

export default function PerfilPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [draft, setDraft] = useState<ProfileData>(emptyProfile);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nome_completo, cpf, registro_profissional, uf_conselho, categoria_profissional')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      const p: ProfileData = data ?? emptyProfile;
      setProfile(p);
      setDraft(p);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Falha ao carregar dados do perfil', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!draft.nome_completo.trim()) {
      toast.error('Nome completo é obrigatório');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome_completo: draft.nome_completo.trim(),
          cpf: draft.cpf?.trim() || null,
          registro_profissional: draft.registro_profissional?.trim() || null,
          uf_conselho: draft.uf_conselho?.trim() || null,
          categoria_profissional: draft.categoria_profissional?.trim() || null,
        })
        .eq('user_id', user.id);
      if (error) throw error;
      setProfile(draft);
      setEditing(false);
      toast.success('Perfil atualizado com sucesso');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Falha ao salvar alterações', { description: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Falha ao sair', { description: msg });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('user_id', user.id);
      if (error) throw error;
      await signOut();
      toast.success('Conta excluída');
      navigate('/login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Falha ao excluir conta', { description: msg });
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const field = (key: keyof ProfileData) => (editing ? draft[key] ?? '' : profile[key] ?? '');
  const setField = (key: keyof ProfileData, value: string) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus dados e segurança da conta</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Informações do usuário</CardTitle>
            <CardDescription>Dados cadastrais do faturista</CardDescription>
          </div>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={startEdit} disabled={loading}>
              <Pencil className="h-4 w-4" /> Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando dados...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={field('nome_completo')}
                  onChange={e => setField('nome_completo', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={user?.email ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo / Função</Label>
                <Input
                  id="cargo"
                  value={field('categoria_profissional')}
                  onChange={e => setField('categoria_profissional', e.target.value)}
                  disabled={!editing}
                  placeholder="Ex.: Faturista"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={field('cpf')}
                  onChange={e => setField('cpf', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registro">Registro profissional</Label>
                <Input
                  id="registro"
                  value={field('registro_profissional')}
                  onChange={e => setField('registro_profissional', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF do conselho</Label>
                <Input
                  id="uf"
                  value={field('uf_conselho')}
                  onChange={e => setField('uf_conselho', e.target.value.toUpperCase().slice(0, 2))}
                  disabled={!editing}
                  maxLength={2}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Segurança da conta</CardTitle>
          <CardDescription>Sair da sessão ou excluir sua conta permanentemente</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">Sessão atual</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sair da conta
            </Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" /> Excluir conta
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tem certeza que deseja excluir sua conta?</DialogTitle>
            <DialogDescription>
              Esta ação é permanente e não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Confirmar exclusão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
