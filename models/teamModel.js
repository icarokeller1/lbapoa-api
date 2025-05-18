export default class TeamModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { rows } = await this.db.query(
      'SELECT id, nome, logoData, logoMime, instagram, indPodeUsarMidia FROM teams ORDER BY id'
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.db.query(
      'SELECT id, nome, logoData, logoMime, instagram, indPodeUsarMidia FROM teams WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async create({ nome, instagram, indPodeUsarMidia, logoBuffer, logoMime }) {
    const { rows } = await this.db.query(
      `INSERT INTO teams (nome, logoData, logoMime, instagram, indPodeUsarMidia)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, logoData, logoMime, instagram, indPodeUsarMidia`,
      [nome, logoBuffer || null, logoMime || null, instagram, indPodeUsarMidia ? true : false]
    );
    return rows[0];
  }

  async update(id, { nome, instagram, indPodeUsarMidia, logoBuffer, logoMime }) {
    const { rows } = await this.db.query(
      `UPDATE teams SET
         nome           = COALESCE($1, nome),
         logoData       = COALESCE($2, logoData),
         logoMime       = COALESCE($3, logoMime),
         instagram      = COALESCE($4, instagram),
         indPodeUsarMidia = COALESCE($5, indPodeUsarMidia)
       WHERE id = $6
       RETURNING id, nome, logoData, logoMime, instagram, indPodeUsarMidia`,
      [
        nome,
        logoBuffer !== undefined ? logoBuffer : null,
        logoMime !== undefined ? logoMime : null,
        instagram,
        indPodeUsarMidia !== undefined ? indPodeUsarMidia : null,
        id,
      ]
    );
    return rows[0];
  }

  async remove(id) {
    await this.db.query('DELETE FROM teams WHERE id = $1', [id]);
  }
}
