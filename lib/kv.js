const BASE = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCmd(...args) {
  if (!BASE || !TOKEN) {
    throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN manquants (variables d\'environnement Vercel)');
  }
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
  if (!res.ok) {
    throw new Error('Redis error ' + res.status);
  }
  const data = await res.json();
  return data.result;
}

async function kvGet(key) {
  const result = await redisCmd('GET', key);
  return result ? JSON.parse(result) : null;
}

async function kvSet(key, value) {
  await redisCmd('SET', key, JSON.stringify(value));
  return value;
}

async function kvDel(key) {
  return redisCmd('DEL', key);
}

module.exports = { kvGet, kvSet, kvDel };
