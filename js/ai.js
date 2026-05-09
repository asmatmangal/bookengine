/**
 * Book Engine — AI Module
 * Groq AI — Free, fast, browser-compatible
 */
'use strict';

/* ═══════════════════════════════════════════════
   CORE AI CALL — Groq
═══════════════════════════════════════════════ */
async function callAI(systemPrompt, messages, maxTokens) {
  maxTokens = maxTokens || 800;

  // messages can be a string (single prompt) or array (conversation)
  const msgArray = Array.isArray(messages)
    ? messages
    : [{ role: 'user', content: String(messages) }];

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + GROQ_API_KEY
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      max_tokens:  maxTokens,
      temperature: 0.7,
      messages:    [{ role: 'system', content: systemPrompt }, ...msgArray]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Groq error ' + res.status + ': ' + err);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

/* ═══════════════════════════════════════════════
   FALLBACK BOOK DATABASE
═══════════════════════════════════════════════ */
const BOOK_DATABASE = {
  nature:    [{title:'The Hidden Life of Trees',author:'Peter Wohlleben',genre:'Nature',reason:'A fascinating look at how trees communicate and support each other in forests.'},{title:'Braiding Sweetgrass',author:'Robin Wall Kimmerer',genre:'Nature',reason:'Beautiful mix of science and indigenous wisdom about plants and the natural world.'},{title:'The Overstory',author:'Richard Powers',genre:'Nature',reason:'A powerful novel about people whose lives are transformed by trees.'},{title:'Silent Spring',author:'Rachel Carson',genre:'Nature',reason:'The landmark book that started the global environmental movement.'},{title:'H is for Hawk',author:'Helen Macdonald',genre:'Nature',reason:'A moving story about grief, healing, and training a wild goshawk.'},{title:'The Wild Remedy',author:'Emma Mitchell',genre:'Nature',reason:'A beautiful diary of how nature heals the mind through every season.'}],
  thriller:  [{title:'Gone Girl',author:'Gillian Flynn',genre:'Thriller',reason:'Two unreliable narrators and a shocking ending you will never see coming.'},{title:'The Girl on the Train',author:'Paula Hawkins',genre:'Thriller',reason:'A woman sees something from her train window that changes everything.'},{title:'The Silent Patient',author:'Alex Michaelides',genre:'Thriller',reason:'A famous painter shoots her husband then never speaks again — jaw-dropping.'},{title:'Big Little Lies',author:'Liane Moriarty',genre:'Thriller',reason:'Three women, one murder, and secrets buried deep for years.'},{title:'Sharp Objects',author:'Gillian Flynn',genre:'Thriller',reason:'Dark, creepy, and impossible to put down.'},{title:'The Woman in the Window',author:'A.J. Finn',genre:'Thriller',reason:'A woman stuck in her home witnesses a terrible crime next door.'}],
  history:   [{title:'Sapiens',author:'Yuval Noah Harari',genre:'History',reason:'The entire story of humanity — how we went from nothing to ruling the planet.'},{title:'The Book Thief',author:'Markus Zusak',genre:'History',reason:'A girl in Nazi Germany who steals books. Narrated by Death — unforgettable.'},{title:'All the Light We Cannot See',author:'Anthony Doerr',genre:'History',reason:'Two children on opposite sides of WWII. Pulitzer Prize winner.'},{title:'The Nightingale',author:'Kristin Hannah',genre:'History',reason:'Two sisters surviving German-occupied France. Emotionally devastating.'},{title:'Guns Germs and Steel',author:'Jared Diamond',genre:'History',reason:'Why did some civilizations conquer others? The answer will surprise you.'},{title:'The Diary of a Young Girl',author:'Anne Frank',genre:'History',reason:'The real diary of a Jewish girl hiding from the Nazis in Amsterdam.'}],
  space:     [{title:'A Brief History of Time',author:'Stephen Hawking',genre:'Space',reason:'The universe explained simply by one of the greatest minds in history.'},{title:'The Martian',author:'Andy Weir',genre:'Space',reason:'An astronaut stranded alone on Mars must survive using only science.'},{title:'Cosmos',author:'Carl Sagan',genre:'Space',reason:'Sagan makes you feel the full wonder and scale of the universe.'},{title:'Project Hail Mary',author:'Andy Weir',genre:'Space',reason:'A man wakes alone in space with no memory — must save Earth alone.'},{title:'Astrophysics for People in a Hurry',author:'Neil deGrasse Tyson',genre:'Space',reason:'Everything fascinating about space in short, simple, brilliant chapters.'},{title:'The Right Stuff',author:'Tom Wolfe',genre:'Space',reason:'The gripping true story of the first American astronauts.'}],
  crime:     [{title:'In Cold Blood',author:'Truman Capote',genre:'Crime',reason:'True story of a brutal murder in small-town America — genre-defining.'},{title:'The Girl with the Dragon Tattoo',author:'Stieg Larsson',genre:'Crime',reason:'A journalist and hacker team up to solve a decades-old family mystery.'},{title:'And Then There Were None',author:'Agatha Christie',genre:'Crime',reason:'Ten strangers on an island — one by one they die. The best mystery ever.'},{title:'I Am Pilgrim',author:'Terry Hayes',genre:'Crime',reason:'A spy must stop a bioterrorist before millions of people die.'},{title:'The No.1 Ladies Detective Agency',author:'Alexander McCall Smith',genre:'Crime',reason:'A brilliant Botswanan woman opens a detective agency — warm and funny.'},{title:'Mindhunter',author:'John Douglas',genre:'Crime',reason:'The real FBI agent who invented criminal profiling tells all.'}],
  selfcare:  [{title:'The Body Keeps the Score',author:'Bessel van der Kolk',genre:'Self Care',reason:'How trauma lives in the body and the proven ways to heal it.'},{title:'Atomic Habits',author:'James Clear',genre:'Self Care',reason:'Small changes compound into remarkable results. The most practical habit book.'},{title:'The Subtle Art of Not Giving a F*ck',author:'Mark Manson',genre:'Self Care',reason:'Refreshingly honest advice about what actually matters in life.'},{title:'Untamed',author:'Glennon Doyle',genre:'Self Care',reason:'A woman breaks free from everything she was expected to be.'},{title:'When Breath Becomes Air',author:'Paul Kalanithi',genre:'Self Care',reason:'A dying doctor writes beautifully about what makes life worth living.'},{title:'The Power of Now',author:'Eckhart Tolle',genre:'Self Care',reason:'How to stop living in your head and start living fully in the present.'}],
  tech:      [{title:'The Innovators',author:'Walter Isaacson',genre:'Tech',reason:'The real story of how the computer and internet were actually invented.'},{title:'Zero to One',author:'Peter Thiel',genre:'Tech',reason:'How to build a startup that creates something completely new in the world.'},{title:'The Lean Startup',author:'Eric Ries',genre:'Tech',reason:'How modern tech companies build products that people actually want.'},{title:'Thinking Fast and Slow',author:'Daniel Kahneman',genre:'Tech',reason:'How your brain actually makes decisions — and how it tricks you daily.'},{title:'Superintelligence',author:'Nick Bostrom',genre:'Tech',reason:'What happens when AI becomes smarter than humans? A serious look.'},{title:'The Age of Surveillance Capitalism',author:'Shoshana Zuboff',genre:'Tech',reason:'How tech companies profit from harvesting your personal data.'}],
  romance:   [{title:'Pride and Prejudice',author:'Jane Austen',genre:'Romance',reason:'The greatest love story ever written — witty, timeless, and perfect.'},{title:'The Notebook',author:'Nicholas Sparks',genre:'Romance',reason:'A beautiful love story that will make you cry and smile at the same time.'},{title:'Outlander',author:'Diana Gabaldon',genre:'Romance',reason:'A woman travels back in time to 18th century Scotland and finds love.'},{title:'Me Before You',author:'Jojo Moyes',genre:'Romance',reason:'A life-changing love story that will break your heart beautifully.'},{title:'The Hating Game',author:'Sally Thorne',genre:'Romance',reason:'Two office rivals who secretly love each other — funny and romantic.'},{title:'It Ends with Us',author:'Colleen Hoover',genre:'Romance',reason:'A powerful, emotional love story that deals with real, difficult themes.'}],
  fantasy:   [{title:'The Name of the Wind',author:'Patrick Rothfuss',genre:'Fantasy',reason:'The most beautifully written fantasy novel of the last 20 years.'},{title:'The Way of Kings',author:'Brandon Sanderson',genre:'Fantasy',reason:'An epic world-building masterpiece with the best magic system ever created.'},{title:'The Lies of Locke Lamora',author:'Scott Lynch',genre:'Fantasy',reason:'Ocean\'s Eleven in a fantasy world — clever, dark, and addictive.'},{title:'A Little Life',author:'Hanya Yanagihara',genre:'Fantasy',reason:'Four friends in New York — the most emotionally powerful novel of the decade.'},{title:'The Shadow of the Wind',author:'Carlos Ruiz Zafon',genre:'Fantasy',reason:'A boy finds a mysterious book in Barcelona and enters a world of secrets.'},{title:'Jonathan Strange and Mr Norrell',author:'Susanna Clarke',genre:'Fantasy',reason:'Magic returns to England — written like a Victorian novel but utterly gripping.'}],
  scifi:     [{title:'Dune',author:'Frank Herbert',genre:'Sci-Fi',reason:'The greatest science fiction novel ever written — epic, political, and visionary.'},{title:'The Hitchhiker\'s Guide to the Galaxy',author:'Douglas Adams',genre:'Sci-Fi',reason:'The funniest book in the universe. 42. That is all.'},{title:'Ender\'s Game',author:'Orson Scott Card',genre:'Sci-Fi',reason:'A child genius is trained to fight an alien war — stunning and heartbreaking.'},{title:'Neuromancer',author:'William Gibson',genre:'Sci-Fi',reason:'The book that invented cyberpunk and predicted the internet.'},{title:'The Left Hand of Darkness',author:'Ursula K. Le Guin',genre:'Sci-Fi',reason:'A world with no gender — one of the most thought-provoking books ever.'},{title:'Flowers for Algernon',author:'Daniel Keyes',genre:'Sci-Fi',reason:'A man with a low IQ becomes a genius — told entirely through diary entries.'}],
  biography: [{title:'Steve Jobs',author:'Walter Isaacson',genre:'Biography',reason:'The full, unfiltered story of the most creative and difficult genius of our time.'},{title:'Becoming',author:'Michelle Obama',genre:'Biography',reason:'Michelle Obama\'s story from Chicago to the White House — honest and inspiring.'},{title:'Long Walk to Freedom',author:'Nelson Mandela',genre:'Biography',reason:'How one man\'s courage changed an entire country. One of the greatest lives ever lived.'},{title:'The Diary of a Young Girl',author:'Anne Frank',genre:'Biography',reason:'The real diary of a Jewish girl hiding from the Nazis — heartbreaking and brave.'},{title:'Open',author:'Andre Agassi',genre:'Biography',reason:'The most honest sports autobiography ever written. He hated tennis. He was the best.'},{title:'Leonardo da Vinci',author:'Walter Isaacson',genre:'Biography',reason:'The full story of history\'s most curious and brilliant mind.'}]
};

/* ═══════════════════════════════════════════════
   AI RECOMMENDATIONS — FIXED (reads full input)
═══════════════════════════════════════════════ */
async function getAIRecommendations() {
  const prefInput = document.getElementById('prefInput');
  const prefs     = prefInput ? prefInput.value.trim() : '';
  if (!prefs) { showToast('Tell me what you enjoy reading first!', 'warning'); return; }

  const container = document.getElementById('aiResults');
  container.innerHTML = '<div class="spinner" style="grid-column:1/-1;margin:40px auto;"></div>';

  try {
    const sys = `You are a world-class book recommendation expert with deep knowledge of all genres and thousands of books.

IMPORTANT: Read the user's FULL request carefully. Consider every word they write — their mood, preferred genre, themes they mention, authors they like, and any specific requirements.

Return ONLY a valid JSON array of exactly 6 book recommendations. No markdown, no code blocks, no explanation — just the raw JSON array starting with [

Each book object must have exactly these fields:
- title: the book title
- author: the author's full name  
- genre: the genre
- reason: 1-2 warm, specific sentences explaining WHY this book matches what the user asked for`;

    const prompt = `The reader says: "${prefs}"

Carefully analyze their full request and recommend exactly 6 books that perfectly match everything they described. Return only the JSON array.`;

    const raw = await callAI(sys, [{ role: 'user', content: prompt }], 1500);

    // Extract JSON from response
    let recs;
    const si = raw.indexOf('['), ei = raw.lastIndexOf(']');
    if (si > -1 && ei > si) {
      recs = JSON.parse(raw.substring(si, ei + 1));
    } else {
      throw new Error('No JSON array found in response');
    }
    if (!Array.isArray(recs) || recs.length === 0) throw new Error('Empty array');

    renderAIRecs(recs, container);

  } catch (err) {
    console.warn('AI recs failed, using smart fallback:', err);
    smartFallbackRecs(prefs, container);
  }
}

/* Smart fallback — reads the full sentence properly */
function smartFallbackRecs(prefs, container) {
  const kw = prefs.toLowerCase();

  // Score each category against the full input
  const scores = {
    romance:   scoreKeywords(kw, ['romance','love','relationship','heart','emotional','feelings','couple','wedding','kiss','dating']),
    thriller:  scoreKeywords(kw, ['thriller','suspense','mystery','crime','detective','murder','killing','dark','scary','horror','psychological']),
    history:   scoreKeywords(kw, ['history','historical','war','ancient','past','century','civilization','world war','empire']),
    space:     scoreKeywords(kw, ['space','cosmos','universe','planet','astronaut','galaxy','nasa','astronomy','stars']),
    scifi:     scoreKeywords(kw, ['sci-fi','science fiction','future','robot','ai','dystopia','cyberpunk','alien','technology']),
    fantasy:   scoreKeywords(kw, ['fantasy','magic','wizard','dragon','sword','kingdom','mythical','elf','adventure']),
    crime:     scoreKeywords(kw, ['crime','detective','murder','police','investigation','serial killer','heist','spy']),
    selfcare:  scoreKeywords(kw, ['self help','motivat','habit','productivity','mindset','wellness','mental health','anxiety','healing','happiness']),
    tech:      scoreKeywords(kw, ['tech','startup','coding','programming','entrepreneur','silicon valley','business','innovation']),
    biography: scoreKeywords(kw, ['biography','memoir','true story','real life','autobiography','celebrity','president','leader']),
    nature:    scoreKeywords(kw, ['nature','wildlife','animals','plants','forest','ocean','environment','outdoor']),
  };

  // Pick the highest scoring category
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  renderAIRecs(BOOK_DATABASE[best] || BOOK_DATABASE.thriller, container);
  showToast('Showing curated picks! AI will give personalized results when available.', 'info');
}

function scoreKeywords(text, keywords) {
  return keywords.reduce((score, kw) => score + (text.includes(kw) ? 1 : 0), 0);
}

/* ═══════════════════════════════════════════════
   GENRE CARD RENDERING
═══════════════════════════════════════════════ */
const GENRE_META = {
  'Thriller':   { bg: '#e74c3c', icon: 'fa-ghost' },
  'Crime':      { bg: '#c0392b', icon: 'fa-fingerprint' },
  'History':    { bg: '#e67e22', icon: 'fa-landmark' },
  'Nature':     { bg: '#27ae60', icon: 'fa-leaf' },
  'Space':      { bg: '#2980b9', icon: 'fa-rocket' },
  'Self Care':  { bg: '#9b59b6', icon: 'fa-heart' },
  'Tech':       { bg: '#1abc9c', icon: 'fa-microchip' },
  'Romance':    { bg: '#e91e8c', icon: 'fa-heart-pulse' },
  'Fantasy':    { bg: '#7c3aed', icon: 'fa-hat-wizard' },
  'Sci-Fi':     { bg: '#2471a3', icon: 'fa-robot' },
  'Biography':  { bg: '#d4856a', icon: 'fa-user' },
  'Mystery':    { bg: '#8e44ad', icon: 'fa-magnifying-glass' },
  'default':    { bg: '#d4a853', icon: 'fa-book-open' }
};

function renderAIRecs(recs, container) {
  container.innerHTML = '';
  recs.forEach((rec, i) => {
    const safeId = (rec.title || '').replace(/[^a-z0-9]/gi, '_');
    const card   = document.createElement('div');
    card.className = 'ai-rec-card';
    card.style.animationDelay = (i * 0.08) + 's';
    const gkey = Object.keys(GENRE_META).find(k => (rec.genre || '').toLowerCase().includes(k.toLowerCase())) || 'default';
    const gm   = GENRE_META[gkey];
    card.innerHTML =
      '<div class="ai-rec-cover-stripe" style="background:linear-gradient(135deg,' + gm.bg + '33,' + gm.bg + '11);">' +
        '<div class="ai-rec-icon-circle" style="background:' + gm.bg + '22;border:2px solid ' + gm.bg + '44;">' +
          '<i class="fas ' + gm.icon + '" style="color:' + gm.bg + ';"></i>' +
        '</div>' +
        '<span class="ai-genre-pill" style="background:' + gm.bg + ';">' + escHtml(rec.genre || 'Book') + '</span>' +
      '</div>' +
      '<div class="ai-rec-content">' +
        '<div class="ai-rec-title">' + escHtml(rec.title) + '</div>' +
        '<div class="ai-rec-author"><i class="fas fa-feather-pointed"></i> ' + escHtml(rec.author) + '</div>' +
        '<p class="ai-rec-reason">' + escHtml(rec.reason || 'A great read perfectly matched to your preferences.') + '</p>' +
        '<div class="ai-rec-actions">' +
          '<button class="btn-primary btn-sm" onclick="searchForBook(\'' + escAttr(rec.title) + '\')"><i class="fas fa-search"></i> Find Book</button>' +
          '<button class="btn-ghost btn-sm" onclick="addToList(\'ai_' + safeId + '\',\'' + escAttr(rec.title) + '\',\'' + escAttr(rec.author) + '\',\'\')"><i class="fas fa-bookmark"></i> Save</button>' +
        '</div>' +
      '</div>';
    container.appendChild(card);
  });
  showToast(recs.length + ' AI picks ready! 📚', 'success');
}

function searchForBook(title) {
  document.getElementById('searchInput').value = title;
  document.querySelector('input[name="searchType"][value="intitle"]').checked = true;
  smoothScrollTo('#search');
  setTimeout(searchBooks, 600);
}

/* ═══════════════════════════════════════════════
   AI BOOK SUMMARY
═══════════════════════════════════════════════ */
async function fetchAISummary(bookId, title, description) {
  const box = document.getElementById('summaryBox_' + bookId);
  if (!box) return;
  box.innerHTML = '<div class="ai-summary-box"><div class="ai-label"><i class="fas fa-sparkles"></i> AI Summary</div><div class="summary-loading"><span></span><span></span><span></span></div></div>';

  try {
    const sys    = 'You are a friendly book reviewer. Write in simple, clear English. Exactly 3 sentences. Be enthusiastic and warm. Never start with "I" or "This book". Make the reader want to pick it up immediately.';
    let   prompt = 'Write a short, exciting, friendly 3-sentence summary of "' + title + '".';
    if (description && description.length > 20) {
      prompt += ' Here is some info: ' + description.replace(/<[^>]*>/g, '').substring(0, 400);
    }

    const summary = await callAI(sys, [{ role: 'user', content: prompt }], 250);
    if (summary && summary.length > 20) {
      box.innerHTML = '<div class="ai-summary-box"><div class="ai-label"><i class="fas fa-sparkles"></i> AI Summary</div><p>' + escHtml(summary) + '</p></div>';
      return;
    }
  } catch (err) { console.warn('AI summary failed:', err); }

  // Fallback to description
  if (description && description.length > 30) {
    const cleaned   = description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 15);
    const summary   = sentences.slice(0, 3).join('. ').trim() + '.';
    box.innerHTML   = '<div class="ai-summary-box"><div class="ai-label"><i class="fas fa-book"></i> Description</div><p>' + escHtml(summary || cleaned.substring(0, 280) + '...') + '</p></div>';
  } else {
    box.innerHTML = '<div class="ai-summary-box"><div class="ai-label"><i class="fas fa-sparkles"></i></div><p style="color:var(--text-muted);">No summary available for this book yet.</p></div>';
  }
}

