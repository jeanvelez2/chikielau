import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { makeUnsubToken } from './_lib/email.js';
import { BASE_URL, safeCompare } from './_lib/config.js';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'unsub-reason',
});

export default async function handler(req, res) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' https: data:; connect-src 'self' https://graph.instagram.com; frame-ancestors 'none'");
  if (req.method === 'GET') {
    const { email, token } = req.query;
    if (!email || !token) {
      return res.status(400).send(page('Invalid link', 'This unsubscribe link is invalid.'));
    }

    const lower = email.toLowerCase();
    if (!safeCompare(token, makeUnsubToken(lower))) {
      return res.status(400).send(page('Invalid link', 'This unsubscribe link is invalid.'));
    }

    try {
      const exists = await redis.sismember('subscribers', lower);
      if (!exists) return res.status(200).send(unsubPage(lower, token, true));
      await redis.srem('subscribers', lower);
      await redis.del(`subscriber:${lower}`);
      return res.status(200).send(unsubPage(lower, token, false));
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return res.status(500).send(page('Error', 'Something went wrong. Please try again.'));
    }
  }

  if (req.method === 'POST') {
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
      const { success: allowed } = await ratelimit.limit(ip);
      if (!allowed) return res.status(429).json({ error: 'Too many requests' });
    } catch { /* allow request if rate limiter fails */ }

    const { email, token, reason } = req.body;
    if (!email || !token) return res.status(400).json({ error: 'Invalid request' });

    const lower = email.toLowerCase();
    if (!safeCompare(token, makeUnsubToken(lower))) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    if (reason && reason.length <= 500) {
      await redis.lpush('unsub-reasons', JSON.stringify({ email: lower, reason, date: new Date().toISOString() }));
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
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

function unsubPage(email, token, alreadyGone) {
  const safeEmail = email.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/<\//g, '<\\/');
  const safeToken = token.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/<\//g, '<\\/');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Unsubscribed - Chikielau</title>
<style>body{background:#1A1A1A;color:#FFF8E7;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{text-align:center;max-width:500px;padding:40px}.box h1{color:#D4AF37;font-family:Georgia,serif}
.box a{color:#D4AF37}
.reasons{display:flex;flex-direction:column;gap:8px;margin:20px 0;text-align:left}
.reasons label{cursor:pointer;padding:8px 12px;border:1px solid #2C2C2C;border-radius:4px}
.reasons label:hover{border-color:#D4AF37}
.reasons input[type="radio"]{margin-right:8px}
#reasonMsg{color:#8f8;display:none;margin-top:12px}
button.btn-reason{background:#D4AF37;color:#1A1A1A;border:none;padding:8px 24px;border-radius:4px;cursor:pointer;font-weight:bold;margin-top:12px}
</style></head>
<body><div class="box">
<h1 id="t-title">${alreadyGone ? 'Already Unsubscribed' : 'Unsubscribed'}</h1>
<p id="t-msg">${alreadyGone ? 'You are already unsubscribed from the Chikielau newsletter.' : 'You have been unsubscribed from the Chikielau newsletter. Sorry to see you go!'}</p>
${alreadyGone ? '' : `<p style="color:#BCAAA4;font-size:14px;" id="t-why">Mind telling us why? (optional)</p>
<div class="reasons">
  <label><input type="radio" name="reason" value="Too frequent"> <span class="t-r1">Too many emails</span></label>
  <label><input type="radio" name="reason" value="Not relevant"> <span class="t-r2">Content not relevant</span></label>
  <label><input type="radio" name="reason" value="Never signed up"> <span class="t-r3">I never signed up</span></label>
  <label><input type="radio" name="reason" value="Other"> <span class="t-r4">Other</span></label>
</div>
<button class="btn-reason" id="sendReason">Send Feedback</button>
<p id="reasonMsg">Thanks for the feedback!</p>`}
<p><a href="${BASE_URL}" id="t-back">← Back to Chikielau</a></p>
</div>
<script>
if (navigator.language && navigator.language.startsWith('es')) {
  document.getElementById('t-title').textContent=${alreadyGone ? "'Ya desuscrito'" : "'Desuscrito'"};
  document.getElementById('t-msg').textContent=${alreadyGone ? "'Ya estás desuscrito del boletín de Chikielau.'" : "'Te has desuscrito del boletín de Chikielau. ¡Lamentamos verte partir!'"};
  document.getElementById('t-back').textContent='← Volver a Chikielau';
  ${!alreadyGone ? `document.getElementById('t-why').textContent='¿Nos cuentas por qué? (opcional)';
  document.querySelector('.t-r1').textContent='Demasiados correos';
  document.querySelector('.t-r2').textContent='Contenido no relevante';
  document.querySelector('.t-r3').textContent='Nunca me suscribí';
  document.querySelector('.t-r4').textContent='Otro';
  document.getElementById('sendReason').textContent='Enviar';
  document.getElementById('reasonMsg').textContent='¡Gracias por tu opinión!';` : ''}
}
${!alreadyGone ? `document.getElementById('sendReason').addEventListener('click', async () => {
  const checked = document.querySelector('input[name="reason"]:checked');
  if (!checked) return;
  try {
    await fetch('/api/newsletter-unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '${safeEmail}', token: '${safeToken}', reason: checked.value })
    });
  } catch {}
  document.getElementById('sendReason').style.display = 'none';
  document.getElementById('reasonMsg').style.display = 'block';
  document.querySelector('.reasons').style.display = 'none';
});` : ''}
</script></body></html>`;
}
