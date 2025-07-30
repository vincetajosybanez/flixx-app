const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");
  // console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
            <img
              src="${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "images/no-image.jpg"
              }"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
    `;

    document.querySelector("#popular-movies").appendChild(div);
  });
}

// Display 20 most popular tv shows
async function displayPopularTVShows() {
  const { results } = await fetchAPIData("tv/popular");
  // console.log(results);
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
            <img
              src="${
                show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : "images/no-image.jpg"
              }"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
    `;

    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const API_KEY = "2e70f3e02936025be67d56fef12c69dd";
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(
    `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);

  // Overlay background image
  displayBackgroundImage("movie", data.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src="${
                data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : "images/no-image.jpg"
              }"
              class="card-img-top"
              alt="${data.title}"
            />
          </div>
          <div>
            <h2>${data.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${data.vote_average.toFixed(2)} / 10
            </p>
            <p class="text-muted">Release Date: ${data.release_date}</p>
            <p>
              ${data.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                data.genres.length > 0 &&
                data.genres.map((genre) => `<li>${genre.name}</li>`).join("")
              }
            </ul>
            <a href="${
              data.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              data.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              data.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              data.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${data.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${
            data.production_companies.length > 0 &&
            data.production_companies
              .map((company) => `<span>${company.name}</span>`)
              .join(", ")
          }</div>
        </div>
  `;

  document.querySelector("#movie-details").appendChild(div);

  hideSpinner();
}

// Display show details
async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const API_KEY = "2e70f3e02936025be67d56fef12c69dd";
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(
    `${API_URL}tv/${showId}?api_key=${API_KEY}&language=en-US`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);

  // Overlay background image
  displayBackgroundImage("tv", data.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src="${
                data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : "images/no-image.jpg"
              }"
              class="card-img-top"
              alt="${data.name}"
            />
          </div>
          <div>
            <h2>${data.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${data.vote_average.toFixed(2)} / 10
            </p>
            <p class="text-muted">Release Date: ${data.first_air_date}</p>
            <p>
              ${data.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                data.genres.length > 0 &&
                data.genres.map((genre) => `<li>${genre.name}</li>`).join("")
              }
            </ul>
            <a href="${
              data.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              data.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                data.last_episode_to_air.episode_number
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${data.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${
              data.production_companies.length > 0 &&
              data.production_companies
                .map((company) => `<span>${company.name}</span>`)
                .join(", ")
            }
          </div>
        </div>
  `;

  document.querySelector("#show-details").appendChild(div);

  hideSpinner();
}

function displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${path})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  showSpinner();

  const API_KEY = "2e70f3e02936025be67d56fef12c69dd";
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  const data = await response.json();
  hideSpinner();

  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

// Highlight active link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Add commas
function addCommasToNumber(number) {
  return Number(number).toLocaleString("en-US");
}

async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  console.log(results);

  results.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
    <a href="movie-details.html?id=${item.id}">
                <img src="${
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "./images/no-image.jpg"
                }" alt="${item.title}" />
              </a>
              <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${
                  item.vote_average
                } / 10
              </h4>
  `;

    document.querySelector(".swiper-wrapper").appendChild(div);
  });

  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    /* scrollbar: {
      el: ".swiper-scrollbar",
    }, */
  });
}

async function searchAPIData() {
  showSpinner();

  const API_KEY = "2e70f3e02936025be67d56fef12c69dd";
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

// Search movies/shows
async function search() {
  const urlParams = new URLSearchParams(window.location.search);
  global.search.page = 1;
  global.search.term = urlParams.get("search-term");
  global.search.type = urlParams.get("type");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No Results Found");

      return;
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}

async function displaySearchResults(results) {
  const type = global.search.type;

  // Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((data) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <a href="${type}-details.html?id=${data.id}">
            <img
              src="${
                data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : "images/no-image.jpg"
              }"
              class="card-img-top"
              alt="${type === "movie" ? data.title : data.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              type === "movie" ? data.title : data.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                type === "movie" ? data.release_date : data.first_air_date
              }</small>
            </p>
          </div>
    `;

    document.querySelector("#search-results-heading").innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // Disable prev button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async function () {
    global.search.page++;

    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector("#prev").addEventListener("click", async function () {
    global.search.page--;

    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularTVShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
