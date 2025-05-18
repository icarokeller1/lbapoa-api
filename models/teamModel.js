// models/teamModel.js
export default class TeamModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    return this.db.all(
      `SELECT id, nome, logoData, logoMime, instagram, indPodeUsarMidia
       FROM teams ORDER BY id`
    );
  }

  async findById(id) {
    return this.db.get(
      `SELECT id, nome, logoData, logoMime, instagram, indPodeUsarMidia
       FROM teams WHERE id = ?`,
      id
    );
  }

  async create({ nome, instagram, indPodeUsarMidia, logoBuffer, logoMime }) {
    const { lastID } = await this.db.run(
      `INSERT INTO teams
         (nome, logoData, logoMime, instagram, indPodeUsarMidia)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nome,
        logoBuffer || null,
        logoMime || null,
        instagram,
        indPodeUsarMidia ? 1 : 0
      ]
    );
    return this.findById(lastID);
  }

  async update(
    id,
    { nome, instagram, indPodeUsarMidia, logoBuffer, logoMime }
  ) {
    await this.db.run(
      `UPDATE teams SET
         nome             = COALESCE(?, nome),
         logoData         = COALESCE(?, logoData),
         logoMime         = COALESCE(?, logoMime),
         instagram        = COALESCE(?, instagram),
         indPodeUsarMidia = COALESCE(?, indPodeUsarMidia)
       WHERE id = ?`,
      [
        nome,
        logoBuffer,
        logoMime,
        instagram,
        indPodeUsarMidia !== undefined ? (indPodeUsarMidia ? 1 : 0) : undefined,
        id
      ]
    );
    return this.findById(id);
  }

  async remove(id) {
    return this.db.run(`DELETE FROM teams WHERE id = ?`, id);
  }
}
