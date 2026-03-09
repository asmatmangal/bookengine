/**
 * BookWise — Authentication Module
 * Handles: Login, Register, Logout, Auth state observer
 */

'use strict';

let currentUser = null;

/* ── Auth State Observer ────────────────────────────────── */
auth.onAuthStateChanged(user => {
  currentUser = user;
  const authBtn   = document.getElementById('authBtn');
  const userEmail = document.getElementById('userEmail');

  if (user) {
    authBtn.textContent = 'Logout';
    authBtn.onclick = logoutUser;
    userEmail.textContent = user.email;

    // Load reading list now that user is known
    loadReadingList();

    showToast(`Welcome back, ${user.email.split('@')[0]}!`, 'success');
  } else {
    authBtn.textContent = 'Login';
    authBtn.onclick = openAuthModal;
    userEmail.textContent = '';

    // Clear reading list UI
    renderEmptyReadingList();
  }
});

/* ── Open / Close Auth Modal ────────────────────────────── */
function openAuthModal() {
  document.getElementById('authModal').classList.remove('hidden');
  switchAuthTab('login');
}
function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
  clearAuthFields();
}

function switchAuthTab(tab) {
  document.getElementById('loginForm').style.display    = (tab === 'login')    ? 'block' : 'none';
  document.getElementById('registerForm').style.display = (tab === 'register') ? 'block' : 'none';
  document.getElementById('loginTabBtn').classList.toggle('active', tab === 'login');
  document.getElementById('registerTabBtn').classList.toggle('active', tab === 'register');
}

function clearAuthFields() {
  ['loginEmail','loginPassword','regEmail','regPassword','regConfirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ── Register ───────────────────────────────────────────── */
async function registerUser() {
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;

  if (!email || !password || !confirm) {
    return showToast('Please fill in all fields.', 'warning');
  }
  if (password.length < 6) {
    return showToast('Password must be at least 6 characters.', 'warning');
  }
  if (password !== confirm) {
    return showToast('Passwords do not match.', 'error');
  }

  try {
    setAuthLoading(true);
    await auth.createUserWithEmailAndPassword(email, password);
    closeAuthModal();
  } catch (err) {
    showToast(authError(err.code), 'error');
  } finally {
    setAuthLoading(false);
  }
}

/* ── Login ──────────────────────────────────────────────── */
async function loginUser() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    return showToast('Please enter your email and password.', 'warning');
  }

  try {
    setAuthLoading(true);
    await auth.signInWithEmailAndPassword(email, password);
    closeAuthModal();
  } catch (err) {
    showToast(authError(err.code), 'error');
  } finally {
    setAuthLoading(false);
  }
}

/* ── Logout ─────────────────────────────────────────────── */
async function logoutUser() {
  try {
    await auth.signOut();
    showToast('You have been logged out.', 'info');
  } catch (err) {
    showToast('Error signing out.', 'error');
  }
}

/* ── Helpers ─────────────────────────────────────────────── */
function setAuthLoading(state) {
  const btns = document.querySelectorAll('.modal-auth .btn-primary');
  btns.forEach(btn => { btn.disabled = state; });
}

function authError(code) {
  const map = {
    'auth/email-already-in-use':        'This email is already registered. Try logging in instead.',
    'auth/invalid-email':               'Please enter a valid email address.',
    'auth/weak-password':               'Password must be at least 6 characters.',
    'auth/user-not-found':              'No account found with this email. Please register first.',
    'auth/wrong-password':              'Incorrect password. Please try again.',
    'auth/invalid-credential':          'Incorrect email or password. Please check and try again.',
    'auth/invalid-login-credentials':   'Incorrect email or password. Please check and try again.',
    'auth/too-many-requests':           'Too many failed attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed':      'Network error. Please check your internet connection.',
    'auth/user-disabled':               'This account has been disabled. Contact support.',
    'auth/operation-not-allowed':       'Email/password login is not enabled. Please contact the administrator.',
    'auth/popup-closed-by-user':        'Sign-in popup was closed. Please try again.',
    'auth/requires-recent-login':       'Please log out and log back in to continue.',
    'auth/configuration-not-found':     'Authentication is not configured. Please enable Email/Password in Firebase Console → Authentication → Sign-in method.',
  };
  return map[code] || `Something went wrong (${code}). Please try again.`;
}

/* ── Allow Enter key in auth inputs ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginUser();
  });
  document.getElementById('regConfirm')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') registerUser();
  });
  // Close modal on overlay click
  document.getElementById('authModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('authModal')) closeAuthModal();
  });
  document.getElementById('bookModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('bookModal')) closeModal();
  });
});
