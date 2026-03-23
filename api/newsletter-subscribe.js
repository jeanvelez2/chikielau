import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { makeConfirmToken, createTransporter } from './_lib/email.js';
import { BASE_URL } from './_lib/config.js';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'newsletter',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'anonymous';
    const { success } = await ratelimit.limit(ip);
    if (!success) return res.status(429).json({ error: 'Too many requests' });
  } catch { /* allow request if rate limiter fails */ }

  const { email, source, resend } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const lower = email.toLowerCase();

  try {
    const exists = await redis.sismember('subscribers', lower);
    if (exists) {
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    }

    const reasons = await redis.lrange('unsub-reasons', 0, 199);
    const wasSubscribed = reasons.some(r => {
      const entry = typeof r === 'string' ? JSON.parse(r) : r;
      return entry.email === lower;
    });

    const pending = await redis.exists(`pending:${lower}`);
    if (pending && !resend) {
      return res.status(200).json({ success: true, message: 'Confirmation email already sent. Check your inbox.', canResend: true });
    }

    const token = makeConfirmToken(lower);
    await redis.set(`pending:${lower}`, JSON.stringify({ token, source: source || 'unknown' }), { ex: 86400 });

    const confirmUrl = `${BASE_URL}/api/newsletter-confirm?email=${encodeURIComponent(lower)}&token=${token}`;
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"Chikielau" <${process.env.GMAIL_USER}>`,
      replyTo: process.env.GMAIL_USER,
      to: lower,
      subject: 'Confirm your subscription to Chikielau',
      text: `Welcome to Chikielau!\n\nClick the link below to confirm your newsletter subscription:\n${confirmUrl}\n\nThis link expires in 24 hours. If you didn't request this, ignore this email.\n\n---\nchikielau.com`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1A1A1A; color: #FFF8E7; padding: 30px; border-radius: 8px;">
          <h1 style="color: #D4AF37; font-family: Georgia, serif; text-align: center;">Welcome to Chikielau!</h1>
          <p style="line-height: 1.6; text-align: center;">Click the button below to confirm your newsletter subscription.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #D4AF37; color: #1A1A1A; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Confirm Subscription</a>
          </div>
          <p style="color: #BCAAA4; font-size: 12px; text-align: center;">This link expires in 24 hours. If you didn't request this, ignore this email.</p>
          <hr style="border: 1px solid #2C2C2C; margin: 30px 0;">
          <p style="color: #BCAAA4; font-size: 12px; text-align: center;">
            <a href="${BASE_URL}" style="color: #D4AF37;">chikielau.com</a> ·
            <a href="https://instagram.com/chikielau" style="color: #BCAAA4;">Instagram</a> ·
            <a href="https://tiktok.com/@chikielau" style="color: #BCAAA4;">TikTok</a> ·
            <a href="https://goodreads.com/chikielau" style="color: #BCAAA4;">Goodreads</a>
          </p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: wasSubscribed ? 'Welcome back! Check your email to re-confirm your subscription.' : 'Check your email to confirm your subscription!' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
