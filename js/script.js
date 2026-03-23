/* ============================================
   Main JavaScript
   Template 2: Celestial Bookshelf
   ============================================ */

// Configuration
const CONFIG = {
  modalDelay: 5000,
  storageKey: 'newsletter_modal_dismissed'
};

/* ============================================
   Utility Functions
   ============================================ */

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Display error message for form input
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message to display
 */
function showError(input, message) {
  const errorElement = input.parentElement.querySelector('.error-message');
  if (errorElement) {
    // Use translation if available
    const translatedMessage = window.languageManager ? window.languageManager.translate(message) : message;
    errorElement.textContent = translatedMessage;
    errorElement.style.display = 'block';
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
  }
}

/**
 * Clear error message for form input
 * @param {HTMLElement} input - Input element
 */
function clearError(input) {
  const errorElement = input.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
  }
}

/**
 * Set localStorage item
 * @param {string} key - Storage key
 * @param {string} value - Storage value
 */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
}

/**
 * Get localStorage item
 * @param {string} key - Storage key
 * @returns {string|null} - Storage value or null
 */
function getStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage not available:', e);
    return null;
  }
}

/* ============================================
   Component Initialization Functions
   ============================================ */

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!navToggle || !mainNav) return;
  
  // Toggle menu on button click
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      document.body.classList.remove('menu-open');
      navToggle.focus();
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

/**
 * Initialize newsletter modal functionality
 */
function initNewsletterModal() {
  const modal = document.getElementById('newsletterModal');
  if (!modal) return;
  
  const closeBtn = modal.querySelector('.modal-close');
  const modalOverlay = modal.querySelector('.modal-overlay') || modal;
  const modalForm = modal.querySelector('form');
  
  // Check if modal was already dismissed or user submitted
  if (getStorage(CONFIG.storageKey)) return;
  
  let modalShown = false;
  
  // Function to show modal
  const showModal = () => {
    if (modalShown) return;
    modalShown = true;
    
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Focus on first input
    const firstInput = modal.querySelector('input[type="email"]');
    if (firstInput) firstInput.focus();
  };
  
  // Show modal after delay (5 seconds)
  setTimeout(() => {
    showModal();
  }, CONFIG.modalDelay);
  
  // Show modal on scroll to 50% of page
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent >= 50) {
      showModal();
      window.removeEventListener('scroll', handleScroll);
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Close modal function
  const closeModal = () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setStorage(CONFIG.storageKey, 'true');
    window.removeEventListener('scroll', handleScroll);
  };
  
  // Close on button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
  
  // Close when clicking outside modal content
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
  
  // Close modal when form is submitted successfully
  if (modalForm) {
    modalForm.addEventListener('submit', () => {
      const checkSuccess = setInterval(() => {
        const msg = modalForm.querySelector('.success-message[style*="display: block"]');
        if (msg && !msg.style.color) {
          clearInterval(checkSuccess);
          setTimeout(() => closeModal(), 3000);
        }
      }, 200);
      setTimeout(() => clearInterval(checkSuccess), 10000);
    });
  }
}

/**
 * Initialize form validation
 */
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      // Validate each required field
      inputs.forEach(input => {
        clearError(input);
        
        if (!input.value.trim()) {
          showError(input, 'form.error.required');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          showError(input, 'form.error.email');
          isValid = false;
        }
      });
      
      // If valid, submit to backend
      if (isValid) {
        // Check if this is the contact form (has name, email, and message fields)
        const isContactForm = form.querySelector('#name') && form.querySelector('#email') && form.querySelector('#message');
        
        if (isContactForm) {
          // Submit contact form to API
          submitContactForm(form);
        } else {
          // Newsletter form - submit to API
          const emailInput = form.querySelector('input[type="email"]');
          const successMessage = form.querySelector('.success-message');
          // Determine source: modal, footer, or page
          const isModal = !!form.closest('#newsletterModal');
          const isFooter = !!form.closest('footer');
          const source = isModal ? 'modal' : isFooter ? 'footer' : 'page';
          try {
            const emailVal = emailInput.value;
            const res = await fetch('/api/newsletter-subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: emailVal, source })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (successMessage) {
              successMessage.textContent = data.message || (window.languageManager ? window.languageManager.translate('form.success') : 'Thank you! Your submission was successful.');
              successMessage.style.display = 'block';
              form.reset();
              // Show resend link if confirmation already pending
              if (data.canResend) {
                const resendLink = document.createElement('a');
                resendLink.href = '#';
                resendLink.textContent = ' Resend confirmation email';
                resendLink.style.color = 'var(--color-gold-primary)';
                resendLink.style.fontSize = '0.85rem';
                resendLink.addEventListener('click', async (ev) => {
                  ev.preventDefault();
                  try {
                    await fetch('/api/newsletter-subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: emailVal, source, resend: true })
                    });
                    resendLink.textContent = ' Confirmation resent!';
                    resendLink.style.pointerEvents = 'none';
                  } catch {}
                });
                successMessage.appendChild(resendLink);
              }
              setTimeout(() => { successMessage.style.display = 'none'; successMessage.textContent = ''; }, 8000);
            }
          } catch (err) {
            if (successMessage) {
              successMessage.textContent = err.message || 'Something went wrong. Please try again.';
              successMessage.style.display = 'block';
              successMessage.style.color = 'var(--color-error)';
              setTimeout(() => { successMessage.style.display = 'none'; successMessage.style.color = ''; }, 5000);
            }
          }
        }
      }
    });
    
    // Clear errors on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          clearError(input);
        }
      });
    });
  });
}

/* ============================================
   Initialize on DOM Ready
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNewsletterModal();
  initForms();
});


/**
 * Submit contact form to API
 * @param {HTMLFormElement} form - Contact form element
 */
