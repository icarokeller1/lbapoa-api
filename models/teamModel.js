export default class TeamModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { rows } = await this.db.query(
      'SELECT id, nome, apelido, logoData AS "logoData", logoMime AS "logoMime", instagram, indPodeUsarMidia AS "indPodeUsarMidia" FROM teams ORDER BY id'
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.db.query(
      'SELECT id, nome, apelido, logoData AS "logoData", logoMime AS "logoMime", instagram, indPodeUsarMidia AS "indPodeUsarMidia" FROM teams WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async create({ nome, apelido, instagram, indPodeUsarMidia, logoBuffer, logoMime }) {
    const { rows } = await this.db.query(
      `INSERT INTO teams (nome, apelido, logoData, logoMime, instagram, indPodeUsarMidia)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, apelido, logoData, logoMime, instagram, indPodeUsarMidia`,
      [nome, apelido, logoBuffer || null, logoMime || null, instagram, indPodeUsarMidia ? true : false]
    );
    return rows[0];
  }

  async update(id, { nome, apelido, instagram, indPodeUsarMidia, logoBuffer, logoMime }) {
    const { rows } = await this.db.query(
      `UPDATE teams SET
         nome           = COALESCE($1, nome),
         apelido        = COALESCE($2, apelido),
         logoData       = COALESCE($3, logoData),
         logoMime       = COALESCE($4, logoMime),
         instagram      = COALESCE($5, instagram),
         indPodeUsarMidia = COALESCE($6, indPodeUsarMidia)
       WHERE id = $7
       RETURNING id, nome, apelido, logoData, logoMime, instagram, indPodeUsarMidia`,
      [
        nome,
        apelido,
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
