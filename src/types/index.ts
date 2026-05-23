export interface Profissional {
  id: string;
  nomeCompleto: string;
  cpf: string;
  registroProfissional: string;
  ufConselho: string;
  cbo: string;
  cnsProfissional?: string;
  criadoEm: string;
}

export interface Paciente {
  id: string;
  nomeCompleto: string;
  idade: number;
  sexo: 'M' | 'F';
  dataNascimento: string;
  racaCor: string;
  etnia?: string;
  cns: string;
  cpf?: string;
  nacionalidade: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
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

export const RACAS_CORES = [
  'Branco(a)', 'Preto(a)', 'Pardo(a)', 'Amarelo(a)', 'Indígena', 'Sem informação'
] as const;

export const NACIONALIDADES = [
  'Brasileiro(a)', 'Estrangeiro(a)', 'Naturalizado(a)'
] as const;
