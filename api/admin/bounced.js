import { Redis } from '@upstash/redis';
import { adminAuth } from '../_lib/config.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  try {
    const raw = await redis.lrange('removed-bounces', 0, 49);
    const bounced = raw.map(r => typeof r === 'string' ? JSON.parse(r) : r);
    return res.status(200).json({ success: true, bounced });
  } catch (error) {
    console.error('Bounced list error:', error);
    return res.status(500).json({ error: 'Failed to fetch bounced list' });
  }
}
