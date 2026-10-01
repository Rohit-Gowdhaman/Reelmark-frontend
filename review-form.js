// ==========================================================
// REELMARK — ADD / EDIT REVIEW PAGE
// ==========================================================


// ==========================================================
// ELEMENTS
// ==========================================================

const reviewForm = document.getElementById('reviewForm');
const formMessage = document.getElementById('formMessage');

const blurbInput = document.getElementById('blurb');
const reviewInput = document.getElementById('review');

const fetchMovieBtn = document.getElementById('fetchMovieBtn');
const omdbMessage = document.getElementById('omdbMessage');

const moviePreview = document.getElementById('moviePreview');
const moviePoster = document.getElementById('moviePoster');
const movieTitlePreview = document.getElementById('movieTitlePreview');
const movieMetaPreview = document.getElementById('movieMetaPreview');

const submitButton =
  reviewForm.querySelector('button[type="submit"]');


// ==========================================================
// EDIT MODE
// ==========================================================

const urlParams =
  new URLSearchParams(window.location.search);

const editId =
  urlParams.get('edit');

let existingReview = null;


// ==========================================================
// CHARACTER COUNTERS
// ==========================================================

blurbInput.addEventListener('input', () => {

  blurbCount.textContent =
    `${blurbInput.value.length} / 180`;

});


reviewInput.addEventListener('input', () => {

  reviewCount.textContent =
    `${reviewInput.value.length} / 2000`;

});


// ==========================================================
// FETCH MOVIE FROM OMDb
// ==========================================================

if (fetchMovieBtn) {

  fetchMovieBtn.addEventListener('click', async () => {

    const titleInput =
      document.getElementById('title');

    const yearInput =
      document.getElementById('year');

    const title =
      titleInput.value.trim();

    const year =
      yearInput.value.trim();

    const message =
      document.getElementById('omdbMessage');

    const preview =
      document.getElementById('moviePreview');

    const poster =
      document.getElementById('moviePoster');

    const titlePreview =
      document.getElementById('movieTitlePreview');

    const metaPreview =
      document.getElementById('movieMetaPreview');


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (!title || !year) {

      message.textContent =
        'Please enter the movie title and release year.';

      return;

    }


    // ------------------------------------------------------
    // LOADING
    // ------------------------------------------------------

    fetchMovieBtn.disabled = true;

    fetchMovieBtn.textContent =
      'FETCHING MOVIE...';

    message.textContent =
      'Searching OMDb...';

    preview.style.display =
      'none';


    try {

      // ----------------------------------------------------
      // SEARCH MOVIE
      // ----------------------------------------------------

      const response =
        await authenticatedFetch(
          `${API_BASE_URL}/api/reviews/search-movie?title=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}`
        );


      const data =
        await response.json();


      console.log(
        'Movie search response:',
        data
      );


      if (!response.ok) {

        throw new Error(
          data.error ||
          'Could not find this movie.'
        );

      }


      // ----------------------------------------------------
      // STORE MOVIE
      // ----------------------------------------------------

      window.selectedMovie =
        data;


      // ----------------------------------------------------
      // AUTO-FILL TITLE
      // ----------------------------------------------------

      if (data.title) {

        titleInput.value =
          data.title;

      }


      // ----------------------------------------------------
      // AUTO-FILL YEAR
      // ----------------------------------------------------

      if (data.year) {

        yearInput.value =
          data.year;

      }


      // ----------------------------------------------------
      // DIRECTOR
      // ----------------------------------------------------

      const directorInput =
        document.getElementById('director');

      if (
        directorInput &&
        data.director
      ) {

        directorInput.value =
          data.director;

      }


      // ----------------------------------------------------
      // RUNTIME
      // ----------------------------------------------------

      const runtimeInput =
        document.getElementById('runtime');

      if (
        runtimeInput &&
        data.runtime
      ) {

        const runtimeNumber =
          parseInt(data.runtime);

        if (!isNaN(runtimeNumber)) {

          runtimeInput.value =
            runtimeNumber;

        }

      }


      // ----------------------------------------------------
      // GENRE
      // ----------------------------------------------------

      const genreSelect =
        document.getElementById('genre');

      if (
        genreSelect &&
        data.genre
      ) {

        const genres =
          data.genre
            .split(',')
            .map(g => g.trim());


        const matchingGenre =
          genres.find(g =>
            Array.from(
              genreSelect.options
            ).some(
              option =>
                option.value === g
            )
          );


        if (matchingGenre) {

          genreSelect.value =
            matchingGenre;

        }

      }


      // ----------------------------------------------------
      // POSTER
      // ----------------------------------------------------

      if (data.poster) {

        poster.src =
          data.poster;

        poster.alt =
          `${data.title} poster`;

        poster.onerror = () => {

          poster.src = '';

          message.textContent =
            'Movie found, but the poster could not be loaded.';

        };

      }


      // ----------------------------------------------------
      // PREVIEW TITLE
      // ----------------------------------------------------

      titlePreview.textContent =
        `${data.title} (${data.year})`;


      // ----------------------------------------------------
      // PREVIEW INFORMATION
      // ----------------------------------------------------

      metaPreview.innerHTML = `

        <div>
          <strong>Genre:</strong>
          ${data.genre || 'N/A'}
        </div>

        <div>
          <strong>Director:</strong>
          ${data.director || 'N/A'}
        </div>

        <div>
          <strong>Runtime:</strong>
          ${data.runtime || 'N/A'}
        </div>

        <div>
          <strong>IMDb ID:</strong>
          ${data.imdbId || 'N/A'}
        </div>

      `;


      // ----------------------------------------------------
      // SHOW PREVIEW
      // ----------------------------------------------------

      preview.style.display =
        'block';

      message.textContent =
        '✓ Movie found successfully.';


    } catch (error) {

      console.error(
        'Movie fetch error:',
        error
      );

      preview.style.display =
        'none';

      message.textContent =
        error.message ||
        'Could not find this movie.';


    } finally {

      fetchMovieBtn.disabled =
        false;

      fetchMovieBtn.textContent =
        'FETCH MOVIE FROM OMDb →';

    }

  });

}


