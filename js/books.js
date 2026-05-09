/**
 * Book Engine — Books Module (Fixed v3)
 * Fixes: Book detail modal, Open Library card clicks, missing openBookModal
 */
'use strict';

/* ── Search Books ───────────────────────────────────────── */
async function searchBooks() {
  const query = document.getElementById('searchInput').value.trim();
  const type  = document.querySelector('input[name="searchType"]:checked').value;

  if (!query) return showToast('Please enter a search term.', 'warning');

  const grid = document.getElementById('searchResults');
  showGridLoading(grid, 'Searching books...');

  try {
    const q       = type + ':' + encodeURIComponent(query);
    const keyPart = GOOGLE_BOOKS_API_KEY ? '&key=' + GOOGLE_BOOKS_API_KEY : '';
    const url     = GOOGLE_BOOKS_BASE + '?q=' + q + '&maxResults=' + APP_CONFIG.searchResultsLimit + '&langRestrict=en' + keyPart;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        renderBookCards(data.items, grid);
        setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        return;
      }
    } catch (googleErr) {
      console.warn('Google Books failed, trying Open Library:', googleErr);
    }

    // Open Library fallback
    let olQuery = query;
    if (type === 'intitle')  olQuery = 'title:' + query;
    else if (type === 'inauthor') olQuery = 'author:' + query;

    const olUrl  = OPEN_LIBRARY_API + '?q=' + encodeURIComponent(olQuery) + '&limit=' + APP_CONFIG.searchResultsLimit;
    const olRes  = await fetch(olUrl);
    if (!olRes.ok) throw new Error('HTTP ' + olRes.status);
    const olData = await olRes.json();

    if (!olData.docs || olData.docs.length === 0) {
      showGridEmpty(grid, 'fa-search', 'No books found for "' + escHtml(query) + '". Try a different term.');
      return;
    }
    renderOpenLibraryCards(olData.docs, grid);
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

  } catch (err) {
    console.error('Search error:', err);
    showGridEmpty(grid, 'fa-exclamation-circle', 'Error fetching books. Check your connection.');
  }
}

/* ── Render Book Cards (Google Books) ───────────────────── */
function renderBookCards(books, container) {
  container.innerHTML = '';
  books.forEach((book, i) => container.appendChild(createBookCard(book, i)));
}

function createBookCard(book, index) {
  index = index || 0;
  const info    = book.volumeInfo || {};
  const id      = book.id;
  const title   = info.title || 'Unknown Title';
  const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';
  const cover   = info.imageLinks && info.imageLinks.thumbnail
    ? info.imageLinks.thumbnail.replace('http://', 'https://')
    : null;
  const rating  = info.averageRating;
  const cat     = info.categories ? info.categories[0] : null;

  const col = document.createElement('div');
  col.className = 'book-card';
  col.style.animationDelay = (index * 0.05) + 's';

  col.innerHTML =
    '<div class="book-cover-wrap">' +
      (cover
        ? '<img src="' + cover + '" alt="' + escHtml(title) + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=\\"no-cover-placeholder\\"><i class=\\"fas fa-book\\"></i><span>' + escHtml(title) + '</span></div>\'">'
        : '<div class="no-cover-placeholder"><i class="fas fa-book"></i><span>' + escHtml(title) + '</span></div>'
      ) +
    '</div>' +
    '<div class="book-body">' +
      '<div class="book-title-text">' + escHtml(title) + '</div>' +
      '<div class="book-author-text">' + escHtml(authors) + '</div>' +
      (rating ? '<div class="book-rating">' + starIcons(rating) + ' ' + rating + '/5</div>' : '') +
      (cat    ? '<span class="book-category">' + escHtml(cat.split('/')[0].trim()) + '</span>' : '') +
      '<div class="book-actions">' +
        '<button class="btn-primary btn-sm" onclick="showBookDetail(\'' + escAttr(id) + '\')">' +
          '<i class="fas fa-info-circle"></i> Details' +
        '</button>' +
        '<button class="btn-ghost btn-sm" onclick="addToList(\'' + escAttr(id) + '\',\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'' + escAttr(cover || '') + '\')">' +
          '<i class="fas fa-plus"></i> Add' +
        '</button>' +
      '</div>' +
    '</div>';

  return col;
}

/* ── Show Book Detail Modal (Google Books) ───────────────── */
async function showBookDetail(bookId) {
  const modal   = document.getElementById('bookModal');
  const content = document.getElementById('modalContent');

  modal.classList.remove('hidden');
  content.innerHTML =
    '<div class="modal-detail-loading">' +
      '<div class="spinner"></div>' +
      '<p>Loading book details...</p>' +
    '</div>';

  try {
    const keyPart = GOOGLE_BOOKS_API_KEY ? '?key=' + GOOGLE_BOOKS_API_KEY : '';
    const res     = await fetch(GOOGLE_BOOKS_BASE + '/' + bookId + keyPart);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const book = await res.json();
    renderBookDetailModal(book);
  } catch (err) {
    console.error('Book detail error:', err);
    content.innerHTML =
      '<div class="grid-empty" style="padding:60px 24px;">' +
        '<i class="fas fa-exclamation-circle"></i>' +
        '<p>Could not load book details. Please try again.</p>' +
        '<button class="btn-ghost btn-sm" style="margin-top:14px;" onclick="closeModal()">Close</button>' +
      '</div>';
  }
}

