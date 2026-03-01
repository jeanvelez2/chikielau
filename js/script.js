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
  
  // Close modal when form is submitted
  if (modalForm) {
    modalForm.addEventListener('submit', () => {
      // Small delay to allow form validation to show
      setTimeout(() => {
        const hasErrors = modalForm.querySelector('.error-message[style*="display: block"]');
        if (!hasErrors) {
          closeModal();
        }
      }, 100);
    });
  }
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
          // Newsletter form - show success message
          const successMessage = form.querySelector('.success-message');
          if (successMessage) {
            const translatedSuccess = window.languageManager ? window.languageManager.translate('form.success') : 'Thank you! Your submission was successful.';
            successMessage.textContent = translatedSuccess;
            successMessage.style.display = 'block';
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              successMessage.style.display = 'none';
            }, 5000);
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
    const formData = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      message: form.querySelector('#message').value
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
        successMessage.style.color = '#4CAF50';
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
        successMessage.style.color = '#f44336';
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Show error message
    if (successMessage) {
      const translatedError = window.languageManager ? window.languageManager.translate('form.error.network') : 'Network error. Please check your connection and try again.';
      successMessage.textContent = translatedError;
      successMessage.style.display = 'block';
      successMessage.style.color = '#f44336';
    }
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}
