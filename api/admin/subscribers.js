import { Redis } from '@upstash/redis';
import { adminAuth, BASE_URL } from '../_lib/config.js';
import { makeConfirmToken, createTransporter } from '../_lib/email.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const emails = await redis.smembers('subscribers');
      const pipeline = redis.pipeline();
      for (const email of emails) pipeline.hgetall(`subscriber:${email}`);
      const results = emails.length ? await pipeline.exec() : [];
      const subscribers = emails.map((email, i) => results[i] || { email });
      subscribers.sort((a, b) => (b.subscribedAt || '').localeCompare(a.subscribedAt || ''));

      if (req.query.format === 'csv') {
        const esc = v => { const s = (v || '').replace(/"/g, '""'); return /^[=+\-@\t\r]/.test(s) ? `"'${s}"` : `"${s}"`; };
        const csv = 'email,subscribed_at,source\n' + subscribers.map(s =>
          `${esc(s.email)},${esc(s.subscribedAt)},${esc(s.source)}`
        ).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
        return res.status(200).send(csv);
      }

      return res.status(200).json({ success: true, subscribers, count: subscribers.length });
    } catch (error) {
      console.error('List subscribers error:', error);
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
  }

  if (req.method === 'POST') {
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0) return res.status(400).json({ error: 'Emails array required' });
    if (emails.length > 500) return res.status(400).json({ error: 'Max 500 emails per import' });

    const transporter = await createTransporter();
    let sent = 0, skipped = 0;

    for (let i = 0; i < emails.length; i++) {
      const lower = emails[i].toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) { skipped++; continue; }
      const exists = await redis.sismember('subscribers', lower);
      if (exists) { skipped++; continue; }
      const pending = await redis.exists(`pending:${lower}`);
      if (pending) { skipped++; continue; }

      const token = makeConfirmToken(lower);
      await redis.set(`pending:${lower}`, JSON.stringify({ token, source: 'csv-import' }), { ex: 86400 });
      const confirmUrl = `${BASE_URL}/api/newsletter-confirm?email=${encodeURIComponent(lower)}&token=${token}`;
      try {
        await transporter.sendMail({
          from: `"Chikielau" <${process.env.GMAIL_USER}>`,
          replyTo: process.env.GMAIL_USER,
          to: lower,
          subject: 'Confirm your subscription to Chikielau',
          text: `Welcome to Chikielau!\n\nClick to confirm: ${confirmUrl}\n\nThis link expires in 24 hours.`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#FFF8E7;padding:30px;border-radius:8px;"><h1 style="color:#D4AF37;font-family:Georgia,serif;text-align:center;">Welcome to Chikielau!</h1><p style="text-align:center;">Click below to confirm your subscription.</p><div style="text-align:center;margin:30px 0;"><a href="${confirmUrl}" style="background:#D4AF37;color:#1A1A1A;padding:12px 32px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">Confirm Subscription</a></div><p style="color:#BCAAA4;font-size:12px;text-align:center;">This link expires in 24 hours.</p></div>`
        });
        sent++;
      } catch { skipped++; }
      if (i < emails.length - 1 && sent > 0) await new Promise(r => setTimeout(r, 250));
    }
    return res.status(200).json({ success: true, sent, skipped });
  }

  if (req.method === 'DELETE') {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    try {
      await redis.srem('subscribers', email.toLowerCase());
      await redis.del(`subscriber:${email.toLowerCase()}`);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete subscriber error:', error);
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
