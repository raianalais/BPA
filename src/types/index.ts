export interface Profissional {
  id: string;
  nomeCompleto: string;
  cpf: string;
  registroProfissional: string;
  ufConselho: string;
  categoriaProfissional: string;
  criadoEm: string;
}

export interface Paciente {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  cpf?: string;
  cns?: string;
  criadoEm: string;
}

export interface Atendimento {
  id: string;
  pacienteId: string;
  profissionalId: string;
  dataAtendimento: string;
  procedimentos: ProcedimentoAtendimento[];
  criadoEm: string;
}

export interface ProcedimentoAtendimento {
  codigoSUS: string;
  descricao: string;
  classificacao: 'BPA-C' | 'BPA-I';
  quantidade: number;
}

export interface ProcedimentoSUS {
  codigo: string;
  descricao: string;
  classificacao: 'BPA-C' | 'BPA-I';
}

export type UserRole = 'gestor' | 'operador' | 'profissional' | 'digitador';

export const UFS_BRASIL = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'
] as const;

export const CATEGORIAS_PROFISSIONAIS = [
  'Cirurgião-Dentista',
  'Técnico em Saúde Bucal (TSB)',
  'Auxiliar em Saúde Bucal (ASB)',
  'Cirurgião-Dentista Especialista',
] as const;
