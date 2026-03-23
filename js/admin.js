const API = {
  subscribers: '/api/admin/subscribers',
  newsletters: '/api/admin/newsletters',
  stats: '/api/admin/newsletter-stats',
  feedback: '/api/admin/unsub-reasons',
  bounced: '/api/admin/bounced'
};
let secret = '';
let csrfToken = '';
let subscriberCount = 0;
let allSubscribers = [];

function headers() {
  return { 'Content-Type': 'application/json', 'x-admin-secret': secret, 'x-csrf-token': csrfToken };
}

async function api(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { ...headers(), ...opts.headers } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Markdown preview (client-side, mirrors server)
function mdToHtml(text) {
  const safe = u => /^(https?:\/\/|\/)/i.test(u) ? u : '#';
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, (_, a, s) => `<img src="${safe(s)}" alt="${a}" style="max-width:100%;border-radius:4px;">`)
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, t, h) => `<a href="${safe(h)}">${t}</a>`)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const errorEl = document.getElementById('loginError');
  errorEl.style.display = 'none';
  secret = document.getElementById('adminPassword').value;
  try {
    await api(API.subscribers);
    csrfToken = crypto.randomUUID();
    sessionStorage.setItem('admin_secret', secret);
    sessionStorage.setItem('admin_csrf', csrfToken);
    showDashboard();
  } catch {
    errorEl.style.display = 'block';
  }
});

document.getElementById('adminPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('loginBtn').click();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  secret = '';
  csrfToken = '';
  sessionStorage.removeItem('admin_secret');
  sessionStorage.removeItem('admin_csrf');
  document.getElementById('dashboardView').style.display = 'none';
  document.getElementById('loginView').style.display = 'flex';
});

const saved = sessionStorage.getItem('admin_secret');
if (saved) { secret = saved; csrfToken = sessionStorage.getItem('admin_csrf') || crypto.randomUUID(); showDashboard(); }

// Tabs
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
    if (tab.dataset.tab === 'feedback') loadFeedback();
    if (tab.dataset.tab === 'bounced') loadBounced();
  });
});

// Dashboard
async function showDashboard() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'block';
  document.querySelectorAll('.stat-box .number').forEach(el => el.classList.add('loading'));
  try { await Promise.all([loadSubscribers(), loadNewsletters()]); }
  finally { document.querySelectorAll('.stat-box .number').forEach(el => el.classList.remove('loading')); }
}

async function loadSubscribers() {
  try {
    const data = await api(API.subscribers);
    subscriberCount = data.count;
    allSubscribers = data.subscribers;
    document.getElementById('subCount').textContent = data.count;
    document.getElementById('subHint').textContent = `Will send to ${data.count} subscriber${data.count !== 1 ? 's' : ''}`;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const newThisMonth = data.subscribers.filter(s => s.subscribedAt && s.subscribedAt >= monthStart).length;
    const newLastMonth = data.subscribers.filter(s => s.subscribedAt && s.subscribedAt >= lastMonthStart && s.subscribedAt < monthStart).length;
    const diff = newThisMonth - newLastMonth;
    const trend = diff > 0 ? ` <span style="color:#8f8;font-size:0.7rem;">↑${diff}</span>` : diff < 0 ? ` <span style="color:#f88;font-size:0.7rem;">↓${Math.abs(diff)}</span>` : '';
    document.getElementById('newThisMonth').innerHTML = newThisMonth + trend;
    renderSubscribers(data.subscribers);
  } catch (err) {
    document.getElementById('subList').innerHTML = `<div class="admin-msg error">${esc(err.message)}</div>`;
  }
}

function renderSubscribers(subs) {
  const list = document.getElementById('subList');
  document.getElementById('bulkRemoveBtn').style.display = 'none';
  if (subs.length === 0) {
    list.innerHTML = '<div class="empty-state">No subscribers found</div>';
    return;
  }
  list.innerHTML = `<ul class="subscriber-list">${subs.map(s => `
      <li>
        <label style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;">
          <input type="checkbox" class="sub-check" value="${esc(s.email)}">
          <div><span class="sub-email">${esc(s.email)}</span>${s.source && s.source !== 'unknown' ? `<span class="sub-source">${esc(s.source)}</span>` : ''}<br><span class="sub-date">${s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : ''}</span></div>
        </label>
        <button class="btn-danger" data-remove-sub="${esc(s.email)}">Remove</button>
      </li>`).join('')}</ul>`;
  list.querySelectorAll('[data-remove-sub]').forEach(btn => {
    btn.addEventListener('click', () => removeSub(btn.dataset.removeSub));
  });
  list.querySelectorAll('.sub-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = list.querySelectorAll('.sub-check:checked').length;
      document.getElementById('bulkRemoveBtn').style.display = checked > 0 ? '' : 'none';
    });
  });
}