// ==========================================================
// LOAD REVIEW FOR EDITING
// ==========================================================

async function loadReviewForEditing() {

  if (!editId) {

    return;

  }


  try {

    formMessage.textContent =
      'Loading review...';


    const response =
      await authenticatedFetch(
        `${API_BASE_URL}/api/reviews/${editId}`
      );


    if (!response.ok) {

      throw new Error(
        'Could not load the review'
      );

    }


    existingReview =
      await response.json();


    // ------------------------------------------------------
    // FILL FORM
    // ------------------------------------------------------

    document.getElementById('title').value =
      existingReview.title || '';


    document.getElementById('year').value =
      existingReview.year || '';


    document.getElementById('genre').value =
      existingReview.genre || '';


    document.getElementById('director').value =
      existingReview.director || '';


    document.getElementById('runtime').value =
      existingReview.runtime || '';


    document.getElementById('rating').value =
      existingReview.rating || '';


    document.getElementById('blurb').value =
      existingReview.blurb || '';


    document.getElementById('review').value =
      existingReview.review || '';


    document.getElementById('verdict').value =
      existingReview.verdict || '';


    document.getElementById('critic').value =
      existingReview.critic || '';


    // ------------------------------------------------------
    // COUNTERS
    // ------------------------------------------------------

    blurbCount.textContent =
      `${blurbInput.value.length} / 180`;

    reviewCount.textContent =
      `${reviewInput.value.length} / 2000`;


    // ------------------------------------------------------
    // BUTTON
    // ------------------------------------------------------

    submitButton.textContent =
      'UPDATE REVIEW';


    formMessage.textContent =
      'Editing your review...';


  } catch (error) {

    console.error(
      'Failed to load review:',
      error
    );

    formMessage.textContent =
      'Could not load the review.';

  }

}


// ==========================================================
// SUBMIT REVIEW
// ==========================================================

