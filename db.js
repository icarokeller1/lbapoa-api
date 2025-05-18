// db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'no-verify'
    ? { rejectUnauthorized: false }
    : undefined
});

export const initDb = async () => {
  // cria tabelas se não existirem
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      logoData BYTEA,
      logoMime TEXT,
      instagram TEXT,
      indPodeUsarMidia BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      timeA TEXT NOT NULL,
      timeB TEXT NOT NULL,
      pontuacaoA INTEGER,
      pontuacaoB INTEGER,
      dataHora TIMESTAMPTZ NOT NULL,
      torneio TEXT
    );
  `);

  return pool;
};
