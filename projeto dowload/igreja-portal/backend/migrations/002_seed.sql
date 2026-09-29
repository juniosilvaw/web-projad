-- Seed de dados fictícios para desenvolvimento (mesmos do frontend)

INSERT INTO cultos (dia_semana, nome, horario, descricao, ordem) VALUES
  (0, 'Culto da Família', '18:00', 'Um culto para reunir toda a família em louvor e na Palavra.', 1),
  (2, 'Culto de Ensino', '19:30', 'Estudo aprofundado das Escrituras para o crescimento espiritual.', 2),
  (4, 'Culto de Oração', '19:30', 'Um tempo dedicado à intercessão e busca da presença de Deus.', 3),
  (6, 'Culto de Jovens', '19:00', 'Louvor, comunhão e Palavra voltados para a juventude.', 4);

INSERT INTO configuracoes (chave, valor) VALUES
  ('nome_igreja', 'Assembleia de Deus Comunidade Viva'),
  ('slogan', 'Uma igreja para você e sua família'),
  ('endereco', '[ENDEREÇO A CONFIGURAR], Belo Horizonte - MG'),
  ('telefone', '[TELEFONE A CONFIGURAR]'),
  ('whatsapp', '[WHATSAPP A CONFIGURAR]'),
  ('email', '[EMAIL A CONFIGURAR]'),
  ('instagram_url', ''),
  ('youtube_url', ''),
  ('facebook_url', ''),
  ('pix_chave', '[CHAVE PIX A CONFIGURAR]'),
  ('pix_favorecido', '[NOME DO FAVORECIDO A CONFIGURAR]'),
  ('transmissao_ao_vivo', 'false');

INSERT INTO congregacoes (nome, bairro, cidade, endereco, telefone, responsavel, latitude, longitude) VALUES
  ('Templo Sede', '[Bairro a configurar]', 'Belo Horizonte', '[Endereço a configurar]', '[Telefone a configurar]', '[Nome a configurar]', -19.9167, -43.9345),
  ('Congregação Bairro Novo', '[Bairro a configurar]', 'Belo Horizonte', '[Endereço a configurar]', '[Telefone a configurar]', '[Nome a configurar]', -19.9245, -43.9352);

INSERT INTO lideres (nome, funcao, categoria, bio, ordem) VALUES
  ('[Nome a configurar]', 'Pastor Presidente', 'presidencia', 'Biografia a ser configurada pelo painel administrativo.', 1),
  ('[Nome a configurar]', 'Pastor Auxiliar', 'pastores', 'Biografia a ser configurada pelo painel administrativo.', 2),
  ('[Nome a configurar]', 'Evangelista', 'evangelistas', 'Biografia a ser configurada pelo painel administrativo.', 3),
  ('[Nome a configurar]', 'Presbítero', 'presbiteros', 'Biografia a ser configurada pelo painel administrativo.', 4),
  ('[Nome a configurar]', 'Diácono', 'diaconos', 'Biografia a ser configurada pelo painel administrativo.', 5);

INSERT INTO ministerios (nome, slug, descricao, lideranca, horarios, contato) VALUES
  ('Ministério de Jovens', 'jovens', 'Comunhão, louvor e ensino voltados para adolescentes e jovens da igreja.', '[Nome a configurar]', 'Sábados, 19h00', '[Contato a configurar]'),
  ('Ministério Infantil', 'infantil', 'Cuidado, ensino bíblico e recreação para as crianças da igreja.', '[Nome a configurar]', 'Domingos, durante o Culto da Família', '[Contato a configurar]'),
  ('Ministério de Mulheres', 'mulheres', 'Encontros de comunhão, estudo da Palavra e apoio mútuo entre as mulheres.', '[Nome a configurar]', 'Quartas-feiras, 15h00', '[Contato a configurar]'),
  ('Escola Bíblica Dominical', 'ebd', 'Ensino sistemático da Palavra em turmas por idade, todos os domingos.', '[Nome a configurar]', 'Domingos, 9h00', '[Contato a configurar]'),
  ('Ministério de Louvor', 'louvor', 'Equipe responsável pela adoração musical nos cultos e eventos.', '[Nome a configurar]', 'Ensaios às sextas-feiras, 20h00', '[Contato a configurar]');

INSERT INTO noticias (slug, categoria, titulo, resumo, conteudo, publicado, publicado_em) VALUES
  ('conferencia-familia', 'Eventos', 'Conferência da Família reúne centenas de pessoas',
   'Três dias de ministração, louvor e testemunhos marcaram a edição deste ano.',
   'A Conferência da Família reuniu famílias de diversas congregações para um fim de semana de ensino bíblico, momentos de louvor e confraternização.',
   true, now() - interval '40 days'),
  ('encontro-juventude', 'Ministérios', 'Juventude realiza encontro especial',
   'Jovens de várias congregações se reuniram para um dia de louvor, comunhão e estudo da Palavra.',
   'O encontro de jovens reuniu participantes de diferentes congregações para uma programação especial com louvor e dinâmicas em grupo.',
   true, now() - interval '63 days');

INSERT INTO eventos (slug, nome, data_inicio, local, descricao, publicado) VALUES
  ('vigilia-oracao', 'Vigília de Oração', now() + interval '9 days', 'Templo Sede', 'Uma noite inteira dedicada à oração e busca da presença de Deus.', true),
  ('conferencia-missoes', 'Conferência de Missões', now() + interval '24 days', 'Templo Sede', 'Três noites com missionários convidados compartilhando testemunhos do campo.', true);

INSERT INTO congregacao_horarios (congregacao_id, descricao)
SELECT id, h.descricao
FROM congregacoes c
CROSS JOIN LATERAL (
  VALUES ('Domingo, 18h00'), ('Terça-feira, 19h30'), ('Quinta-feira, 19h30')
) AS h(descricao)
WHERE c.nome = 'Templo Sede';

INSERT INTO congregacao_horarios (congregacao_id, descricao)
SELECT id, h.descricao
FROM congregacoes c
CROSS JOIN LATERAL (
  VALUES ('Domingo, 18h00'), ('Quinta-feira, 19h30')
) AS h(descricao)
WHERE c.nome = 'Congregação Bairro Novo';

-- Usuário administrador padrão (senha: TrocarSenha123! — hash bcrypt gerado no app)
