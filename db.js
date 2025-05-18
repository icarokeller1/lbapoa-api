// db.js
import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export const initDb = async () => {
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      titulo         TEXT NOT NULL,
      descricao      TEXT NOT NULL,
      linkinstagram  TEXT,
      data           DATE NOT NULL,
      times          TEXT,    -- nomes separados por ';'
      torneios       TEXT     -- nomes separados por ';'
    );
  `);

  return pool;
};
