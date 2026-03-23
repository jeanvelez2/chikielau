import { Redis } from '@upstash/redis';
import { makeConfirmToken, createTransporter } from './_lib/email.js';
import { BASE_URL, safeCompare } from './_lib/config.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token } = req.query;
  if (!email || !token) {
    return res.status(400).send(page('Invalid link', 'This confirmation link is invalid.'));
  }

  const lower = email.toLowerCase();
  if (!safeCompare(token, makeConfirmToken(lower))) {
    return res.status(400).send(page('Invalid link', 'This confirmation link is invalid or has expired.'));
  }

  try {
    const pending = await redis.get(`pending:${lower}`);
    if (!pending) {
      const exists = await redis.sismember('subscribers', lower);
      if (exists) {
        return res.status(200).send(page('Already confirmed!', 'You are already subscribed to the Chikielau newsletter.'));
      }
      return res.status(400).send(page('Link expired', 'This confirmation link has expired. Please subscribe again.'));
    }

    let source = 'unknown';
    if (typeof pending === 'object' && pending !== null) {
      source = pending.source || 'unknown';
    } else if (typeof pending === 'string') {
      try { source = JSON.parse(pending).source || 'unknown'; } catch { /* legacy */ }
    }
    await redis.del(`pending:${lower}`);
    await redis.sadd('subscribers', lower);
    await redis.hset(`subscriber:${lower}`, { email: lower, subscribedAt: new Date().toISOString(), source });

    try {
      const transporter = await createTransporter();
      await transporter.sendMail({
        from: `"Chikielau" <${process.env.GMAIL_USER}>`,
        replyTo: process.env.GMAIL_USER,
        to: lower,
        subject: 'Welcome to Chikielau! 📚',
        text: `Welcome to Chikielau!\n\nYou're now subscribed to our newsletter. Expect book reviews, reading recommendations, and literary discoveries delivered to your inbox.\n\nHappy reading!\n\n---\nchikielau.com`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#FFF8E7;padding:30px;border-radius:8px;">
          <h1 style="color:#D4AF37;font-family:Georgia,serif;text-align:center;">Welcome to Chikielau! 📚</h1>
          <p style="line-height:1.6;text-align:center;">You're now subscribed to our newsletter. Expect book reviews, reading recommendations, and literary discoveries delivered to your inbox.</p>
          <p style="line-height:1.6;text-align:center;">Happy reading!</p>
          <hr style="border:1px solid #2C2C2C;margin:30px 0;">
          <p style="color:#BCAAA4;font-size:12px;text-align:center;">
            <a href="${BASE_URL}" style="color:#D4AF37;">chikielau.com</a> ·
            <a href="https://instagram.com/chikielau" style="color:#BCAAA4;">Instagram</a> ·
            <a href="https://tiktok.com/@chikielau" style="color:#BCAAA4;">TikTok</a> ·
            <a href="https://goodreads.com/chikielau" style="color:#BCAAA4;">Goodreads</a>
          </p></div>`
      });
    } catch (e) { console.error('Welcome email failed:', e.message); }

    return res.status(200).send(page('Subscription confirmed!', 'You are now subscribed to the Chikielau newsletter. Welcome!'));
  } catch (error) {
    console.error('Confirm error:', error);
    return res.status(500).send(page('Error', 'Something went wrong. Please try again.'));
  }
}

function page(title, message) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex">
<title>${title} - Chikielau</title>
<style>body{background:#1A1A1A;color:#FFF8E7;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{text-align:center;max-width:500px;padding:40px}.box h1{color:#D4AF37;font-family:Georgia,serif}
.box a{color:#D4AF37}</style></head>
<body><div class="box"><h1>${title}</h1><p>${message}</p><p><a href="${BASE_URL}">← Back to Chikielau</a></p></div></body></html>`;
}
