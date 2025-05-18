// models/matchModel.js
export default class MatchModel {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    return this.db.all('SELECT * FROM matches ORDER BY dataHora DESC');
  }

  async findById(id) {
    return this.db.get('SELECT * FROM matches WHERE id = ?', id);
  }

    async create(m) {
        const {
            timeA,
            timeB,
            dataHora,
            torneio,
            pontuacaoA,
            pontuacaoB
        } = m;
        const pA = pontuacaoA != null ? pontuacaoA : null;
        const pB = pontuacaoB != null ? pontuacaoB : null;

        const { lastID } = await this.db.run(
            `INSERT INTO matches
            (timeA, timeB, pontuacaoA, pontuacaoB, dataHora, torneio)
            VALUES (?,?,?,?,?,?)`,
            [timeA, timeB, pA, pB, dataHora, torneio]
        );
        return this.findById(lastID);
    }

  async update(id, m) {
    const {
        timeA,
        timeB,
        dataHora,
        torneio,
        pontuacaoA,
        pontuacaoB
    } = m;
    const pA = pontuacaoA != null ? pontuacaoA : undefined;
    const pB = pontuacaoB != null ? pontuacaoB : undefined;

    await this.db.run(
        `UPDATE matches SET
        timeA      = COALESCE(?, timeA),
        timeB      = COALESCE(?, timeB),
        pontuacaoA = COALESCE(?, pontuacaoA),
        pontuacaoB = COALESCE(?, pontuacaoB),
        dataHora   = COALESCE(?, dataHora),
        torneio    = COALESCE(?, torneio)
        WHERE id = ?`,
        [timeA, timeB, pA, pB, dataHora, torneio, id]
    );
    return this.findById(id);
    }

  async remove(id) {
    return this.db.run('DELETE FROM matches WHERE id = ?', id);
  }
}
