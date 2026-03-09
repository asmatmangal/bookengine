/**
 * BookWise — AI Module
 * Groq AI (llama-3.3-70b-versatile)
 * - Chat interface
 * - Book recommendations
 * - Book summaries
 */
'use strict';

/* ── Fallback database ──────────────────────────────────── */
const BOOK_DATABASE = {
  nature:    [
    { title: 'The Hidden Life of Trees',       author: 'Peter Wohlleben',   genre: 'Nature',    reason: 'A fascinating look at how trees communicate and support each other in forests.' },
    { title: 'Braiding Sweetgrass',             author: 'Robin Wall Kimmerer', genre: 'Nature', reason: 'Beautiful mix of science and indigenous wisdom about plants and the natural world.' },
    { title: 'The Overstory',                   author: 'Richard Powers',    genre: 'Nature',    reason: 'A powerful novel about people whose lives are changed by trees.' },
    { title: 'Silent Spring',                   author: 'Rachel Carson',     genre: 'Nature',    reason: 'The book that started the environmental movement — still hugely relevant today.' },
    { title: 'H is for Hawk',                   author: 'Helen Macdonald',   genre: 'Nature',    reason: 'A moving story about grief and the wild world of training a goshawk.' },
    { title: 'The Wild Remedy',                 author: 'Emma Mitchell',     genre: 'Nature',    reason: 'A diary of how nature heals the mind — honest, warm, and beautifully illustrated.' }
  ],
  thriller:  [
    { title: 'Gone Girl',                       author: 'Gillian Flynn',     genre: 'Thriller',  reason: 'Two unreliable narrators, shocking twists, and an ending you will not see coming.' },
    { title: 'The Girl on the Train',           author: 'Paula Hawkins',     genre: 'Thriller',  reason: 'A woman sees something she should not have from her train window — and nothing is safe.' },
    { title: 'The Silent Patient',              author: 'Alex Michaelides',  genre: 'Thriller',  reason: 'A famous painter shoots her husband then never speaks again. A therapist is obsessed with finding out why.' },
    { title: 'Big Little Lies',                 author: 'Liane Moriarty',    genre: 'Thriller',  reason: 'Three women, one murder, and secrets that have been buried for years.' },
    { title: 'Sharp Objects',                   author: 'Gillian Flynn',     genre: 'Thriller',  reason: 'Dark, creepy, and impossible to put down — a journalist goes home and finds old wounds.' },
    { title: 'The Woman in the Window',         author: 'A.J. Finn',         genre: 'Thriller',  reason: 'A woman stuck in her house thinks she witnesses a crime — but did she really?' }
  ],
  history:   [
    { title: 'Sapiens',                         author: 'Yuval Noah Harari', genre: 'History',   reason: 'The story of all of us — how humans went from nothing to ruling the planet. Easy to read and mind-blowing.' },
    { title: 'The Book Thief',                  author: 'Markus Zusak',      genre: 'History',   reason: 'A girl in Nazi Germany who steals books. Narrated by Death. Absolutely beautiful.' },
    { title: 'All the Light We Cannot See',     author: 'Anthony Doerr',     genre: 'History',   reason: 'Two kids on opposite sides of WWII — a blind French girl and a German soldier. Stunning writing.' },
    { title: 'The Nightingale',                 author: 'Kristin Hannah',    genre: 'History',   reason: 'Two sisters surviving German-occupied France. One of the most emotional books you will ever read.' },
    { title: 'Guns Germs and Steel',            author: 'Jared Diamond',     genre: 'History',   reason: 'Why did some civilizations conquer others? This book gives a surprising, science-based answer.' },
    { title: 'The Diary of a Young Girl',       author: 'Anne Frank',        genre: 'History',   reason: 'Real diary of a Jewish girl hiding from the Nazis. Simple, honest, and impossible to forget.' }
  ],
  space:     [
    { title: 'A Brief History of Time',         author: 'Stephen Hawking',   genre: 'Space',     reason: 'The universe explained by the greatest mind of our time — surprisingly easy to follow.' },
    { title: 'The Martian',                     author: 'Andy Weir',         genre: 'Space',     reason: 'An astronaut is left alone on Mars and has to survive using science. Funny and thrilling at the same time.' },
    { title: 'Cosmos',                          author: 'Carl Sagan',        genre: 'Space',     reason: 'Carl Sagan makes you feel the wonder of the universe in a way no one else can.' },
    { title: 'Project Hail Mary',               author: 'Andy Weir',         genre: 'Space',     reason: 'A man wakes up alone in space with no memory and has to save Earth. Impossible to put down.' },
    { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', genre: 'Space', reason: 'Everything you need to know about space in short, simple chapters. Perfect for beginners.' },
    { title: 'The Right Stuff',                 author: 'Tom Wolfe',         genre: 'Space',     reason: 'The true story of the first American astronauts — brave, funny, and full of heart.' }
  ],
  crime:     [
    { title: 'In Cold Blood',                   author: 'Truman Capote',     genre: 'Crime',     reason: 'The true story of a brutal murder in small-town America. Reads like a novel but every word is real.' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson',     genre: 'Crime',     reason: 'A missing girl, a journalist, and a hacker team up to solve a decades-old mystery. Gripping from page one.' },
    { title: 'And Then There Were None',        author: 'Agatha Christie',   genre: 'Crime',     reason: 'Ten strangers on an island, one by one they die. The greatest murder mystery ever written.' },
    { title: 'I Am Pilgrim',                    author: 'Terry Hayes',       genre: 'Crime',     reason: 'A spy has to stop a bioterrorist before millions die. Fast, clever, and terrifying.' },
    { title: 'The No.1 Ladies Detective Agency',author: 'Alexander McCall Smith', genre: 'Crime', reason: 'A woman in Botswana starts a detective agency. Warm, funny, and completely charming.' },
    { title: 'Mindhunter',                      author: 'John Douglas',      genre: 'Crime',     reason: 'The real FBI agent who invented criminal profiling tells his story. Fascinating and chilling.' }
  ],
  selfcare:  [
    { title: 'The Body Keeps the Score',        author: 'Bessel van der Kolk', genre: 'Self Care', reason: 'How trauma lives in the body and how to heal it. Life-changing for many readers.' },
    { title: 'Atomic Habits',                   author: 'James Clear',       genre: 'Self Care', reason: 'Small changes, big results. The most practical book on building better habits ever written.' },
    { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson',  genre: 'Self Care', reason: 'Honest and funny advice about what actually matters in life. Refreshingly blunt.' },
    { title: 'Untamed',                         author: 'Glennon Doyle',     genre: 'Self Care', reason: 'A woman breaks free from everything she was supposed to be. Raw, honest, and inspiring.' },
    { title: 'When Breath Becomes Air',         author: 'Paul Kalanithi',    genre: 'Self Care', reason: 'A dying doctor writes about what makes life worth living. Heartbreaking and beautiful.' },
    { title: 'The Power of Now',                author: 'Eckhart Tolle',     genre: 'Self Care', reason: 'How to stop living in your head and start living in the present moment. Simple but profound.' }
  ],
  tech:      [
    { title: 'The Innovators',                  author: 'Walter Isaacson',   genre: 'Tech',      reason: 'The real story of how the computer and internet were invented — full of fascinating people.' },
    { title: 'Zero to One',                     author: 'Peter Thiel',       genre: 'Tech',      reason: 'How to build a startup that creates something completely new. Short and packed with ideas.' },
    { title: 'The Lean Startup',                author: 'Eric Ries',         genre: 'Tech',      reason: 'How modern tech companies build products people actually want. Changed how startups work.' },
    { title: 'Thinking Fast and Slow',          author: 'Daniel Kahneman',   genre: 'Tech',      reason: 'How your brain actually makes decisions — and how it tricks you. Brilliant and practical.' },
    { title: 'Superintelligence',               author: 'Nick Bostrom',      genre: 'Tech',      reason: 'What happens when AI becomes smarter than humans? A serious and important book about our future.' },
    { title: 'The Age of Surveillance Capitalism', author: 'Shoshana Zuboff', genre: 'Tech',     reason: 'How tech companies profit from your data and what it means for your freedom.' }
  ],
  wilderness:[ 
    { title: 'Wild',                            author: 'Cheryl Strayed',    genre: 'Wilderness', reason: 'A woman hikes 1,100 miles alone to put her broken life back together. Raw and inspiring.' },
    { title: 'Into the Wild',                   author: 'Jon Krakauer',      genre: 'Wilderness', reason: 'A young man gives up everything to live alone in the Alaskan wilderness. True story.' },
    { title: 'A Walk in the Woods',             author: 'Bill Bryson',       genre: 'Wilderness', reason: 'Funny, warm, and full of facts — two middle-aged men try to hike the Appalachian Trail.' },
    { title: 'The Call of the Wild',            author: 'Jack London',       genre: 'Wilderness', reason: 'A dog is taken to Alaska during the Gold Rush. A short classic that hits like a sledgehammer.' },
    { title: 'Touching the Void',               author: 'Joe Simpson',       genre: 'Wilderness', reason: 'Two climbers, one terrible accident in the Andes. One of the greatest survival stories ever told.' },
    { title: 'My Side of the Mountain',         author: 'Jean Craighead George', genre: 'Wilderness', reason: 'A boy runs away to live alone in the Catskill Mountains. Perfect for anyone who loves nature.' }
  ]
};

/* ═══════════════════════════════════════════════════════════
   GROQ API HELPER
═══════════════════════════════════════════════════════════ */
async function callGroq(systemPrompt, userPrompt, maxTokens = 1024) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      temperature: 0.75,
      max_tokens:  maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   }
      ]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

/* ═══════════════════════════════════════════════════════════
   AI CHAT INTERFACE
═══════════════════════════════════════════════════════════ */
let chatHistory = [];
let chatOpen    = false;

function initChat() {
  // Inject chat HTML once
  if (document.getElementById('chatWidget')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="chatWidget" class="chat-widget hidden">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar"><i class="fas fa-robot"></i></div>
          <div>
            <div class="chat-title">BookWise AI</div>
            <div class="chat-status"><span class="chat-dot"></span> Online</div>
          </div>
        </div>
        <button class="chat-close-btn" onclick="toggleChat()"><i class="fas fa-times"></i></button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg ai">
          <div class="chat-bubble">
            Hey! 👋 I'm your BookWise AI. Tell me what kind of books you're in the mood for and I'll find the perfect ones for you. You can also ask me anything about a specific book!
          </div>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ask me anything about books..." onkeydown="if(event.key==='Enter')sendChatMessage()" />
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
  const widget = document.getElementById('chatWidget');
  const fab    = document.getElementById('chatFab');
  if (chatOpen) {
    widget.classList.remove('hidden');
    widget.classList.add('chat-open');
    fab.classList.add('fab-active');
    setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
  } else {
    widget.classList.remove('chat-open');
    widget.classList.add('hidden');
    fab.classList.remove('fab-active');
  }
}

function appendChatMessage(role, text) {
  const box = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;
  msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function appendChatTyping() {
  const box = document.getElementById('chatMessages');
  const id  = 'typing_' + Date.now();
  box.insertAdjacentHTML('beforeend', `
    <div class="chat-msg ai" id="${id}">
      <div class="chat-bubble chat-typing">
        <span></span><span></span><span></span>
      </div>
    </div>`);
  box.scrollTop = box.scrollHeight;
  return id;
}

async function sendChatMessage() {
  const input   = document.getElementById('chatInput');
  const userMsg = input?.value.trim();
  if (!userMsg) return;

  input.value = '';
  appendChatMessage('user', escHtml(userMsg));

  // Add to history
  chatHistory.push({ role: 'user', content: userMsg });

  const typingId = appendChatTyping();

  try {
    const systemPrompt = `You are BookWise AI — a friendly, knowledgeable book expert. 
You talk like a smart friend who loves books, not like a professor.
Use simple, clear English that anyone can understand. Short sentences. Warm tone.
When recommending books, be enthusiastic and explain WHY someone would love it in 1-2 simple sentences.
If someone asks for recommendations, give 3-5 books with a short reason for each.
Format book recommendations like this: **Book Title** by Author — reason why.
Never use complicated vocabulary. Never be robotic. Always be warm and helpful.
Keep responses concise — no long walls of text.`;

    // Build messages with history (last 6 turns max)
    const recentHistory = chatHistory.slice(-12);
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.8,
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentHistory
        ]
      })
    });

    const data    = await res.json();
    const aiReply = data?.choices?.[0]?.message?.content || 'Sorry, I had trouble with that. Try again!';

    // Add AI reply to history
    chatHistory.push({ role: 'assistant', content: aiReply });

    // Remove typing indicator
    document.getElementById(typingId)?.remove();

    // Format the reply — convert **bold** to <strong> and newlines to <br>
    const formatted = escHtml(aiReply)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    appendChatMessage('ai', formatted);

  } catch (err) {
    document.getElementById(typingId)?.remove();
    appendChatMessage('ai', 'Oops! Something went wrong. Check your connection and try again.');
    console.error('Chat error:', err);
  }
}

