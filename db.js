import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ⬇ apontamos direto p/ o arquivo na raiz
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'lbapoa.sqlite');

export const initDb = async () => {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      logo TEXT,
      instagram TEXT,
      indPodeUsarMidia INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
};
