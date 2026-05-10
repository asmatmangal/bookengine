/**
 * BookWise — App Entry Point
 * Handles: Page load, navbar behaviour, hamburger menu,
 *          active nav link highlighting on scroll
 */

'use strict';

/* ── Page Load ───────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 700);
    }, 800);
  }
});

/* ── Navbar Scroll Behaviour ────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  highlightActiveNav();
});

/* ── Hamburger Menu ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Set auth button default action
  const authBtn = document.getElementById('authBtn');
  if (authBtn && !authBtn.onclick) {
    authBtn.onclick = openAuthModal;
  }
});

/* ── Active Nav Link ─────────────────────────────────────── */
function highlightActiveNav() {
  const sections = ['hero','search','ai-recs','my-list'];
  const links    = document.querySelectorAll('.nav-links a');

  let active = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.getBoundingClientRect().top <= 100) active = id;
  });

  links.forEach(link => {
    const href = link.getAttribute('href').replace('#','');
    link.style.color = (href === active) ? 'var(--gold)' : '';
  });
}
