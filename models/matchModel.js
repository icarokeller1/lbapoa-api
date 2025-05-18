// models/matchModel.js
export default class MatchModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { rows } = await this.db.query(
      'SELECT id, timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio FROM matches ORDER BY dataHora DESC'
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.db.query(
      'SELECT id, timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio FROM matches WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async create({ timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio }) {
    const { rows } = await this.db.query(
      `INSERT INTO matches
         (timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio`,
      [timeA, timeB, pontuacaoA ?? null, pontuacaoB ?? null, dataHora, torneio]
    );
    return rows[0];
  }

  async update(id, { timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio }) {
    const { rows } = await this.db.query(
      `UPDATE matches SET
         timeA      = COALESCE($1, timeA),
         timeB      = COALESCE($2, timeB),
         pontuacaoA = COALESCE($3, pontuacaoA),
         pontuacaoB = COALESCE($4, pontuacaoB),
         dataHora   = COALESCE($5, dataHora),
         torneio    = COALESCE($6, torneio)
       WHERE id = $7
       RETURNING id, timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio`,
      [timeA, timeB, pontuacaoA ?? null, pontuacaoB ?? null, dataHora, torneio, id]
    );
    return rows[0];
  }

  async remove(id) {
    await this.db.query('DELETE FROM matches WHERE id = $1', [id]);
  }
}
