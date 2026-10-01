// ============================================================
// GET LOGIN INFORMATION
// ============================================================

const token = localStorage.getItem('token');

let user = null;

try {
    user = JSON.parse(
        localStorage.getItem('user')
    );
} catch (error) {
    console.error(
        'Failed to read logged-in user:',
        error
    );
}

// ============================================================
// CHECK LOGIN
// ============================================================

if (!token || !user) {

    window.location.href = 'login.html';

} else if (user.role !== 'admin') {

    alert('Admin access required.');

    window.location.href = 'index.html';

}


// ============================================================
// STORE ALL REVIEWS
// ============================================================

let allReviews = [];


// ============================================================
// GET HTML ELEMENTS
// ============================================================

// ============================================================
// ADMIN WELCOME
// ============================================================

const adminWelcome =
    document.getElementById('adminWelcome');


// ============================================================
// ANALYTICS ELEMENTS
// ============================================================

// Total Reviews
const totalReviews =
    document.getElementById('totalReviews');

// Average Rating
const averageRating =
    document.getElementById('averageRating');

// User Statistics
const totalAdmins =
    document.getElementById('totalAdmins');

const totalNormalUsers =
    document.getElementById('totalNormalUsers');

const analyticsTotalUsers =
    document.getElementById('analyticsTotalUsers');

// Reviews by Genre
const reviewsByGenre =
    document.getElementById('reviewsByGenre');

// Reviews by Year
const reviewsByYear =
    document.getElementById('reviewsByYear');


// ============================================================
// USER MANAGEMENT ELEMENTS
// ============================================================

const usersGrid =
    document.getElementById('usersGrid');

const usersEmpty =
    document.getElementById('usersEmpty');

const userCount =
    document.getElementById('userCount');


// ============================================================
// REVIEW MANAGEMENT ELEMENTS
// ============================================================

const reviewsGrid =
    document.getElementById('reviewsGrid');

const reviewsEmpty =
    document.getElementById('reviewsEmpty');

const reviewCount =
    document.getElementById('reviewCount');


// ============================================================
// REVIEW SEARCH & FILTERS
// ============================================================

const reviewSearch =
    document.getElementById('reviewSearch');

const genreFilter =
    document.getElementById('genreFilter');

const ratingFilter =
    document.getElementById('ratingFilter');

const yearFilter =
    document.getElementById('yearFilter');

const resetReviewFilters =
    document.getElementById(
        'resetReviewFilters'
    );


// ============================================================
// EDIT REVIEW MODAL ELEMENTS
// ============================================================

const editReviewModal =
    document.getElementById(
        'editReviewModal'
    );

const editReviewForm =
    document.getElementById(
        'editReviewForm'
    );

const closeEditReview =
    document.getElementById(
        'closeEditReview'
    );

const cancelEditReview =
    document.getElementById(
        'cancelEditReview'
    );


// ============================================================
// WELCOME MESSAGE
// ============================================================

if (adminWelcome && user) {

    adminWelcome.textContent =
        `Welcome, ${user.name}. You are logged in as an administrator.`;

}


// ============================================================
// USER MANAGEMENT
// ============================================================

// ============================================================
// LOAD USERS
// ============================================================

