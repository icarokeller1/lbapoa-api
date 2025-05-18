// server.js
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import buildTeamRouter from './routes/teamRoutes.js';
import buildMatchRouter from './routes/matchRoutes.js';  // <-- import

const PORT = process.env.PORT || 3000;

const start = async () => {
  const db = await initDb();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static('uploads'));

  // rotas existentes
  app.use('/teams', buildTeamRouter(db));

  // nova rota para partidas
  app.use('/matches', buildMatchRouter(db));

  app.get('/', (_, res) => res.json({ status: 'OK' }));

  app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
};

start();
