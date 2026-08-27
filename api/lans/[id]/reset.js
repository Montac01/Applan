const { kvDel } = require('../../../lib/kv');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { id } = req.query;
  try {
    await kvDel('lan:' + id);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
};
