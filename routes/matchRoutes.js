// routes/matchRoutes.js
import { Router } from 'express';
import MatchModel from '../models/matchModel.js';

export default function buildMatchRouter(db) {
  const router = Router();
  const matchModel = new MatchModel(db);

  router.get('/', async (_req, res) => {
    res.json(await matchModel.findAll());
  });

  router.get('/:id', async (req, res) => {
    const m = await matchModel.findById(req.params.id);
    m ? res.json(m) : res.sendStatus(404);
  });

  router.post('/', async (req, res) => {
    try {
      const payload = {
        teamAId:    parseInt(req.body.teamAId, 10),
        teamBId:    parseInt(req.body.teamBId, 10),
        pontuacaoA: req.body.pontuacaoA ?? null,
        pontuacaoB: req.body.pontuacaoB ?? null,
        dataHora:   req.body.dataHora,
        torneio:    req.body.torneio,
      };
      const created = await matchModel.create(payload);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao criar partida.' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const payload = {
        teamAId:    req.body.teamAId ? parseInt(req.body.teamAId, 10) : undefined,
        teamBId:    req.body.teamBId ? parseInt(req.body.teamBId, 10) : undefined,
        pontuacaoA: req.body.pontuacaoA ?? undefined,
        pontuacaoB: req.body.pontuacaoB ?? undefined,
        dataHora:   req.body.dataHora,
        torneio:    req.body.torneio,
      };
      const updated = await matchModel.update(req.params.id, payload);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao atualizar partida.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    await matchModel.remove(req.params.id);
    res.sendStatus(204);
  });

  return router;
}