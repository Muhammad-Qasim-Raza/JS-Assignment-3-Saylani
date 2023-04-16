const form = document.querySelector('form');
const recommendations = document.querySelector('.recommendations');
const recipeList = document.getElementById('recipe-list');
const recipeDetailsContainer = document.getElementById('recipeDetailsContainer');
const searchResultsHeading = document.querySelector('.search-results-heading');

// Add an event listener to the form submit button
form.addEventListener('submit', e => {
  e.preventDefault(); // prevent form from submitting and refreshing the page
  const formData = new FormData(form);

  // Convert form data to an object
  const preferences = {};
  for (const [name, value] of formData.entries()) {
    preferences[name] = value;
  }

  // Fetch movie data from data.json file
  fetch('data.json')
    .then(response => response.json())
    .then(movies => {
      // Filter movies based on user preferences
      const filteredMovies = movies.filter(movie => {
        const genreMatch = preferences.genre ? movie.genres.includes(preferences.genre) : true;
        const ratingMatch = preferences.rating ? movie.vote_average >= preferences.rating : true;
        const yearMatch = preferences.year ? new Date(movie.release_date).getFullYear() == preferences.year : true;
        return genreMatch && ratingMatch && yearMatch;
      });

      // Display search results
      if (filteredMovies.length > 0) {
        searchResultsHeading.textContent = 'Search Results';
        recipeList.innerHTML = '';
        filteredMovies.forEach(movie => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = movie.title;
          link.dataset.id = movie.id;
          link.classList.add('movie-link'); // Add movie-link class to link
          link.addEventListener('click', displayMovieDetails);
          listItem.appendChild(link);
          recipeList.appendChild(listItem);
        });
      } else {
        searchResultsHeading.textContent = 'No results found';
        recipeList.innerHTML = '';
      }
    })
    .catch(error => console.error(error));
});

// Function to display movie details
function displayMovieDetails(e) {
  e.preventDefault();
  const movieId = e.target.dataset.id;

  // Fetch movie details from data.json file
  fetch('data.json')
    .then(response => response.json())
    .then(movies => {
      const movie = movies.find(movie => movie.id == movieId);

      // Display movie details
      recipeDetailsContainer.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
        <p>Genres: ${movie.genres.join(', ')}</p>
        <p>Release Date: ${movie.release_date}</p>
        <p>Rating: ${movie.vote_average}</p>
      `;
    })
    .catch(error => console.error(error));
}
