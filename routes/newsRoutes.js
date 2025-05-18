// routes/newsRoutes.js
import { Router } from 'express';
import NewsModel from '../models/newsModel.js';

export default function buildNewsRouter(db) {
  const router = Router();
  const model = new NewsModel(db);

  // Listar todas
  router.get('/', async (_req, res) => {
    const all = await model.findAll();
    res.json(all);
  });

  // Obter uma por ID
  router.get('/:id', async (req, res) => {
    const item = await model.findById(req.params.id);
    item ? res.json(item) : res.sendStatus(404);
  });

  // Criar nova notícia
  router.post('/', async (req, res) => {
    try {
      const created = await model.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao criar notícia.' });
    }
  });

  // Atualizar notícia
  router.put('/:id', async (req, res) => {
    try {
      const updated = await model.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao atualizar notícia.' });
    }
  });

  // Deletar notícia
  router.delete('/:id', async (req, res) => {
    await model.remove(req.params.id);
    res.sendStatus(204);
  });

  return router;
}
