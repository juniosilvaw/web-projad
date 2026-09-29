-- =========================================================
-- Portal Institucional — Assembleia de Deus
-- Schema do banco de dados (PostgreSQL)
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------
-- Usuários administrativos (painel admin)
-- ---------------------------------------------------------
CREATE TYPE papel_usuario AS ENUM ('administrador', 'pastor', 'secretaria', 'editor');

CREATE TABLE usuarios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  senha_hash    VARCHAR(255) NOT NULL,
  papel         papel_usuario NOT NULL DEFAULT 'editor',
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Cultos (agenda semanal fixa)
-- ---------------------------------------------------------
CREATE TABLE cultos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana  SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=domingo
  nome        VARCHAR(120) NOT NULL,
  horario     TIME NOT NULL,
  descricao   TEXT,
  ordem       SMALLINT NOT NULL DEFAULT 0,
  ativo       BOOLEAN NOT NULL DEFAULT true
);

-- ---------------------------------------------------------
-- Congregações
-- ---------------------------------------------------------
CREATE TABLE congregacoes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         VARCHAR(150) NOT NULL,
  bairro       VARCHAR(120) NOT NULL,
  cidade       VARCHAR(120) NOT NULL,
  endereco     VARCHAR(255) NOT NULL,
  telefone     VARCHAR(40),
  responsavel  VARCHAR(150),
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  ativo        BOOLEAN NOT NULL DEFAULT true,
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE congregacao_horarios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  congregacao_id   UUID NOT NULL REFERENCES congregacoes(id) ON DELETE CASCADE,
  descricao        VARCHAR(120) NOT NULL -- ex: "Domingo, 18h00"
);

-- ---------------------------------------------------------
-- Liderança
-- ---------------------------------------------------------
CREATE TYPE categoria_lideranca AS ENUM (
  'presidencia', 'pastores', 'evangelistas', 'presbiteros', 'diaconos', 'lideres_departamento'
);

CREATE TABLE lideres (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(150) NOT NULL,
  funcao     VARCHAR(150) NOT NULL,
  categoria  categoria_lideranca NOT NULL,
  bio        TEXT,
  foto_url   VARCHAR(500),
  ordem      SMALLINT NOT NULL DEFAULT 0,
  ativo      BOOLEAN NOT NULL DEFAULT true,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Ministérios
-- ---------------------------------------------------------
CREATE TABLE ministerios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(150) NOT NULL,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  descricao   TEXT,
  lideranca   VARCHAR(150),
  horarios    VARCHAR(200),
  contato     VARCHAR(150),
  foto_url    VARCHAR(500),
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Notícias
-- ---------------------------------------------------------
CREATE TABLE noticias (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(200) NOT NULL UNIQUE,
  categoria     VARCHAR(80) NOT NULL,
  titulo        VARCHAR(220) NOT NULL,
  resumo        VARCHAR(400) NOT NULL,
  conteudo      TEXT NOT NULL,
  imagem_url    VARCHAR(500),
  publicado     BOOLEAN NOT NULL DEFAULT false,
  publicado_em  TIMESTAMPTZ,
  autor_id      UUID REFERENCES usuarios(id),
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Eventos
-- ---------------------------------------------------------
CREATE TABLE eventos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(200) NOT NULL UNIQUE,
  nome        VARCHAR(220) NOT NULL,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim    TIMESTAMPTZ,
  local       VARCHAR(200),
  descricao   TEXT,
  imagem_url  VARCHAR(500),
  publicado   BOOLEAN NOT NULL DEFAULT false,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Estudos / conteúdo de ensino
-- ---------------------------------------------------------
CREATE TABLE estudos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(200) NOT NULL UNIQUE,
  categoria   VARCHAR(80) NOT NULL, -- Estudos Bíblicos, EBD, Devocional, Artigo, Sermão, Pregação
  titulo      VARCHAR(220) NOT NULL,
  conteudo    TEXT,
  arquivo_url VARCHAR(500),
  publicado   BOOLEAN NOT NULL DEFAULT false,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Mídia (vídeos, podcasts, fotos)
-- ---------------------------------------------------------
CREATE TABLE midias (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      VARCHAR(220) NOT NULL,
  categoria   VARCHAR(80) NOT NULL, -- Pregações, Transmissões, Podcasts, Fotos
  url         VARCHAR(500) NOT NULL,
  publicado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Banners do hero (carrossel)
-- ---------------------------------------------------------
CREATE TABLE banners (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo     VARCHAR(220),
  subtitulo  VARCHAR(300),
  imagem_url VARCHAR(500) NOT NULL,
  link_url   VARCHAR(500),
  ordem      SMALLINT NOT NULL DEFAULT 0,
  ativo      BOOLEAN NOT NULL DEFAULT true
);

-- ---------------------------------------------------------
-- Configurações gerais (chave/valor) — contato, redes sociais, PIX
-- ---------------------------------------------------------
CREATE TABLE configuracoes (
  chave         VARCHAR(100) PRIMARY KEY,
  valor         TEXT,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Pedidos de oração
-- ---------------------------------------------------------
CREATE TABLE pedidos_oracao (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(150),
  email      VARCHAR(150),
  telefone   VARCHAR(40),
  pedido     TEXT NOT NULL,
  anonimo    BOOLEAN NOT NULL DEFAULT false,
  atendido   BOOLEAN NOT NULL DEFAULT false,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Mensagens de contato
-- ---------------------------------------------------------
CREATE TABLE mensagens_contato (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  mensagem   TEXT NOT NULL,
  lida       BOOLEAN NOT NULL DEFAULT false,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Índices úteis
-- ---------------------------------------------------------
CREATE INDEX idx_noticias_publicado ON noticias (publicado, publicado_em DESC);
CREATE INDEX idx_eventos_data ON eventos (data_inicio);
CREATE INDEX idx_congregacoes_busca ON congregacoes (cidade, bairro);
CREATE INDEX idx_lideres_categoria ON lideres (categoria, ordem);
