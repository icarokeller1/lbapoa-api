// server.js
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import buildTeamRouter from './routes/teamRoutes.js';
import buildMatchRouter from './routes/matchRoutes.js';
import buildNewsRouter from './routes/newsRoutes.js';
import buildTournamentRouter from './routes/tournamentRoutes.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  const db = await initDb();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/teams', buildTeamRouter(db));
  app.use('/matches', buildMatchRouter(db));
  app.use('/news', buildNewsRouter(db));
  app.use('/tournaments', buildTournamentRouter(db));

  app.get('/', (_, res) => res.json({ status: 'OK' }));

  app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
};

start();
