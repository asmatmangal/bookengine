/**
 * BookWise — UI Helpers
 * Shared utilities: toast notifications, grid loading/empty states,
 * HTML/attribute escaping, scroll helpers
 */

'use strict';

/* ── Toast Notifications ────────────────────────────────── */
const TOAST_ICONS = {
  success: 'fa-check-circle',
  error:   'fa-times-circle',
  warning: 'fa-exclamation-triangle',
  info:    'fa-info-circle'
};

function showToast(message, type = 'info', duration = 4000) {
  const wrap  = document.getElementById('toast');
  if (!wrap) return;

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${TOAST_ICONS[type] || 'fa-info-circle'}"></i><span>${message}</span>`;
  wrap.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(40px)';
    t.style.transition = '0.4s ease';
    setTimeout(() => t.remove(), 400);
  }, duration);
}

/* ── Grid States ─────────────────────────────────────────── */
function showGridLoading(container, message = 'Loading...') {
  container.innerHTML = `
    <div class="grid-loading">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>`;
}

function showGridEmpty(container, icon, message) {
  container.innerHTML = `
    <div class="grid-empty">
      <i class="fas ${icon}"></i>
      <p>${message}</p>
    </div>`;
}

/* ── Security: Escape Helpers ───────────────────────────── */
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

function escAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g,  "\\'")
    .replace(/"/g,  '&quot;');
}

/* ── Smooth Scroll Helper (Fixed for all browsers) ────── */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    setTimeout(() => {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        try {
          el.scrollIntoView(true);
        } catch (e2) {
          window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
        }
      }
    }, 100);
  }
}