// Init chat on page load
document.addEventListener('DOMContentLoaded', initChat);

/* ═══════════════════════════════════════════════════════════
   AI RECOMMENDATIONS
═══════════════════════════════════════════════════════════ */
async function getAIRecommendations() {
  const prefs = document.getElementById('prefInput').value.trim();
  if (!prefs) return showToast('Please describe what kind of books you enjoy.', 'warning');

  const grid = document.getElementById('aiResults');
  showGridLoading(grid, 'AI is finding your perfect books...');

  const systemPrompt = `You are a friendly book expert. Talk like a warm, enthusiastic friend who loves books.
Use simple English — short sentences, everyday words, no complicated vocabulary.
Your job: recommend exactly 6 real books that match what the user describes.
Return ONLY a raw JSON array. No markdown, no backticks, no explanation before or after.
Each object: {"title":"...","author":"...","genre":"...","reason":"one simple sentence why they will love it"}`;

  const userPrompt = `The user said: "${prefs}"
Recommend 6 books that perfectly match this. JSON array only:`;

  try {
    const rawText     = await callGroq(systemPrompt, userPrompt, 1200);
    const recommended = parseRecommendations(rawText);
    if (!recommended || recommended.length === 0) throw new Error('Parse failed');
    renderAIRecommendations(recommended, grid);
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  } catch (err) {
    console.error('AI Recommendations error:', err);
    const genre    = detectGenre(prefs);
    const fallback = [...(BOOK_DATABASE[genre] || BOOK_DATABASE.thriller)]
      .sort(() => 0.5 - Math.random()).slice(0, 6);
    renderAIRecommendations(fallback, grid);
    showToast('Showing curated picks (AI unavailable).', 'warning');
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  }
}