/* ═══════════════════════════════════════════════
   BOOK MODAL
═══════════════════════════════════════════════ */
function openBookModal(bookData) {
  const modal = document.getElementById('bookModal'), content = document.getElementById('modalContent');
  if (!modal || !content) return;
  modal.classList.remove('hidden');
  const info      = bookData.volumeInfo || {};
  const title     = info.title || 'Unknown Title';
  const authors   = Array.isArray(info.authors) ? info.authors.join(', ') : (info.authors || 'Unknown Author');
  const cover     = info.imageLinks?.thumbnail?.replace('http://', 'https://') || null;
  const desc      = info.description || '';
  const published = info.publishedDate || '—';
  const bookId    = bookData.id || 'ol_' + Math.random().toString(36).substr(2, 8);

  content.innerHTML =
    '<div class="modal-book-layout">' +
      '<div class="modal-book-cover">' +
        (cover ? '<img src="' + cover + '" alt="' + escHtml(title) + '">'
               : '<div class="no-cover-placeholder"><i class="fas fa-book"></i><span>' + escHtml(title) + '</span></div>') +
      '</div>' +
      '<div class="modal-book-info">' +
        '<div class="modal-book-title">'  + escHtml(title)   + '</div>' +
        '<div class="modal-book-author">by ' + escHtml(authors) + '</div>' +
        '<div class="modal-meta">' + (published !== '—' ? '<span class="meta-chip"><i class="fas fa-calendar"></i> ' + published + '</span>' : '') + '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn-primary btn-sm" onclick="addToList(\'' + escAttr(bookId) + '\',\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'' + escAttr(cover || '') + '\')"><i class="fas fa-plus"></i> Add to List</button>' +
          '<button class="btn-ghost btn-sm" onclick="checkAndOpenFree(\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'pdf\')"><i class="fas fa-file-pdf"></i> Free PDF</button>' +
          '<button class="btn-ghost btn-sm" onclick="checkAndOpenFree(\'' + escAttr(title) + '\',\'' + escAttr(authors) + '\',\'read\')"><i class="fas fa-book-open"></i> Read Online</button>' +
          '<button class="btn-ghost btn-sm" onclick="fetchAISummary(\'' + escAttr(bookId) + '\',\'' + escAttr(title) + '\',\'' + escAttr(desc.substring(0, 800)) + '\')"><i class="fas fa-robot"></i> AI Summary</button>' +
        '</div>' +
        '<div id="summaryBox_' + bookId + '"></div>' +
      '</div>' +
    '</div>';
}

