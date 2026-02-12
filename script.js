document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle with smooth animation
  const toggleBtn = document.getElementById('darkmode');
  const iconSpan = document.getElementById('darkmode-icon');

  function setMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    iconSpan.textContent = isDark ? '🌙' : '☀️';
    iconSpan.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      iconSpan.style.transform = 'rotate(0deg)';
    }, 300);
  }

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    setMode(true);
  } else {
    setMode(false);
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Search feature with debouncing
  const searchBox = document.getElementById('search');
  const cards = document.querySelectorAll('.card');
  const noResults = document.getElementById('no-results');
  let searchTimeout;

  searchBox.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const searchText = searchBox.value.toLowerCase().trim();
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
      noResults.style.display = found || searchText === '' ? 'none' : 'block';
    }, 300); // 300ms debounce
  });

  // Scroll reveal animation for cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    observer.observe(card);
  });

  // Star Rating System
  const starRating = document.getElementById('starRating');
  const ratingInput = document.getElementById('reviewRating');
  let selectedRating = 0;

  if (starRating) {
    const stars = starRating.querySelectorAll('.star');
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        ratingInput.value = selectedRating;
        updateStars();
      });

      star.addEventListener('mouseenter', () => {
        const hoverRating = parseInt(star.dataset.rating);
        stars.forEach((s, index) => {
          if (index < hoverRating) {
            s.style.color = 'var(--text-color)';
          } else {
            s.style.color = selectedRating > index ? 'var(--text-color)' : '#ddd';
          }
        });
      });
    });

    starRating.addEventListener('mouseleave', updateStars);

    function updateStars() {
      stars.forEach((s, index) => {
        if (index < selectedRating) {
          s.classList.add('active');
          s.style.color = 'var(--text-color)';
        } else {
          s.classList.remove('active');
          s.style.color = document.body.classList.contains('dark-mode') ? '#444' : '#ddd';
        }
      });
    }
  }

  // Review Section Logic
  const reviewForm = document.getElementById('reviewForm');
  const reviewsGrid = document.getElementById('reviewsGrid');
  const MAX_REVIEWS = 50;
  let reviews = JSON.parse(localStorage.getItem('footerReviews') || '[]');

  if (reviews.length > MAX_REVIEWS) {
    reviews = reviews.slice(-MAX_REVIEWS);
    localStorage.setItem('footerReviews', JSON.stringify(reviews));
  }

  function getInitials(name) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function renderReviews() {
    if (!reviewsGrid) return;
    
    if (reviews.length === 0) {
      reviewsGrid.innerHTML = `
        <div class="review-card" style="grid-column: 1 / -1;">
          <div class="review-avatar">?</div>
          <div class="review-comment">No reviews yet. Be the first to share your experience!</div>
        </div>
      `;
      return;
    }

    reviewsGrid.innerHTML = reviews.slice().reverse().map((r, index) => `
      <div class="review-card" style="animation-delay: ${index * 0.1}s;">
        <div class="review-quote">"</div>
        <div class="review-avatar">${getInitials(r.name)}</div>
        <div class="review-comment">"${escapeHtml(r.comment)}"</div>
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <div class="review-name">${escapeHtml(r.name)}</div>
        <div class="review-role">ToonWorld User</div>
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!name || !rating || !comment) {
      alert('Please fill in all fields including star rating');
      return;
    }

    if (name.length > 50) {
      alert('Name is too long (max 50 characters)');
      return;
    }

    if (comment.length > 200) {
      alert('Comment is too long (max 200 characters)');
      return;
    }

    reviews.push({ name, rating, comment });
    
    if (reviews.length > MAX_REVIEWS) {
      reviews = reviews.slice(-MAX_REVIEWS);
    }
    
    localStorage.setItem('footerReviews', JSON.stringify(reviews));
    renderReviews();
    reviewForm.reset();
    selectedRating = 0;
    ratingInput.value = '';
    
    if (starRating) {
      starRating.querySelectorAll('.star').forEach(s => {
        s.classList.remove('active');
        s.style.color = document.body.classList.contains('dark-mode') ? '#444' : '#ddd';
      });
    }

    const submitBtn = reviewForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Submitted!';
    submitBtn.style.background = 'var(--text-color)';
    submitBtn.style.color = 'var(--bg-color)';
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = 'var(--button-bg)';
      submitBtn.style.color = 'var(--button-text)';
    }, 2000);

    reviewsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  renderReviews();

  // Smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Add parallax effect to header on scroll
  let lastScroll = 0;
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
});