document.getElementById('subSearch').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  renderSubscribers(q ? allSubscribers.filter(s => s.email.toLowerCase().includes(q)) : allSubscribers);
});

async function loadNewsletters() {
  try {
    const data = await api(API.newsletters);
    const nls = data.newsletters;
    document.getElementById('nlCount').textContent = nls.length;
    document.getElementById('sentCount').textContent = nls.filter(n => n.status === 'sent').length;
    document.getElementById('scheduledCount').textContent = nls.filter(n => n.status === 'scheduled').length;
    const list = document.getElementById('nlList');
    if (nls.length === 0) {
      list.innerHTML = '<div class="empty-state">No newsletters yet</div>';
      return;
    }
    list.innerHTML = nls.map(n => `
      <div class="newsletter-item" data-nl-id="${n.id}">
        <h3>${esc(n.subject)}</h3>
        <div class="newsletter-meta">
          <span class="badge badge-${n.status}">${n.status}</span>
          <span>${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</span>
          ${n.sentTo !== undefined && n.status === 'sent' ? `<span>Sent to ${n.sentTo}</span>` : ''}
          ${n.failedTo ? `<span style="color:#f88;">Failed: ${(() => { try { const f = typeof n.failedTo === 'string' ? JSON.parse(n.failedTo) : n.failedTo; return f.length; } catch { return '?'; } })()}</span><button class="btn-sm" style="background:#5e2e2e;color:#f88;" data-failed-nl="${n.id}" data-failed-emails="${esc(JSON.stringify(typeof n.failedTo === 'string' ? JSON.parse(n.failedTo) : n.failedTo))}">View Failed</button><button class="btn-sm btn-send" data-retry-nl="${n.id}">Retry Failed</button>` : ''}
          ${n.scheduledAt ? `<span>Scheduled: ${new Date(n.scheduledAt).toLocaleString()}</span>` : ''}
          <span class="opens-info" data-opens-id="${n.id}"></span>
          ${n.status === 'draft' || n.status === 'scheduled' ? `<button class="btn-sm btn-edit" data-edit-nl="${n.id}">Edit</button>` : ''}
          ${n.status === 'sent' ? `<button class="btn-sm btn-edit" data-view-nl="${n.id}">View</button>` : ''}
          <button class="btn-sm btn-edit" data-clone-nl="${n.id}">Clone</button>
          ${n.status === 'draft' ? `<button class="btn-sm btn-send" data-send-nl="${n.id}">Send</button>` : ''}
          <button class="btn-danger" data-remove-nl="${n.id}">Delete</button>
        </div>
      </div>`).join('');

    // Attach event listeners
    list.querySelectorAll('[data-remove-nl]').forEach(btn => {
      btn.addEventListener('click', () => removeNl(btn.dataset.removeNl));
    });
    list.querySelectorAll('[data-edit-nl]').forEach(btn => {
      btn.addEventListener('click', () => editNl(btn.dataset.editNl, nls));
    });
    list.querySelectorAll('[data-send-nl]').forEach(btn => {
      btn.addEventListener('click', () => sendExisting(btn.dataset.sendNl));
    });
    list.querySelectorAll('[data-view-nl]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nl = nls.find(n => n.id === btn.dataset.viewNl);
        if (!nl) return;
        const w = window.open('', '_blank');
        w.document.write(`<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#FFF8E7;padding:30px;border-radius:8px;"><h1 style="color:#D4AF37;font-family:Georgia,serif;text-align:center;">${esc(nl.subject)}</h1><div style="line-height:1.6"><p>${mdToHtml(nl.body)}</p></div></div>`);
        w.document.close();
      });
    });
    list.querySelectorAll('[data-clone-nl]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nl = nls.find(n => n.id === btn.dataset.cloneNl);
        if (!nl) return;
        document.getElementById('nlSubject').value = nl.subject;
        document.getElementById('nlBody').value = nl.body;
        document.getElementById('editingId').value = '';
        nlBody.dispatchEvent(new Event('input'));
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        document.querySelector('[data-tab="compose"]').classList.add('active');
        document.getElementById('panel-compose').classList.add('active');
        composeDirty = true;
        showMsg(document.getElementById('composeMsg'), `Cloned: ${nl.subject}`, 'success');
      });
    });

    list.querySelectorAll('[data-failed-nl]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const emails = JSON.parse(btn.dataset.failedEmails);
          alert('Failed recipients:\n\n' + emails.join('\n'));
        } catch { alert('Could not parse failed emails'); }
      });
    });
    attachRetryListeners();

    // Load open stats for sent newsletters
    const sentNls = nls.filter(n => n.status === 'sent');
    const trendData = [];
    for (const n of sentNls) {
      const pct = await loadOpenStats(n.id, Number(n.sentTo) || 0);
      trendData.push({ subject: n.subject, pct });
    }
    if (sentNls.length > 0) {
      const note = document.createElement('p');
      note.className = 'stats-note';
      note.textContent = 'Open rates are approximate — many email clients block tracking pixels.';
      list.appendChild(note);
    }
    // Render trend chart
    if (trendData.length >= 2) {
      const chart = document.createElement('div');
      chart.style.cssText = 'margin-top:16px;padding:16px;background:var(--color-black-secondary);border-radius:var(--border-radius-sm);';
      chart.innerHTML = `<p style="color:var(--color-text-secondary);font-size:0.85rem;margin:0 0 8px;">Open Rate Trend (last ${Math.min(trendData.length, 10)})</p>
        <div style="display:flex;align-items:flex-end;gap:4px;height:80px;">${trendData.slice(0, 10).reverse().map(d =>
          `<div title="${esc(d.subject)}: ${d.pct}%" style="flex:1;background:var(--color-gold-primary);border-radius:2px 2px 0 0;min-width:12px;height:${Math.max(d.pct, 2)}%;opacity:${d.pct > 0 ? 1 : 0.3};"></div>`
        ).join('')}</div>`;
      list.appendChild(chart);
    }
  } catch (err) {
    document.getElementById('nlList').innerHTML = `<div class="admin-msg error">${esc(err.message)}</div>`;
  }
}

