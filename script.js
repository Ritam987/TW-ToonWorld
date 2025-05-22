document.addEventListener('DOMContentLoaded', () => {
  // Fancy Dark mode toggle with sun/moon icon
  const toggleBtn = document.getElementById('darkmode');
  const iconSpan = document.getElementById('darkmode-icon');

  function setMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    iconSpan.textContent = isDark ? '🌙' : '☀️';
  }

  // Initial state: light mode (sun) unless dark-mode class is present
  setMode(document.body.classList.contains('dark-mode'));

  toggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setMode(isDark);
  });

// Search feature (Title only + No results message)
const searchBox = document.getElementById('search');
const cards = document.querySelectorAll('.card');
const noResults = document.getElementById('no-results');

searchBox.addEventListener('input', () => {
  const searchText = searchBox.value.toLowerCase();
  let found = false;

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();

    if (title.includes(searchText)) {
      card.style.display = 'flex';
      found = true;
    } else {
      card.style.display = 'none';
    }
  });

  // Show/hide the "No results" message
  noResults.style.display = found ? 'none' : 'block';
   });
});

// Review Section Logic
document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...

  // --- Review Marquee Section ---
  const reviewForm = document.getElementById('reviewForm');
  const reviewMarquee = document.getElementById('reviewMarquee');
  let reviews = JSON.parse(localStorage.getItem('footerReviews') || '[]');

  function renderReviews() {
    if (!reviewMarquee) return;
    if (reviews.length === 0) {
      reviewMarquee.innerHTML = `<div class="review-card">No reviews yet. Be the first!</div>`;
      reviewMarquee.style.animationPlayState = 'paused';
      return;
    }
    // Duplicate reviews for seamless marquee
    const allReviews = [...reviews, ...reviews];
    reviewMarquee.innerHTML = allReviews.map(r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <div class="review-name">${r.name}</div>
        <div class="review-comment">${r.comment}</div>
      </div>
    `).join('');
    reviewMarquee.style.animationPlayState = 'running';
  }

  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reviewerName').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    if (!name || !rating || !comment) return;
    reviews.push({ name, rating, comment });
    localStorage.setItem('footerReviews', JSON.stringify(reviews));
    renderReviews();
    reviewForm.reset();
  });

  renderReviews();
});