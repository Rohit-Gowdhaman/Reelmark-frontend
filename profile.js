const user = JSON.parse(localStorage.getItem('user'));
const profileToken = localStorage.getItem('token');

console.log("USER:", user);
console.log("TOKEN:", profileToken);


// ================================
// DISPLAY USER INFORMATION
// ================================

const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');

const profileReviewTotal =
    document.getElementById('profileReviewTotal');

const profileAverageRating =
    document.getElementById('profileAverageRating');

profileName.textContent = user.name;
profileEmail.textContent = user.email;


// ================================
// MY REVIEWS
// ================================

const myReviewsGrid = document.getElementById('myReviewsGrid');
const myReviewsEmpty = document.getElementById('myReviewsEmpty');
const myReviewCount = document.getElementById('myReviewCount');


async function loadMyReviews() {

    try {

const response = await authenticatedFetch(
    '${API_BASE_URL}/api/reviews/my',
    {
        method: 'GET'
    }
);

        if (!response.ok) {
            throw new Error('Failed to load reviews');
        }

        const reviews = await response.json();

        console.log("MY REVIEWS:", reviews);

        renderMyReviews(reviews);

    } catch (error) {

        console.error("Failed to load my reviews:", error);

        myReviewsEmpty.style.display = 'block';

        myReviewsEmpty.querySelector('h3').textContent =
            'Unable to load your reviews.';
    }
}


// ================================
// DISPLAY REVIEWS
// ================================

function renderMyReviews(reviews) {

    myReviewsGrid.innerHTML = '';

    myReviewCount.textContent =
        `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;

        // ================================
// PROFILE STATISTICS
// ================================

profileReviewTotal.textContent =
    reviews.length;

if (reviews.length > 0) {

    const totalRating = reviews.reduce(
        (sum, review) => {
            return sum + Number(review.rating || 0);
        },
        0
    );

    const averageRating =
        totalRating / reviews.length;

    profileAverageRating.textContent =
        averageRating.toFixed(1);

} else {

    profileAverageRating.textContent = '0.0';

}


    // No reviews
    if (reviews.length === 0) {

        myReviewsEmpty.style.display = 'block';

        return;
    }


    // Reviews exist
    myReviewsEmpty.style.display = 'none';


    reviews.forEach(review => {

        const card = document.createElement('article');

        card.className = 'my-review-card';


        // Review card
        card.innerHTML = `
           <div class="my-review-poster">

    ${
        review.poster
            ? `
                <img
                    src="${review.poster}"
                    alt="${review.title} movie poster"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >

                <div class="my-review-poster-fallback">
                    🎬
                </div>
              `
            : `
                <div class="my-review-poster-fallback">
                    🎬
                </div>
              `
    }

    <div class="my-review-poster-rating">
        ${Number(review.rating || 0).toFixed(1)} ★
    </div>

</div>
            <div class="my-review-content">

                <div class="my-review-meta">
                    ${review.genre || 'Movie'} · ${review.year || ''}
                </div>

                <h3>
                    ${review.title}
                </h3>

                <p class="my-review-director">
                    Directed by ${review.director}
                </p>

                <p class="my-review-rating">
                    ★ ${review.rating}/5
                </p>

                <p class="my-review-blurb">
                    ${review.blurb}
                </p>


                <!-- ACTION BUTTONS -->

                <div class="my-review-actions">

                    <button
                        class="edit-review-btn"
                        data-id="${review.id}">
                        ✎&nbsp; EDIT
                    </button>

                    <button
                        class="delete-review-btn"
                        data-id="${review.id}">
                        DELETE
                    </button>

                </div>

            </div>
        `;


        myReviewsGrid.appendChild(card);

    });
}


// ================================
// DELETE REVIEW
// ================================

document.addEventListener('click', async (event) => {

    const deleteButton =
        event.target.closest('.delete-review-btn');

    if (!deleteButton) {
        return;
    }


    const reviewId = deleteButton.dataset.id;


    const confirmDelete = confirm(
        'Are you sure you want to delete this review?'
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await authenticatedFetch(
    `${API_BASE_URL}/api/reviews/${reviewId}`,
    {
        method: 'DELETE'
    }
);


        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.error || 'Failed to delete review'
            );
        }


        alert('Review deleted successfully.');


        // Reload reviews after deletion
        loadMyReviews();


    } catch (error) {

        console.error('Delete error:', error);

        alert(error.message);

    }

});

// ================================
// EDIT REVIEW
// ================================

document.addEventListener('click', (event) => {

    const editButton =
        event.target.closest('.edit-review-btn');

    if (!editButton) {
        return;
    }

    const reviewId = editButton.dataset.id;

    window.location.href =
        `add-review.html?edit=${reviewId}`;

});


// ================================
// START
// ================================

loadMyReviews();