async function loadOpenStats(id, sentTo) {
  try {
    const data = await api(`${API.stats}?id=${id}`);
    const el = document.querySelector(`[data-opens-id="${id}"]`);
    const pct = sentTo > 0 ? Math.min(100, Math.round((data.opens.unique / sentTo) * 100)) : 0;
    if (el && data.opens) {
      el.innerHTML = `<div class="open-bar-wrap">
        <div class="open-bar"><div class="open-bar-fill" style="width:${pct}%"></div></div>
        <span class="open-bar-label">${data.opens.unique}/${sentTo} opened (${pct}%) · ${data.opens.total} total</span>
      </div>`;
    }
    return pct;
  } catch { return 0; }
}

// Compose
document.getElementById('sendBtn').addEventListener('click', () => submitNewsletter(true));
document.getElementById('draftBtn').addEventListener('click', () => submitNewsletter(false));
document.getElementById('scheduleBtn').addEventListener('click', () => {
  const dt = document.getElementById('scheduleAt').value;
  if (!dt) { showMsg(document.getElementById('composeMsg'), 'Pick a date/time first', 'error'); return; }
  if (new Date(dt) <= new Date()) { showMsg(document.getElementById('composeMsg'), 'Scheduled time must be in the future', 'error'); return; }
  submitNewsletter(false, new Date(dt).toISOString());
});

document.getElementById('nextMorningBtn').addEventListener('click', () => {
  const now = new Date();
  const next9 = new Date(now);
  next9.setHours(9, 0, 0, 0);
  if (next9 <= now) next9.setDate(next9.getDate() + 1);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('scheduleAt').value = `${next9.getFullYear()}-${pad(next9.getMonth()+1)}-${pad(next9.getDate())}T${pad(next9.getHours())}:${pad(next9.getMinutes())}`;
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (document.getElementById('nlSubject').value || document.getElementById('nlBody').value) {
    if (!confirm('Clear the compose form?')) return;
  }
  resetCompose();
});

