export interface IMesa {
  id: number;
  qtd_cadeiras: number;
  status: boolean;
  numero: number;
  localizacao: string;
  posicao_x: number;
  posicao_y: number;
  reservado_por: string | null;
  reservado_em: Date | null;
}

export interface ICreateMesaInput {
  qtd_cadeiras: number;
  status?: boolean;
  numero?: number;
  localizacao?: string;
  posicao_x?: number;
  posicao_y?: number;
}

export interface IUpdateMesaInput {
  id?: number;
  qtd_cadeiras?: number;
  status?: boolean;
  numero?: number;
  localizacao?: string;
  posicao_x?: number;
  posicao_y?: number;
}

export interface IMesaOutput extends IMesa {}
