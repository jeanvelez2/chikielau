import { createHmac } from 'crypto';
import { BASE_URL } from './config.js';

/** Escape HTML special characters including single quotes */
export function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function hmacSecret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error('ADMIN_SECRET not configured');
  return s;
}

/** Generate 128-bit HMAC unsubscribe token for an email @param {string} email */
export function makeUnsubToken(email) {
  return createHmac('sha256', hmacSecret()).update(`unsub:${email}`).digest('hex').slice(0, 32);
}

/** Generate 128-bit HMAC confirmation token for an email @param {string} email */
export function makeConfirmToken(email) {
  return createHmac('sha256', hmacSecret()).update(email).digest('hex').slice(0, 32);
}

/** Sanitize a URL — only allow http(s) and relative paths */
function safeUrl(url) {
  return /^(https?:\/\/|\/)/i.test(url) ? url : '#';
}

/** Convert markdown subset to inline-styled HTML for emails @param {string} text */
export function markdownToHtml(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" style="max-width:100%;border-radius:4px;">`)
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, text, href) => `<a href="${safeUrl(href)}" style="color: #D4AF37;">${text}</a>`)
    .replace(/^### (.+)$/gm, '<h3 style="color: #D4AF37; font-family: Georgia, serif;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color: #D4AF37; font-family: Georgia, serif;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color: #D4AF37; font-family: Georgia, serif;">$1</h1>')
    .replace(/^---$/gm, '<hr style="border: 1px solid #2C2C2C; margin: 20px 0;">')
    .replace(/\n\n/g, '</p><p style="line-height: 1.6;">')
    .replace(/\n/g, '<br>');
}

/** Strip markdown to plain text for email text/plain fallback @param {string} text */
export function markdownToPlainText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '$1: $2')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
    .replace(/^#{1,3} /gm, '')
    .replace(/^---$/gm, '---');
}

/**
 * Build newsletter email HTML + plain text with tracking and unsubscribe links.
 * @param {string} subject @param {string} body @param {string} email
 * @param {string} newsletterId @param {{preheader?: string, footerMessage?: string}} opts
 * @returns {{html: string, text: string, unsubUrl: string}}
 */
export function buildEmail(subject, body, email, newsletterId, opts = {}) {
  const unsubToken = makeUnsubToken(email);
  const unsubUrl = `${BASE_URL}/api/newsletter-unsubscribe?email=${encodeURIComponent(email)}&token=${unsubToken}`;
  const trackUrl = `${BASE_URL}/api/newsletter-track?id=${encodeURIComponent(newsletterId)}&e=${encodeURIComponent(email)}`;
  const htmlBody = markdownToHtml(body);
  const prefsUrl = `${BASE_URL}/api/newsletter-preferences?email=${encodeURIComponent(email)}&token=${unsubToken}`;
  const preheader = opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(opts.preheader)}</div>` : '';
  const footerMsg = opts.footerMessage ? `<p style="color:#F4E4C1;font-size:13px;text-align:center;margin-bottom:20px;">${escapeHtml(opts.footerMessage)}</p>` : '';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1A1A1A; color: #FFF8E7; padding: 30px; border-radius: 8px;">
      ${preheader}
      <h1 style="color: #D4AF37; font-family: Georgia, serif; text-align: center;">${escapeHtml(subject)}</h1>
      <div style="line-height: 1.6;"><p style="line-height: 1.6;">${htmlBody}</p></div>
      <hr style="border: 1px solid #2C2C2C; margin: 30px 0;">
      ${footerMsg}
      <p style="color: #BCAAA4; font-size: 12px; text-align: center;">
        You received this because you subscribed to Chikielau's newsletter.<br>
        <a href="${BASE_URL}" style="color: #D4AF37;">chikielau.com</a> |
        <a href="${prefsUrl}" style="color: #BCAAA4;">Preferences</a> |
        <a href="${unsubUrl}" style="color: #BCAAA4;">Unsubscribe</a>
      </p>
      <img src="${trackUrl}" width="1" height="1" alt="" style="display:none;">
    </div>
  `;
  const text = `${subject}\n\n${markdownToPlainText(body)}${opts.footerMessage ? '\n\n' + opts.footerMessage : ''}\n\n---\nUnsubscribe: ${unsubUrl}\nchikielau.com`;
  return { html, text, unsubUrl };
}

const DELAY_MS = 250;
const MAX_BOUNCES = 3;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/** Create a Gmail SMTP transporter via nodemailer @returns {Promise<import('nodemailer').Transporter>} */
export async function createTransporter() {
  const nodemailer = await import('nodemailer');
  return nodemailer.default.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });
}

/**
 * Send a newsletter to all subscribers with bounce tracking.
 * @param {import('@upstash/redis').Redis} redis @param {string} id
 * @param {string} subject @param {string} body @param {{preheader?: string, footerMessage?: string}} opts
 * @returns {Promise<number>} Number of emails successfully sent
 */
export async function sendNewsletter(redis, id, subject, body, opts = {}) {
  const emails = await redis.smembers('subscribers');
  if (emails.length === 0) {
    await redis.hset(`newsletter:${id}`, { status: 'sent', sentAt: new Date().toISOString(), sentTo: '0' });
    return 0;
  }

  const transporter = await createTransporter();
  let sentCount = 0;
  const failed = [];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    try {
      const { html, text, unsubUrl } = buildEmail(subject, body, email, id, opts);
      await transporter.sendMail({
        from: `"Chikielau" <${process.env.GMAIL_USER}>`,
        replyTo: process.env.GMAIL_USER,
        to: email,
        subject,
        html,
        text,
        headers: {
          'List-Unsubscribe': `<${unsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      });
      sentCount++;
      await redis.hdel(`subscriber:${email}`, 'bounces');
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err.message);
      failed.push(email);
      const bounces = await redis.hincrby(`subscriber:${email}`, 'bounces', 1);
      if (bounces >= MAX_BOUNCES) {
        console.warn(`Removing ${email} after ${MAX_BOUNCES} bounces`);
        await redis.srem('subscribers', email);
        await redis.del(`subscriber:${email}`);
        await redis.lpush('removed-bounces', JSON.stringify({ email, reason: `${MAX_BOUNCES} bounces`, date: new Date().toISOString() }));
      }
    }
    if (i < emails.length - 1) await sleep(DELAY_MS);
  }

  await redis.hset(`newsletter:${id}`, {
    status: 'sent',
    sentAt: new Date().toISOString(),
    sentTo: String(sentCount),
    ...(failed.length > 0 ? { failedTo: JSON.stringify(failed) } : {})
  });

  return sentCount;
}