/* ── Render Book Detail Modal Content ─────────────────────── */
function renderBookDetailModal(book) {
  const content = document.getElementById('modalContent');
  const info    = book.volumeInfo || {};

  const title       = info.title       || 'Unknown Title';
  const authors     = info.authors     ? info.authors.join(', ') : 'Unknown Author';
  const publisher   = info.publisher   || '—';
  const published   = info.publishedDate ? info.publishedDate.substring(0, 4) : '—';
  const pages       = info.pageCount   || '—';
  const lang        = info.language    ? info.language.toUpperCase() : '—';
  const categories  = info.categories  ? info.categories.slice(0, 2).join(', ') : '—';
  const rating      = info.averageRating;
  const ratingCount = info.ratingsCount || 0;
  const desc        = info.description || 'No description available.';
  const cleanDesc   = desc.replace(/<[^>]*>/g, '');
  const cover       = info.imageLinks
    ? (info.imageLinks.large || info.imageLinks.medium || info.imageLinks.thumbnail || '').replace('http://', 'https://')
    : '';
  const preview     = info.previewLink || '#';
  const bookId      = book.id;

  content.innerHTML =
    '<div class="modal-detail">' +
      '<div class="modal-detail-cover">' +
        (cover
          ? '<img src="' + escHtml(cover) + '" alt="' + escHtml(title) + '" onerror="this.src=\'\';">'
          : '<div class="no-cover-large"><i class="fas fa-book"></i></div>'
        ) +
      '</div>' +
      '<div class="modal-detail-body">' +
        '<div class="modal-detail-title">' + escHtml(title) + '</div>' +
        '<div class="modal-detail-author">by ' + escHtml(authors) + '</div>' +

        (rating
          ? '<div class="modal-detail-rating">' +
              '<span class="stars-gold">' + starIcons(rating) + '</span>' +
              '<span>' + rating + ' / 5</span>' +
              '<span class="rating-count">(' + ratingCount + ' ratings)</span>' +
            '</div>'
          : '') +

        '<div class="modal-meta-chips">' +
          '<span class="meta-chip"><i class="fas fa-calendar"></i> ' + escHtml(published) + '</span>' +
          '<span class="meta-chip"><i class="fas fa-file-alt"></i> ' + pages + ' pages</span>' +
          '<span class="meta-chip"><i class="fas fa-building"></i> ' + escHtml(publisher) + '</span>' +
          '<span class="meta-chip"><i class="fas fa-globe"></i> ' + lang + '</span>' +
          (categories !== '—' ? '<span class="meta-chip"><i class="fas fa-tag"></i> ' + escHtml(categories.split(',')[0].trim()) + '</span>' : '') +
        '</div>' +

        '<div class="modal-detail-desc hidden" id="descBox_' + escAttr(bookId) + '">' +
          '<p>' + escHtml(cleanDesc.length > 700 ? cleanDesc.substring(0, 700) + '\u2026' : cleanDesc) + '</p>' +
        '</div>' +

        '<div class="modal-detail-actions">' +
          '<button class="btn-primary btn-sm" onclick="addToList(\'' + escAttr(bookId) + '\',\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'' + escAttr(cover) + '\')">' +
            '<i class="fas fa-plus"></i> Add to List' +
          '</button>' +
          '<button class="btn-primary btn-sm btn-pdf" onclick="checkAndOpenFree(\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'pdf\')">' +
            '<i class="fas fa-file-pdf"></i> Free PDF' +
          '</button>' +
          '<button class="btn-ghost btn-sm" onclick="checkAndOpenFree(\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'read\')">' +
            '<i class="fas fa-book-open"></i> Read Online' +
          '</button>' +
          (preview !== '#'
            ? '<a href="' + escHtml(preview) + '" target="_blank" rel="noopener" class="btn-ghost btn-sm"><i class="fas fa-eye"></i> Preview</a>'
            : '') +
          '<button class="btn-ghost btn-sm" onclick="fetchAISummary(\'' + escAttr(bookId) + '\',\'' + escAttr(title) + '\',\'' + escAttr(cleanDesc.substring(0, 600)) + '\')">' +
            '<i class="fas fa-robot"></i> AI Summary' +
          '</button>' +
        '</div>' +

        '<div id="summaryBox_' + escAttr(bookId) + '"></div>' +
      '</div>' +
    '</div>';
}

/* ── Open Book Modal (for Open Library books) ─────────────── */
function openBookModal(bookObj) {
  const modal   = document.getElementById('bookModal');
  const content = document.getElementById('modalContent');
  modal.classList.remove('hidden');

  // bookObj is already a partial volumeInfo-style object
  const book = typeof bookObj === 'string' ? JSON.parse(bookObj) : bookObj;
  renderBookDetailModal(book);
}

