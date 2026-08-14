/* Sissy's Sweets by Em — main.js */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGalleryFilter();
  initMenuTabs();
  initFAQ();
  initScrollAnimations();
  setActiveNavLink();
  initContactForm();
});

/* ── Navigation ── */
function initNav() {
  const nav       = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const menu      = document.querySelector('.mobile-menu');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
      nav.classList.remove('nav--transparent');
    } else {
      nav.classList.remove('scrolled');
      if (nav.dataset.transparent) nav.classList.add('nav--transparent');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('.mobile-menu__link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !menu.contains(e.target)) close();
    });
  }

  function close() {
    menu?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
    if (link.getAttribute('href') === page || (page === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Gallery Filter ── */
function initGalleryFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length) return;
  const reduced = prefersReducedMotion();

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const cat = btn.dataset.filter;

      items.forEach(item => {
        const show     = cat === 'all' || item.dataset.category === cat;
        const wasShown = item.dataset.hidden !== 'true';
        item.dataset.hidden = show ? 'false' : 'true';

        if (show && !wasShown) {
          item.style.display = '';
          if (reduced) return;
          item.classList.add('filter-enter');
          requestAnimationFrame(() => requestAnimationFrame(() => item.classList.remove('filter-enter')));
        } else if (!show && wasShown) {
          if (reduced) { item.style.display = 'none'; return; }
          item.classList.add('filter-exit');
          whenTransitionEndOrTimeout(item, 260, () => {
            if (item.dataset.hidden === 'true') item.style.display = 'none';
          });
        }
      });
    });
  });
}

/* ── Menus Tab Switcher ── */
function initMenuTabs() {
  const tabs     = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');
  if (!tabs.length) return;
  const reduced = prefersReducedMotion();

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      const current = document.querySelector('.menu-section.active');
      const target  = document.getElementById(tab.dataset.tab);
      if (!target || target === current) return;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (!current || reduced) {
        current?.classList.remove('active');
        target.classList.add('active');
        return;
      }

      current.classList.add('fading');
      whenTransitionEndOrTimeout(current, 240, () => {
        current.classList.remove('active', 'fading');
        target.classList.add('active', 'fading');
        requestAnimationFrame(() => requestAnimationFrame(() => target.classList.remove('fading')));
      });
    });
  });
}

/* ── Motion helpers ── */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function whenTransitionEndOrTimeout(el, ms, cb) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.removeEventListener('transitionend', finish);
    cb();
  };
  el.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, ms);
}

/* ── FAQ Accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── Contact Form — mailto inquiry builder ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    /* Validate required fields */
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        markInvalid(field, 'This field is required.');
        valid = false;
      } else if (field.type === 'email' && !validEmail(field.value.trim())) {
        markInvalid(field, 'Please enter a valid email address.');
        valid = false;
      } else {
        markValid(field);
      }
    });
    if (!valid) return;

    /* Collect values */
    const get = id => (document.getElementById(id)?.value.trim()) || '';
    const firstName   = get('firstName');
    const lastName    = get('lastName');
    const email       = get('email');
    const phone       = get('phone')    || 'Not provided';
    const eventDate   = get('eventDate');
    const eventType   = get('eventType');
    const itemType    = get('itemType');
    const servings    = get('servings') || 'Not specified';
    const pickup      = get('pickupDelivery');
    const message     = get('message');

    /* Build email body */
    const body =
      'NEW ORDER INQUIRY\n' +
      '-----------------\n\n' +
      'Name:     ' + firstName + ' ' + lastName + '\n' +
      'Email:    ' + email + '\n' +
      'Phone:    ' + phone + '\n\n' +
      'Event Date:          ' + eventDate + '\n' +
      'Event Type:          ' + eventType + '\n' +
      'Ordering:            ' + itemType + '\n' +
      'Servings / Quantity: ' + servings + '\n' +
      'Pickup or Delivery:  ' + pickup + '\n\n' +
      'Details:\n' + message + '\n\n' +
      '-----------------\n' +
      'Sent from sissyssweetsbyem.com';

    const subject = 'New Order Inquiry — Sissy\'s Sweets by Em';
    const mailto  = 'mailto:sissyssweets.business@gmail.com'
                  + '?subject=' + encodeURIComponent(subject)
                  + '&body='    + encodeURIComponent(body);

    /* Open email client — page stays loaded with mailto: */
    window.location.href = mailto;

    /* Show confirmation */
    form.style.display = 'none';
    const success = document.getElementById('formSuccess');
    if (success) {
      success.classList.add('visible');
      requestAnimationFrame(() => requestAnimationFrame(() => success.classList.add('shown')));
      success.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    }
  });

  /* Clear error state as user types */
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => markValid(field));
  });
}

function markInvalid(field, msg) {
  markValid(field);
  field.classList.add('is-invalid');
  const err = document.createElement('span');
  err.className = 'form-error';
  err.textContent = msg;
  field.parentNode.appendChild(err);
}

function markValid(field) {
  field.classList.remove('is-invalid');
  field.parentNode.querySelector('.form-error')?.remove();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Scroll Animations ── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  /* Stagger delay per group — computed from position within the nearest
     .stagger ancestor rather than CSS nth-child, so it scales correctly
     whether a group has 3 items or 20. Delay wraps every 6 items so a
     long gallery/list never accumulates an unreasonably long wait. */
  document.querySelectorAll('.stagger').forEach(group => {
    const items = group.querySelectorAll('.fade-up');
    items.forEach((el, i) => {
      el.style.transitionDelay = ((i % 6) * 80) + 'ms';
    });
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => io.observe(el));
}
