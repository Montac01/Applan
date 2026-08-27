const crypto = require('crypto');
const { kvSet } = require('../../lib/kv');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = req.body || {};
    const date = String(body.date || '').slice(0, 20);
    const game = String(body.game || '').slice(0, 80);
    if (!date || !game) {
      res.status(400).json({ error: 'date et game requis' });
      return;
    }
    const id = crypto.randomBytes(5).toString('hex');
    const data = { date, game, players: [], teams: null };
    await kvSet('lan:' + id, data);
    res.status(200).json({ id, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
};
