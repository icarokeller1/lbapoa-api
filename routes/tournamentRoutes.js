// routes/tournamentRoutes.js
import { Router } from 'express';
import TournamentModel from '../models/tournamentModel.js';

export default function buildTournamentRouter(db) {
  const router = Router();
  const model = new TournamentModel(db);

  // Listar
  router.get('/', async (_req, res) => {
    const all = await model.findAll();          // já inclui link
    res.json(all);
  });

  // Obter por ID
  router.get('/:id', async (req, res) => {
    const t = await model.findById(req.params.id);
    t ? res.json(t) : res.sendStatus(404);
  });

  // Criar
  router.post('/', async (req, res) => {
    try {
      const created = await model.create({
        nome: req.body.nome,
        link: req.body.link || null      // <-- inclui link opcional
      });
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao criar torneio.' });
    }
  });

  // Atualizar
  router.put('/:id', async (req, res) => {
    try {
      const updated = await model.update(req.params.id, {
        nome: req.body.nome,
        link: req.body.link              // pode vir undefined ou null
      });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao atualizar torneio.' });
    }
  });

  // Deletar
  router.delete('/:id', async (req, res) => {
    await model.remove(req.params.id);
    res.sendStatus(204);
  });

  return router;
}