document.getElementById('previewBtn').addEventListener('click', () => {
  const box = document.getElementById('previewBox');
  const body = document.getElementById('nlBody').value;
  if (!body.trim()) { box.style.display = 'none'; return; }
  const isHtml = box.dataset.mode === 'html' && box.style.display === 'block';
  if (isHtml) { box.style.display = 'none'; box.dataset.mode = ''; return; }
  document.getElementById('previewContent').innerHTML = '<p>' + mdToHtml(body) + '</p>';
  box.dataset.mode = 'html';
  box.style.display = 'block';
});

// Character count
const nlBody = document.getElementById('nlBody');
const charCount = document.getElementById('charCount');
nlBody.addEventListener('input', () => {
  const len = nlBody.value.length;
  charCount.textContent = `${len.toLocaleString()} / 50,000`;
  charCount.className = len > 45000 ? 'char-count warn' : 'char-count';
});

// Ctrl+P preview shortcut in compose textarea
nlBody.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
    document.getElementById('previewBtn').click();
  }
});

// Plain text preview
function mdToPlain(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '$1: $2').replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
    .replace(/^#{1,3} /gm, '').replace(/^---$/gm, '---');
}
document.getElementById('plainBtn').addEventListener('click', () => {
  const box = document.getElementById('previewBox');
  const body = document.getElementById('nlBody').value;
  if (!body.trim()) { box.style.display = 'none'; return; }
  const isPlain = box.dataset.mode === 'plain' && box.style.display === 'block';
  if (isPlain) { box.style.display = 'none'; box.dataset.mode = ''; return; }
  document.getElementById('previewContent').innerHTML = '<pre style="white-space:pre-wrap;font-family:monospace;font-size:0.9rem;">' + esc(mdToPlain(body)) + '</pre>';
  box.dataset.mode = 'plain';
  box.style.display = 'block';
});

// Warn before leaving compose with unsaved changes
let composeDirty = false;
const nlSubjectEl = document.getElementById('nlSubject');
const nlPreheaderEl = document.getElementById('nlPreheader');
const nlFooterEl = document.getElementById('nlFooter');
nlBody.addEventListener('input', () => { composeDirty = true; });
nlSubjectEl.addEventListener('input', () => { composeDirty = true; });
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    if (composeDirty && tab.dataset.tab !== 'compose' && (nlSubjectEl.value || nlBody.value)) {
      if (!confirm('You have unsaved changes in compose. Leave anyway?')) {
        e.stopImmediatePropagation();
        return;
      }
    }
  }, true);
});

