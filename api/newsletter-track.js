import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id, e } = req.query;
  if (id && e && id.length <= 64 && e.length <= 254) {
    try {
      const p = redis.pipeline();
      p.hincrby(`newsletter-opens:${id}`, 'total', 1);
      p.sadd(`newsletter-opens:${id}:unique`, e);
      await p.exec();
    } catch (err) {
      console.error('Track error:', err.message);
    }
  }

  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res.status(200).send(pixel);
}
