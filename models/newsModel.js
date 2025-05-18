// models/newsModel.js
export default class NewsModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { rows } = await this.db.query(
      `SELECT id, titulo, descricao, linkinstagram, data, times, torneios
       FROM news
       ORDER BY data DESC`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.db.query(
      `SELECT id, titulo, descricao, linkinstagram, data, times, torneios
       FROM news
       WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  async create({ titulo, descricao, linkinstagram, data, times, torneios }) {
    const { rows } = await this.db.query(
      `INSERT INTO news
         (titulo, descricao, linkinstagram, data, times, torneios)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, titulo, descricao, linkinstagram, data, times, torneios`,
      [titulo, descricao, linkinstagram, data, times, torneios]
    );
    return rows[0];
  }

  async update(id, { titulo, descricao, linkinstagram, data, times, torneios }) {
    const { rows } = await this.db.query(
      `UPDATE news SET
         titulo        = COALESCE($1, titulo),
         descricao     = COALESCE($2, descricao),
         linkinstagram = COALESCE($3, linkinstagram),
         data          = COALESCE($4, data),
         times         = COALESCE($5, times),
         torneios      = COALESCE($6, torneios)
       WHERE id = $7
       RETURNING id, titulo, descricao, linkinstagram, data, times, torneios`,
      [titulo, descricao, linkinstagram, data, times, torneios, id]
    );
    return rows[0];
  }

  async remove(id) {
    await this.db.query(
      `DELETE FROM news WHERE id = $1`,
      [id]
    );
  }
}