// Auto-save drafts to localStorage
function autoSave() {
  try {
    localStorage.setItem('admin_draft', JSON.stringify({
      subject: nlSubjectEl.value,
      body: nlBody.value,
      preheader: nlPreheaderEl.value,
      footerMessage: nlFooterEl.value
    }));
    const el = document.getElementById('draftSaved');
    el.textContent = `Draft saved at ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
    el.style.display = '';
  } catch {}
}
nlBody.addEventListener('input', autoSave);
nlSubjectEl.addEventListener('input', autoSave);
nlPreheaderEl.addEventListener('input', autoSave);
nlFooterEl.addEventListener('input', autoSave);
// Restore on load
try {
  const draft = JSON.parse(localStorage.getItem('admin_draft'));
  if (draft && !nlSubjectEl.value && !nlBody.value) {
    nlSubjectEl.value = draft.subject || '';
    nlBody.value = draft.body || '';
    nlPreheaderEl.value = draft.preheader || '';
    nlFooterEl.value = draft.footerMessage || '';
    if (draft.body) nlBody.dispatchEvent(new Event('input'));
    composeDirty = false;
  }
} catch {}

// Send test email
document.getElementById('testBtn').addEventListener('click', async () => {
  const subject = document.getElementById('nlSubject').value.trim();
  const body = document.getElementById('nlBody').value.trim();
  const msg = document.getElementById('composeMsg');
  if (!subject || !body) { showMsg(msg, 'Subject and body required', 'error'); return; }
  const lastTest = localStorage.getItem('admin_test_email') || '';
  const testEmail = prompt('Send test to email:', lastTest);
  if (!testEmail) return;
  try { localStorage.setItem('admin_test_email', testEmail); } catch {}
  const btn = document.getElementById('testBtn');
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const data = await api(API.newsletters, {
      method: 'POST',
      body: JSON.stringify({ subject, body, testEmail, preheader: document.getElementById('nlPreheader').value.trim(), footerMessage: document.getElementById('nlFooter').value.trim() })
    });
    showMsg(msg, data.message || 'Test sent!', 'success');
  } catch (err) { showMsg(msg, err.message, 'error'); }
  finally { btn.disabled = false; btn.textContent = 'Send Test'; }
});

async function submitNewsletter(send, scheduledAt) {
  const subject = document.getElementById('nlSubject').value.trim();
  const body = document.getElementById('nlBody').value.trim();
  const preheader = document.getElementById('nlPreheader').value.trim();
  const footerMessage = document.getElementById('nlFooter').value.trim();
  const msg = document.getElementById('composeMsg');
  const editId = document.getElementById('editingId').value;

  if (!subject || !body) { showMsg(msg, 'Subject and body required', 'error'); return; }

  // Warn about duplicate subject
  try {
    const existing = await api(API.newsletters);
    const dupe = existing.newsletters.find(n => n.subject.trim().toLowerCase() === subject.toLowerCase() && n.id !== editId);
    if (dupe && !confirm(`A newsletter with this subject already exists (${dupe.status}). Continue anyway?`)) return;
  } catch {}

  // Refresh subscriber count before confirm dialog
  if (send) {
    try {
      const fresh = await api(API.subscribers);
      subscriberCount = fresh.count;
      document.getElementById('subCount').textContent = fresh.count;
      document.getElementById('subHint').textContent = `Will send to ${fresh.count} subscriber${fresh.count !== 1 ? 's' : ''}`;
    } catch {}
  }

  if (send && !confirm(`Send this newsletter to ${subscriberCount} subscriber${subscriberCount !== 1 ? 's' : ''}?`)) return;

  const btn = send ? document.getElementById('sendBtn') : (scheduledAt ? document.getElementById('scheduleBtn') : document.getElementById('draftBtn'));
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = send ? 'Sending...' : (scheduledAt ? 'Scheduling...' : 'Saving...');

  try {
    let data;
    if (editId && !scheduledAt) {
      // Update existing
      data = await api(API.newsletters, {
        method: 'PUT',
        body: JSON.stringify({ id: editId, subject, body, send, preheader, footerMessage })
      });
    } else {
      // Create new (or schedule)
      data = await api(API.newsletters, {
        method: 'POST',
        body: JSON.stringify({ subject, body, send, scheduledAt, preheader, footerMessage })
      });
    }

    const msgText = send ? `Sent to ${data.sentTo} subscriber${data.sentTo != 1 ? 's' : ''}!` : (scheduledAt ? 'Newsletter scheduled!' : 'Draft saved');
    showMsg(msg, msgText, 'success');
    composeDirty = false;
    resetCompose();
    await loadNewsletters();
  } catch (err) {
    showMsg(msg, err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

function editNl(id, newsletters) {
  const nl = newsletters.find(n => n.id === id);
  if (!nl) return;
  document.getElementById('nlSubject').value = nl.subject;
  document.getElementById('nlBody').value = nl.body;
  document.getElementById('nlPreheader').value = nl.preheader || '';
  document.getElementById('nlFooter').value = nl.footerMessage || '';
  document.getElementById('editingId').value = id;
  document.getElementById('previewBox').style.display = 'none';
  nlBody.dispatchEvent(new Event('input'));
  // Switch to compose tab
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="compose"]').classList.add('active');
  document.getElementById('panel-compose').classList.add('active');
  showMsg(document.getElementById('composeMsg'), `Editing: ${nl.subject}`, 'success');
}

async function sendExisting(id) {
  if (!confirm(`Send this newsletter to ${subscriberCount} subscriber${subscriberCount !== 1 ? 's' : ''}?`)) return;
  try {
    const data = await api(API.newsletters, {
      method: 'PUT',
      body: JSON.stringify({ id, send: true })
    });
    showMsg(document.getElementById('composeMsg'), `Sent to ${data.sentTo} subscriber${data.sentTo != 1 ? 's' : ''}!`, 'success');
    await loadNewsletters();
  } catch (err) { alert(err.message); }
}

function resetCompose() {
  document.getElementById('composeForm').reset();
  document.getElementById('editingId').value = '';
  document.getElementById('nlPreheader').value = '';
  document.getElementById('nlFooter').value = '';
  document.getElementById('previewBox').style.display = 'none';
  document.getElementById('previewBox').dataset.mode = '';
  document.getElementById('scheduleAt').value = '';
  document.getElementById('draftSaved').style.display = 'none';
  charCount.textContent = '0 / 50,000';
  charCount.className = 'char-count';
  composeDirty = false;
  try { localStorage.removeItem('admin_draft'); } catch {}
}

// Export CSV
document.getElementById('exportBtn').addEventListener('click', async () => {
  try {
    const res = await fetch(`${API.subscribers}?format=csv`, { headers: headers() });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) { alert(err.message); }
});

// Export newsletter stats CSV
document.getElementById('exportStatsBtn').addEventListener('click', async () => {
  const btn = document.getElementById('exportStatsBtn');
  btn.disabled = true; btn.textContent = 'Exporting...';
  try {
    const data = await api(API.newsletters);
    const rows = ['"Subject","Status","Created","Sent At","Sent To","Unique Opens","Total Opens","Open Rate"'];
    for (const n of data.newsletters) {
      let unique = 0, total = 0;
      if (n.status === 'sent') {
        try {
          const s = await api(`${API.stats}?id=${n.id}`);
          unique = s.opens.unique; total = s.opens.total;
        } catch {}
      }
      const sentTo = Number(n.sentTo) || 0;
      const pct = sentTo > 0 ? Math.round((unique / sentTo) * 100) : 0;
      rows.push(`"${(n.subject || '').replace(/"/g, '""')}","${n.status}","${n.createdAt || ''}","${n.sentAt || ''}","${sentTo}","${unique}","${total}","${pct}%"`);
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter-stats.csv'; a.click();
    URL.revokeObjectURL(url);
  } catch (err) { alert(err.message); }
  finally { btn.disabled = false; btn.textContent = 'Export Stats CSV'; }
});

