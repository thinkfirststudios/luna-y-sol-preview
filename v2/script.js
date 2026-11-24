/* ====================================================
   Luna y Sol V2 — script.js

   TO UPDATE BOOKING URL: change BOOKING_URL below.
   Every "Book" button on the site reads from this one
   constant, so swap it once and it updates everywhere.
   ==================================================== */

const BOOKING_URL = '#book';

document.addEventListener('DOMContentLoaded', () => {

  // Wire all booking buttons
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.setAttribute('href', BOOKING_URL);
  });

  // Header hairline once the page scrolls
  const header = document.querySelector('.site-header');
  if (header) {
    const tick = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    const open = () => {
      toggle.classList.add('open');
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => nav.classList.contains('open') ? close() : open());
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
  }

  // Active nav link (fallback if aria-current wasn't set in markup)
  const file = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a:not(.btn)').forEach(link => {
    if (link.getAttribute('href') === file) link.setAttribute('aria-current', 'page');
  });

});
