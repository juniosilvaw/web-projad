import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../src/config/db.js";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@igreja.local";
  const senha = process.env.ADMIN_SENHA || "TrocarSenha123!";
  const nome = "Administrador";

  const hash = await bcrypt.hash(senha, 10);

  await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, papel)
     VALUES ($1, $2, $3, 'administrador')
     ON CONFLICT (email) DO UPDATE SET senha_hash = EXCLUDED.senha_hash`,
    [nome, email, hash]
  );

  console.log(`Usuário administrador criado/atualizado: ${email}`);
  console.log(`Senha inicial: ${senha} (altere após o primeiro login)`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