// Delete actions
async function removeSub(email) {
  if (!confirm(`Remove ${email}?`)) return;
  try {
    await api(API.subscribers, { method: 'DELETE', body: JSON.stringify({ email }) });
    await loadSubscribers();
  } catch (err) { alert(err.message); }
}

document.getElementById('bulkRemoveBtn').addEventListener('click', async () => {
  const checked = [...document.querySelectorAll('.sub-check:checked')].map(cb => cb.value);
  if (!checked.length) return;
  if (!confirm(`Remove ${checked.length} subscriber${checked.length > 1 ? 's' : ''}?`)) return;
  try {
    for (const email of checked) {
      await api(API.subscribers, { method: 'DELETE', body: JSON.stringify({ email }) });
    }
    await loadSubscribers();
  } catch (err) { alert(err.message); }
});

async function removeNl(id) {
  const item = document.querySelector(`[data-nl-id="${id}"]`);
  if (item) item.style.opacity = '0.3';
  showUndo('Newsletter deleted', () => {
    if (item) item.style.opacity = '';
  }, async () => {
    try {
      await api(API.newsletters, { method: 'DELETE', body: JSON.stringify({ id }) });
      await loadNewsletters();
    } catch (err) { alert(err.message); if (item) item.style.opacity = ''; }
  });
}

// Feedback
async function loadFeedback() {
  try {
    const data = await api(API.feedback);
    const list = document.getElementById('feedbackList');
    if (!data.reasons || data.reasons.length === 0) {
      list.innerHTML = '<div class="empty-state">No unsubscribe feedback yet</div>';
      return;
    }
    list.innerHTML = data.reasons.map(r => `
      <div class="reason-item">
        <span class="reason-text">${esc(r.reason)}</span>
        <span class="reason-meta">${esc(r.email)}<br>${r.date ? new Date(r.date).toLocaleDateString() : ''}</span>
      </div>`).join('');
  } catch (err) {
    document.getElementById('feedbackList').innerHTML = `<div class="admin-msg error">${esc(err.message)}</div>`;
  }
}

