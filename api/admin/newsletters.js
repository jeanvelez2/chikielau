import { Redis } from '@upstash/redis';
import { adminAuth } from '../_lib/config.js';
import { sendNewsletter, buildEmail, createTransporter } from '../_lib/email.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const ids = await redis.lrange('newsletters', 0, -1);
      const pipeline = redis.pipeline();
      for (const id of ids) pipeline.hgetall(`newsletter:${id}`);
      const results = ids.length ? await pipeline.exec() : [];
      const newsletters = [];
      for (let i = 0; i < ids.length; i++) {
        if (results[i]) newsletters.push({ id: ids[i], ...results[i] });
      }
      return res.status(200).json({ success: true, newsletters });
    } catch (error) {
      console.error('List newsletters error:', error);
      return res.status(500).json({ error: 'Failed to fetch newsletters' });
    }
  }

  if (req.method === 'POST') {
    const { subject, body, send, scheduledAt, testEmail } = req.body;
    if (!subject || !body) return res.status(400).json({ error: 'Subject and body required' });
    if (subject.length > 200 || body.length > 50000) return res.status(400).json({ error: 'Input exceeds maximum length' });

    if (testEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) return res.status(400).json({ error: 'Invalid test email' });
      try {
        const transporter = await createTransporter();
        const { html, text } = buildEmail(subject, body, testEmail, 'test', { preheader: req.body.preheader, footerMessage: req.body.footerMessage });
        await transporter.sendMail({
          from: `"Chikielau" <${process.env.GMAIL_USER}>`,
          replyTo: process.env.GMAIL_USER,
          to: testEmail,
          subject: `[TEST] ${subject}`,
          html,
          text
        });
        return res.status(200).json({ success: true, message: 'Test email sent' });
      } catch (err) {
        console.error('Test email error:', err);
        return res.status(500).json({ error: 'Failed to send test email' });
      }
    }

    try {
      const id = Date.now().toString(36);
      let status = 'draft';
      if (scheduledAt) {
        const d = new Date(scheduledAt);
        if (isNaN(d.getTime()) || d <= new Date()) return res.status(400).json({ error: 'Scheduled time must be a valid future date' });
        status = 'scheduled';
      } else if (send) status = 'sending';

      const newsletter = { subject, body, createdAt: new Date().toISOString(), status };
      if (scheduledAt) newsletter.scheduledAt = scheduledAt;
      if (req.body.preheader) newsletter.preheader = req.body.preheader;
      if (req.body.footerMessage) newsletter.footerMessage = req.body.footerMessage;

      await redis.hset(`newsletter:${id}`, newsletter);
      await redis.lpush('newsletters', id);

      if (send && !scheduledAt) {
        const sentCount = await sendNewsletter(redis, id, subject, body, { preheader: req.body.preheader, footerMessage: req.body.footerMessage });
        return res.status(200).json({ success: true, id, sentTo: sentCount });
      }

      return res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Create newsletter error:', error);
      return res.status(500).json({ error: 'Failed to create newsletter' });
    }
  }

  if (req.method === 'PUT') {
    const { id, subject, body, send, retryFailed } = req.body;
    if (!id) return res.status(400).json({ error: 'Newsletter ID required' });

    try {
      const existing = await redis.hgetall(`newsletter:${id}`);
      if (!existing) return res.status(404).json({ error: 'Newsletter not found' });

      if (retryFailed) {
        if (!existing.failedTo) return res.status(400).json({ error: 'No failed recipients' });
        const failedEmails = typeof existing.failedTo === 'string' ? JSON.parse(existing.failedTo) : existing.failedTo;
        const transporter = await createTransporter();
        let retrySent = 0;
        const stillFailed = [];
        for (const email of failedEmails) {
          try {
            const { html, text, unsubUrl } = buildEmail(existing.subject, existing.body, email, id, { preheader: existing.preheader, footerMessage: existing.footerMessage });
            await transporter.sendMail({ from: `"Chikielau" <${process.env.GMAIL_USER}>`, replyTo: process.env.GMAIL_USER, to: email, subject: existing.subject, html, text, headers: { 'List-Unsubscribe': `<${unsubUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
            retrySent++;
          } catch { stillFailed.push(email); }
        }
        const updates = { sentTo: String(Number(existing.sentTo || 0) + retrySent) };
        if (stillFailed.length > 0) updates.failedTo = JSON.stringify(stillFailed);
        else await redis.hdel(`newsletter:${id}`, 'failedTo');
        await redis.hset(`newsletter:${id}`, updates);
        return res.status(200).json({ success: true, retrySent, stillFailed: stillFailed.length });
      }

      if (send && existing.status === 'sent') return res.status(400).json({ error: 'Newsletter already sent' });

      if (!send && !retryFailed && existing.status === 'scheduled' && existing.scheduledAt) {
        const timeUntil = new Date(existing.scheduledAt) - new Date();
        if (timeUntil < 300000 && timeUntil > 0) return res.status(400).json({ error: 'Cannot edit — scheduled to send within 5 minutes' });
      }

      const updates = {};
      if (subject) updates.subject = subject;
      if (body) updates.body = body;
      if (req.body.preheader !== undefined) updates.preheader = req.body.preheader;
      if (req.body.footerMessage !== undefined) updates.footerMessage = req.body.footerMessage;
      if (Object.keys(updates).length) await redis.hset(`newsletter:${id}`, updates);

      if (send) {
        const nl = await redis.hgetall(`newsletter:${id}`);
        await redis.hset(`newsletter:${id}`, { status: 'sending' });
        const sentCount = await sendNewsletter(redis, id, nl.subject, nl.body, { preheader: nl.preheader, footerMessage: nl.footerMessage });
        return res.status(200).json({ success: true, sentTo: sentCount });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update newsletter error:', error);
      return res.status(500).json({ error: 'Failed to update' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Newsletter ID required' });
    try {
      await redis.lrem('newsletters', 0, id);
      await redis.del(`newsletter:${id}`);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete newsletter error:', error);
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
