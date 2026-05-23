import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, ClipboardList, FileBarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profissionais, pacientes, atendimentos } = useApp();
  const navigate = useNavigate();

  const bpaC = atendimentos.reduce((acc, a) => acc + a.procedimentos.filter(p => p.classificacao === 'BPA-C').length, 0);
  const bpaI = atendimentos.reduce((acc, a) => acc + a.procedimentos.filter(p => p.classificacao === 'BPA-I').length, 0);

  const stats = [
    { title: 'Profissionais', value: profissionais.length, icon: Users, onClick: () => navigate('/profissionais') },
    { title: 'Pacientes', value: pacientes.length, icon: UserPlus, onClick: () => navigate('/pacientes') },
    { title: 'Atendimentos', value: atendimentos.length, icon: ClipboardList, onClick: () => navigate('/atendimentos') },
    { title: 'Procedimentos', value: bpaC + bpaI, icon: FileBarChart, onClick: () => navigate('/relatorios') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema OdontoSUS</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card
            key={stat.title}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classificação BPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground">BPA-C (Consolidado)</p>
                <p className="text-2xl font-bold text-primary">{bpaC}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BPA-I (Individualizado)</p>
                <p className="text-2xl font-bold text-info">{bpaI}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            {atendimentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum atendimento registrado.</p>
            ) : (
              <div className="space-y-2">
                {atendimentos.slice(-5).reverse().map(a => {
                  const pac = pacientes.find(p => p.id === a.pacienteId);
                  return (
                    <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-2 text-sm">
                      <span className="font-medium text-foreground">{pac?.nomeCompleto || 'Paciente'}</span>
                      <span className="text-muted-foreground">{new Date(a.dataAtendimento).toLocaleDateString('pt-BR')}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
