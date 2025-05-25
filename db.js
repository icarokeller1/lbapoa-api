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
      apelido TEXT,
      logoData BYTEA,
      logoMime TEXT,
      instagram TEXT,
      indPodeUsarMidia BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      teamA_id INTEGER NOT NULL REFERENCES teams(id),
      teamB_id INTEGER NOT NULL REFERENCES teams(id),
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
      titulo         TEXT,
      descricao      TEXT,
      linkinstagram  TEXT,
      data           DATE NOT NULL,
      times          TEXT,    -- nomes separados por ';'
      torneios       TEXT     -- nomes separados por ';'
    );
  `);

  await pool.query(`
    BEGIN;

ALTER TABLE matches
  ADD COLUMN teamA_id INTEGER,
  ADD COLUMN teamB_id INTEGER;

UPDATE matches
  SET teamA_id = tA.id
  FROM teams tA
  WHERE tA.nome = matches.timea;

UPDATE matches
  SET teamB_id = tB.id
  FROM teams tB
  WHERE tB.nome = matches.timeb;

ALTER TABLE matches
  DROP COLUMN IF EXISTS timea,
  DROP COLUMN IF EXISTS timeb;

ALTER TABLE matches
  ADD CONSTRAINT fk_match_teama FOREIGN KEY (teamA_id) REFERENCES teams(id),
  ADD CONSTRAINT fk_match_teamb FOREIGN KEY (teamB_id) REFERENCES teams(id);

COMMIT;
  `);

  return pool;
};
