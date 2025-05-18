// routes/matchRoutes.js
import { Router } from 'express';
import MatchModel from '../models/matchModel.js';

export default function buildMatchRouter(db) {
  const router = Router();
  const matchModel = new MatchModel(db);

  // Listar todas
  router.get('/', async (_req, res) => {
    const all = await matchModel.findAll();
    res.json(all);
  });

  // Obter uma por ID
  router.get('/:id', async (req, res) => {
    const m = await matchModel.findById(req.params.id);
    m ? res.json(m) : res.sendStatus(404);
  });

  // Criar nova partida
  router.post('/', async (req, res) => {
    try {
      // espera JSON com campos: timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio
      const created = await matchModel.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao criar partida.' });
    }
  });

  // Atualizar
  router.put('/:id', async (req, res) => {
    try {
      const updated = await matchModel.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao atualizar partida.' });
    }
  });

  // Deletar
  router.delete('/:id', async (req, res) => {
    await matchModel.remove(req.params.id);
    res.sendStatus(204);
  });

  return router;
}
