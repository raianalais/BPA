import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileBarChart, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';

function calcularIdade(dataNascimento: string, dataReferencia: string): number {
  const nasc = new Date(dataNascimento + 'T00:00:00');
  const ref = new Date(dataReferencia + 'T00:00:00');
  let idade = ref.getFullYear() - nasc.getFullYear();
  const m = ref.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < nasc.getDate())) idade--;
  return idade;
}

function getFaixaEtaria(idade: number): string {
  if (idade < 0) return 'Inválido';
  if (idade <= 5) return '0-5';
  if (idade <= 12) return '6-12';
  if (idade <= 17) return '13-17';
  if (idade <= 29) return '18-29';
  if (idade <= 44) return '30-44';
  if (idade <= 59) return '45-59';
  return '60+';
}

export default function RelatoriosPage() {
  const { atendimentos, pacientes, getPaciente, getProfissional } = useApp();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const filtered = useMemo(() => {
    if (!dataInicio || !dataFim) return [];
    return atendimentos.filter(a => a.dataAtendimento >= dataInicio && a.dataAtendimento <= dataFim);
  }, [atendimentos, dataInicio, dataFim]);

  const totalBpaC = filtered.reduce((acc, a) => acc + a.procedimentos.filter(p => p.classificacao === 'BPA-C').length, 0);
  const totalBpaI = filtered.reduce((acc, a) => acc + a.procedimentos.filter(p => p.classificacao === 'BPA-I').length, 0);

  // Relatório avançado: pacientes por faixa etária por procedimento
  const relatorioAvancado = useMemo(() => {
    if (filtered.length === 0) return [];

    const mapa: Record<string, Record<string, Set<string>>> = {};

    for (const a of filtered) {
      const pac = getPaciente(a.pacienteId);
      if (!pac) continue;
      const idade = calcularIdade(pac.dataNascimento, a.dataAtendimento);
      const faixa = getFaixaEtaria(idade);

      for (const p of a.procedimentos) {
        const key = `${p.codigoSUS}|${p.descricao}|${p.classificacao}`;
        if (!mapa[key]) mapa[key] = {};
        if (!mapa[key][faixa]) mapa[key][faixa] = new Set();
        mapa[key][faixa].add(a.pacienteId);
      }
    }

    return Object.entries(mapa).map(([key, faixas]) => {
      const [codigoSUS, descricao, classificacao] = key.split('|');
      const faixasArr = Object.entries(faixas).map(([faixa, pacIds]) => ({
        faixa,
        quantidade: pacIds.size,
      })).sort((a, b) => a.faixa.localeCompare(b.faixa));
      const total = faixasArr.reduce((s, f) => s + f.quantidade, 0);
      return { codigoSUS, descricao, classificacao, faixas: faixasArr, total };
    }).sort((a, b) => a.codigoSUS.localeCompare(b.codigoSUS));
  }, [filtered, getPaciente]);

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

  function downloadRelatorioAvancado() {
    if (relatorioAvancado.length === 0) {
      toast.error('Não há dados para gerar o relatório avançado.');
      return;
    }

    const faixas = ['0-5', '6-12', '13-17', '18-29', '30-44', '45-59', '60+'];
    const header = `Código SUS,Procedimento,Classificação,${faixas.join(',')},Total\n`;
    const rows = relatorioAvancado.map(r => {
      const faixaValues = faixas.map(f => {
        const found = r.faixas.find(fx => fx.faixa === f);
        return found ? found.quantidade : 0;
      });
      return `${r.codigoSUS},"${r.descricao}",${r.classificacao},${faixaValues.join(',')},${r.total}`;
    });

    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-avancado-${dataInicio}-a-${dataFim}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Relatório avançado baixado com sucesso!');
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

          <Tabs defaultValue="geral">
            <TabsList>
              <TabsTrigger value="geral">Relatório Geral</TabsTrigger>
              <TabsTrigger value="avancado">Por Faixa Etária</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={downloadCSV} disabled={filtered.length === 0} className="gap-2">
                  <Download className="h-4 w-4" /> Baixar CSV
                </Button>
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
            </TabsContent>

            <TabsContent value="avancado" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> Pacientes por faixa etária e procedimento
                </p>
                <Button onClick={downloadRelatorioAvancado} disabled={relatorioAvancado.length === 0} className="gap-2">
                  <Download className="h-4 w-4" /> Baixar CSV
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  {relatorioAvancado.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      Nenhum dado disponível para o período selecionado.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Procedimento</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-center">0-5</TableHead>
                            <TableHead className="text-center">6-12</TableHead>
                            <TableHead className="text-center">13-17</TableHead>
                            <TableHead className="text-center">18-29</TableHead>
                            <TableHead className="text-center">30-44</TableHead>
                            <TableHead className="text-center">45-59</TableHead>
                            <TableHead className="text-center">60+</TableHead>
                            <TableHead className="text-center font-bold">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorioAvancado.map(r => {
                            const faixas = ['0-5', '6-12', '13-17', '18-29', '30-44', '45-59', '60+'];
                            return (
                              <TableRow key={r.codigoSUS}>
                                <TableCell className="font-mono text-xs">{r.codigoSUS}</TableCell>
                                <TableCell className="max-w-[200px] truncate text-sm">{r.descricao}</TableCell>
                                <TableCell>
                                  <Badge variant={r.classificacao === 'BPA-C' ? 'default' : 'secondary'} className="text-[10px]">
                                    {r.classificacao}
                                  </Badge>
                                </TableCell>
                                {faixas.map(f => {
                                  const found = r.faixas.find(fx => fx.faixa === f);
                                  return (
                                    <TableCell key={f} className="text-center">
                                      {found ? found.quantidade : 0}
                                    </TableCell>
                                  );
                                })}
                                <TableCell className="text-center font-bold">{r.total}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
