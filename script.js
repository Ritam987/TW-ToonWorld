document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const toggleBtn = document.getElementById('darkmode');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
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