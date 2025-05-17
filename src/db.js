import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || `${__dirname}/../lbapoa.sqlite`;

export const initDb = async () => {
  // cria o arquivo se não existir
  await fs.mkdir(dirname(DB_PATH), { recursive: true }).catch(() => {});
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      logo TEXT,                    -- caminho do arquivo
      instagram TEXT,
      indPodeUsarMidia INTEGER NOT NULL DEFAULT 0
    );
  `);

  return db;
};