async function loadUsers() {

    try {

        const response =
            await fetch(
                '${API_BASE_URL}/api/admin/users',
                {
                    method: 'GET',

                    headers: {
                        'Authorization':
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                'Failed to load users'
            );

        }


        const users =
            await response.json();


        console.log(
            'ADMIN USERS:',
            users
        );


        renderUsers(users);


    } catch (error) {

        console.error(
            'Failed to load users:',
            error
        );


        if (usersEmpty) {

            usersEmpty.style.display =
                'block';


            const heading =
                usersEmpty.querySelector('h3');


            if (heading) {

                heading.textContent =
                    'Unable to load users.';

            }

        }

    }

}


// ============================================================
// RENDER USERS
// ============================================================

function renderUsers(users) {

    if (!usersGrid) {
        return;
    }


    usersGrid.innerHTML = '';


    // ========================================================
    // USER COUNT
    // ========================================================

    if (userCount) {

        userCount.textContent =
            `${users.length} ${
                users.length === 1
                    ? 'user'
                    : 'users'
            }`;

    }


    // ========================================================
    // NO USERS
    // ========================================================

    if (users.length === 0) {

        if (usersEmpty) {

            usersEmpty.style.display =
                'block';

        }

        return;

    }


    if (usersEmpty) {

        usersEmpty.style.display =
            'none';

    }


    // ========================================================
    // CREATE USER CARDS
    // ========================================================

    users.forEach(currentUser => {

        const card =
            document.createElement(
                'article'
            );


        card.className =
            'my-review-card';


        // ====================================================
        // CHECK CURRENT ADMIN
        // ====================================================

        const isCurrentAdmin =
            currentUser.id === user.id;


        // ====================================================
        // ROLE BUTTON TEXT
        // ====================================================

        const roleButtonText =
            currentUser.role === 'admin'
                ? 'Remove Admin'
                : 'Make Admin';


        // ====================================================
        // NEW ROLE
        // ====================================================

        const newRole =
            currentUser.role === 'admin'
                ? 'user'
                : 'admin';


        // ====================================================
        // USER CARD HTML
        // ====================================================

        card.innerHTML = `

            <div class="my-review-icon">

                ${
                    currentUser.role === 'admin'
                        ? '🛡️'
                        : '👤'
                }

            </div>


            <div class="my-review-content">

                <div class="my-review-meta">

                    ${currentUser.role.toUpperCase()}

                </div>


                <h3>

                    ${currentUser.name}

                </h3>


                <p class="my-review-director">

                    ${currentUser.email}

                </p>


                <p class="my-review-blurb">

                    User ID:
                    ${currentUser.id}

                </p>


                <p class="my-review-blurb">

                    Joined:
                    ${currentUser.created_at}

                </p>


                ${
                    isCurrentAdmin

                        ? `

                            <p class="my-review-blurb">

                                Current Admin

                            </p>

                          `

                        : `

                            <button
                                class="admin-role-btn"
                                data-user-id="${currentUser.id}"
                                data-role="${newRole}">

                                ${roleButtonText}

                            </button>


                            <button
                                class="admin-delete-btn"
                                data-user-id="${currentUser.id}">

                                Delete User

                            </button>

                          `
                }

            </div>

        `;


        usersGrid.appendChild(card);


        // ====================================================
        // ROLE CHANGE BUTTON
        // ====================================================

        const roleButton =
            card.querySelector(
                '.admin-role-btn'
            );


        if (roleButton) {

            roleButton.addEventListener(
                'click',
                async () => {

                    const userId =
                        roleButton.dataset.userId;


                    const role =
                        roleButton.dataset.role;


                    const confirmChange =
                        confirm(
                            `Change ${currentUser.name}'s role to ${role}?`
                        );


                    if (!confirmChange) {

                        return;

                    }


                    try {

                        roleButton.disabled =
                            true;


                        roleButton.textContent =
                            'Updating...';


                        const response =
                            await fetch(
                                `${API_BASE_URL}/api/admin/users/${userId}/role`,
                                {
                                    method: 'PUT',

                                    headers: {

                                        'Content-Type':
                                            'application/json',

                                        'Authorization':
                                            `Bearer ${token}`

                                    },

                                    body:
                                        JSON.stringify({
                                            role: role
                                        })

                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                data.error ||
                                'Failed to update role'
                            );

                        }


                        alert(
                            `${currentUser.name} is now ${role}.`
                        );


                        await loadUsers();

                        await loadAnalytics();


                    } catch (error) {

                        console.error(
                            'Role update failed:',
                            error
                        );


                        alert(
                            error.message
                        );


                        roleButton.disabled =
                            false;


                        roleButton.textContent =
                            roleButtonText;

                    }

                }
            );

        }


        // ====================================================
        // DELETE USER BUTTON
        // ====================================================

        const deleteButton =
            card.querySelector(
                '.admin-delete-btn'
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                'click',
                async () => {

                    const userId =
                        deleteButton.dataset.userId;


                    const confirmDelete =
                        confirm(
                            `Are you sure you want to delete ${currentUser.name}?`
                        );


                    if (!confirmDelete) {

                        return;

                    }


                    try {

                        deleteButton.disabled =
                            true;


                        deleteButton.textContent =
                            'Deleting...';


                        const response =
                            await fetch(
                                `${API_BASE_URL}/api/admin/users/${userId}`,
                                {
                                    method: 'DELETE',

                                    headers: {

                                        'Authorization':
                                            `Bearer ${token}`

                                    }

                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                data.error ||
                                'Failed to delete user'
                            );

                        }


                        alert(
                            `${currentUser.name} has been deleted.`
                        );


                        await loadUsers();

                        await loadAnalytics();


                    } catch (error) {

                        console.error(
                            'Delete user failed:',
                            error
                        );


                        alert(
                            error.message
                        );


                        deleteButton.disabled =
                            false;


                        deleteButton.textContent =
                            'Delete User';

                    }

                }
            );

        }

    });

}


