const { kvGet, kvSet } = require('../../../../lib/kv');

module.exports = async (req, res) => {
  const { id, playerId } = req.query;
  try {
    const data = await kvGet('lan:' + id);
    if (!data) {
      res.status(404).json({ error: 'LAN introuvable' });
      return;
    }

    if (req.method === 'DELETE') {
      data.players = data.players.filter((p) => String(p.id) !== String(playerId));
      data.teams = null;
    } else if (req.method === 'PATCH') {
      const body = req.body || {};
      const level = [1, 2, 3, 4, 5].includes(Number(body.level)) ? Number(body.level) : null;
      if (!level) {
        res.status(400).json({ error: 'Niveau invalide' });
        return;
      }
      const idx = data.players.findIndex((p) => String(p.id) === String(playerId));
      if (idx === -1) {
        res.status(404).json({ error: 'Joueur introuvable' });
        return;
      }
      data.players[idx] = { ...data.players[idx], level: level };
      data.teams = null;
    } else {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    await kvSet('lan:' + id, data);
    res.status(200).json({ id, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
};
