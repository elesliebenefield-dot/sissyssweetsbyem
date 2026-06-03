/* Sissy's Sweets by Em — main.js */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGalleryFilter();
  initMenuTabs();
  initFAQ();
  initScrollAnimations();
  setActiveNavLink();
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

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.dataset.hidden = show ? 'false' : 'true';
        item.style.display  = show ? '' : 'none';
      });
    });
  });
}

/* ── Menus Tab Switcher ── */
function initMenuTabs() {
  const tabs     = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
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

/* ── Scroll Animations ── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

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
