document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('readingProgress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    });
  }

  document.getElementById('blogSearch')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.post-card').forEach(card => {
      card.style.display = !q || card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // R10 #9: Reading time
  const rc = document.querySelector('.review-content');
  const pm = document.querySelector('.post-meta');
  if (rc && pm) {
    const mins = Math.max(1, Math.round(rc.textContent.trim().split(/\s+/).length / 200));
    const span = document.createElement('span');
    span.className = 'read-time';
    span.textContent = `\u00B7 ${mins} min read`;
    pm.appendChild(span);
  }

  // R10 #8: Genre pills from JSON-LD
  const ld = document.querySelector('script[type="application/ld+json"]');
  const bookMeta = document.querySelector('.book-meta');
  if (ld && bookMeta) {
    try {
      const data = JSON.parse(ld.textContent);
      const genres = data.genre || data.itemReviewed?.genre;
      if (genres?.length) {
        const div = document.createElement('div');
        div.className = 'genre-pills';
        genres.forEach(g => {
          const a = document.createElement('a');
          a.className = 'genre-pill';
          a.href = '../blog-full.html?genre=' + encodeURIComponent(g);
          a.textContent = g;
          div.appendChild(a);
        });
        bookMeta.appendChild(div);
      }
    } catch {}
  }

  // R10 #7: Share buttons
  const buySection = document.querySelector('.buy-section');
  if (buySection) {
    const div = document.createElement('div');
    div.className = 'share-bar';
    const title = document.querySelector('.post-title')?.textContent || document.title;
    const url = location.href;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '🔗 Copy Link';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => {});
    });
    div.appendChild(copyBtn);

    if (navigator.share) {
      const shareBtn = document.createElement('button');
      shareBtn.textContent = '📤 Share';
      shareBtn.addEventListener('click', () => { navigator.share({ title, url }).catch(() => {}); });
      div.appendChild(shareBtn);
    }

    buySection.after(div);
  }
});

function showToast(msg) {
  let t = document.querySelector('.share-toast');
  if (!t) { t = document.createElement('div'); t.className = 'share-toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 2000);
}
