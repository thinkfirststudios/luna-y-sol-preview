/* ====================================================
   Luna Y Sol — V3 script.js

   TO UPDATE BOOKING URL: change BOOKING_URL below.
   Every "Book" button on the site reads from this one
   constant — swap it once and it updates everywhere.
   ==================================================== */

const BOOKING_URL = '#book';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Wire all booking buttons ─────────────────────
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.setAttribute('href', BOOKING_URL);
  });

  // ─── Header border on scroll ──────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const tick = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  // ─── Mobile nav toggle ────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');

  if (toggle && nav) {
    const open = () => {
      // Position the overlay directly under the header
      const bottom = header ? header.getBoundingClientRect().bottom : 0;
      nav.style.setProperty('--nav-top', `${Math.max(0, bottom)}px`);
      toggle.classList.add('open');
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () =>
      nav.classList.contains('open') ? close() : open()
    );
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && nav.classList.contains('open')) close();
    });
  }

  // ─── Mark active nav link ─────────────────────────
  const file = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === file) link.setAttribute('aria-current', 'page');
  });

  // ─── Gallery filter (gallery page only) ───────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.g-item');
  const count      = document.querySelector('.gallery-count');
  if (filterBtns.length && items.length) {
    const apply = cat => {
      let shown = 0;
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.cat.split(' ').includes(cat);
        item.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
      if (count) count.textContent = `Showing ${shown} of ${items.length} looks`;
    };
    filterBtns.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
    apply('all');
  }

});
