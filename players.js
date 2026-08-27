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
    const prenom = String(body.prenom || '').trim().slice(0, 40);
    const nom = String(body.nom || '').trim().slice(0, 40);
    const formula = body.formula === 'pizza' ? 'pizza' : (body.formula === 'sans' ? 'sans' : null);
    const level = [1, 2, 3, 4, 5].includes(Number(body.level)) ? Number(body.level) : null;
    if (!prenom || !nom || !formula || !level) {
      res.status(400).json({ error: 'Champs manquants' });
      return;
    }
    const player = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: prenom + ' ' + nom,
      formula: formula,
      level: level,
      asAdmin: !!body.asAdmin
    };
    data.players.push(player);
    data.teams = null;
    await kvSet('lan:' + id, data);
    res.status(200).json({ id, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
};
