const { kvGet, kvSet } = require('../../../lib/kv');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { id } = req.query;
  try {
    const data = await kvGet('lan:' + id);
    if (!data) {
      res.status(404).json({ error: 'LAN introuvable' });
      return;
    }
    const body = req.body || {};
    data.teams = body.teams || null;
    await kvSet('lan:' + id, data);
    res.status(200).json({ id, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
};
