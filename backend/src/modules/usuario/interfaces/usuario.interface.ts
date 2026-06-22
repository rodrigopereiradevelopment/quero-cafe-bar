export interface IUsuario {
  id: number;
  nome: string;
  usuario: string;
  perfil: number;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  cpf?: string;
  foto?: string;
}

export interface IUsuarioInput {
  nome: string;
  usuario: string;
  senha: string;
  perfil?: number;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  cpf?: string;
  foto?: string;
}

export interface IUsuarioUpdateInput {
  id?: number;
  nome?: string;
  usuario?: string;
  senha?: string;
  perfil?: number;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  cpf?: string;
  foto?: string;
}

export interface IUsuarioLoginInput {
  usuario: string;
  senha: string;
  perfil?: number;
}

export interface IUsuarioOutput extends IUsuario {}
