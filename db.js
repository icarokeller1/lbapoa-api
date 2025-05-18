// db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'lbapoa.sqlite');

export const initDb = async () => {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  // tabela de times (já existente)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      logo TEXT,
      instagram TEXT,
      indPodeUsarMidia INTEGER NOT NULL DEFAULT 0
    );
  `);

  // 🚀 nova tabela de partidas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeA TEXT NOT NULL,
      timeB TEXT NOT NULL,
      pontuacaoA INTEGER,
      pontuacaoB INTEGER,
      dataHora TEXT NOT NULL,       -- ISO string
      torneio TEXT
    );
  `);

  return db;
};