function detectGenre(prefs) {
  const t = prefs.toLowerCase();
  if (t.match(/nature|wildlife|forest|plant|ecology|environment/)) return 'nature';
  if (t.match(/space|star|planet|cosmos|astronomy|galaxy|nasa/))   return 'space';
  if (t.match(/history|war|wwii|ancient|medieval|civilization/))   return 'history';
  if (t.match(/crime|detective|murder|noir|investigation/))        return 'crime';
  if (t.match(/self|wellness|mindful|mental|heal|habit|growth/))   return 'selfcare';
  if (t.match(/tech|ai|code|startup|digital|software|computer/))   return 'tech';
  if (t.match(/wild|survival|outdoor|mountain|adventure|hike/))    return 'wilderness';
  if (t.match(/thrill|suspense|danger|horror|scary|psychological/)) return 'thriller';
  return 'thriller';
}

function parseRecommendations(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/```json|```/gi, '').trim();
  try {
    const p = JSON.parse(cleaned);
    return Array.isArray(p) ? p : null;
  } catch {
    const m = cleaned.match(/\[[\s\S]*\]/);
    if (m) { try { const p = JSON.parse(m[0]); return Array.isArray(p) ? p : null; } catch {} }
    return null;
  }
}

function renderAIRecommendations(recs, container) {
  container.innerHTML = '';
  recs.forEach((rec, i) => {
    const safeId = escAttr(rec.title.replace(/\s+/g,'_').toLowerCase().substring(0,40));
    const card   = document.createElement('div');
    card.className         = 'ai-rec-card';
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="ai-rec-genre"><i class="fas fa-tag"></i> ${escHtml(rec.genre || 'Fiction')}</div>
      <div class="ai-rec-title">${escHtml(rec.title)}</div>
      <div class="ai-rec-author">by ${escHtml(rec.author)}</div>
      <div class="ai-rec-reason">${escHtml(rec.reason || 'Recommended based on your preferences.')}</div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn-primary btn-sm" onclick="searchForBook('${escAttr(rec.title)}')">
          <i class="fas fa-search"></i> Find Book
        </button>
        <button class="btn-ghost btn-sm" onclick="addToList('ai_${safeId}','${escAttr(rec.title)}','${escAttr(rec.author)}','')">
          <i class="fas fa-plus"></i> Add to List
        </button>
      </div>`;
    container.appendChild(card);
  });
  showToast(`${recs.length} AI recommendations ready!`, 'success');
}

function searchForBook(title) {
  document.getElementById('searchInput').value = title;
  document.querySelector('input[name="searchType"][value="intitle"]').checked = true;
  smoothScrollTo('#search');
  setTimeout(searchBooks, 600);
}

/* ═══════════════════════════════════════════════════════════
   AI BOOK SUMMARY — simple English, friendly tone
═══════════════════════════════════════════════════════════ */
async function fetchAISummary(bookId, title, description) {
  const box = document.getElementById(`summaryBox_${bookId}`);
  if (!box) return;

  box.innerHTML = `
    <div class="ai-summary-box">
      <div class="ai-label"><i class="fas fa-robot"></i> AI Summary</div>
      <div class="spinner" style="width:20px;height:20px;margin:10px auto;border-width:2px"></div>
    </div>`;

  const systemPrompt = `You are a friendly book reviewer. 
Write in very simple, clear English — like you're telling a friend about a book.
Short sentences. Everyday words. No complicated vocabulary.
Be enthusiastic and make the person want to read it.
Maximum 4 sentences. Always in English.`;

  const userPrompt = `Write a short, simple, friendly summary of the book "${title}".
${description ? `Here is some info about it: ${description}` : ''}
Make it sound exciting. Simple English only. 3-4 sentences max.`;

  try {
    const summary = await callGroq(systemPrompt, userPrompt, 250);
    box.innerHTML = `
      <div class="ai-summary-box">
        <div class="ai-label"><i class="fas fa-robot"></i> AI Summary</div>
        <p>${escHtml(summary.trim())}</p>
      </div>`;
  } catch (err) {
    console.error('AI Summary error:', err);
    box.innerHTML = `
      <div class="ai-summary-box">
        <div class="ai-label"><i class="fas fa-robot"></i> AI Summary</div>
        <p style="color:var(--text-dim);">Could not generate summary right now. Please try again.</p>
      </div>`;
  }
}

/* ═══════════════════════════════════════════════════════════
   PDF / READ ONLINE — check availability first
═══════════════════════════════════════════════════════════ */
async function checkAndOpenFree(title, author, type) {
  const btn = event.target.closest('button') || event.target;
  const origHTML = btn.innerHTML;
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Checking...';
  btn.disabled   = true;

  try {
    // Check Open Library for free availability
    const query = encodeURIComponent(title + ' ' + author);
    const res   = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=3&fields=title,author_name,ia,public_scan_b,lending_edition_s`);
    const data  = await res.json();

    const match = data.docs?.find(book => {
      const t = (book.title || '').toLowerCase();
      return t.includes(title.toLowerCase().substring(0, 15));
    });

    btn.innerHTML = origHTML;
    btn.disabled  = false;

    if (type === 'pdf') {
      if (match?.ia && match?.public_scan_b) {
        // Has a free public domain scan
        window.open(`https://archive.org/details/${match.ia[0]}`, '_blank');
      } else if (match?.ia) {
        // Available on Internet Archive but may need borrow
        window.open(`https://openlibrary.org/works/${match.lending_edition_s || ''}/borrow`, '_blank');
        showToast('Redirecting — this book may need a free account to borrow.', 'info');
      } else {
        // Not freely available
        showUnavailableToast(title, 'pdf');
      }
    } else {
      // Read online
      if (match?.ia && match?.public_scan_b) {
        window.open(`https://archive.org/stream/${match.ia[0]}`, '_blank');
      } else if (match?.lending_edition_s) {
        window.open(`https://openlibrary.org/books/${match.lending_edition_s}`, '_blank');
        showToast('Redirecting to Open Library — free account needed to read online.', 'info');
      } else {
        showUnavailableToast(title, 'read');
      }
    }
  } catch (err) {
    btn.innerHTML = origHTML;
    btn.disabled  = false;
    // Fallback — go directly to search
    if (type === 'pdf') {
      window.open(`https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(title)}`, '_blank');
    } else {
      window.open(`https://openlibrary.org/search?q=${encodeURIComponent(title)}&has_fulltext=true`, '_blank');
    }
  }
}

function showUnavailableToast(title, type) {
  const msg = type === 'pdf'
    ? `Oops! "${title}" is not available as a free PDF. It may be protected by copyright.`
    : `Oops! "${title}" is not available to read online for free due to copyright restrictions.`;

  // Show as a bigger toast
  const wrap = document.getElementById('toast');
  const t    = document.createElement('div');
  t.className = 'toast warning';
  t.style.maxWidth = '380px';
  t.innerHTML = `
    <i class="fas fa-lock"></i>
    <div>
      <strong style="display:block;margin-bottom:4px;">Not Available for Free</strong>
      <span style="font-size:0.8rem;">${escHtml(msg)}</span>
    </div>`;
  wrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(40px)';
    t.style.transition = '0.4s ease';
    setTimeout(() => t.remove(), 400);
  }, 5000);
}
