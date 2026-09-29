import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "migrations");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function jaAplicado() {
  const { rows } = await pool.query("SELECT to_regclass('public.usuarios') AS existe");
  return rows[0].existe !== null;
}

async function main() {
  if (await jaAplicado()) {
    console.log("Schema já aplicado — nada a fazer.");
    await pool.end();
    return;
  }

  const arquivos = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const arquivo of arquivos) {
    const sql = readFileSync(join(migrationsDir, arquivo), "utf-8");
    console.log(`Aplicando ${arquivo}...`);
    await pool.query(sql);
  }

  console.log("Migrações aplicadas com sucesso.");
  await pool.end();
}

main().catch((err) => {
  console.error("Falha ao aplicar migrações:", err);
  process.exit(1);
});