/* ═══════════════════════════════════════════════
   READ / DOWNLOAD BOOKS
═══════════════════════════════════════════════ */
async function checkAndOpenFree(title, authors, type) {
  const btn  = event.target.closest('button') || event.target;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
  btn.disabled  = true;
  try {
    // 1. Project Gutenberg
    const gutRes  = await fetch(GUTENBERG_API + '?search=' + encodeURIComponent(title) + '&languages=en');
    const gutData = await gutRes.json();
    if (gutData.results && gutData.results.length > 0) {
      const formats = gutData.results[0].formats || {};
      if (type === 'pdf') {
        const pdfUrl = formats['application/pdf'] || formats['application/pdf; charset=utf-8'];
        if (pdfUrl) { window.open(pdfUrl, '_blank'); showToast('Opening free PDF from Project Gutenberg! 📖', 'success'); return; }
      }
      const htmlUrl = formats['text/html'] || formats['text/html; charset=utf-8'] || formats['text/html; charset=us-ascii'];
      if (htmlUrl) { window.open(htmlUrl, '_blank'); showToast('Opening free online reader! 📚', 'success'); return; }
      const epubUrl = formats['application/epub+zip'];
      if (epubUrl) { window.open(epubUrl, '_blank'); showToast('Opening free EPUB! 📚', 'success'); return; }
    }
    // 2. Open Library
    const olRes  = await fetch('https://openlibrary.org/search.json?title=' + encodeURIComponent(title) + '&limit=3&fields=title,author_name,ia,public_scan_b,key');
    const olData = await olRes.json();
    if (olData.docs && olData.docs.length > 0) {
      for (const doc of olData.docs) {
        if (doc.ia && doc.ia.length > 0 && doc.public_scan_b) {
          const iaId = doc.ia[0];
          const url  = type === 'pdf' ? 'https://archive.org/download/' + iaId + '/' + iaId + '.pdf' : 'https://archive.org/details/' + iaId;
          window.open(url, '_blank');
          showToast(type === 'pdf' ? 'Opening free PDF! 📄' : 'Opening free reader! 📚', 'success'); return;
        }
      }
      if (olData.docs[0].key) { window.open('https://openlibrary.org' + olData.docs[0].key, '_blank'); showToast('Opening on Open Library.', 'info'); return; }
    }
    // 3. Google fallback
    const q = encodeURIComponent('"' + title + '" ' + (authors || ''));
    window.open('https://www.google.com/search?q=' + q + (type === 'pdf' ? '+free+pdf' : '+read+online+free'), '_blank');
    showToast('Searching for a free version online...', 'info');
  } catch (err) {
    const q = encodeURIComponent(title + ' ' + (type === 'pdf' ? 'free pdf' : 'read online free'));
    window.open('https://www.google.com/search?q=' + q, '_blank');
  } finally { btn.innerHTML = orig; btn.disabled = false; }
}

