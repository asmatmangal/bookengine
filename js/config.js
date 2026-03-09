/**
 * ══════════════════════════════════════════════════════════
 *  BookWise — Configuration File
 *  FYP: Asmat Ullah (BSCSM-22-50) | BZU Multan
 * ══════════════════════════════════════════════════════════
 */

// ── Firebase Configuration ──────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyApjb80nXsecv2wvkuHX5Nz4NizzxDCwYo",
  authDomain:        "book-recommendation-26f0d.firebaseapp.com",
  projectId:         "book-recommendation-26f0d",
  storageBucket:     "book-recommendation-26f0d.firebasestorage.app",
  messagingSenderId: "996487192764",
  appId:             "1:996487192764:web:7c69f5b5e24c4d49f6b0b9"
};

// ── Groq API (Fast & Free) ───────────────────────────────
const GROQ_API_KEY  = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL    = "llama-3.3-70b-versatile";

// ── Google Books API ─────────────────────────────────────
const GOOGLE_BOOKS_API_KEY = "AIzaSyC_j7HmQGkOL46-FmV6JrK7wj0Q_Y9xjqw";
const GOOGLE_BOOKS_BASE    = "https://www.googleapis.com/books/v1/volumes";

// ── Open Library API (FREE BACKUP) ──────────────────────
const OPEN_LIBRARY_API = "https://openlibrary.org/api/search.json";

// ── App Settings ─────────────────────────────────────────
const APP_CONFIG = {
  searchResultsLimit:     12,
  aiRecommendationsCount: 6,
};

// ── Initialise Firebase ──────────────────────────────────
try {
  firebase.initializeApp(firebaseConfig);
  console.info("%c📚 BookWise ready — Groq AI active", "color:#c9a84c;font-weight:bold");
} catch (e) {
  console.warn("Firebase init skipped:", e.message);
}

const db   = firebase.firestore();
const auth = firebase.auth();
