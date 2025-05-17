// routes/teamRoutes.js
import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import TeamModel from '../models/teamModel.js';

export default function buildTeamRouter(db) {
  const router = Router();
  const teamModel = new TeamModel(db);

  /* ----------------------------------------------------------
   *  Configuração de upload
   * -------------------------------------------------------- */
  const uploadDir = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });      // garante a pasta

  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) =>
      cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  });

  const upload = multer({ storage });

  /* ----------------------------------------------------------
   *  Rotas
   * -------------------------------------------------------- */
  router.get('/', async (_req, res) => {
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
        logo: req.file ? `uploads/${req.file.filename}` : null
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
        logo: req.file ? `uploads/${req.file.filename}` : undefined
      };
      const updated = await teamModel.update(req.params.id, payload);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Falha ao atualizar time.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // 1⟩ busca o time p/ saber o logo
      const team = await teamModel.findById(id);
      if (!team) return res.sendStatus(404);

      // 2⟩ tenta remover o arquivo se o campo logo existir
      if (team.logo) {
        const filePath = path.join(process.cwd(), team.logo);
        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            // loga mas não bloqueia a deleção do registro
            console.warn(`Falha ao apagar logo ${filePath}:`, err.message);
          }
        });
      }

      // 3⟩ remove o registro
      await teamModel.remove(id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao apagar time.' });
    }
  });

  return router;
}
