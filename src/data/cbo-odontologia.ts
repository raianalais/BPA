export interface CboItem {
  codigo: string;
  descricao: string;
  area: string;
}

export const CBO_ODONTOLOGIA: CboItem[] = [
  // Área Clínica
  { codigo: '2232-08', descricao: 'Cirurgião Dentista – Clínico Geral', area: 'Clínica' },
  { codigo: '2232-40', descricao: 'Ortodontista', area: 'Clínica' },
  { codigo: '2232-48', descricao: 'Periodontista', area: 'Clínica' },
  { codigo: '2232-24', descricao: 'Implantodontista', area: 'Clínica' },
  { codigo: '2232-12', descricao: 'Endodontista', area: 'Clínica' },
  { codigo: '2232-56', descricao: 'Protesista', area: 'Clínica' },
  { codigo: '2232-60', descricao: 'Radiologista', area: 'Clínica' },
  { codigo: '2232-36', descricao: 'Odontopediatra', area: 'Clínica' },
  { codigo: '2232-88', descricao: 'Pacientes com Necessidades Especiais', area: 'Clínica' },
  { codigo: '2232-68', descricao: 'Traumatologista Bucomaxilofacial', area: 'Clínica' },
  { codigo: '2232-44', descricao: 'Estomatologista', area: 'Clínica' },
  { codigo: '2232-64', descricao: 'Reabilitador Oral', area: 'Clínica' },
  { codigo: '2232-76', descricao: 'Odontologia do Trabalho', area: 'Clínica' },
  // Área Técnica
  { codigo: '3224-05', descricao: 'Técnico em Saúde Bucal (TSB)', area: 'Técnica' },
  { codigo: '3224-15', descricao: 'Auxiliar em Saúde Bucal (ASB)', area: 'Técnica' },
  { codigo: '3224-20', descricao: 'Técnico em Prótese Dentária', area: 'Técnica' },
  { codigo: '3224-25', descricao: 'Auxiliar de Prótese Dentária', area: 'Técnica' },
  // Área Administrativa
  { codigo: '1312-10', descricao: 'Gerente de Serviços de Saúde', area: 'Administrativa' },
  { codigo: '4221-10', descricao: 'Recepcionista', area: 'Administrativa' },
  { codigo: '4110-05', descricao: 'Auxiliar Administrativo', area: 'Administrativa' },
  { codigo: '5143-20', descricao: 'Auxiliar de Serviços Gerais', area: 'Administrativa' },
];
