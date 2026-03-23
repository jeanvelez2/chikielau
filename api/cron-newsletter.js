import { Redis } from '@upstash/redis';
import { sendNewsletter } from './_lib/email.js';
import { safeCompare } from './_lib/config.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (!safeCompare(req.headers.authorization || '', `Bearer ${process.env.CRON_SECRET}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Rec #13: Acquire lock to prevent duplicate sends from concurrent cron invocations
  const lockKey = 'lock:cron-newsletter';
  const locked = await redis.set(lockKey, Date.now(), { nx: true, ex: 300 });
  if (!locked) return res.status(200).json({ success: true, processed: 0, skipped: 'locked' });

  try {
    const ids = await redis.lrange('newsletters', 0, -1);
    const now = new Date().toISOString();
    let sent = 0;

    for (const id of ids) {
      const nl = await redis.hgetall(`newsletter:${id}`);
      if (!nl || nl.status !== 'scheduled' || !nl.scheduledAt) continue;
      if (nl.scheduledAt > now) continue;

      try {
        await redis.hset(`newsletter:${id}`, { status: 'sending' });
        await sendNewsletter(redis, id, nl.subject, nl.body, { preheader: nl.preheader, footerMessage: nl.footerMessage });
        sent++;
      } catch (err) {
        console.error(`Failed to send newsletter ${id}:`, err);
        await redis.hset(`newsletter:${id}`, { status: 'failed' }).catch(() => {});
      }
    }

    return res.status(200).json({ success: true, processed: sent });
  } catch (error) {
    console.error('Cron newsletter error:', error);
    return res.status(500).json({ error: 'Failed to process scheduled newsletters' });
  } finally {
    await redis.del(lockKey).catch(() => {});
  }
}
