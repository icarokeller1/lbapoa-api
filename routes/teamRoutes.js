import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import TeamModel from '../models/teamModel.js';

export default function buildTeamRouter(db) {
  const router = Router();
  const teamModel = new TeamModel(db);

  // configura upload (pasta uploads)
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname))
  });
  const upload = multer({ storage });

  router.get('/', async (req, res) => {
    res.json(await teamModel.findAll());
  });

  router.get('/:id', async (req, res) => {
    const team = await teamModel.findById(req.params.id);
    team ? res.json(team) : res.sendStatus(404);
  });

  router.post('/', upload.single('logo'), async (req, res) => {
    try {
      const payload = {
        ...req.body,
        logo: req.file?.path
      };
      const newTeam = await teamModel.create(payload);
      res.status(201).json(newTeam);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao inserir time.' });
    }
  });

  router.put('/:id', upload.single('logo'), async (req, res) => {
    try {
      const payload = {
        ...req.body,
        logo: req.file?.path
      };
      const upd = await teamModel.update(req.params.id, payload);
      res.json(upd);
    } catch (err) {
      res.status(400).json({ error: 'Falha ao atualizar time.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    await teamModel.remove(req.params.id);
    res.sendStatus(204);
  });

  return router;
}
