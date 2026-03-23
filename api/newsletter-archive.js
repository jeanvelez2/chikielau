import { Redis } from '@upstash/redis';
import { markdownToHtml, escapeHtml } from './_lib/email.js';
import { BASE_URL } from './_lib/config.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const perPage = 20;
    const ids = await redis.lrange('newsletters', 0, -1);
    const pipeline = redis.pipeline();
    for (const id of ids) pipeline.hgetall(`newsletter:${id}`);
    const results = ids.length ? await pipeline.exec() : [];
    const all = [];
    for (let i = 0; i < ids.length; i++) {
      const nl = results[i];
      if (nl && nl.status === 'sent') all.push({ id: ids[i], ...nl });
    }
    const total = all.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    if (page > totalPages && total > 0) {
      res.setHeader('Location', `?page=${totalPages}`);
      return res.status(302).end();
    }
    const newsletters = all.slice((page - 1) * perPage, page * perPage);

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Newsletter Archive - Chikielau</title>
<meta name="description" content="Browse past newsletters from Chikielau — book reviews, recommendations, and literary musings.">
<meta property="og:title" content="Newsletter Archive - Chikielau">
<meta property="og:description" content="Browse past newsletters from Chikielau — book reviews, recommendations, and literary musings.">
<meta property="og:type" content="website">
<meta property="og:url" content="${BASE_URL}/api/newsletter-archive">
<link rel="canonical" href="${BASE_URL}/api/newsletter-archive">
<style>
*{box-sizing:border-box}
body{background:#1A1A1A;color:#FFF8E7;font-family:'Lato',Arial,sans-serif;margin:0;padding:0}
.site-nav{background:#1A1A1A;border-bottom:1px solid #2C2C2C;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;max-width:900px;margin:0 auto}
.site-nav .logo{color:#D4AF37;font-family:Georgia,serif;font-size:1.4rem;text-decoration:none}
.site-nav .nav-links{display:flex;gap:20px}
.site-nav .nav-links a{color:#D7CCC8;text-decoration:none;font-size:0.9rem}
.site-nav .nav-links a:hover{color:#D4AF37}
.archive{max-width:700px;margin:0 auto;padding:40px 20px}
h1{color:#D4AF37;font-family:Georgia,serif;text-align:center;margin-bottom:40px}
.nl-item{border-bottom:1px solid #2C2C2C;padding:30px 0}
.nl-item:last-child{border-bottom:none}
.nl-item h2{color:#D4AF37;font-family:Georgia,serif;margin:0 0 8px}
.nl-date{color:#BCAAA4;font-size:0.85rem;margin-bottom:16px}
.nl-body{display:none;line-height:1.6}
.nl-body strong{color:#F4E4C1}
.nl-body a{color:#D4AF37}
.nl-body h1,.nl-body h2,.nl-body h3{color:#D4AF37;font-family:Georgia,serif}
.nl-body hr{border:1px solid #2C2C2C}
.empty{text-align:center;color:#BCAAA4;padding:60px 0}
.archive-footer{text-align:center;padding:40px 20px;border-top:1px solid #2C2C2C;margin-top:40px;color:#BCAAA4;font-size:0.85rem}
.archive-footer a{color:#D4AF37;text-decoration:none}
.nl-body.open{display:block}
.nl-toggle{color:#BCAAA4;font-size:0.8rem;cursor:pointer;margin-bottom:8px}
.nl-share{display:flex;gap:8px;margin-top:8px}
.nl-share a,.nl-share button{color:#BCAAA4;font-size:0.75rem;text-decoration:none;background:none;border:1px solid #2C2C2C;padding:2px 8px;border-radius:3px;cursor:pointer}
.nl-share a:hover,.nl-share button:hover{border-color:#D4AF37;color:#D4AF37}
.pagination{display:flex;justify-content:center;gap:12px;margin-top:40px}
.pagination a{color:#D4AF37;text-decoration:none;padding:8px 16px;border:1px solid #2C2C2C;border-radius:4px}
.pagination a:hover{border-color:#D4AF37}
.pagination .current{color:#FFF8E7;border-color:#D4AF37;background:#2C2C2C;padding:8px 16px;border:1px solid #D4AF37;border-radius:4px}
</style></head><body>
<nav class="site-nav">
  <a href="${BASE_URL}" class="logo">Chikielau</a>
  <div class="nav-links">
    <a href="${BASE_URL}/blog.html">Blog</a>
    <a href="${BASE_URL}/about.html">About</a>
    <a href="${BASE_URL}/newsletter.html">Newsletter</a>
  </div>
</nav>
<div class="archive">
<h1>Newsletter Archive</h1>
${newsletters.length === 0 ? '<p class="empty">No newsletters yet. Subscribe to be the first to know!</p>' :
  newsletters.map(n => `<div class="nl-item">
  <h2>${escapeHtml(n.subject)}</h2>
  <div class="nl-date">${n.sentAt ? new Date(n.sentAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</div>
  <div class="nl-toggle" onclick="var b=this.nextElementSibling;b.classList.toggle('open');this.textContent=b.classList.contains('open')?'▾ Collapse':'▸ Read more'">▸ Read more</div>
  <div class="nl-body"><p>${markdownToHtml(n.body)}</p></div>
  <div class="nl-share">
    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(n.subject + ' — Chikielau Newsletter')}&url=${encodeURIComponent(BASE_URL + '/api/newsletter-archive')}" target="_blank" rel="noopener noreferrer">Share on X</a>
    <button onclick="navigator.clipboard.writeText('${BASE_URL}/api/newsletter-archive');this.textContent='Copied!'">Copy Link</button>
  </div>
</div>`).join('')}
${totalPages > 1 ? `<div class="pagination">
  ${page > 1 ? `<a href="?page=${page - 1}">← Prev</a>` : ''}
  ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => p === page ? `<span class="current">${p}</span>` : `<a href="?page=${p}">${p}</a>`).join('')}
  ${page < totalPages ? `<a href="?page=${page + 1}">Next →</a>` : ''}
</div>` : ''}
</div>
<div class="archive-footer">
  <a href="${BASE_URL}">← Back to Chikielau</a> · <a href="${BASE_URL}/newsletter.html">Subscribe</a>
</div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Archive error:', error);
    return res.status(500).send('<p>Something went wrong.</p>');
  }
}
