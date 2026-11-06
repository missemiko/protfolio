document.documentElement.classList.add('js');

const header = document.getElementById('siteHeader');
const toggle = document.getElementById('menuToggle');
const panel = document.getElementById('navPanel');

// Sticky header background
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
function setMenu(open) {
  if (!toggle || !panel) return;
  toggle.setAttribute('aria-expanded', String(open));
  const label = toggle.querySelector('[data-label]');
  if (label) label.textContent = open ? 'Close menu' : 'Open menu';
  panel.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Active nav link
const navLinks = [...document.querySelectorAll('[data-nav]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if (sections.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => {
        const on = a.getAttribute('href') === `#${en.target.id}`;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
}

// FAQ accordion
document.querySelectorAll('.acc-trigger').forEach((btn) => {
  const item = btn.closest('.acc-item');
  const panelEl = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      panelEl.hidden = false;
      requestAnimationFrame(() => item.classList.add('is-open'));
    } else {
      item.classList.remove('is-open');
      setTimeout(() => { if (btn.getAttribute('aria-expanded') === 'false') panelEl.hidden = true; }, 450);
    }
  });
});

// Email: hidden until clicked (kept out of the HTML source)
const email = document.getElementById('emailLink');
if (email) {
  const text = email.querySelector('[data-email-text]');
  let shown = false;
  email.addEventListener('click', () => {
    const addr = atob(email.dataset.e);
    if (!shown) {
      shown = true;
      text.textContent = addr;
      email.setAttribute('aria-label', 'Email ' + addr + '. Press again to write an email.');
      email.classList.add('is-revealed');
    } else {
      window.location.href = 'mailto:' + addr;
    }
  });
}

// Scroll progress + hero tilt
const bar = document.getElementById('progress');
if (bar) {
  const upd = () => {
    const m = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')';
  };
  addEventListener('scroll', upd, { passive: true }); upd();
}
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (fine && !calm) {
  document.querySelectorAll('.arch, .featured-monogram, .community-mark').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = 'perspective(600px) rotateY(' + x * 10 + 'deg) rotateX(' + -y * 10 + 'deg) scale(1.03)';
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// Dynamic year
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
