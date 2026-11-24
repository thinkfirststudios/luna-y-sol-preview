/* ====================================================
   Luna y Sol V3 — script.js

   BOOKING LINKS: each stylist's Fresha page lives in BOOKING
   below. Update a link there and every button follows.
   - "Book with Hector/Sarah" buttons (data-stylist) go straight
     to that stylist's page in a new tab.
   - Every other "Book" button opens a chooser for the two.
   - Without JavaScript, general Book buttons fall back to the
     stylists page, which has a direct button for each.
   ==================================================== */

const BOOKING = {
  hector: {
    name: 'Hector',
    role: 'Curl specialist',
    url: 'https://www.fresha.com/a/hector-luna-y-sol-pasadena-300-east-colorado-blvd-unit-241-cbuogd77/all-offer?menu=true&pId=757938',
  },
  sarah: {
    name: 'Sarah',
    role: 'Cut & color specialist',
    url: 'https://www.fresha.com/a/sarah-luna-y-sol-pasadena-300-east-colorado-boulevard-unit-241-kzy2sj7s',
  },
};

function buildBookingDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'book-dialog';
  dialog.setAttribute('aria-labelledby', 'book-dialog-title');
  const ext = '<svg class="book-ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  const choices = Object.values(BOOKING).map(s => `
      <a class="book-choice" href="${s.url}" target="_blank" rel="noopener">
        <span><strong>${s.name}</strong><span class="book-role">${s.role}</span></span>
        <span class="book-go">Book with ${s.name} ${ext}<span class="sr-only"> (opens Fresha in a new tab)</span></span>
      </a>`).join('');
  dialog.innerHTML = `
    <div class="book-dialog-inner">
      <button class="book-dialog-close" type="button" aria-label="Close">&times;</button>
      <h2 id="book-dialog-title">Book an appointment</h2>
      <p>Choose your stylist. Booking opens on Fresha in a new tab.</p>
      <div class="book-choices">${choices}</div>
    </div>`;
  document.body.appendChild(dialog);
  dialog.querySelector('.book-dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('.book-choice').forEach(a => a.addEventListener('click', () => dialog.close()));
  // click on the dimmed backdrop closes it
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  return dialog;
}

document.addEventListener('DOMContentLoaded', () => {

  // Booking buttons
  document.querySelectorAll('.book-btn[data-stylist]').forEach(btn => {
    const s = BOOKING[btn.dataset.stylist];
    if (!s) return;
    btn.setAttribute('href', s.url);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener');
  });
  const bookDialog = typeof HTMLDialogElement === 'function' ? buildBookingDialog() : null;
  document.querySelectorAll('.book-btn:not([data-stylist])').forEach(btn => {
    btn.setAttribute('href', 'stylists.html');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', e => {
      if (!bookDialog) return;          // old browser: follow the link to the stylists page
      e.preventDefault();
      bookDialog.showModal();
    });
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
      if (window.innerWidth > 1100 && nav.classList.contains('open')) close();
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
