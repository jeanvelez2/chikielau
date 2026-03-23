import { Redis } from '@upstash/redis';
import { makeUnsubToken } from './_lib/email.js';
import { BASE_URL, safeCompare } from './_lib/config.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' https: data:; connect-src 'self' https://graph.instagram.com; frame-ancestors 'none'");
  const { email, token } = req.query;
  if (!email || !token) return res.status(400).send(page('Invalid link', 'This link is invalid.'));

  const lower = email.toLowerCase();
  if (!safeCompare(token, makeUnsubToken(lower))) return res.status(400).send(page('Invalid link', 'This link is invalid.'));

  try {
    const exists = await redis.sismember('subscribers', lower);
    if (!exists) return res.status(400).send(page('Not subscribed', 'You are not currently subscribed.'));

    if (req.method === 'GET') {
      const sub = await redis.hgetall(`subscriber:${lower}`) || {};
      return res.status(200).send(prefsPage(lower, token, sub.frequency || 'every'));
    }

    if (req.method === 'POST') {
      const { frequency } = req.body;
      if (!['every', 'monthly'].includes(frequency)) return res.status(400).json({ error: 'Invalid frequency' });
      await redis.hset(`subscriber:${lower}`, { frequency });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Preferences error:', error);
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

function prefsPage(email, token, current) {
  const safeEmail = email.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/<\//g, '<\\/');
  const safeToken = token.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/<\//g, '<\\/');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Preferences - Chikielau</title>
<style>body{background:#1A1A1A;color:#FFF8E7;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{text-align:center;max-width:500px;padding:40px}.box h1{color:#D4AF37;font-family:Georgia,serif}
.box a{color:#D4AF37}
.opts{display:flex;flex-direction:column;gap:8px;margin:20px 0;text-align:left}
.opts label{cursor:pointer;padding:8px 12px;border:1px solid #2C2C2C;border-radius:4px}
.opts label:hover{border-color:#D4AF37}
.opts input{margin-right:8px}
button.btn{background:#D4AF37;color:#1A1A1A;border:none;padding:8px 24px;border-radius:4px;cursor:pointer;font-weight:bold;margin-top:12px}
#msg{color:#8f8;display:none;margin-top:12px}
</style></head>
<body><div class="box">
<h1>Email Preferences</h1>
<p style="color:#BCAAA4;">Choose how often you'd like to hear from us:</p>
<div class="opts">
  <label><input type="radio" name="freq" value="every" ${current === 'every' ? 'checked' : ''}> Every newsletter</label>
  <label><input type="radio" name="freq" value="monthly" ${current === 'monthly' ? 'checked' : ''}> Monthly digest only</label>
</div>
<button class="btn" id="saveBtn">Save Preferences</button>
<p id="msg">Preferences saved!</p>
<p><a href="${BASE_URL}">← Back to Chikielau</a></p>
</div>
<script>
document.getElementById('saveBtn').addEventListener('click', async () => {
  const freq = document.querySelector('input[name="freq"]:checked');
  if (!freq) return;
  try {
    await fetch('/api/newsletter-preferences?email=${encodeURIComponent(safeEmail)}&token=${safeToken}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frequency: freq.value })
    });
    document.getElementById('msg').style.display = 'block';
  } catch {}
});
</script></body></html>`;
}