async function submitContactForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const successMessage = form.querySelector('.success-message');
  const originalButtonText = submitButton.textContent;
  
  try {
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = window.languageManager ? window.languageManager.translate('form.sending') : 'Sending...';
    
    // Get form data
    const topicEl = form.querySelector('#topic');
    const formData = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      message: form.querySelector('#message').value,
      topic: topicEl ? topicEl.value : ''
    };
    
    // Send to API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Show success message
      if (successMessage) {
        const translatedSuccess = window.languageManager ? window.languageManager.translate('form.success') : 'Thank you! Your message has been sent successfully.';
        successMessage.textContent = translatedSuccess;
        successMessage.style.display = 'block';
        successMessage.className = 'success-message success';
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      }
    } else {
      // Show error message
      if (successMessage) {
        const translatedError = window.languageManager ? window.languageManager.translate('form.error.server') : 'Sorry, there was an error sending your message. Please try again.';
        successMessage.textContent = translatedError;
        successMessage.style.display = 'block';
        successMessage.className = 'success-message error';
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Show error message
    if (successMessage) {
      const translatedError = window.languageManager ? window.languageManager.translate('form.error.network') : 'Network error. Please check your connection and try again.';
      successMessage.textContent = translatedError;
      successMessage.style.display = 'block';
      successMessage.className = 'success-message error';
    }
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

// Theme toggle
(function() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch {}
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  const nav = document.querySelector('.nav-actions') || document.querySelector('.language-toggle')?.parentElement;
  if (!nav) return;
  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle light/dark mode');
  btn.textContent = (saved === 'light') ? '🌙' : '☀️';
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    btn.textContent = isLight ? '☀️' : '🌙';
    try { localStorage.setItem('theme', next); } catch {}
  });
  nav.insertBefore(btn, nav.firstChild);
})();

// R10: Scroll reveal
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .reveal-child').forEach(el => io.observe(el));
})();

// R10: Stat counter
(function() {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const raw = e.target.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, '');
      const target = parseFloat(raw);
      if (isNaN(target)) return;
      const isFloat = raw.includes('.');
      const dur = 1200;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const v = target * ease;
        e.target.textContent = (isFloat ? v.toFixed(1) : Math.round(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => io.observe(el));
})();

// R10: Back to top
(function() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8593;';
  document.body.appendChild(btn);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { btn.classList.toggle('visible', window.scrollY > 400); ticking = false; }); }
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// R10 #10: Hero typing effect
(function() {
  const el = document.querySelector('.hero-tagline');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const allPhrases = {
    en: ['A celestial journey through contemporary fiction, fantasy, and literary adventures', 'Where the stars meet stories', 'Exploring worlds, one page at a time'],
    es: ['Un viaje celestial a través de la ficción contemporánea, fantasía y aventuras literarias', 'Donde las estrellas se encuentran con las historias', 'Explorando mundos, una página a la vez']
  };
  function getLang() { return (document.documentElement.lang || 'en').startsWith('es') ? 'es' : 'en'; }
  let phrases = allPhrases[getLang()];
  let pi = 0, ci = 0, deleting = false, tid;
  if (el.hasAttribute('data-i18n')) el.removeAttribute('data-i18n');
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.textContent = '|';
  el.after(cursor);
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { tid = setTimeout(() => { deleting = true; tick(); }, 2500); return; }
      tid = setTimeout(tick, 50);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; tid = setTimeout(tick, 400); return; }
      tid = setTimeout(tick, 30);
    }
  }
  el.textContent = '';
  tick();
  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => {
    clearTimeout(tid); phrases = allPhrases[getLang()]; pi = 0; ci = 0; deleting = false; el.textContent = ''; tick();
  }));
})();

// R10 #11: Mobile carousel
(function() {
  if (window.innerWidth >= 768) return;
  document.querySelectorAll('.posts-grid').forEach(g => g.classList.add('carousel'));
})();

// R10 #12-13: Currently reading + reading challenge
(function() {
  const crEl = document.getElementById('currentlyReading');
  const rcEl = document.getElementById('readingChallenge');
  if (!crEl && !rcEl) return;
  fetch('data/reading-status.json').then(r => r.json()).then(data => {
    if (crEl && data.currentlyReading) {
      const b = data.currentlyReading;
      crEl.innerHTML = `<img src="${b.cover}" alt="${b.title}" width="60" height="90"><div class="currently-reading-info"><h4>${b.title}</h4><p>${b.author}</p><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div><div class="progress-label">${b.progress}% complete</div></div>`;
      requestAnimationFrame(() => { crEl.querySelector('.progress-fill').style.width = b.progress + '%'; });
    }
    if (rcEl && data.readingChallenge) {
      const c = data.readingChallenge;
      const pct = Math.min(100, Math.round(c.read / c.goal * 100));
      rcEl.innerHTML = `<h4>📚 ${c.year} Reading Challenge</h4><div class="challenge-bar"><div class="challenge-fill" style="width:0%"></div></div><div class="challenge-label">${c.read} of ${c.goal} books (${pct}%)</div>`;
      requestAnimationFrame(() => { rcEl.querySelector('.challenge-fill').style.width = pct + '%'; });
    }
  }).catch(() => {});
})();

// R10 #14: Image blur-up
(function() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) { img.classList.add('loaded'); return; }
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  });
})();

// R10 #15: Cursor sparkle (desktop only, respects reduced motion)
(function() {
  if ('ontouchstart' in window || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = e.clientX - 3 + 'px';
    s.style.top = e.clientY - 3 + 'px';
    document.body.appendChild(s);
    requestAnimationFrame(() => s.classList.add('fade'));
    setTimeout(() => s.remove(), 600);
  });
})();
