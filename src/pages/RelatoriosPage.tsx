import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileBarChart } from 'lucide-react';
import { toast } from 'sonner';

export default function RelatoriosPage() {
  const { atendimentos, getPaciente, getProfissional } = useApp();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const filtered = useMemo(() => {
    if (!dataInicio || !dataFim) return [];
    return atendimentos.filter(a => a.dataAtendimento >= dataInicio && a.dataAtendimento <= dataFim);
  }, [atendimentos, dataInicio, dataFim]);

  const totalBpaC = filtered.reduce((acc, a) => acc + a.procedimentos.filter(p => p.classificacao === 'BPA-C').length, 0);
  const totalBpaI = filtered.reduce((acc, a) => acc + a.procedimentos.filter(p => p.classificacao === 'BPA-I').length, 0);

  function downloadCSV() {
    if (filtered.length === 0) {
      toast.error('Não há dados no período selecionado para gerar o relatório.');
      return;
    }

    const header = 'Data,Paciente,CPF/CNS,Profissional,Código SUS,Procedimento,Classificação,Quantidade\n';
    const rows = filtered.flatMap(a => {
      const pac = getPaciente(a.pacienteId);
      const prof = getProfissional(a.profissionalId);
      return a.procedimentos.map(p =>
        `${a.dataAtendimento},${pac?.nomeCompleto || ''},${pac?.cpf || pac?.cns || ''},${prof?.nomeCompleto || ''},${p.codigoSUS},${p.descricao},${p.classificacao},${p.quantidade}`
      );
    });

    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-bpa-${dataInicio}-a-${dataFim}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Relatório baixado com sucesso!');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios BPA</h1>
        <p className="text-sm text-muted-foreground">Gere relatórios de produção ambulatorial</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileBarChart className="h-4 w-4 text-primary" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div>
              <Label>Data Inicial</Label>
              <Input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            </div>
            <div>
              <Label>Data Final</Label>
              <Input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </div>
            <Button onClick={downloadCSV} disabled={!dataInicio || !dataFim} className="gap-2">
              <Download className="h-4 w-4" /> Baixar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {dataInicio && dataFim && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Atendimentos</p>
                <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">BPA-C (Consolidado)</p>
                <p className="text-2xl font-bold text-primary">{totalBpaC}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">BPA-I (Individualizado)</p>
                <p className="text-2xl font-bold text-info">{totalBpaI}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum atendimento encontrado no período selecionado.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead className="hidden md:table-cell">Profissional</TableHead>
                      <TableHead>Procedimento</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.flatMap(a => {
                      const pac = getPaciente(a.pacienteId);
                      const prof = getProfissional(a.profissionalId);
                      return a.procedimentos.map((p, i) => (
                        <TableRow key={`${a.id}-${i}`}>
                          <TableCell>{new Date(a.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="font-medium">{pac?.nomeCompleto || '—'}</TableCell>
                          <TableCell className="hidden md:table-cell">{prof?.nomeCompleto || '—'}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs text-muted-foreground">{p.codigoSUS}</span>
                            <span className="ml-1 text-sm">{p.descricao}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={p.classificacao === 'BPA-C' ? 'default' : 'secondary'} className="text-[10px]">
                              {p.classificacao}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ));
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
