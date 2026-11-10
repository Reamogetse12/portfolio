/* ===========================
   Portfolio Script
=========================== */

// ── Navbar: scroll effect + active link highlight ──────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Sticky style
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Active nav link based on current section in view
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// ── Mobile hamburger menu ───────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinksContainer.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ── Typed text effect in hero ───────────────────────────────────────────────
const phrases = [
  'Informatics Student',
  'Frontend Developer',
  'Angular Enthusiast',
  'Problem Solver',
];

const typedEl = document.getElementById('typed-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end of phrase before deleting
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(type, delay);
}

// Start typing after hero animation completes
setTimeout(type, 1400);

// ── Scroll reveal ───────────────────────────────────────────────────────────
function addRevealClasses() {
  const targets = [
    '.about-text',
    '.about-cards',
    '.info-card',
    '.skill-category',
    '.project-card',
    '.contact-info',
    '.contact-form',
  ];

  targets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('reveal');
    });
  });
}

function revealOnScroll() {
  const revealEls = document.querySelectorAll('.reveal');
  const windowBottom = window.scrollY + window.innerHeight;

  revealEls.forEach((el) => {
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    if (windowBottom > elTop + 60) {
      el.classList.add('visible');
    }
  });
}

// Set up reveal classes then observe
addRevealClasses();

// Use IntersectionObserver when available for better performance
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
} else {
  // Fallback for older browsers
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();
}

// ── Contact form validation & submission ────────────────────────────────────
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

const validators = {
  name: (val) => {
    if (!val.trim()) return 'Name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (val) => {
    if (!val.trim()) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email address.';
    return '';
  },
  message: (val) => {
    if (!val.trim()) return 'Message is required.';
    if (val.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

function validateField(field) {
  const name = field.name;
  const errorEl = document.getElementById(`${name}-error`);
  if (!validators[name] || !errorEl) return true;

  const errorMsg = validators[name](field.value);
  errorEl.textContent = errorMsg;
  field.classList.toggle('invalid', !!errorMsg);
  return !errorMsg;
}

// Real-time validation on blur
form.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    // Clear error on input after it's been shown
    if (field.classList.contains('invalid')) {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = form.querySelectorAll('input, textarea');
  let allValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) allValid = false;
  });

  if (!allValid) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  setTimeout(() => {
    form.reset();
    form.querySelectorAll('input, textarea').forEach((f) => f.classList.remove('invalid'));
    formSuccess.textContent = '✓ Message sent! I\'ll get back to you soon.';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

    setTimeout(() => {
      formSuccess.textContent = '';
    }, 5000);
  }, 1200);
});

// ── Footer: current year ────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
