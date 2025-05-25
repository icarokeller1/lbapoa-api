// routes/teamRoutes.js
import { Router } from 'express';
import multer from 'multer';
import TeamModel from '../models/teamModel.js';

export default function buildTeamRouter(db) {
  const router = Router();
  const teamModel = new TeamModel(db);

  // Multer em memória para obter `buffer` e `mimetype`
  const upload = multer({ storage: multer.memoryStorage() });

  // helper para formatar saída JSON com data-URL
  function formatTeam(team) {
    const { logoData, logoMime, apelido, ...rest } = team;
    return {
      ...rest,
      logo: logoData
        ? `data:${logoMime};base64,${logoData.toString('base64')}`
        : null
    };
  }

  router.get('/', async (_req, res) => {
    const all = await teamModel.findAll();
    res.json(all.map(formatTeam));
  });

  router.get('/:id', async (req, res) => {
    const team = await teamModel.findById(req.params.id);
    if (!team) return res.sendStatus(404);
    res.json(formatTeam(team));
  });

  router.post('/', upload.single('logo'), async (req, res) => {
    console.log('>>> req.file:', req.file);
    console.log('>>> req.body:', req.body);
    try {
      const payload = {
        ...req.body,
        apelido: req.body.apelido || null,
        indPodeUsarMidia: req.body.indPodeUsarMidia === 'true' || req.body.indPodeUsarMidia === '1',
        logoBuffer: req.file?.buffer,
        logoMime: req.file?.mimetype
      };
      const created = await teamModel.create(payload);
      res.status(201).json(formatTeam(created));
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao inserir time.' });
    }
  });

  router.put('/:id', upload.single('logo'), async (req, res) => {
    try {
      const payload = {
        ...req.body,
        apelido: req.body.apelido || null,
        indPodeUsarMidia: req.body.indPodeUsarMidia === 'true' || req.body.indPodeUsarMidia === '1',
        logoBuffer: req.file ? req.file.buffer : undefined,
        logoMime: req.file ? req.file.mimetype : undefined
      };
      const updated = await teamModel.update(req.params.id, payload);
      res.json(formatTeam(updated));
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao atualizar time.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    await teamModel.remove(req.params.id);
    res.sendStatus(204);
  });

  return router;
}