reviewForm.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();


    // ======================================================
    // BUILD REVIEW DATA
    // ======================================================

    const reviewData = {

      title:
        document.getElementById('title')
          .value
          .trim(),

      year:
        Number(
          document.getElementById('year').value
        ),

      genre:
        document.getElementById('genre').value,

      director:
        document.getElementById('director').value
          .trim(),

      runtime:
        Number(
          document.getElementById('runtime').value
        ) || 0,

      rating:
        Number(
          document.getElementById('rating').value
        ),

      blurb:
        document.getElementById('blurb')
          .value
          .trim(),

      review:
        document.getElementById('review')
          .value
          .trim(),

      verdict:
        document.getElementById('verdict')
          .value
          .trim(),

      critic:
        document.getElementById('critic')
          .value
          .trim(),

      published:
        true,

      icon:
        existingReview?.icon ||
        'wave',

      colors:
        existingReview?.colors ||
        [
          '#25358b',
          '#000000'
        ],

      tags:
        existingReview?.tags ||
        [],

      // ----------------------------------------------------
      // OMDb DATA
      // ----------------------------------------------------

      imdb_id:
        window.selectedMovie?.imdbId ||
        existingReview?.imdb_id ||
        null,

      poster:
        window.selectedMovie?.poster ||
        existingReview?.poster ||
        null

    };


    // ======================================================
    // VALIDATION
    // ======================================================

    if (!reviewData.title) {

      formMessage.textContent =
        'Please enter the movie title.';

      return;

    }


    if (
      !reviewData.year ||
      reviewData.year < 1888 ||
      reviewData.year > 2100
    ) {

      formMessage.textContent =
        'Please enter a valid release year.';

      return;

    }


    if (
      !reviewData.rating &&
      reviewData.rating !== 0
    ) {

      formMessage.textContent =
        'Please enter a rating.';

      return;

    }


    if (
      reviewData.rating < 0 ||
      reviewData.rating > 5
    ) {

      formMessage.textContent =
        'Rating must be between 0 and 5.';

      return;

    }


    if (
      !Number.isInteger(
        reviewData.rating * 2
      )
    ) {

      formMessage.textContent =
        'Rating must be in 0.5 steps.';

      return;

    }


    if (!reviewData.blurb) {

      formMessage.textContent =
        'Please enter a short description.';

      return;

    }


    if (!reviewData.review) {

      formMessage.textContent =
        'Please write your full review.';

      return;

    }


    if (!reviewData.verdict) {

      formMessage.textContent =
        'Please enter your verdict.';

      return;

    }


    if (!reviewData.critic) {

      formMessage.textContent =
        'Please enter your name.';

      return;

    }


    // ======================================================
    // SHOW MESSAGE
    // ======================================================

    formMessage.textContent =
      editId
        ? 'Updating your review...'
        : 'Publishing your review...';


    try {

      submitButton.disabled =
        true;


      submitButton.textContent =
        editId
          ? 'UPDATING...'
          : 'PUBLISHING...';


      // ====================================================
      // EDIT EXISTING REVIEW
      // ====================================================

      if (editId) {

        const response =
          await authenticatedFetch(
            `${API_BASE_URL}/api/reviews/${editId}`,
            {
              method: 'PUT',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify(reviewData)

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            'Failed to update review'
          );

        }


        console.log(
          'Review updated:',
          data
        );


        formMessage.textContent =
          '✓ Review updated successfully!';


        setTimeout(() => {

          window.location.href =
            'profile.html';

        }, 1200);


        return;

      }


      // ====================================================
      // ADD NEW NORMAL USER REVIEW
      // ====================================================

      const response =
        await authenticatedFetch(
          '${API_BASE_URL}/api/reviews',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(reviewData)

          }
        );


      const data =
        await response.json();


      console.log(
        'Review created:',
        data
      );


      if (!response.ok) {

        throw new Error(
          data.error ||
          'Failed to create review'
        );

      }


      formMessage.textContent =
        '✓ Movie review published successfully!';


      reviewForm.reset();


      blurbCount.textContent =
        '0 / 180';

      reviewCount.textContent =
        '0 / 2000';


      moviePreview.style.display =
        'none';


      window.selectedMovie =
        null;


      // ----------------------------------------------------
      // REDIRECT
      // ----------------------------------------------------

      setTimeout(() => {

        window.location.href =
          'index.html';

      }, 1200);


    } catch (error) {

      console.error(
        'Failed to save review:',
        error
      );


      formMessage.textContent =
        'Could not save the review. ' +
        error.message;


      submitButton.disabled =
        false;


      submitButton.textContent =
        editId
          ? 'UPDATE REVIEW'
          : 'Publish Review →';

    }

  }
);


// ==========================================================
// START
// ==========================================================

loadReviewForEditing();