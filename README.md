# 📚 BookWise — AI-Powered Book Recommendation System

**Final Year Project** | Asmat Ullah (BSCSM-22-50)  
**University:** Bahauddin Zakariya University, Multan  
**Supervisor:** Dr. Muzaffar Hameed  
**Program:** BS(CS) Morning | Session 2022–2026

---

## 🎯 Project Overview

BookWise is an AI-powered web application that helps users discover books based on their interests. It combines the Google Books API for book data with OpenAI's ChatGPT for personalised recommendations and AI-generated summaries.

### ✨ Features
- 🔍 **Search Books** — Search by title, author, or ISBN (Google Books API)
- 🤖 **AI Recommendations** — Get personalised picks based on your reading preferences
- 📝 **AI Summaries** — Generate a concise AI summary of any book
- 📚 **Reading List** — Save books and track status (To Read / Reading / Completed)
- ⭐ **Star Ratings** — Rate books 1–5 stars
- 🔐 **User Authentication** — Firebase email/password login & registration
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🛠️ Technology Stack

| Layer           | Technology                              |
|----------------|-----------------------------------------|
| Frontend        | HTML5, CSS3, Vanilla JavaScript         |
| Styling         | Custom CSS (Dark Library Aesthetic)     |
| Fonts           | Playfair Display + DM Sans (Google Fonts) |
| Authentication  | Firebase Authentication                 |
| Database        | Firebase Firestore                      |
| Book Data API   | Google Books API                        |
| AI Engine       | OpenAI GPT-3.5-Turbo                    |
| Deployment      | Firebase Hosting / Netlify              |

---

## ⚡ Quick Setup

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project: **bookwise-fyp**
3. Enable **Authentication** → Sign-in method → Email/Password ✅
4. Enable **Firestore Database** → Start in test mode
5. Go to **Project Settings** → **Your apps** → Add Web App
6. Copy the `firebaseConfig` object

### 2. OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy it

### 3. Configure the Project
Open `js/config.js` and replace:
```javascript
const firebaseConfig = {
  apiKey:            "YOUR_FIREBASE_API_KEY",  // ← paste here
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";  // ← paste here
```

### 4. Run Locally
```bash
# Option A — Open directly in browser (simplest)
open index.html

# Option B — Firebase local server
npm install -g firebase-tools
firebase login
firebase serve

# Option C — Live Server (VS Code extension)
# Right-click index.html → Open with Live Server
```

### 5. Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 📁 Project Structure

```
bookwise/
├── index.html              # Main HTML page
├── css/
│   └── style.css           # All styles (dark library theme)
├── js/
│   ├── config.js           # 🔑 API keys & Firebase init (configure this!)
│   ├── app.js              # App entry point (loader, navbar)
│   ├── auth.js             # Firebase Authentication
│   ├── books.js            # Google Books API + book cards
│   ├── ai.js               # OpenAI recommendations & summaries
│   ├── readinglist.js      # Firestore reading list CRUD
│   └── ui.js               # Shared UI helpers (toast, escaping)
├── firebase.json           # Firebase hosting & emulator config
├── firestore.rules         # Firestore security rules
├── package.json            # Project metadata
└── README.md               # This file
```

---

## 🔐 Security Notes

> ⚠️ **For FYP / Academic Use Only**  
> The OpenAI API key is stored client-side. For a production system, move all API calls to a backend (Firebase Cloud Functions, Node.js, etc.) to protect your keys.

---

## 👨‍💻 Developer

**Asmat Ullah**  
Roll No: BSCSM-22-50  
Email: mr.asmat.com@gmail.com  
Cell: +92 308 8443686  
BZU Multan — BS Computer Science (Morning) 2022–2026
