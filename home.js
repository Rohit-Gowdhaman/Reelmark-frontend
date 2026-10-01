/* =========================================================
   REELMARK — HOME PAGE JAVASCRIPT
========================================================= */

const API_URL = "http://localhost:4000";

let REVIEWS = [];

let activeGenre = "All";

let searchTerm = "";


/* =========================================================
   DOM
========================================================= */

const movieGrid =
    document.getElementById("movieGrid");

const genreContainer =
    document.getElementById("genres");

const searchToggle =
    document.getElementById("searchToggle");

const searchPanel =
    document.getElementById("searchPanel");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const movieCount =
    document.getElementById("movieCount");

const visibleMovieCount =
    document.getElementById("visibleMovieCount");

const emptyState =
    document.getElementById("emptyState");

const movieModal =
    document.getElementById("movieModal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const modalClose =
    document.getElementById("modalClose");

const randomMovieBtn =
    document.getElementById("randomMovieBtn");


/* =========================================================
   LOAD MOVIES
========================================================= */

async function loadReviews() {

    try {

        const response =
            await fetch(`${API_URL}/api/reviews`);

        if (!response.ok) {

            throw new Error(
                "Failed to load movies"
            );
        }

        REVIEWS =
            await response.json();

        movieCount.textContent =
            String(REVIEWS.length).padStart(2, "0");

        buildGenres();

        renderMovies();

    } catch (error) {

        console.error(error);

        movieGrid.innerHTML = `
            <div class="loading-state">
                <p>
                    Unable to load movies.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   BUILD GENRES
========================================================= */

function buildGenres() {

    const genres = new Set();

    REVIEWS.forEach(movie => {

        if (!movie.genre) {
            return;
        }

        movie.genre
            .split(",")
            .map(g => g.trim())
            .filter(Boolean)
            .forEach(g => genres.add(g));
    });


    const sortedGenres =
        [...genres].sort();


    genreContainer.innerHTML = `
        <button
            class="genre-btn active"
            data-genre="All"
        >
            ALL
        </button>
    `;


    sortedGenres.forEach(genre => {

        const button =
            document.createElement("button");

        button.className =
            "genre-btn";

        button.dataset.genre =
            genre;

        button.textContent =
            genre.toUpperCase();

        genreContainer.appendChild(button);
    });


    genreContainer
        .querySelectorAll(".genre-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    genreContainer
                        .querySelectorAll(".genre-btn")
                        .forEach(btn =>
                            btn.classList.remove("active")
                        );

                    button.classList.add("active");

                    activeGenre =
                        button.dataset.genre;

                    renderMovies();
                }
            );
        });
}


/* =========================================================
   FILTER MOVIES
========================================================= */

function getFilteredMovies() {

    return REVIEWS.filter(movie => {

        const matchesGenre =
            activeGenre === "All" ||
            (
                movie.genre &&
                movie.genre
                    .toLowerCase()
                    .includes(
                        activeGenre.toLowerCase()
                    )
            );


        const searchableText = [

            movie.title,

            movie.director,

            movie.genre,

            movie.year

        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


        const matchesSearch =
            !searchTerm ||
            searchableText.includes(searchTerm);


        return (
            matchesGenre &&
            matchesSearch
        );
    });
}


/* =========================================================
   RENDER MOVIES
========================================================= */

function renderMovies() {

    const movies =
        getFilteredMovies();


    visibleMovieCount.textContent =
        String(movies.length).padStart(2, "0");


    if (!movies.length) {

        movieGrid.innerHTML = "";

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    movieGrid.innerHTML =
        movies.map((movie, index) =>
            createMovieCard(movie, index)
        ).join("");


    movieGrid
        .querySelectorAll(".movie-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const id =
                        Number(card.dataset.id);

                    const movie =
                        REVIEWS.find(
                            r => r.id === id
                        );

                    if (movie) {
                        openMovieModal(movie);
                    }
                }
            );
        });
}


/* =========================================================
   MOVIE CARD
========================================================= */

function createMovieCard(movie, index) {

    const poster =
        movie.poster &&
        movie.poster !== "N/A"
            ? movie.poster
            : "";


    const rating =
        Number(movie.rating || 0)
            .toFixed(1);


    const genre =
        movie.genre
            ? movie.genre.split(",")[0].trim()
            : "Movie";


    const director =
        movie.director ||
        "Director unavailable";


    return `

        <article
            class="movie-card"
            data-id="${movie.id}"
            style="animation-delay:${index * 45}ms"
        >

            <div class="movie-poster">

                ${
                    poster
                    ?
                    `
                    <img
                        src="${escapeHTML(poster)}"
                        alt="${escapeHTML(movie.title)} poster"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >
                    `
                    :
                    `
                    <div style="
                        width:100%;
                        height:100%;
                        display:grid;
                        place-items:center;
                        color:#555b6d;
                        font-family:'IBM Plex Mono',monospace;
                        font-size:10px;
                    ">
                        POSTER UNAVAILABLE
                    </div>
                    `
                }


                <div class="poster-overlay"></div>


                <div class="poster-genre">
                    ${escapeHTML(genre)}
                </div>


                <div class="poster-rating">
                    ★ ${rating}
                </div>


                <div class="poster-bottom">

                    <div class="poster-title">
                        ${escapeHTML(movie.title)}
                    </div>

                    <div class="poster-year">
                        ${movie.year || "—"}
                    </div>

                </div>

            </div>


            <div class="movie-info">

                <div class="movie-info-title">
                    ${escapeHTML(movie.title)}
                </div>

                <div class="movie-info-director">
                    ${escapeHTML(director)}
                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   MOVIE MODAL
========================================================= */

function openMovieModal(movie) {

    const poster =
        movie.poster &&
        movie.poster !== "N/A"
            ? movie.poster
            : "";


    const rating =
        Number(movie.rating || 0)
            .toFixed(1);


    document.getElementById(
        "modalTitle"
    ).textContent =
        movie.title || "Untitled";


    document.getElementById(
        "modalGenre"
    ).textContent =
        movie.genre || "Movie";


    document.getElementById(
        "modalRating"
    ).textContent =
        `★ ${rating}`;


    document.getElementById(
        "modalMeta"
    ).innerHTML = `

        ${movie.year || "—"}
        &nbsp; / &nbsp;
        ${escapeHTML(movie.director || "Unknown director")}
        <br>

        ${movie.runtime || "—"} min

        ${
            movie.imdb_id
            ? `&nbsp; / &nbsp; IMDb ${escapeHTML(movie.imdb_id)}`
            : ""
        }

    `;


    document.getElementById(
        "modalBlurb"
    ).textContent =
        movie.blurb ||
        "No description available.";


    document.getElementById(
        "modalReview"
    ).textContent =
        movie.review ||
        "No review available.";


    document.getElementById(
        "modalVerdict"
    ).textContent =
        movie.verdict ||
        "REVIEW";


    const modalPoster =
        document.getElementById(
            "modalPoster"
        );


    if (poster) {

        modalPoster.style.backgroundImage =
            `url("${poster}")`;

    } else {

        modalPoster.style.backgroundImage =
            "none";
    }


    movieModal.classList.add("show");

    movieModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeMovieModal() {

    movieModal.classList.remove("show");

    movieModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


modalClose.addEventListener(
    "click",
    closeMovieModal
);


modalBackdrop.addEventListener(
    "click",
    closeMovieModal
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMovieModal();

        }
    }
);


/* =========================================================
   SEARCH
========================================================= */

searchToggle.addEventListener(
    "click",
    () => {

        searchPanel.classList.toggle(
            "show"
        );

        if (
            searchPanel.classList.contains(
                "show"
            )
        ) {

            searchInput.focus();

        }
    }
);


searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value
                .trim()
                .toLowerCase();

        renderMovies();
    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        searchTerm = "";

        searchInput.focus();

        renderMovies();
    }
);


/* =========================================================
   RANDOM MOVIE
========================================================= */

randomMovieBtn.addEventListener(
    "click",
    () => {

        if (!REVIEWS.length) {
            return;
        }

        const randomIndex =
            Math.floor(
                Math.random() *
                REVIEWS.length
            );

        openMovieModal(
            REVIEWS[randomIndex]
        );
    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   START
========================================================= */

loadReviews();