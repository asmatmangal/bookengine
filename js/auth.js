/**
 * Book Engine — Authentication Module (Fixed v3)
 * Handles: Login, Register (with name + terms), Logout, Auth state
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
    const displayName = user.displayName || user.email.split('@')[0];
    userEmail.textContent = displayName;
    loadReadingList();
    showToast('Welcome back, ' + displayName + '!', 'success');
  } else {
    authBtn.textContent = 'Login';
    authBtn.onclick = openAuthModal;
    userEmail.textContent = '';
    renderEmptyReadingList();
  }
});

/* ── Open / Close Auth Modal ─────────────────────────────*/
function openAuthModal(tab) {
  document.getElementById('authModal').classList.remove('hidden');
  switchAuthTab(tab || 'login');
}
function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
  clearAuthFields();
}

function switchAuthTab(tab) {
  openAuthModal();
  if (tab === 'register' && typeof showAuthPanel === 'function') {
    setTimeout(function() { showAuthPanel('register'); }, 50);
  }
}

function clearAuthFields() {
  ['loginEmail','loginPassword','regName','regEmail','regPassword','regConfirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const terms = document.getElementById('agreeTerms');
  if (terms) terms.checked = false;
  const strength = document.getElementById('passwordStrength');
  if (strength) strength.innerHTML = '';
}

/* ── Register ───────────────────────────────────────────── */
async function registerUser() {
  const name     = (document.getElementById('regName')     ? document.getElementById('regName').value.trim() : '');
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;
  const terms    = document.getElementById('agreeTerms');

  if (!name) return showToast('Please enter your full name.', 'warning');
  if (!email || !password || !confirm) return showToast('Please fill in all fields.', 'warning');
  if (password.length < 6)  return showToast('Password must be at least 6 characters.', 'warning');
  if (password !== confirm)  return showToast('Passwords do not match.', 'error');
  if (terms && !terms.checked) return showToast('Please agree to the Terms & Conditions.', 'warning');

  try {
    setAuthLoading(true);
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    // Save display name
    await cred.user.updateProfile({ displayName: name });
    closeAuthModal();
    showToast('Account created! Welcome, ' + name + '!', 'success');
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

  if (!email || !password) return showToast('Please enter your email and password.', 'warning');

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
    'auth/email-already-in-use':       'This email is already registered. Try logging in instead.',
    'auth/invalid-email':              'Please enter a valid email address.',
    'auth/weak-password':              'Password must be at least 6 characters.',
    'auth/user-not-found':             'No account found with this email. Please register first.',
    'auth/wrong-password':             'Incorrect password. Please try again.',
    'auth/invalid-credential':         'Incorrect email or password. Please check and try again.',
    'auth/invalid-login-credentials':  'Incorrect email or password. Please check and try again.',
    'auth/too-many-requests':          'Too many failed attempts. Please wait a few minutes.',
    'auth/network-request-failed':     'Network error. Please check your internet connection.',
    'auth/user-disabled':              'This account has been disabled.',
    'auth/operation-not-allowed':      'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.',
    'auth/configuration-not-found':    'Firebase Authentication not configured. Please enable Email/Password in Firebase Console.',
  };
  return map[code] || 'Something went wrong (' + code + '). Please try again.';
}

/* ── Keyboard & click-outside handling ──────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginUser();
  });
  document.getElementById('regConfirm')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') registerUser();
  });
  document.getElementById('authModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('authModal')) closeAuthModal();
  });
  document.getElementById('bookModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('bookModal')) closeModal();
  });
});
