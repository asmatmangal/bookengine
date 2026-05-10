/**
 * Book Engine — Info Modals & Contact
 * About, Contact, Community, Terms, Privacy
 */
'use strict';

var INFO_CONTENT = {

  about: {
    title: 'About Book Engine',
    icon: 'fa-book-open',
    html: function() {
      return '<div class="about-hero">' +
        '<p>Book Engine is a specialized <strong>AI-Driven Book Discovery Platform</strong> designed to help you find the perfect book every time. ' +
        'Unlike standard search algorithms that only match keywords, Book Engine uses <strong>AI Intent Analysis</strong> to understand what you truly want to read. ' +
        'Our platform combines the power of advanced AI with verified metadata from the Google Books API to ensure every suggestion is real, accurate, and meaningful. ' +
        'Whether you are looking for a gripping thriller, a life-changing self-help book, or a deep dive into history — Book Engine finds it for you.</p>' +
        '</div>' +
        '<h4>Our Features</h4>' +
        '<div class="about-features">' +
          '<div class="about-feature"><i class="fas fa-search"></i><span>Search 40M+ books by title, author or ISBN</span></div>' +
          '<div class="about-feature"><i class="fas fa-robot"></i><span>AI recommendations via Deep Intent Analysis</span></div>' +
          '<div class="about-feature"><i class="fas fa-layer-group"></i><span>8 curated genre categories with full-image browse</span></div>' +
          '<div class="about-feature"><i class="fas fa-bookmark"></i><span>Personal reading list with progress tracking</span></div>' +
          '<div class="about-feature"><i class="fas fa-comments"></i><span>Full AI chat for book discovery and advice</span></div>' +
          '<div class="about-feature"><i class="fas fa-file-alt"></i><span>AI-powered book summaries in simple English</span></div>' +
        '</div>' +
        '<h4>Our Mission</h4>' +
        '<p>We believe every reader deserves a smarter, more personal way to discover books. Book Engine was built to make that possible — free, fast, and powered by the latest AI technology.</p>' +
        '<h4>The Developer</h4>' +
        '<div class="contact-info-box">' +
          '<p><i class="fas fa-user"></i> <strong>Asmat Ullah</strong> — Lead AI Developer</p>' +
          '<p><i class="fas fa-envelope"></i> mr.asmat.com@gmail.com</p>' +
          '<p><i class="fas fa-phone"></i> 03088443686</p>' +
          '<p><i class="fas fa-university"></i> Bahauddin Zakariya University, Multan</p>' +
        '</div>';
    }
  },

  contact: {
    title: 'Contact Us',
    icon: 'fa-envelope',
    html: function() {
      return '<p>Have a question, suggestion, or need help? We would love to hear from you. Reach out directly or use the form below.</p>' +
        '<div class="contact-info-box">' +
          '<p><i class="fas fa-user"></i> <strong>Asmat Ullah</strong> — Lead Developer</p>' +
          '<p><i class="fas fa-envelope"></i> <strong>Email:</strong> <a href="mailto:mr.asmat.com@gmail.com" style="color:var(--gold)">mr.asmat.com@gmail.com</a></p>' +
          '<p><i class="fas fa-phone"></i> <strong>Phone / WhatsApp:</strong> <a href="tel:03088443686" style="color:var(--gold)">03088443686</a></p>' +
          '<p><i class="fas fa-clock"></i> <strong>Response time:</strong> Usually within 24 hours</p>' +
        '</div>' +
        '<h4>Send a Message</h4>' +
        '<div class="form-group"><label>Your Name</label><input type="text" id="contactName" placeholder="Your full name" /></div>' +
        '<div class="form-group"><label>Your Email</label><input type="email" id="contactEmail" placeholder="your@email.com" /></div>' +
        '<div class="form-group"><label>Subject</label><input type="text" id="contactSubject" placeholder="e.g. Feedback, Bug report, Collaboration..." /></div>' +
        '<div class="form-group"><label>Message</label><textarea id="contactMsg" rows="4" style="width:100%;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);padding:12px;font-size:0.88rem;resize:vertical;outline:none;margin-top:2px;" placeholder="Write your message here..."></textarea></div>' +
        '<button class="btn-primary full-width" onclick="submitContact()"><i class="fas fa-paper-plane"></i> Send Message</button>';
    }
  },

  community: {
    title: 'Community Guidelines',
    icon: 'fa-users',
    html: function() {
      return '<p>Book Engine is a place for <strong>readers, learners, and book lovers</strong>. To keep our community positive and helpful for everyone, we ask all users to follow these simple standards.</p>' +
        '<div class="about-features">' +
          '<div class="about-feature"><i class="fas fa-bullseye"></i><span>Be specific and clear in your searches</span></div>' +
          '<div class="about-feature"><i class="fas fa-heart"></i><span>Be respectful and kind</span></div>' +
          '<div class="about-feature"><i class="fas fa-ban"></i><span>No spam or automated queries</span></div>' +
          '<div class="about-feature"><i class="fas fa-comment-dots"></i><span>Give honest and constructive feedback</span></div>' +
        '</div>' +
        '<h4>1. Be Specific</h4>' +
        '<p>Use <strong>clear, descriptive language</strong> when asking the AI for recommendations. The more specific you are, the better your results. Instead of "good book", try "a non-fiction book about climate change written for general readers".</p>' +
        '<h4>2. Respect the Platform</h4>' +
        '<p>Book Engine is designed for <strong>discovering and enjoying books</strong>. Please use it for its intended purpose — finding great reads, tracking your reading journey, and exploring new genres.</p>' +
        '<h4>3. No Spam or Abuse</h4>' +
        '<p>Avoid <strong>repetitive, automated, or abusive queries</strong>. Each request uses real API resources — please use them thoughtfully. Spamming the platform may result in temporary access restrictions.</p>' +
        '<h4>4. Honest Feedback</h4>' +
        '<p>Found an incorrect recommendation or a bug? We welcome your honest feedback. Use the Contact form to report issues — your input directly helps us improve Book Engine for all users.</p>' +
        '<h4>5. Respect Copyright</h4>' +
        '<p>Only use the Free PDF and Read Online features for books that are <strong>legally and freely available</strong>. Do not seek or share pirated or unauthorized content through this platform.</p>' +
        '<h4>6. Be Kind</h4>' +
        '<p>Whether you are interacting with the AI chat or leaving feedback, please be respectful. Everyone deserves a safe, welcoming space to discover the joy of reading.</p>' +
        '<h4>Enforcement</h4>' +
        '<p>Violations of these guidelines may result in account suspension. For any questions or concerns, contact us at <a href="mailto:mr.asmat.com@gmail.com" style="color:var(--gold)">mr.asmat.com@gmail.com</a> or call <a href="tel:03088443686" style="color:var(--gold)">03088443686</a>.</p>';
    }
  },

  terms: {
    title: 'Terms & Conditions',
    icon: 'fa-file-contract',
    html: function() {
      return '<p class="info-date"><i class="fas fa-calendar"></i> Last updated: April 2026</p>' +
        '<p>By using Book Engine, you agree to the following terms. Please read them carefully before using our platform.</p>' +
        '<h4>1. Acceptance of Terms</h4>' +
        '<p>By accessing or using Book Engine, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.</p>' +
        '<h4>2. Use of the Platform</h4>' +
        '<p>Book Engine is provided for <strong>personal, educational, and non-commercial use only.</strong> You may not use Book Engine for commercial purposes, automated data harvesting, reselling of results, or any unlawful activity.</p>' +
        '<h4>3. AI-Generated Content</h4>' +
        '<p>Book Engine uses AI technology to generate recommendations and summaries. While we strive for accuracy, <strong>AI-generated content is for informational and descriptive purposes only</strong> and may not always reflect the exact content of a book. Always refer to the original source for accuracy.</p>' +
        '<h4>4. User Accounts</h4>' +
        '<p>You are responsible for keeping your login credentials secure. Book Engine is not liable for unauthorized access resulting from your failure to protect your account details. You may delete your account at any time by contacting us.</p>' +
        '<h4>5. Service Availability</h4>' +
        '<p>We reserve the right to <strong>modify, suspend, or discontinue</strong> any part of the platform at any time, with or without notice. We are not liable for any interruptions to the service.</p>' +
        '<h4>6. Third-Party Services</h4>' +
        '<p>Book Engine uses third-party services including Google Books API and Anthropic AI. Results from these services are subject to their own terms and conditions. We are not responsible for the accuracy of third-party content.</p>' +
        '<h4>7. Intellectual Property</h4>' +
        '<p>All book metadata, covers, and descriptions displayed on Book Engine belong to their respective publishers and rights holders. Book Engine does not claim ownership of any book content shown on this platform.</p>' +
        '<h4>8. Limitation of Liability</h4>' +
        '<p>The service is provided "as is." We make no guarantees about uptime, accuracy of AI suggestions, or availability of free reading links. Book Engine is not liable for any damages resulting from use of the platform.</p>' +
        '<h4>9. Changes to Terms</h4>' +
        '<p>We may update these Terms at any time. Continued use of Book Engine after changes are posted means you accept the updated Terms. The date at the top of this page shows when the Terms were last updated.</p>' +
        '<h4>10. Contact</h4>' +
        '<p>For any questions about these Terms, contact us at <a href="mailto:mr.asmat.com@gmail.com" style="color:var(--gold)">mr.asmat.com@gmail.com</a> or <a href="tel:03088443686" style="color:var(--gold)">03088443686</a>.</p>';
    }
  },

  privacy: {
    title: 'Privacy Policy',
    icon: 'fa-shield-halved',
    html: function() {
      return '<p class="info-date"><i class="fas fa-calendar"></i> Last updated: April 2026</p>' +
        '<p>Your privacy matters to us. This Privacy Policy explains exactly what data Book Engine collects, how it is used, and how it is protected.</p>' +
        '<h4>1. What We Collect</h4>' +
        '<p>We <strong>do not collect personal identity information</strong> from anonymous users. If you create an account, we store your email address and a securely hashed password via Firebase Authentication — we never see your raw password.</p>' +
        '<h4>2. Reading List Data</h4>' +
        '<p>Books you save, their reading status, and ratings are stored in your personal Firebase Firestore database — <strong>accessible only by you</strong> when logged in. This data is never shared with third parties.</p>' +
        '<h4>3. Search Data</h4>' +
        '<p>When you search for books, your query is sent to the Google Books API to retrieve results. We do not store your search queries on our servers. Google\'s own privacy policy applies to this data.</p>' +
        '<h4>4. AI Chat & Summaries</h4>' +
        '<p>When you use the AI chat or request a book summary, your message is sent to Anthropic\'s API to generate a response. <strong>We do not store these messages</strong> on our end. Anthropic\'s privacy policy governs how they handle this data.</p>' +
        '<h4>5. Cookies</h4>' +
        '<p>Book Engine uses <strong>minimal session cookies</strong> to keep you logged in and remember your current session. We do not use advertising, tracking, or analytics cookies of any kind.</p>' +
        '<h4>6. No Data Selling</h4>' +
        '<p>We will <strong>never sell, rent, or trade your personal data</strong> to third parties. Your information exists solely to make Book Engine work for you.</p>' +
        '<h4>7. Data Security</h4>' +
        '<p>All data is transmitted over encrypted HTTPS connections. Account passwords are hashed using industry-standard cryptography. We follow best practices to protect your information.</p>' +
        '<h4>8. Your Rights</h4>' +
        '<p>You have the right to access, correct, or delete your personal data at any time. To request account deletion or a data export, email us at <a href="mailto:mr.asmat.com@gmail.com" style="color:var(--gold)">mr.asmat.com@gmail.com</a>.</p>' +
        '<h4>9. Children\'s Privacy</h4>' +
        '<p>Book Engine is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.</p>' +
        '<h4>10. Contact</h4>' +
        '<p>For any privacy concerns, reach us at <a href="mailto:mr.asmat.com@gmail.com" style="color:var(--gold)">mr.asmat.com@gmail.com</a> or <a href="tel:03088443686" style="color:var(--gold)">03088443686</a>.</p>';
    }
  }

};

