/* ============================================
   Main JavaScript
   Template 3: Moonlit Pages
   ============================================ */

// Configuration
const CONFIG = {
  modalDelay: 5000,
  cookieName: 'newsletter_modal_dismissed',
  cookieExpireDays: 30,
  stickyHeaderOffset: 100
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
    errorElement.textContent = message;
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
 * Set cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration
 */
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

/**
 * Get cookie value
 * @param {string} name - Cookie name
 * @returns {string} - Cookie value or empty string
 */
function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return '';
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
 * Initialize sticky header functionality (Template 3 specific)
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > CONFIG.stickyHeaderOffset) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
    
    lastScrollTop = scrollTop;
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
  
  // Check if modal was already dismissed
  if (getCookie(CONFIG.cookieName)) return;
  
  // Show modal after delay
  setTimeout(() => {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    // Focus on first input
    const firstInput = modal.querySelector('input[type="email"]');
    if (firstInput) firstInput.focus();
  }, CONFIG.modalDelay);
  
  // Close modal function
  const closeModal = () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    setCookie(CONFIG.cookieName, 'true', CONFIG.cookieExpireDays);
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
}

/**
 * Initialize form validation
 */
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      // Validate each required field
      inputs.forEach(input => {
        clearError(input);
        
        if (!input.value.trim()) {
          showError(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          showError(input, 'Please enter a valid email address');
          isValid = false;
        }
      });
      
      // If valid, show success message (in production, submit to backend)
      if (isValid) {
        const successMessage = form.querySelector('.success-message');
        if (successMessage) {
          successMessage.textContent = 'Thank you! Your submission was successful.';
          successMessage.style.display = 'block';
          form.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 5000);
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
  initStickyHeader();
  initNewsletterModal();
  initForms();
});