/* ── Render Open Library Cards ──────────────────────────── */
function renderOpenLibraryCards(books, container) {
  container.innerHTML = '';
  books.forEach(function(book, i) {
    const title   = book.title || 'Unknown Title';
    const author  = book.author_name ? book.author_name[0] : 'Unknown Author';
    const year    = book.first_publish_year || '';
    const coverId = book.cover_id;
    const cover   = coverId ? 'https://covers.openlibrary.org/b/id/' + coverId + '-M.jpg' : '';
    const genre   = book.subject ? book.subject[0] : 'General';

    // Build a Google Books-compatible object for the detail modal
    const bookObj = {
      id: 'ol_' + (book.isbn ? book.isbn[0] : title.replace(/\s+/g,'_').toLowerCase()),
      volumeInfo: {
        title: title,
        authors: [author],
        publishedDate: String(year),
        imageLinks: cover ? { thumbnail: cover } : {},
        description: 'A ' + genre + ' book published in ' + (year || 'unknown year') + '.',
        language: 'en'
      }
    };
    const bookJson = escAttr(JSON.stringify(bookObj));
    const bookId   = bookObj.id;

    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = (i * 0.05) + 's';

    card.innerHTML =
      '<div class="book-cover-wrap" style="cursor:pointer;" onclick="openBookModal(' + "'" + bookJson + "'" + ')">' +
        (cover
          ? '<img src="' + escHtml(cover) + '" alt="' + escHtml(title) + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=\\"no-cover-placeholder\\"><i class=\\"fas fa-book\\"></i></div>\'">'
          : '<div class="no-cover-placeholder"><i class="fas fa-book"></i><span>' + escHtml(title) + '</span></div>'
        ) +
      '</div>' +
      '<div class="book-body">' +
        '<div class="book-title-text">' + escHtml(title) + '</div>' +
        '<div class="book-author-text">' + escHtml(author) + '</div>' +
        (year ? '<div class="book-author-text" style="font-size:0.72rem;">' + year + '</div>' : '') +
        '<div class="book-actions">' +
          '<button class="btn-primary btn-sm" onclick="openBookModal(\'' + bookJson + '\')">' +
            '<i class="fas fa-info-circle"></i> Details' +
          '</button>' +
          '<button class="btn-ghost btn-sm" onclick="addToList(\'' + escAttr(bookId) + '\',\'' + escAttr(title) + '\',\'' + escAttr(author) + '\',\'' + escAttr(cover) + '\')">' +
            '<i class="fas fa-plus"></i> Add' +
          '</button>' +
        '</div>' +
      '</div>';

    container.appendChild(card);
  });
}

/* ── Close Modal ────────────────────────────────────────── */
function closeModal() {
  document.getElementById('bookModal').classList.add('hidden');
  document.getElementById('modalContent').innerHTML = '';
}

/* ── Star Icons ─────────────────────────────────────────── */
function starIcons(rating) {
  var s = '';
  for (var i = 1; i <= 5; i++) {
    s += '<i class="' + (i <= Math.round(rating) ? 'fas' : 'far') + ' fa-star"></i>';
  }
  return s;
}

/* ── Category Search (Fixed — dual source with fallback) ── */
async function searchCategory(query) {
  smoothScrollTo('#categories');
  const grid = document.getElementById('categoryResults');
  showGridLoading(grid, 'Loading books...');

  // Use simple keyword query for Google Books (better results than subject: prefix)
  const simpleQ = query.split(' ').slice(0, 3).join(' '); // take first 3 words

  try {
    const keyPart = GOOGLE_BOOKS_API_KEY ? '&key=' + GOOGLE_BOOKS_API_KEY : '';
    const url     = GOOGLE_BOOKS_BASE + '?q=' + encodeURIComponent(simpleQ) + '&maxResults=12&orderBy=relevance&langRestrict=en&printType=books' + keyPart;
    const res     = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data    = await res.json();

    if (data.items && data.items.length > 0) {
      renderBookCards(data.items, grid);
      setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      return;
    }
  } catch (err) {
    console.warn('Google Books category failed, trying Open Library:', err);
  }

  // Fallback: Open Library
  try {
    const olUrl  = OPEN_LIBRARY_API + '?q=' + encodeURIComponent(simpleQ) + '&limit=12&language=eng';
    const olRes  = await fetch(olUrl);
    if (!olRes.ok) throw new Error('OL HTTP ' + olRes.status);
    const olData = await olRes.json();
    if (olData.docs && olData.docs.length > 0) {
      renderOpenLibraryCards(olData.docs, grid);
      setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      return;
    }
  } catch (err2) {
    console.error('Category fallback also failed:', err2);
  }

  showGridEmpty(grid, 'fa-search', 'No books found for this category. Please try again.');
}

/* ── Enter key in search ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchBooks();
  });
});
