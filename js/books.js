/**
 * BookWise — Books Module
 * Handles: Google Books API search, book cards, book detail modal
 */

'use strict';

/* ── Search Books (with fallback) ───────────────────────── */
async function searchBooks() {
  const query = document.getElementById('searchInput').value.trim();
  const type  = document.querySelector('input[name="searchType"]:checked').value;

  if (!query) {
    return showToast('Please enter a search term.', 'warning');
  }

  const grid = document.getElementById('searchResults');
  showGridLoading(grid, 'Searching books...');

  try {
    // Try Google Books first
    const q      = `${type}:${encodeURIComponent(query)}`;
    const keyPart= GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : '';
    const url    = `${GOOGLE_BOOKS_BASE}?q=${q}&maxResults=${APP_CONFIG.searchResultsLimit}&langRestrict=en${keyPart}`;
    
    try {
      const res    = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        renderBookCards(data.items, grid);
        setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        return;
      }
    } catch (googleErr) {
      console.warn('Google Books failed, trying Open Library:', googleErr);
    }
    
    // Fallback to Open Library
    let olQuery = query;
    if (type === 'intitle') olQuery = `title:${query}`;
    else if (type === 'inauthor') olQuery = `author:${query}`;
    
    const olUrl = `${OPEN_LIBRARY_API}?q=${encodeURIComponent(olQuery)}&limit=${APP_CONFIG.searchResultsLimit}`;
    const olRes = await fetch(olUrl);
    if (!olRes.ok) throw new Error(`HTTP ${olRes.status}`);
    const olData = await olRes.json();

    if (!olData.docs || olData.docs.length === 0) {
      showGridEmpty(grid, 'fa-search', `No books found for "<strong>${escHtml(query)}</strong>". Try a different term.`);
      return;
    }

    renderOpenLibraryCards(olData.docs, grid);
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

  } catch (err) {
    console.error('Search error:', err);
    showGridEmpty(grid, 'fa-exclamation-circle', 'Error fetching books. Check your connection.');
  }
}

/* ── Render Book Card Grid ──────────────────────────────── */
function renderBookCards(books, container) {
  container.innerHTML = '';
  books.forEach((book, i) => {
    const card = createBookCard(book, i);
    container.appendChild(card);
  });
}

