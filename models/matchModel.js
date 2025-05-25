// models/matchModel.js
export default class MatchModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
      const { rows } = await this.db.query(
        `SELECT
          m.id,
          m.teamA_id AS "teamAId",
          tA.nome    AS "teamA",
          m.teamB_id AS "teamBId",
          tB.nome    AS "teamB",
          m.pontuacaoA AS "pontuacaoA",
          m.pontuacaoB AS "pontuacaoB",
          m.dataHora AS "dataHora",
          m.torneio AS "torneio"
        FROM matches m
        JOIN teams tA ON tA.id = m.teamA_id
        JOIN teams tB ON tB.id = m.teamB_id
        ORDER BY m.dataHora DESC`
      );
      return rows;
    }

  async findById(id) {
    const { rows } = await this.db.query(
      `SELECT
         m.id,
         m.teamA_id AS "teamAId",
         tA.nome    AS "teamA",
         m.teamB_id AS "teamBId",
         tB.nome    AS "teamB",
         m.pontuacaoA AS "pontuacaoA",
         m.pontuacaoB AS "pontuacaoB",
         m.dataHora AS "dataHora",
         m.torneio AS "torneio"
       FROM matches m
       JOIN teams tA ON tA.id = m.teamA_id
       JOIN teams tB ON tB.id = m.teamB_id
       WHERE m.id = $1`,
      [id]
    );
    return rows[0];
  }

  async create({ teamAId, teamBId, pontuacaoA, pontuacaoB, dataHora, torneio }) {
    const { rows } = await this.db.query(
      `INSERT INTO matches
         (teamA_id, teamB_id, pontuacaoA, pontuacaoB, dataHora, torneio)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [teamAId, teamBId, pontuacaoA ?? null, pontuacaoB ?? null, dataHora, torneio]
    );
    return this.findById(rows[0].id);
  }

  async update(id, { teamAId, teamBId, pontuacaoA, pontuacaoB, dataHora, torneio }) {
    const { rows } = await this.db.query(
      `UPDATE matches SET
         teamA_id   = COALESCE($1, teamA_id),
         teamB_id   = COALESCE($2, teamB_id),
         pontuacaoA = COALESCE($3, pontuacaoA),
         pontuacaoB = COALESCE($4, pontuacaoB),
         dataHora   = COALESCE($5, dataHora),
         torneio    = COALESCE($6, torneio)
       WHERE id = $7
       RETURNING id`,
      [teamAId, teamBId, pontuacaoA ?? null, pontuacaoB ?? null, dataHora, torneio, id]
    );
    return this.findById(rows[0].id);
  }

  async remove(id) {
    await this.db.query('DELETE FROM matches WHERE id = $1', [id]);
  }
}
