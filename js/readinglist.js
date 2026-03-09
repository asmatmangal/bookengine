/**
 * BookWise — Reading List Module
 * Handles: Add, Load, Update, Remove books in Firestore
 *          Also handles star rating and read status
 */

'use strict';

/* ── Add Book to Firestore Reading List ─────────────────── */
async function addToList(bookId, title, author, coverUrl) {
  if (!currentUser) {
    showToast('Please login to add books to your reading list.', 'warning');
    openAuthModal();
    return;
  }
  if (!bookId || !title) {
    showToast('Book information incomplete.', 'error');
    return;
  }

  try {
    const ref = db.collection('users').doc(currentUser.uid)
                  .collection('readingList').doc(bookId);

    const snap = await ref.get();
    if (snap.exists) {
      showToast(`"${title}" is already in your list.`, 'info');
      return;
    }

    await ref.set({
      bookId,
      title,
      author:   author  || 'Unknown Author',
      coverUrl: coverUrl || '',
      status:   'to-read',
      rating:   0,
      addedAt:  firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast(`"${title}" added to your reading list!`, 'success');
    loadReadingList();

  } catch (err) {
    console.error('addToList error:', err);
    showToast('Error adding book. Please try again.', 'error');
  }
}

/* ── Load Reading List from Firestore ───────────────────── */
async function loadReadingList() {
  if (!currentUser) {
    renderEmptyReadingList();
    return;
  }

  const grid = document.getElementById('readingList');
  showGridLoading(grid, 'Loading your reading list...');

  try {
    const snap = await db.collection('users').doc(currentUser.uid)
                         .collection('readingList')
                         .orderBy('addedAt', 'desc')
                         .get();

    if (snap.empty) {
      showGridEmpty(grid, 'fa-bookmark',
        'Your reading list is empty.<br>Search for books and add them here!');
      return;
    }

    grid.innerHTML = '';
    snap.forEach((doc, i) => {
      const card = createRLCard(doc.id, doc.data(), i);
      grid.appendChild(card);
    });

  } catch (err) {
    console.error('loadReadingList error:', err);
    showGridEmpty(grid, 'fa-exclamation-circle', 'Could not load reading list. Please refresh.');
  }
}

/* ── Create Reading List Card ───────────────────────────── */
function createRLCard(docId, book, index = 0) {
  const card = document.createElement('div');
  card.className = 'rl-card';
  card.id = `rl-card-${docId}`;
  card.style.animationDelay = `${index * 0.05}s`;

  const cover = book.coverUrl
    ? `<img src="${escHtml(book.coverUrl)}" alt="${escHtml(book.title)}" loading="lazy"
           onerror="this.parentElement.innerHTML='<div class=\\'no-cover-placeholder\\'><i class=\\'fas fa-book\\'></i></div>'">`
    : `<div class="no-cover-placeholder"><i class="fas fa-book"></i></div>`;

  card.innerHTML = `
    <div class="rl-cover">${cover}</div>
    <div class="rl-body">
      <div class="rl-title">${escHtml(book.title)}</div>
      <div class="rl-author">${escHtml(book.author)}</div>

      <select class="rl-status-select"
              onchange="updateStatus('${escAttr(docId)}', this.value)">
        <option value="to-read"   ${book.status === 'to-read'   ? 'selected' : ''}>📖 To Read</option>
        <option value="reading"   ${book.status === 'reading'   ? 'selected' : ''}>📚 Reading</option>
        <option value="completed" ${book.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
      </select>

      <div class="rl-footer">
        <div class="rl-stars" id="stars_${escAttr(docId)}">
          ${buildStars(book.rating || 0, docId)}
        </div>
        <button class="btn-danger" onclick="removeFromList('${escAttr(docId)}','${escAttr(book.title)}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>`;

  return card;
}

/* ── Build Interactive Star Rating HTML ──────────────────── */
function buildStars(currentRating, docId) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const cls = i <= currentRating ? 'fas fa-star active' : 'far fa-star';
    html += `<i class="${cls}" data-rating="${i}"
                onmouseenter="previewStars('${escAttr(docId)}', ${i})"
                onmouseleave="resetStars('${escAttr(docId)}', ${currentRating})"
                onclick="rateBook('${escAttr(docId)}', ${i})"></i>`;
  }
  return html;
}

function previewStars(docId, rating) {
  const container = document.getElementById(`stars_${docId}`);
  if (!container) return;
  container.querySelectorAll('i').forEach((star, i) => {
    star.className = i < rating ? 'fas fa-star active' : 'far fa-star';
  });
}

function resetStars(docId, currentRating) {
  const container = document.getElementById(`stars_${docId}`);
  if (!container) return;
  container.querySelectorAll('i').forEach((star, i) => {
    star.className = i < currentRating ? 'fas fa-star active' : 'far fa-star';
  });
}

/* ── Rate a Book ────────────────────────────────────────── */
async function rateBook(docId, rating) {
  if (!currentUser) return;
  try {
    await db.collection('users').doc(currentUser.uid)
            .collection('readingList').doc(docId)
            .update({ rating });

    // Re-render just the stars
    const container = document.getElementById(`stars_${docId}`);
    if (container) container.innerHTML = buildStars(rating, docId);

    showToast(`Rated ${rating} star${rating !== 1 ? 's' : ''}!`, 'success');
  } catch (err) {
    console.error('rateBook error:', err);
    showToast('Error saving rating.', 'error');
  }
}

/* ── Update Reading Status ──────────────────────────────── */
async function updateStatus(docId, status) {
  if (!currentUser) return;
  try {
    await db.collection('users').doc(currentUser.uid)
            .collection('readingList').doc(docId)
            .update({ status });

    const labels = { 'to-read': 'To Read', 'reading': 'Reading', 'completed': 'Completed' };
    showToast(`Status updated to "${labels[status]}"`, 'success');
  } catch (err) {
    console.error('updateStatus error:', err);
    showToast('Error updating status.', 'error');
  }
}

/* ── Remove Book from Reading List ──────────────────────── */
async function removeFromList(docId, title) {
  if (!currentUser) return;
  if (!confirm(`Remove "${title}" from your reading list?`)) return;

  try {
    await db.collection('users').doc(currentUser.uid)
            .collection('readingList').doc(docId)
            .delete();

    showToast(`"${title}" removed from your list.`, 'info');

    // Remove card from DOM
    const card = document.getElementById(`rl-card-${docId}`);
    if (card) card.remove();

    // Check if list is now empty
    const grid = document.getElementById('readingList');
    if (grid && grid.children.length === 0) {
      showGridEmpty(grid, 'fa-bookmark',
        'Your reading list is empty.<br>Search for books and add them here!');
    }
  } catch (err) {
    console.error('removeFromList error:', err);
    showToast('Error removing book.', 'error');
  }
}

/* ── Render Not-Logged-In State ─────────────────────────── */
function renderEmptyReadingList() {
  const grid = document.getElementById('readingList');
  if (!grid) return;
  grid.innerHTML = `
    <div class="grid-empty" style="grid-column:1/-1">
      <i class="fas fa-lock" style="font-size:2.5rem;color:var(--text-dim);margin-bottom:14px;display:block"></i>
      <p>
        <a href="#" onclick="openAuthModal()" style="color:var(--gold)">Login</a>
        to view and manage your reading list.
      </p>
    </div>`;
}