/* ── Create Individual Book Card ────────────────────────── */
function createBookCard(book, index = 0) {
  const info    = book.volumeInfo || {};
  const id      = book.id;
  const title   = info.title || 'Unknown Title';
  const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';
  const cover   = info.imageLinks?.thumbnail?.replace('http://', 'https://') || null;
  const rating  = info.averageRating;
  const cat     = info.categories?.[0] || null;

  const col = document.createElement('div');
  col.className = 'book-card';
  col.style.animationDelay = `${index * 0.05}s`;

  col.innerHTML = `
    <div class="book-cover-wrap">
      ${cover
        ? `<img src="${cover}" alt="${escHtml(title)}" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\\'no-cover-placeholder\\'><i class=\\'fas fa-book\\'></i><span>${escHtml(title)}</span></div>'">`
        : `<div class="no-cover-placeholder"><i class="fas fa-book"></i><span>${escHtml(title)}</span></div>`
      }
    </div>
    <div class="book-body">
      <div class="book-title-text">${escHtml(title)}</div>
      <div class="book-author-text">${escHtml(authors)}</div>
      ${rating ? `<div class="book-rating">${starIcons(rating)} ${rating}/5</div>` : ''}
      ${cat    ? `<span class="book-category">${escHtml(cat.split('/')[0].trim())}</span>` : ''}
      <div class="book-actions">
        <button class="btn-primary btn-sm" onclick="showBookDetail('${escAttr(id)}')">
          <i class="fas fa-info-circle"></i> Details
        </button>
        <button class="btn-ghost btn-sm" onclick="addToList('${escAttr(id)}','${escAttr(title)}','${escAttr(authors)}','${escAttr(cover || '')}')">
          <i class="fas fa-plus"></i> Add
        </button>
      </div>
    </div>`;

  return col;
}

/* ── Show Book Detail Modal ─────────────────────────────── */
async function showBookDetail(bookId) {
  const modal   = document.getElementById('bookModal');
  const content = document.getElementById('modalContent');

  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="grid-loading" style="min-height:200px">
      <div class="spinner"></div><p>Loading book details...</p>
    </div>`;

  try {
    const keyPart = GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : '';
    const res  = await fetch(`${GOOGLE_BOOKS_BASE}/${bookId}${keyPart}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const book = await res.json();
    const info = book.volumeInfo || {};

    const title       = info.title       || 'Unknown Title';
    const authors     = info.authors     ? info.authors.join(', ') : 'Unknown Author';
    const publisher   = info.publisher   || '—';
    const published   = info.publishedDate || '—';
    const pages       = info.pageCount   || '—';
    const categories  = info.categories  ? info.categories.join(', ') : '—';
    const rating      = info.averageRating;
    const ratingCount = info.ratingsCount;
    const desc        = info.description || 'No description available.';
    const cover       = info.imageLinks?.large?.replace('http://', 'https://')
                     || info.imageLinks?.thumbnail?.replace('http://', 'https://')
                     || null;
    const preview     = info.previewLink || '#';
    const infoLink    = info.infoLink    || '#';

    content.innerHTML = `
      <div class="modal-book-layout">
        <div class="modal-book-cover">
          ${cover
            ? `<img src="${cover}" alt="${escHtml(title)}">`
            : `<div class="no-cover-placeholder"><i class="fas fa-book"></i></div>`
          }
        </div>
        <div class="modal-book-info">
          <div class="modal-book-title">${escHtml(title)}</div>
          <div class="modal-book-author">by ${escHtml(authors)}</div>

          <div class="modal-meta">
            <span class="meta-chip"><i class="fas fa-calendar me-1"></i>${published}</span>
            <span class="meta-chip"><i class="fas fa-file-alt me-1"></i>${pages} pages</span>
            <span class="meta-chip"><i class="fas fa-building me-1"></i>${escHtml(publisher)}</span>
            ${categories !== '—' ? `<span class="meta-chip"><i class="fas fa-tag"></i> ${escHtml(categories.split(',')[0])}</span>` : ''}
            ${rating ? `<span class="meta-chip" style="color:var(--gold)"><i class="fas fa-star"></i> ${rating}/5 (${ratingCount || 0})</span>` : ''}
          </div>

          <p class="modal-desc">${escHtml(desc).substring(0, 600)}${desc.length > 600 ? '...' : ''}</p>

          <div class="modal-actions">
            <button class="btn-primary btn-sm"
                    onclick="addToList('${escAttr(bookId)}','${escAttr(title)}','${escAttr(authors)}','${escAttr(cover || '')}')">
              <i class="fas fa-plus"></i> Add to List
            </button>
            <button class="btn-primary btn-sm" onclick="checkAndOpenFree('${escAttr(title)}','${escAttr(authors)}','pdf')" style="background:var(--success);border:none;color:#fff;">
              <i class="fas fa-file-pdf"></i> Free PDF
            </button>
            <button class="btn-ghost btn-sm" onclick="checkAndOpenFree('${escAttr(title)}','${escAttr(authors)}','read')">
              <i class="fas fa-book-open"></i> Read Online
            </button>
            <a href="${preview}" target="_blank" rel="noopener" class="btn-ghost btn-sm" style="text-decoration:none;">
              <i class="fas fa-eye"></i> Preview
            </a>
            <button class="btn-ghost btn-sm" onclick="fetchAISummary('${escAttr(bookId)}','${escAttr(title)}','${escAttr(desc.substring(0,800))}')">
              <i class="fas fa-robot"></i> AI Summary
            </button>
          </div>

          <div id="summaryBox_${bookId}"></div>
        </div>
      </div>`;
  } catch (err) {
    console.error('Book detail error:', err);
    content.innerHTML = `<div class="grid-empty"><i class="fas fa-exclamation-circle"></i><p>Could not load book details.</p></div>`;
  }
}

/* ── Render Open Library Cards ──────────────────────────── */
function renderOpenLibraryCards(books, container) {
  container.innerHTML = '';
  books.forEach((book, i) => {
    const title = book.title || 'Unknown Title';
    const author = book.author_name ? book.author_name[0] : 'Unknown Author';
    const year = book.first_publish_year || '';
    const coverId = book.cover_id;
    const cover = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/128x192?text=No+Cover';
    const isbn = book.isbn ? book.isbn[0] : '';
    const genre = book.subject ? book.subject[0] : 'General';
    
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="book-cover" onclick="openBookModal({
        id: 'ol_${escAttr(isbn || title)}',
        volumeInfo: {
          title: '${escAttr(title)}',
          authors: ['${escAttr(author)}'],
          publishedDate: '${year}',
          imageLinks: { thumbnail: '${escAttr(cover)}' },
          description: 'Book from Open Library - ${escAttr(genre)}'
        }
      })">
        <img src="${cover}" alt="${escHtml(title)}" onerror="this.src='https://via.placeholder.com/128x192?text=No+Cover'">
      </div>
      <div class="book-info">
        <h3 class="book-title">${escHtml(title)}</h3>
        <p class="book-author">${escHtml(author)}</p>
        ${year ? `<small class="book-year">${year}</small>` : ''}
        <div class="book-actions">
          <button class="btn-primary btn-sm" onclick="openBookModal({
            id: 'ol_${escAttr(isbn || title)}',
            volumeInfo: {
              title: '${escAttr(title)}',
              authors: ['${escAttr(author)}'],
              publishedDate: '${year}',
              imageLinks: { thumbnail: '${escAttr(cover)}' },
              description: 'Book from Open Library - ${escAttr(genre)}'
            }
          })">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn-ghost btn-sm" onclick="addToList('ol_${escAttr(isbn || title.replace(/\s+/g,'_').toLowerCase())}','${escAttr(title)}','${escAttr(author)}','${escAttr(cover)}')">
            <i class="fas fa-bookmark"></i> Add
          </button>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

/* ── Close Book Modal ───────────────────────────────────── */
function closeModal() {
  document.getElementById('bookModal').classList.add('hidden');
  document.getElementById('modalContent').innerHTML = '';
}

/* ── Star Icons Helper ───────────────────────────────────── */
function starIcons(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += `<i class="fa${i <= Math.round(rating) ? 's' : 'r'} fa-star"></i>`;
  }
  return s;
}

/* ── Allow Enter key in search input ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchBooks();
  });
});

/* ── Category Search ────────────────────────────────────── */
async function searchCategory(query) {
  smoothScrollTo('#categories');
  const grid = document.getElementById('categoryResults');
  showGridLoading(grid, `Loading ${query} books...`);

  try {
    const q       = `subject:${encodeURIComponent(query)}`;
    const keyPart = GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : '';
    const url     = `${GOOGLE_BOOKS_BASE}?q=${q}&maxResults=12&orderBy=relevance&langRestrict=en${keyPart}`;
    const res     = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data    = await res.json();

    if (data.items && data.items.length > 0) {
      renderBookCards(data.items, grid);
      setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      showGridEmpty(grid, 'fa-search', `No books found for "${query}".`);
    }
  } catch (err) {
    console.error('Category search error:', err);
    showGridEmpty(grid, 'fa-exclamation-circle', 'Error loading category. Please try again.');
  }
}
