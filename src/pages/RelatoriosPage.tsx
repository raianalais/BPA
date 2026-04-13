import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileBarChart, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function RelatoriosPage() {
  const { atendimentos, getPaciente, getProfissional } = useApp();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // BPA-C header fields
  const [cnesBpaC, setCnesBpaC] = useState('');
  const [nomeEstabelecimentoBpaC, setNomeEstabelecimentoBpaC] = useState('');
  const [ufBpaC, setUfBpaC] = useState('');
  const [mesAnoBpaC, setMesAnoBpaC] = useState('');

  // BPA-I header fields
  const [cnesBpaI, setCnesBpaI] = useState('');
  const [nomeEstabelecimentoBpaI, setNomeEstabelecimentoBpaI] = useState('');
  const [cnsProfissionalBpaI, setCnsProfissionalBpaI] = useState('');
  const [cboBpaI, setCboBpaI] = useState('');
  const [equipeBpaI, setEquipeBpaI] = useState('');

  const filtered = useMemo(() => {
    if (!dataInicio || !dataFim) return [];
    return atendimentos.filter(a => a.dataAtendimento >= dataInicio && a.dataAtendimento <= dataFim);
  }, [atendimentos, dataInicio, dataFim]);

  const bpaCData = useMemo(() => {
    let seq = 0;
    return filtered.flatMap(a => {
      const pac = getPaciente(a.pacienteId);
      const prof = getProfissional(a.profissionalId);
      return a.procedimentos
        .filter(p => p.classificacao === 'BPA-C')
        .map(p => ({ seq: ++seq, procedimento: `${p.codigoSUS} - ${p.descricao}`, cbo: prof?.cbo || '', idade: pac?.idade ?? '', quantidade: p.quantidade }));
    });
  }, [filtered, getPaciente, getProfissional]);

  const bpaIData = useMemo(() => {
    return filtered.flatMap(a => {
      const pac = getPaciente(a.pacienteId);
      return a.procedimentos
        .filter(p => p.classificacao === 'BPA-I')
        .map(p => ({
          cns: pac?.cns || '',
          nome: pac?.nomeCompleto || '',
          sexo: pac?.sexo === 'M' ? 'Masculino' : pac?.sexo === 'F' ? 'Feminino' : 'Ignorado',
          dataNascimento: pac?.dataNascimento || '',
          nacionalidade: pac?.nacionalidade || '',
          racaCor: pac?.racaCor || '',
          etnia: pac?.etnia || '',
          dataAtendimento: a.dataAtendimento,
          codigoProcedimento: p.codigoSUS,
          quantidade: p.quantidade,
        }));
    });
  }, [filtered, getPaciente]);

  function buildBpaCContent(separator: string, ext: 'csv' | 'txt') {
    const headerLines: string[] = [];
    if (cnesBpaC) headerLines.push(`CNES${separator}${cnesBpaC}`);
    if (nomeEstabelecimentoBpaC) headerLines.push(`Estabelecimento${separator}${nomeEstabelecimentoBpaC}`);
    if (ufBpaC) headerLines.push(`UF${separator}${ufBpaC}`);
    if (mesAnoBpaC) headerLines.push(`Mês/Ano${separator}${mesAnoBpaC}`);
    if (headerLines.length) headerLines.push('');

    const colHeader = ['Seq', 'Procedimento', 'CBO', 'Idade', 'Quantidade'].join(separator);
    const rows = bpaCData.map(r => [r.seq, r.procedimento, r.cbo, r.idade, r.quantidade].join(separator));
    return headerLines.join('\n') + colHeader + '\n' + rows.join('\n');
  }

  function buildBpaIContent(separator: string, ext: 'csv' | 'txt') {
    const headerLines: string[] = [];
    if (cnesBpaI) headerLines.push(`CNES${separator}${cnesBpaI}`);
    if (nomeEstabelecimentoBpaI) headerLines.push(`Estabelecimento${separator}${nomeEstabelecimentoBpaI}`);
    if (cnsProfissionalBpaI) headerLines.push(`CNS Profissional${separator}${cnsProfissionalBpaI}`);
    if (cboBpaI) headerLines.push(`CBO${separator}${cboBpaI}`);
    if (equipeBpaI) headerLines.push(`Equipe${separator}${equipeBpaI}`);
    if (headerLines.length) headerLines.push('');

    const colHeader = ['CNS', 'Nome', 'Sexo', 'Data Nascimento', 'Nacionalidade', 'Raça/Cor', 'Etnia', 'Data Atendimento', 'Código Procedimento', 'Quantidade'].join(separator);
    const rows = bpaIData.map(r => [
      r.cns, r.nome, r.sexo,
      r.dataNascimento ? new Date(r.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : '',
      r.nacionalidade, r.racaCor, r.etnia,
      r.dataAtendimento ? new Date(r.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR') : '',
      r.codigoProcedimento, r.quantidade,
    ].join(separator));
    return headerLines.join('\n') + colHeader + '\n' + rows.join('\n');
  }

  function download(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Relatório baixado com sucesso!');
  }

  function downloadBpaC(ext: 'csv' | 'txt') {
    if (bpaCData.length === 0) { toast.error('Não há dados BPA-C no período.'); return; }
    const sep = ext === 'csv' ? ',' : '\t';
    const content = buildBpaCContent(sep, ext);
    download(content, `bpa-c-${dataInicio}-a-${dataFim}.${ext}`, ext === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;');
  }

  function downloadBpaI(ext: 'csv' | 'txt') {
    if (bpaIData.length === 0) { toast.error('Não há dados BPA-I no período.'); return; }
    const sep = ext === 'csv' ? ',' : '\t';
    const content = buildBpaIContent(sep, ext);
    download(content, `bpa-i-${dataInicio}-a-${dataFim}.${ext}`, ext === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;');
  }

  const totalBpaC = bpaCData.length;
  const totalBpaI = bpaIData.length;
  const hasDateRange = dataInicio && dataFim;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios BPA</h1>
        <p className="text-sm text-muted-foreground">Gere relatórios de produção ambulatorial</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileBarChart className="h-4 w-4 text-primary" /> Período
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

      {hasDateRange && (
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

          <Tabs defaultValue="bpa-c" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bpa-c">BPA-C (Consolidado)</TabsTrigger>
              <TabsTrigger value="bpa-i">BPA-I (Individualizado)</TabsTrigger>
            </TabsList>

            <TabsContent value="bpa-c" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cabeçalho BPA-C (opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div><Label>CNES</Label><Input value={cnesBpaC} onChange={e => setCnesBpaC(e.target.value)} placeholder="Código CNES" /></div>
                    <div><Label>Nome do Estabelecimento</Label><Input value={nomeEstabelecimentoBpaC} onChange={e => setNomeEstabelecimentoBpaC(e.target.value)} /></div>
                    <div><Label>UF</Label><Input value={ufBpaC} onChange={e => setUfBpaC(e.target.value)} maxLength={2} placeholder="Ex: SP" /></div>
                    <div><Label>Mês/Ano</Label><Input value={mesAnoBpaC} onChange={e => setMesAnoBpaC(e.target.value)} placeholder="Ex: 04/2026" /></div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => downloadBpaC('csv')} disabled={bpaCData.length === 0} className="gap-2">
                  <Download className="h-4 w-4" /> CSV
                </Button>
                <Button onClick={() => downloadBpaC('txt')} disabled={bpaCData.length === 0} variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" /> TXT
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  {bpaCData.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">Nenhum procedimento BPA-C no período.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Seq</TableHead>
                          <TableHead>Procedimento</TableHead>
                          <TableHead>CBO</TableHead>
                          <TableHead>Idade</TableHead>
                          <TableHead>Qtd</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bpaCData.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell>{r.seq}</TableCell>
                            <TableCell>{r.procedimento}</TableCell>
                            <TableCell>{r.cbo}</TableCell>
                            <TableCell>{r.idade}</TableCell>
                            <TableCell>{r.quantidade}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bpa-i" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cabeçalho BPA-I (opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div><Label>CNES</Label><Input value={cnesBpaI} onChange={e => setCnesBpaI(e.target.value)} placeholder="Código CNES" /></div>
                    <div><Label>Nome do Estabelecimento</Label><Input value={nomeEstabelecimentoBpaI} onChange={e => setNomeEstabelecimentoBpaI(e.target.value)} /></div>
                    <div><Label>CNS do Profissional</Label><Input value={cnsProfissionalBpaI} onChange={e => setCnsProfissionalBpaI(e.target.value)} /></div>
                    <div><Label>CBO</Label><Input value={cboBpaI} onChange={e => setCboBpaI(e.target.value)} /></div>
                    <div><Label>Equipe</Label><Input value={equipeBpaI} onChange={e => setEquipeBpaI(e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => downloadBpaI('csv')} disabled={bpaIData.length === 0} className="gap-2">
                  <Download className="h-4 w-4" /> CSV
                </Button>
                <Button onClick={() => downloadBpaI('txt')} disabled={bpaIData.length === 0} variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" /> TXT
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  {bpaIData.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">Nenhum procedimento BPA-I no período.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>CNS</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Sexo</TableHead>
                            <TableHead>Data Nasc.</TableHead>
                            <TableHead>Nacionalidade</TableHead>
                            <TableHead>Raça/Cor</TableHead>
                            <TableHead>Etnia</TableHead>
                            <TableHead>Data Atend.</TableHead>
                            <TableHead>Cód. Proc.</TableHead>
                            <TableHead>Qtd</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bpaIData.map((r, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono text-xs">{r.cns}</TableCell>
                              <TableCell>{r.nome}</TableCell>
                              <TableCell>{r.sexo}</TableCell>
                              <TableCell>{r.dataNascimento ? new Date(r.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : ''}</TableCell>
                              <TableCell>{r.nacionalidade}</TableCell>
                              <TableCell>{r.racaCor}</TableCell>
                              <TableCell>{r.etnia}</TableCell>
                              <TableCell>{r.dataAtendimento ? new Date(r.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR') : ''}</TableCell>
                              <TableCell className="font-mono text-xs">{r.codigoProcedimento}</TableCell>
                              <TableCell>{r.quantidade}</TableCell>
                            </TableRow>
                          ))}
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
