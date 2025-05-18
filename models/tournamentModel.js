// models/tournamentModel.js
export default class TournamentModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { rows } = await this.db.query(
      'SELECT id, nome FROM tournaments ORDER BY nome'
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.db.query(
      'SELECT id, nome FROM tournaments WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async create({ nome }) {
    const { rows } = await this.db.query(
      `INSERT INTO tournaments (nome)
       VALUES ($1)
       RETURNING id, nome`,
      [nome]
    );
    return rows[0];
  }

  async update(id, { nome }) {
    const { rows } = await this.db.query(
      `UPDATE tournaments
         SET nome = COALESCE($1, nome)
       WHERE id = $2
       RETURNING id, nome`,
      [nome, id]
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
