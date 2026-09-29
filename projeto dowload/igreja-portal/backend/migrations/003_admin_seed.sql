-- Usuário administrador padrão para o ambiente do docker-compose.
-- Login: admin@igreja.local   Senha: TrocarSenha123!
-- IMPORTANTE: troque essa senha assim que possível em produção.

INSERT INTO usuarios (nome, email, senha_hash, papel)
VALUES (
  'Administrador',
  'admin@igreja.local',
  '$2a$10$Tbip.mM3yzHzFv14uPwMOOsesUdJgz7egmqgqp/8fmPTVoeGSH3y.',
  'administrador'
)
ON CONFLICT (email) DO NOTHING;
