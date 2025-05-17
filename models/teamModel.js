export default class TeamModel {
  constructor(db) {
    this.db = db;
  }

  async findAll()      { return this.db.all('SELECT * FROM teams'); }
  async findById(id)   { return this.db.get('SELECT * FROM teams WHERE id = ?', id); }
  async create(t) {
    const { nome, logo, instagram, indPodeUsarMidia } = t;
    const { lastID } = await this.db.run(
      'INSERT INTO teams (nome, logo, instagram, indPodeUsarMidia) VALUES (?,?,?,?)',
      [nome, logo, instagram, indPodeUsarMidia ? 1 : 0]
    );
    return this.findById(lastID);
  }
  async update(id, t) {
    const { nome, logo, instagram, indPodeUsarMidia } = t;
    await this.db.run(
      `UPDATE teams SET
         nome = COALESCE(?, nome),
         logo = COALESCE(?, logo),
         instagram = COALESCE(?, instagram),
         indPodeUsarMidia = COALESCE(?, indPodeUsarMidia)
       WHERE id = ?`,
      [nome, logo, instagram, indPodeUsarMidia !== undefined ? (indPodeUsarMidia ? 1 : 0) : undefined, id]
    );
    return this.findById(id);
  }
  async remove(id)     { return this.db.run('DELETE FROM teams WHERE id = ?', id); }
}