/* ═══════════════════════════════════════════════
   CHATBOT — FULLY FIXED
═══════════════════════════════════════════════ */
let chatHistory = [];
let chatOpen    = false;

function initChat() {
  if (document.getElementById('chatWidget')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="chatWidget" class="chat-widget hidden">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar"><i class="fas fa-robot"></i></div>
          <div>
            <div class="chat-title">Book AI</div>
            <div class="chat-status"><span class="chat-dot"></span> Online</div>
          </div>
        </div>
        <button class="chat-close-btn" onclick="toggleChat()"><i class="fas fa-times"></i></button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg ai">
          <div class="chat-bubble">Hey! 👋 I'm your <strong>Book AI</strong>. Ask me anything — recommendations, summaries, authors, genres, or just tell me your mood and I'll find the perfect book!</div>
        </div>
        <div class="chat-suggestions">
          <button class="chat-chip" onclick="sendQuickMessage('Recommend a good thriller')">🔪 Thrillers</button>
          <button class="chat-chip" onclick="sendQuickMessage('Best books of 2024')">⭐ Best 2024</button>
          <button class="chat-chip" onclick="sendQuickMessage('Books similar to Harry Potter')">🧙 Like HP</button>
          <button class="chat-chip" onclick="sendQuickMessage('Best sci-fi novels ever')">🚀 Sci-Fi</button>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ask about books..." onkeydown="if(event.key==='Enter')sendChatMessage()" />
        <button class="chat-send-btn" onclick="sendChatMessage()"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
    <button class="chat-fab" id="chatFab" onclick="toggleChat()">
      <i class="fas fa-robot"></i>
      <span class="chat-fab-label">Ask AI</span>
    </button>
  `);
}

function toggleChat() {
  chatOpen = !chatOpen;
  const w = document.getElementById('chatWidget');
  const f = document.getElementById('chatFab');
  if (chatOpen) {
    w.classList.remove('hidden');
    setTimeout(() => w.classList.add('chat-open'), 10);
    f.classList.add('fab-active');
    setTimeout(() => { document.getElementById('chatInput')?.focus(); }, 350);
  } else {
    w.classList.remove('chat-open');
    setTimeout(() => w.classList.add('hidden'), 250);
    f.classList.remove('fab-active');
  }
}

function appendChatMessage(role, html) {
  const box = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + role;
  msg.innerHTML = '<div class="chat-bubble">' + html + '</div>';
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function appendTyping() {
  const box = document.getElementById('chatMessages');
  const id  = 'typing_' + Date.now();
  box.insertAdjacentHTML('beforeend',
    '<div class="chat-msg ai" id="' + id + '">' +
      '<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>' +
    '</div>'
  );
  box.scrollTop = box.scrollHeight;
  return id;
}

function sendQuickMessage(msg) {
  const inp = document.getElementById('chatInput');
  if (inp) inp.value = msg;
  sendChatMessage();
}

async function sendChatMessage() {
  const input   = document.getElementById('chatInput');
  const userMsg = input?.value?.trim();
  if (!userMsg) return;
  input.value = '';

  appendChatMessage('user', escHtml(userMsg));

  // Add to history
  chatHistory.push({ role: 'user', content: userMsg });

  // Keep last 10 exchanges (20 messages) to avoid token limit
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

  const typingId = appendTyping();

  try {
    const sys = `You are Book AI — a friendly, enthusiastic, and knowledgeable book expert.
You talk like a smart friend who genuinely loves books.
Use simple, clear English that anyone can understand.
When recommending books: give 3-4 suggestions. Format each as:
**Book Title** by Author — one sentence explaining why they will love it.
Keep all responses under 200 words. Be warm, encouraging, and specific.
Remember the conversation context and refer back to what the user said earlier.`;

    // Send full conversation history for context
    const reply = await callAI(sys, chatHistory, 500);

    document.getElementById(typingId)?.remove();

    if (reply && reply.trim().length > 5) {
      // Add assistant reply to history
      chatHistory.push({ role: 'assistant', content: reply });

      // Format bold text and line breaks
      const formatted = escHtml(reply)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      appendChatMessage('ai', formatted);
    } else {
      throw new Error('Empty response');
    }

  } catch (err) {
    console.warn('Chat error:', err);
    document.getElementById(typingId)?.remove();
    appendChatMessage('ai', '📚 Sorry, I had a quick hiccup! Please ask me again — I\'m here to help you find your next great read!');
  }
}

document.addEventListener('DOMContentLoaded', initChat);

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escAttr(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}
