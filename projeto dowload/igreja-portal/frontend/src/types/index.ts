export interface Culto {
  id: string;
  dia_semana: number;
  nome: string;
  horario: string;
  descricao?: string | null;
}

export interface Noticia {
  id: string;
  slug: string;
  categoria: string;
  titulo: string;
  resumo: string;
  conteudo?: string;
  imagem_url?: string | null;
  publicado_em: string;
}

export interface Evento {
  id: string;
  slug: string;
  nome: string;
  data_inicio: string;
  data_fim?: string | null;
  local?: string | null;
  descricao?: string | null;
  imagem_url?: string | null;
}

export type CategoriaLideranca =
  | "presidencia"
  | "pastores"
  | "evangelistas"
  | "presbiteros"
  | "diaconos"
  | "lideres_departamento";

export interface Lider {
  id: string;
  nome: string;
  funcao: string;
  categoria: CategoriaLideranca;
  bio?: string | null;
  foto_url?: string | null;
  ordem?: number;
}

export interface Ministerio {
  id: string;
  nome: string;
  slug: string;
  descricao?: string | null;
  lideranca?: string | null;
  horarios?: string | null;
  contato?: string | null;
  foto_url?: string | null;
}

export interface Congregacao {
  id: string;
  nome: string;
  bairro: string;
  cidade: string;
  endereco: string;
  telefone?: string | null;
  responsavel?: string | null;
  horarios: string[];
  latitude?: number | null;
  longitude?: number | null;
}

export interface Estudo {
  id: string;
  slug: string;
  categoria: string;
  titulo: string;
  conteudo?: string | null;
  arquivo_url?: string | null;
}

export interface Midia {
  id: string;
  titulo: string;
  categoria: string;
  url: string;
  publicado_em: string;
}