// ============================================================
// REVIEW MANAGEMENT
// ============================================================

// ============================================================
// LOAD ALL REVIEWS
// ============================================================

async function loadReviews() {

    try {

        const response =
            await fetch(
                '${API_BASE_URL}/api/admin/reviews',
                {
                    method: 'GET',

                    headers: {
                        'Authorization':
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                'Failed to load reviews'
            );

        }


        const reviews =
            await response.json();


        console.log(
            'ADMIN REVIEWS:',
            reviews
        );


        // Store all reviews
        allReviews =
            Array.isArray(reviews)
                ? reviews
                : [];


        // Create filter options
        populateReviewFilters(
            allReviews
        );


        // Display reviews
        renderReviews(
            allReviews
        );


    } catch (error) {

        console.error(
            'Failed to load reviews:',
            error
        );


        if (reviewsEmpty) {

            reviewsEmpty.style.display =
                'block';


            const heading =
                reviewsEmpty.querySelector('h3');


            if (heading) {

                heading.textContent =
                    'Unable to load reviews.';

            }

        }

    }

}


// ============================================================
// RENDER REVIEWS
// ============================================================

function renderReviews(reviews) {

    if (!reviewsGrid) {
        return;
    }


    reviewsGrid.innerHTML = '';


    // ========================================================
    // REVIEW COUNT
    // ========================================================

    if (reviewCount) {

        reviewCount.textContent =
            `${reviews.length} ${
                reviews.length === 1
                    ? 'review'
                    : 'reviews'
            }`;

    }


    // ========================================================
    // NO REVIEWS
    // ========================================================

    if (reviews.length === 0) {

        if (reviewsEmpty) {

            reviewsEmpty.style.display =
                'block';

        }

        return;

    }


    if (reviewsEmpty) {

        reviewsEmpty.style.display =
            'none';

    }


    // ========================================================
    // CREATE REVIEW CARDS
    // ========================================================

    reviews.forEach(review => {

        const card =
            document.createElement(
                'article'
            );


        card.className =
            'my-review-card';


        // ====================================================
        // REVIEW CARD HTML
        // ====================================================

        card.innerHTML = `

            <div class="my-review-icon">

                🎬

            </div>


            <div class="my-review-content">

                <div class="my-review-meta">

                    ${review.genre || ''}

                </div>


                <h3>

                    ${review.title || ''}

                </h3>


                <p class="my-review-director">

                    Director:
                    ${review.director || ''}

                </p>


                <p class="my-review-blurb">

                    Rating:
                    ⭐ ${review.rating ?? ''}

                </p>


                <p class="my-review-blurb">

                    Year:
                    ${review.year ?? ''}

                </p>


                <p class="my-review-blurb">

                    Runtime:
                    ${review.runtime ?? ''} minutes

                </p>


                <p class="my-review-blurb">

                    Review:
                    ${review.review || ''}

                </p>


                <p class="my-review-blurb">

                    Posted by:
                    ${review.user_name || 'Unknown user'}

                </p>


                <p class="my-review-blurb">

                    Email:
                    ${review.user_email || 'Unknown'}

                </p>


                <p class="my-review-blurb">

                    Review ID:
                    ${review.id}

                </p>


                <div class="admin-review-actions">

                    <button
                        class="admin-edit-btn"
                        data-review-id="${review.id}">

                        ✏️ Edit Review

                    </button>


                    <button
                        class="admin-delete-review-btn"
                        data-review-id="${review.id}">

                        🗑 Delete Review

                    </button>

                </div>

            </div>

        `;


        reviewsGrid.appendChild(card);


        // ====================================================
        // EDIT REVIEW BUTTON
        // ====================================================

        const editButton =
            card.querySelector(
                '.admin-edit-btn'
            );


        if (editButton) {

            editButton.addEventListener(
                'click',
                () => {

                    openEditReview(review);

                }
            );

        }


        // ====================================================
        // DELETE REVIEW BUTTON
        // ====================================================

        const deleteReviewButton =
            card.querySelector(
                '.admin-delete-review-btn'
            );


        if (deleteReviewButton) {

            deleteReviewButton.addEventListener(
                'click',
                () => {

                    deleteReview(review);

                }
            );

        }

    });

}


// ============================================================
// EDIT REVIEW
// ============================================================

// ============================================================
// OPEN EDIT REVIEW MODAL
// ============================================================

function openEditReview(review) {

    document.getElementById(
        'editReviewId'
    ).value =
        review.id;


    document.getElementById(
        'editTitle'
    ).value =
        review.title || '';


    document.getElementById(
        'editYear'
    ).value =
        review.year || '';


    document.getElementById(
        'editGenre'
    ).value =
        review.genre || '';


    document.getElementById(
        'editDirector'
    ).value =
        review.director || '';


    document.getElementById(
        'editRuntime'
    ).value =
        review.runtime || '';


    document.getElementById(
        'editRating'
    ).value =
        review.rating ?? '';


    document.getElementById(
        'editBlurb'
    ).value =
        review.blurb || '';


    document.getElementById(
        'editReview'
    ).value =
        review.review || '';


    document.getElementById(
        'editVerdict'
    ).value =
        review.verdict || '';


    document.getElementById(
        'editIcon'
    ).value =
        review.icon || '';


    document.getElementById(
        'editColors'
    ).value =
        review.colors || '';


    document.getElementById(
        'editTags'
    ).value =
        review.tags || '';


    document.getElementById(
        'editCritic'
    ).value =
        review.critic || '';


    document.getElementById(
        'editPublished'
    ).value =
        review.published || '';


    if (editReviewModal) {

        editReviewModal.style.display =
            'flex';

    }


    document.body.style.overflow =
        'hidden';

}


// ============================================================
// CLOSE EDIT MODAL
// ============================================================

function closeEditModal() {

    if (editReviewModal) {

        editReviewModal.style.display =
            'none';

    }


    document.body.style.overflow =
        '';


    if (editReviewForm) {

        editReviewForm.reset();

    }

}


// ============================================================
// CLOSE BUTTON
// ============================================================

if (closeEditReview) {

    closeEditReview.addEventListener(
        'click',
        closeEditModal
    );

}


// ============================================================
// CANCEL BUTTON
// ============================================================

if (cancelEditReview) {

    cancelEditReview.addEventListener(
        'click',
        closeEditModal
    );

}


// ============================================================
// CLICK OUTSIDE MODAL
// ============================================================

if (editReviewModal) {

    const editOverlay =
        editReviewModal.querySelector(
            '.edit-review-overlay'
        );


    if (editOverlay) {

        editOverlay.addEventListener(
            'click',
            closeEditModal
        );

    }

}


// ============================================================
// SAVE EDITED REVIEW
// ============================================================

if (editReviewForm) {

    editReviewForm.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();


            // ==================================================
            // GET REVIEW ID
            // ==================================================

            const editReviewId =
                document.getElementById(
                    'editReviewId'
                );


            if (!editReviewId) {

                alert(
                    'Review ID field is missing.'
                );

                return;

            }


            const reviewId =
                editReviewId.value;


            // ==================================================
            // GET FORM VALUES
            // ==================================================

            const title =
                document.getElementById(
                    'editTitle'
                ).value.trim();


            const year =
                Number(
                    document.getElementById(
                        'editYear'
                    ).value
                );


            const genre =
                document.getElementById(
                    'editGenre'
                ).value.trim();


            const director =
                document.getElementById(
                    'editDirector'
                ).value.trim();


            const runtime =
                Number(
                    document.getElementById(
                        'editRuntime'
                    ).value
                );


            const rating =
                Number(
                    document.getElementById(
                        'editRating'
                    ).value
                );


            const blurb =
                document.getElementById(
                    'editBlurb'
                ).value.trim();


            const review =
                document.getElementById(
                    'editReview'
                ).value.trim();


            const verdict =
                document.getElementById(
                    'editVerdict'
                ).value.trim();


            const icon =
                document.getElementById(
                    'editIcon'
                ).value.trim();


            const colors =
                document.getElementById(
                    'editColors'
                ).value.trim();


            const tags =
                document.getElementById(
                    'editTags'
                ).value.trim();


            const critic =
                document.getElementById(
                    'editCritic'
                ).value.trim();


            const published =
                document.getElementById(
                    'editPublished'
                ).value.trim();


            // ==================================================
            // VALIDATION
            // ==================================================

            if (
                !title ||
                !year ||
                !genre ||
                !director ||
                !runtime ||
                !blurb ||
                !review ||
                !verdict ||
                !icon ||
                !colors ||
                !tags ||
                !critic ||
                !published
            ) {

                alert(
                    'Please fill in all fields.'
                );

                return;

            }


            // ==================================================
            // VALIDATE YEAR
            // ==================================================

            if (
                Number.isNaN(year) ||
                year < 1888 ||
                year > 2100
            ) {

                alert(
                    'Please enter a valid movie year.'
                );

                return;

            }


            // ==================================================
            // VALIDATE RUNTIME
            // ==================================================

            if (
                Number.isNaN(runtime) ||
                runtime <= 0
            ) {

                alert(
                    'Runtime must be greater than 0.'
                );

                return;

            }


            // ==================================================
            // VALIDATE RATING
            // ==================================================

            if (
                Number.isNaN(rating) ||
                rating < 0 ||
                rating > 10
            ) {

                alert(
                    'Rating must be between 0 and 10.'
                );

                return;

            }


            // ==================================================
            // PREPARE DATA
            // ==================================================

            const updatedData = {

                title: title,

                year: year,

                genre: genre,

                director: director,

                runtime: runtime,

                rating: rating,

                blurb: blurb,

                review: review,

                verdict: verdict,

                icon: icon,

                colors: colors,

                tags: tags,

                critic: critic,

                published: published

            };


            // ==================================================
            // SEND UPDATE REQUEST
            // ==================================================

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/admin/reviews/${reviewId}`,
                        {
                            method: 'PUT',

                            headers: {

                                'Content-Type':
                                    'application/json',

                                'Authorization':
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    updatedData
                                )

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


                // ==================================================
                // SUCCESS
                // ==================================================

                alert(
                    'Review updated successfully!'
                );


                closeEditModal();


                await loadReviews();

                await loadAnalytics();


            } catch (error) {

                console.error(
                    'Failed to update review:',
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


// ============================================================
// DELETE REVIEW
// ============================================================

async function deleteReview(review) {

    const confirmDelete =
        confirm(
            `Are you sure you want to delete "${review.title}"?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/reviews/${review.id}`,
                {
                    method: 'DELETE',

                    headers: {

                        'Authorization':
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to delete review'
            );

        }


        alert(
            `"${review.title}" has been deleted successfully.`
        );


        await loadReviews();

        await loadAnalytics();


    } catch (error) {

        console.error(
            'Failed to delete review:',
            error
        );


        alert(
            error.message
        );

    }

}


// ============================================================
// REVIEW SEARCH & FILTER
// ============================================================

// ============================================================
// POPULATE REVIEW FILTERS
// ============================================================

function populateReviewFilters(reviews) {

    // ========================================================
    // GENRES
    // ========================================================

    if (!genreFilter) {
        return;
    }


    const genres = [
        ...new Set(
            reviews
                .map(
                    review => review.genre
                )
                .filter(Boolean)
        )
    ];


    genres.sort();


    genreFilter.innerHTML = `

        <option value="all">

            All Genres

        </option>

    `;


    genres.forEach(genre => {

        const option =
            document.createElement(
                'option'
            );


        option.value =
            genre;


        option.textContent =
            genre;


        genreFilter.appendChild(
            option
        );

    });


    // ========================================================
    // YEARS
    // ========================================================

    if (!yearFilter) {
        return;
    }


    const years = [
        ...new Set(
            reviews
                .map(
                    review => review.year
                )
                .filter(Boolean)
        )
    ];


    years.sort(
        (a, b) => b - a
    );


    yearFilter.innerHTML = `

        <option value="all">

            All Years

        </option>

    `;


    years.forEach(year => {

        const option =
            document.createElement(
                'option'
            );


        option.value =
            year;


        option.textContent =
            year;


        yearFilter.appendChild(
            option
        );

    });

}


// ============================================================
// FILTER REVIEWS
// ============================================================

function filterReviews() {

    if (
        !reviewSearch ||
        !genreFilter ||
        !ratingFilter ||
        !yearFilter
    ) {

        return;

    }


    const searchText =
        reviewSearch.value
            .trim()
            .toLowerCase();


    const selectedGenre =
        genreFilter.value;


    const selectedRating =
        ratingFilter.value;


    const selectedYear =
        yearFilter.value;


    const filteredReviews =
        allReviews.filter(review => {

            // ==================================================
            // SEARCH
            // ==================================================

            const searchableText = `

                ${review.title || ''}

                ${review.director || ''}

                ${review.genre || ''}

                ${review.user_name || ''}

                ${review.user_email || ''}

            `.toLowerCase();


            const matchesSearch =
                !searchText ||
                searchableText.includes(
                    searchText
                );


            // ==================================================
            // GENRE
            // ==================================================

            const matchesGenre =
                selectedGenre === 'all' ||
                review.genre === selectedGenre;


            // ==================================================
            // RATING
            // ==================================================

            let matchesRating =
                true;


            if (
                selectedRating !== 'all'
            ) {

                matchesRating =
                    Number(review.rating) >=
                    Number(selectedRating);

            }


            // ==================================================
            // YEAR
            // ==================================================

            const matchesYear =
                selectedYear === 'all' ||
                String(review.year) ===
                String(selectedYear);


            // ==================================================
            // FINAL RESULT
            // ==================================================

            return (
                matchesSearch &&
                matchesGenre &&
                matchesRating &&
                matchesYear
            );

        });


    renderReviews(
        filteredReviews
    );

}


// ============================================================
// SEARCH EVENT
// ============================================================

if (reviewSearch) {

    reviewSearch.addEventListener(
        'input',
        filterReviews
    );

}


// ============================================================
// GENRE FILTER EVENT
// ============================================================

if (genreFilter) {

    genreFilter.addEventListener(
        'change',
        filterReviews
    );

}


// ============================================================
// RATING FILTER EVENT
// ============================================================

if (ratingFilter) {

    ratingFilter.addEventListener(
        'change',
        filterReviews
    );

}


// ============================================================
// YEAR FILTER EVENT
// ============================================================

if (yearFilter) {

    yearFilter.addEventListener(
        'change',
        filterReviews
    );

}


// ============================================================
// RESET FILTERS
// ============================================================

if (resetReviewFilters) {

    resetReviewFilters.addEventListener(
        'click',
        () => {

            if (reviewSearch) {

                reviewSearch.value =
                    '';

            }


            if (genreFilter) {

                genreFilter.value =
                    'all';

            }


            if (ratingFilter) {

                ratingFilter.value =
                    'all';

            }


            if (yearFilter) {

                yearFilter.value =
                    'all';

            }


            renderReviews(
                allReviews
            );

        }
    );

}


// ============================================================
// ADMIN ANALYTICS
// ============================================================

// ============================================================
// LOAD ADMIN ANALYTICS
// ============================================================

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                '${API_BASE_URL}/api/admin/analytics',
                {
                    method: 'GET',

                    headers: {
                        'Authorization':
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                'Failed to load analytics'
            );

        }


        const analytics =
            await response.json();


        console.log(
            'ADMIN ANALYTICS:',
            analytics
        );


        // ========================================================
        // USER STATISTICS
        // ========================================================

        if (
            analytics.users &&
            totalAdmins
        ) {

            totalAdmins.textContent =
                analytics.users.admins;

        }


        if (
            analytics.users &&
            totalNormalUsers
        ) {

            totalNormalUsers.textContent =
                analytics.users.normalUsers;

        }


        if (
            analytics.users &&
            analyticsTotalUsers
        ) {

            analyticsTotalUsers.textContent =
                analytics.users.total;

        }


        // ========================================================
        // REVIEW STATISTICS
        // ========================================================

        if (
            analytics.reviews &&
            totalReviews
        ) {

            totalReviews.textContent =
                analytics.reviews.total;

        }


        if (
            analytics.reviews &&
            averageRating
        ) {

            averageRating.textContent =
                analytics.reviews.averageRating;

        }


        // ========================================================
        // REVIEWS BY GENRE
        // ========================================================

        renderGenreAnalytics(
            analytics.reviewsByGenre
        );


        // ========================================================
        // REVIEWS BY YEAR
        // ========================================================

        renderYearAnalytics(
            analytics.reviewsByYear
        );


    } catch (error) {

        console.error(
            'Failed to load analytics:',
            error
        );

    }

}


// ============================================================
// RENDER GENRE ANALYTICS
// ============================================================

function renderGenreAnalytics(
    genreData
) {

    if (!reviewsByGenre) {
        return;
    }


    reviewsByGenre.innerHTML =
        '';


    // ========================================================
    // NO DATA
    // ========================================================

    if (
        !genreData ||
        genreData.length === 0
    ) {

        reviewsByGenre.innerHTML = `

            <p class="admin-analytics-empty">

                No genre data available.

            </p>

        `;

        return;

    }


    // ========================================================
    // FIND HIGHEST REVIEW COUNT
    // ========================================================

    const maxCount =
        Math.max(
            ...genreData.map(
                item => Number(item.count)
            )
        );


    // ========================================================
    // CREATE GENRE ROWS
    // ========================================================

    genreData.forEach(item => {

        const percentage =
            maxCount > 0
                ? (
                    Number(item.count) /
                    maxCount
                ) * 100
                : 0;


        const row =
            document.createElement(
                'div'
            );


        row.className =
            'admin-genre-item';


        row.innerHTML = `

            <div class="admin-genre-info">

                <span>

                    ${item.genre}

                </span>


                <strong>

                    ${item.count}

                </strong>

            </div>


            <div class="admin-genre-bar">

                <div
                    class="admin-genre-bar-fill"
                    style="width: ${percentage}%;">
                </div>

            </div>

        `;


        reviewsByGenre.appendChild(
            row
        );

    });

}


// ============================================================
// RENDER YEAR ANALYTICS
// ============================================================

function renderYearAnalytics(
    yearData
) {

    if (!reviewsByYear) {
        return;
    }


    reviewsByYear.innerHTML =
        '';


    // ========================================================
    // NO DATA
    // ========================================================

    if (
        !yearData ||
        yearData.length === 0
    ) {

        reviewsByYear.innerHTML = `

            <p class="admin-analytics-empty">

                No year data available.

            </p>

        `;

        return;

    }


    // ========================================================
    // FIND HIGHEST REVIEW COUNT
    // ========================================================

    const maxCount =
        Math.max(
            ...yearData.map(
                item => Number(item.count)
            )
        );


    // ========================================================
    // CREATE YEAR ROWS
    // ========================================================

    yearData.forEach(item => {

        const percentage =
            maxCount > 0
                ? (
                    Number(item.count) /
                    maxCount
                ) * 100
                : 0;


        const row =
            document.createElement(
                'div'
            );


        row.className =
            'admin-year-item';


        row.innerHTML = `

            <div class="admin-year-info">

                <span>

                    ${item.year}

                </span>


                <strong>

                    ${item.count}

                </strong>

            </div>


            <div class="admin-year-bar">

                <div
                    class="admin-year-bar-fill"
                    style="width: ${percentage}%;">
                </div>

            </div>

        `;


        reviewsByYear.appendChild(
            row
        );

    });

}


// ============================================================
// START ADMIN DASHBOARD
// ============================================================

loadUsers();

loadReviews();

loadAnalytics();