// models/tournamentModel.js
export default class TournamentModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { rows } = await this.db.query(
      'SELECT id, nome, link FROM tournaments ORDER BY nome'
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.db.query(
      'SELECT id, nome, link FROM tournaments WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async create({ nome, link }) {
    const { rows } = await this.db.query(
      `INSERT INTO tournaments (nome, link)
       VALUES ($1,$2)
       RETURNING id, nome, link`,
      [nome, link]
    );
    return rows[0];
  }

  async update(id, { nome, link }) {
    const { rows } = await this.db.query(
      `UPDATE tournaments
         SET nome = COALESCE($1, nome),
             link = COALESCE($2, link)
       WHERE id = $3
       RETURNING id, nome`,
      [nome, link, id]
    );
    return rows[0];
  }

  async remove(id) {
    await this.db.query(
      'DELETE FROM tournaments WHERE id = $1',
      [id]
    );
  }
}