function openInfoModal(type) {
  var info = INFO_CONTENT[type];
  if (!info) return;
  var contentEl = document.getElementById('infoModalContent');
  if (!contentEl) return;
  contentEl.innerHTML =
    '<div class="info-modal-header">' +
      '<i class="fas ' + info.icon + '"></i>' +
      '<h2>' + info.title + '</h2>' +
    '</div>' +
    '<div class="info-modal-body">' + info.html() + '</div>';
  document.getElementById('infoModal').classList.remove('hidden');
}

function closeInfoModal() {
  var modal = document.getElementById('infoModal');
  if (modal) modal.classList.add('hidden');
}

function submitContact() {
  var name    = document.getElementById('contactName')    ? document.getElementById('contactName').value.trim()    : '';
  var email   = document.getElementById('contactEmail')   ? document.getElementById('contactEmail').value.trim()   : '';
  var subject = document.getElementById('contactSubject') ? document.getElementById('contactSubject').value.trim() : 'Book Engine Enquiry';
  var msg     = document.getElementById('contactMsg')     ? document.getElementById('contactMsg').value.trim()     : '';

  if (!name || !email || !msg) {
    showToast('Please fill in all fields.', 'warning');
    return;
  }
  if (!subject) subject = 'Book Engine Enquiry';

  var mailSubject = encodeURIComponent('Book Engine: ' + subject + ' (from ' + name + ')');
  var mailBody    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + msg);
  window.location.href = 'mailto:mr.asmat.com@gmail.com?subject=' + mailSubject + '&body=' + mailBody;
  showToast('Opening your email client...', 'success');
}

document.addEventListener('DOMContentLoaded', function() {
  var infoModal = document.getElementById('infoModal');
  if (infoModal) {
    infoModal.addEventListener('click', function(e) {
      if (e.target === infoModal) closeInfoModal();
    });
  }
  var bookModal = document.getElementById('bookModal');
  if (bookModal) {
    bookModal.addEventListener('click', function(e) {
      if (e.target === bookModal) closeModal();
    });
  }
  var authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) closeAuthModal();
    });
  }
});