async function loadBounced() {
  try {
    const data = await api(API.bounced);
    const list = document.getElementById('bouncedList');
    if (!data.bounced || data.bounced.length === 0) {
      list.innerHTML = '<div class="empty-state">No bounce-removed subscribers</div>';
      return;
    }
    list.innerHTML = data.bounced.map(b => `
      <div class="reason-item">
        <span class="reason-text">${esc(b.email)}</span>
        <span class="reason-meta">${esc(b.reason)}<br>${b.date ? new Date(b.date).toLocaleDateString() : ''}</span>
      </div>`).join('');
  } catch (err) {
    document.getElementById('bouncedList').innerHTML = `<div class="admin-msg error">${esc(err.message)}</div>`;
  }
}

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = `admin-msg ${type}`;
  el.style.display = '';
  setTimeout(() => { el.className = 'admin-msg'; }, 5000);
}

// #7 Undo toast
function showUndo(msg, onUndo, onConfirm) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#2C2C2C;color:#FFF8E7;padding:12px 20px;border-radius:6px;display:flex;gap:12px;align-items:center;z-index:999;box-shadow:0 4px 12px rgba(0,0,0,0.5);';
  toast.innerHTML = `<span>${msg}</span><button style="background:#D4AF37;color:#1A1A1A;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-weight:bold;">Undo</button>`;
  document.body.appendChild(toast);
  let undone = false;
  toast.querySelector('button').addEventListener('click', () => { undone = true; toast.remove(); onUndo(); });
  setTimeout(() => { toast.remove(); if (!undone) onConfirm(); }, 5000);
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// #3 Keyboard shortcuts
document.getElementById('shortcutsBtn').addEventListener('click', () => {
  alert('Keyboard Shortcuts:\n\nCtrl+P — Toggle preview (in compose textarea)\n\nAll other actions use buttons.');
});

// #4 Newsletter status filter
let allNewsletters = [];
document.getElementById('nlFilter').addEventListener('change', (e) => {
  const v = e.target.value;
  const items = document.querySelectorAll('.newsletter-item');
  items.forEach(el => {
    const badge = el.querySelector('.badge');
    el.style.display = (v === 'all' || (badge && badge.textContent === v)) ? '' : 'none';
  });
});

// #5 Import CSV
document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const emails = text.split(/[\n,]/).map(s => s.trim().replace(/^"|"$/g, '')).filter(s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
  if (!emails.length) { alert('No valid emails found in CSV'); return; }
  if (!confirm(`Import ${emails.length} email${emails.length > 1 ? 's' : ''}? Confirmation emails will be sent to each.`)) return;
  const btn = document.getElementById('importBtn');
  btn.disabled = true; btn.textContent = 'Importing...';
  try {
    const data = await api(API.subscribers, {
      method: 'POST',
      body: JSON.stringify({ emails })
    });
    alert(`Import done: ${data.sent} confirmation emails sent, ${data.skipped} skipped`);
    await loadSubscribers();
  } catch (err) { alert(err.message); }
  finally { btn.disabled = false; btn.textContent = 'Import CSV'; e.target.value = ''; }
});

// #6 Light/dark theme toggle
document.getElementById('themeBtn').addEventListener('click', () => {
  const isLight = document.body.classList.toggle('admin-light');
  document.getElementById('themeBtn').textContent = isLight ? '🌙' : '☀';
  try { localStorage.setItem('admin_theme', isLight ? 'light' : 'dark'); } catch {}
});
try {
  if (localStorage.getItem('admin_theme') === 'light') {
    document.body.classList.add('admin-light');
    document.getElementById('themeBtn').textContent = '🌙';
  }
} catch {}

// #7 Undo delete (newsletter)
let undoTimer = null;
const origRemoveNl = removeNl;

// #11 Retry failed sends
function attachRetryListeners() {
  document.querySelectorAll('[data-retry-nl]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.retryNl;
      btn.disabled = true; btn.textContent = 'Retrying...';
      try {
        const data = await api(API.newsletters, { method: 'PUT', body: JSON.stringify({ id, retryFailed: true }) });
        alert(`Retry: ${data.retrySent} sent, ${data.stillFailed} still failed`);
        await loadNewsletters();
      } catch (err) { alert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Retry Failed'; }
    });
  });
}
