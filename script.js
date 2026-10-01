/* ==========================================================
   REELMARK — data, rendering, and interactions
   ========================================================== */

let REVIEWS = [];

/* ==========================================================
   login logout process
   ========================================================== */
const loginBtn = document.getElementById('loginBtn');

/* ==========================================================
   showing logined username 
   ========================================================== */
const userName = document.getElementById('userName');


/* ==========================================================
   showing logined button when a new user see the page  
   ========================================================== */
const profileBtn =
  document.getElementById('profileBtn');

/* ==========================================================
   showing admin dhashboard button only when admin logedin 
   ========================================================== */
const adminBtn = document.getElementById('adminBtn');

function updateAuthButton() {

  const token = localStorage.getItem('token');

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem('user')
    );
  } catch (error) {
    user = null;
  }


  // ==========================================
  // USER IS LOGGED IN
  // ==========================================

  if (token && user) {

    loginBtn.textContent = 'Logout';
    loginBtn.href = '#';

    userName.textContent =
      `Hi, ${user.name}`;


    // Show Profile button
    profileBtn.style.display =
      'inline-flex';


    // ========================================
    // ADMIN
    // ========================================

    if (user.role === 'admin') {

      adminBtn.style.display =
        'inline-flex';

    } else {

      adminBtn.style.display =
        'none';
    }

  }


  // ==========================================
  // USER IS LOGGED OUT
  // ==========================================

  else {

    loginBtn.textContent = 'Login';
    loginBtn.href = 'login.html';

    userName.textContent = '';


    // Hide Profile
    profileBtn.style.display =
      'none';


    // Hide Admin Dashboard
    adminBtn.style.display =
      'none';
  }
}

loginBtn.addEventListener('click', (event) => {

  const token =
    localStorage.getItem('token');

  if (token) {

    // User is logged in → logout
    event.preventDefault();

    logoutUser();

  }

});

updateAuthButton();

const currentUser = JSON.parse(localStorage.getItem('user'));

async function loadReviews() {

  try {

    // SHOW LOADING MESSAGE
    reviewsStatus.style.display = 'block';
    reviewsStatus.textContent =
      'Loading reviews...';

    grid.style.display = 'none';
    emptyState.style.display = 'none';

    const response = await fetch(
      "${API_BASE_URL}/api/reviews"
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status}`
      );
    }

    REVIEWS = await response.json();

    console.log(
      "Reviews loaded from backend:",
      REVIEWS
    );

    // Rebuild genre buttons
    setupGenres();

    // Update ticker
    updateTicker();

    // Update review count
    heroCount.textContent =
      REVIEWS.length;

    // Render reviews
    render(false);

    // HIDE LOADING MESSAGE
    reviewsStatus.style.display = 'none';

    grid.style.display = 'grid';

  } catch (error) {

    console.error(
      "Failed to load reviews:",
      error
    );

    // Hide review grid
    grid.style.display = 'none';

    // Show error message
    reviewsStatus.style.display = 'block';

    reviewsStatus.textContent =
      'Unable to load reviews. Please make sure the server is running.';
  }
}
  

/* ---------- generated poster-art icons (original line-art, one per title) ---------- */
const ICONS = {
  orchard: `<path d="M32 54V34" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="20" r="14" stroke-width="2"/><circle cx="16" cy="30" r="9" stroke-width="2"/><circle cx="48" cy="30" r="9" stroke-width="2"/>`,
  radio: `<rect x="12" y="24" width="40" height="26" rx="3" stroke-width="2"/><circle cx="22" cy="37" r="6" stroke-width="2"/><path d="M36 33h10M36 41h6" stroke-width="2" stroke-linecap="round"/><path d="M24 24l6-10h4l6 10" stroke-width="2" stroke-linecap="round"/>`,
  wolf: `<path d="M12 46 20 20l6 8 6-8 6 8 6-8 8 26" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="24" cy="34" r="1.6" fill="#fff" stroke="none"/><circle cx="40" cy="34" r="1.6" fill="#fff" stroke="none"/>`,
  mask: `<path d="M14 22c0-6 8-10 18-10s18 4 18 10-6 20-18 20-18-14-18-20Z" stroke-width="2"/><path d="M22 22c2-3 6-3 8 0M34 22c2-3 6-3 8 0" stroke-width="2" stroke-linecap="round"/><path d="M24 34c3 3 13 3 16 0" stroke-width="2" stroke-linecap="round"/>`,
  choir: `<path d="M32 10c-8 0-14 8-14 18v20h28V28c0-10-6-18-14-18Z" stroke-width="2"/><path d="M24 22h16M22 30h20" stroke-width="1.4" stroke-linecap="round"/><circle cx="32" cy="16" r="4" stroke-width="2"/>`,
  "gear-flower": `<circle cx="32" cy="32" r="10" stroke-width="2"/><path d="M32 10v8M32 46v8M10 32h8M46 32h8M17 17l6 6M41 41l6 6M47 17l-6 6M23 41l-6 6" stroke-width="2" stroke-linecap="round"/>`,
  wave: `<path d="M8 26c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke-width="2" stroke-linecap="round"/><path d="M8 38c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke-width="2" stroke-linecap="round"/>`,
  doors: `<rect x="10" y="12" width="12" height="38" rx="1.5" stroke-width="1.6"/><rect x="26" y="12" width="12" height="38" rx="1.5" stroke-width="1.6"/><rect x="42" y="12" width="12" height="38" rx="1.5" stroke-width="1.6"/><circle cx="19" cy="32" r="1.3" fill="#fff" stroke="none"/><circle cx="35" cy="32" r="1.3" fill="#fff" stroke="none"/><circle cx="51" cy="32" r="1.3" fill="#fff" stroke="none"/>`
};

function iconSVG(key){
  return `<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-linejoin="round">${ICONS[key] || ICONS.wave}</svg>`;
}

function posterStyle(colors){
  return `background:
    linear-gradient(160deg, ${colors[0]}, transparent 62%),
    linear-gradient(320deg, rgba(255,255,255,0.07), transparent 55%),
    linear-gradient(135deg, ${colors[0]}, ${colors[1]} 78%);`;
}

function posterMarkup(r) {

  const poster =
    r.poster && r.poster.trim()
      ? `
        <img
          src="${r.poster}"
          alt="${r.title} movie poster"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
      `
      : '';

  return `
    <div class="poster">

      ${poster}

      <div
        class="poster-fallback"
        style="${r.poster ? 'display:none;' : 'display:flex;'}"
      >
        <span>${r.title}</span>
      </div>

      <span class="genre-tag">
        ${r.genre || 'Movie'}
      </span>

      <span class="rating-badge">
        ${Number(r.rating || 0).toFixed(1)}★
      </span>

      <div class="poster-title">
        ${r.title}
      </div>

      <div class="card-spot"></div>

    </div>
  `;
}
/* ---------- dom refs ---------- */
const grid = document.getElementById('grid');
const pillsEl = document.getElementById('genrePills');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const reviewsStatus = document.getElementById('reviewsStatus');
const backdrop = document.getElementById('backdrop');
const modalContent = document.getElementById('modalContent');
const heroCount = document.getElementById('heroCount');
const cursorSpot = document.getElementById('cursorSpot');

let activeGenre = "All";
let currentList = [];
let currentIndex = -1;

function dbFrameMarkup(){
  return `<span class="db-dot tl"></span><span class="db-dot tr"></span><span class="db-dot br"></span><span class="db-dot bl"></span>
    <span class="db-line h top"></span><span class="db-line h bottom"></span><span class="db-line v left"></span><span class="db-line v right"></span>`;
}

function starsHTML(rating){
  let out = '<div class="stars">';
  for(let i=1;i<=5;i++) out += `<span class="sdot ${i <= Math.round(rating) ? 'on' : ''}"></span>`;
  return out + '</div>';
}

/* ---------- filtering / sorting ---------- */
function sortList(list){
  const v = sortSelect.value;
  const copy = [...list];
  if(v === 'rating-desc') copy.sort((a,b)=>b.rating-a.rating);
  else if(v === 'rating-asc') copy.sort((a,b)=>a.rating-b.rating);
  else if(v === 'year-desc') copy.sort((a,b)=>b.year-a.year);
  else if(v === 'year-asc') copy.sort((a,b)=>a.year-b.year);
  else if(v === 'az') copy.sort((a,b)=>a.title.localeCompare(b.title));
  return copy;
}

function computeList(){
  const query = searchInput.value.trim().toLowerCase();
  const filtered = REVIEWS.filter(r=>{
    const matchesGenre = activeGenre === "All" || r.genre === activeGenre;
    const matchesQuery = !query || r.title.toLowerCase().includes(query) || r.director.toLowerCase().includes(query);
    return matchesGenre && matchesQuery;
  });
  return sortList(filtered);
}

function render(animate){
  const filtered = computeList();
  currentList = filtered;
  resultCount.innerHTML = `<b>${filtered.length}</b> review${filtered.length===1?'':'s'}`;
  emptyState.style.display = filtered.length ? 'none' : 'block';

  if(animate && grid.children.length){
    [...grid.children].forEach(c => c.classList.add('leaving'));
    setTimeout(()=> paintGrid(filtered), 180);
  } else {
    paintGrid(filtered);
  }
}

function paintGrid(filtered){
  grid.innerHTML = '';
  filtered.forEach((r, idx) => {
    const card = document.createElement('article');
    card.className = 'card db-frame entering';
    card.style.animationDelay = `${idx * 30}ms`;
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', `Read the review of ${r.title}`);


    /* ---------- delete-button ---------- */
    card.innerHTML = `
      ${dbFrameMarkup()}

      <div class="db-content">

        ${posterMarkup(r, false)}

        <div class="body">

          <div class="meta">
            ${r.year} · dir. ${r.director} · ${r.runtime} min
          </div>

          <p class="blurb">
            ${r.blurb}
          </p>

          <div class="foot">

            ${starsHTML(r.rating)}

            <span class="readmore">
              Read review →
            </span>

          </div>

          ${
            
            //changed from r.id > 8 to the code given below
            currentUser && r.user_id === currentUser.id

              ? `
                <button
                  class="delete-review-btn"
                  data-id="${r.id}"
                  type="button">
                  Delete review
                </button>
              `
              : ''
          }

        </div>

      </div>
    `;


    // ==============================
    // OPEN REVIEW MODAL
    // ==============================

    const open = () => openModal(r);

    card.addEventListener('click', open);

    card.addEventListener('keydown', e => {

      if (
        e.key === 'Enter' ||
        e.key === ' '
      ) {

        e.preventDefault();

        open();
      }

    });


    // ==============================
    // DELETE REVIEW
    // ==============================

    const deleteBtn =
      card.querySelector('.delete-review-btn');

    if (deleteBtn) {

      deleteBtn.addEventListener(
        'click',
        async (e) => {

          e.stopPropagation();

          const reviewId =
            deleteBtn.dataset.id;

          const confirmed = confirm(
            `Are you sure you want to delete "${r.title}"?`
          );

          if (!confirmed) {
            return;
          }

          try {

            deleteBtn.disabled = true;

            deleteBtn.textContent =
              'Deleting...';

            const response = await fetch(
              `${API_BASE_URL}/api/reviews/${reviewId}`,
              {
                method: 'DELETE' ,
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`       }
              }
            );

            if (!response.ok) {

              const data =
                await response
                  .json()
                  .catch(() => ({}));

              throw new Error(
                data.error ||
                'Failed to delete review'
              );
            }

            // Get the updated list
            // from the backend
            await loadReviews();

          } catch (error) {

            console.error(
              'Delete error:',
              error
            );

            alert(
              'Could not delete the review: ' +
              error.message
            );

            deleteBtn.disabled = false;

            deleteBtn.textContent =
              'Delete review';
          }

        }
      );

    }


    // ==============================
    // CARD EFFECTS
    // ==============================

    attachTilt(card);

    attachSpotlight(card);

    grid.appendChild(card);

  });

}


/* ---------- pointer micro-interactions ---------- */
function attachTilt(card){
  const strength = 7; // degrees
  function onMove(e){
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * strength;
    const ry = (px - 0.5) * strength;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  }
  function onLeave(){ card.style.transform = ''; }
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
}

function attachSpotlight(card){
  const poster = card.querySelector('.poster');
  if(!poster) return;
  poster.addEventListener('mousemove', e => {
    const rect = poster.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    poster.style.setProperty('--mx', mx + '%');
    poster.style.setProperty('--my', my + '%');
  });
}



/* magnetic buttons: pull slightly toward the cursor on hover */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${mx * 0.15}px, ${my * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ---------- modal ---------- */
function openModal(r){

  currentIndex =
    currentList.findIndex(x => x.title === r.title);

  if(currentIndex === -1){

    currentList = [r, ...currentList];

    currentIndex = 0;

  }

  paintModal(r);

  /* Hide global cursor spotlight while modal is open */
  if(cursorSpot){
    cursorSpot.style.display = 'none';
  }

  backdrop.classList.add('open');

  requestAnimationFrame(() => {
    backdrop.classList.add('show');
  });

  document.addEventListener(
    'keydown',
    modalKeys
  );
}

function paintModal(r){

  const atStart =
    currentIndex <= 0;

  const atEnd =
    currentIndex >= currentList.length - 1;

  const poster =
    r.poster && r.poster.trim()
      ? `
        <img
          class="modal-movie-poster"
          src="${r.poster}"
          alt="${r.title} movie poster"
          onerror="
            this.style.display='none';
            this.nextElementSibling.style.display='flex';
          "
        >

        <div
          class="modal-poster-fallback"
          style="display:none;"
        >
          <div class="modal-fallback-icon">
            ${iconSVG(r.icon)}
          </div>

          <span>${r.title}</span>
        </div>
      `
      : `
        <div class="modal-poster-fallback">
          <div class="modal-fallback-icon">
            ${iconSVG(r.icon)}
          </div>

          <span>${r.title}</span>
        </div>
      `;


  modalContent.innerHTML = `

    <div class="modal-shell">

      <!-- ==================================================
           CLOSE BUTTON
           ================================================== -->

      <button
        class="modal-close"
        id="modalClose"
        aria-label="Close review"
        type="button"
      >
        ×
      </button>


      <!-- ==================================================
           MAIN MODAL CONTENT
           ================================================== -->

      <div class="modal-main">


        <!-- ==================================================
             LEFT — POSTER
             ================================================== -->

        <div class="modal-poster-column">

          <div class="modal-poster-frame">

            ${poster}

            <div class="modal-poster-overlay"></div>

            <div class="modal-poster-rating">
              ${Number(r.rating || 0).toFixed(1)}
              <span>★</span>
            </div>

          </div>


          <!-- POSTER INFORMATION -->

          <div class="modal-poster-caption">

            <span class="modal-poster-label">
              REELMARK REVIEW
            </span>

            <span class="modal-poster-year">
              ${r.year}
            </span>

          </div>

        </div>



        <!-- ==================================================
             RIGHT — MOVIE INFORMATION
             ================================================== -->

        <div class="modal-details">


          <!-- TOP LABEL -->

          <div class="modal-kicker">
            MOVIE REVIEW
          </div>


          <!-- TITLE -->

          <h2 class="modal-title">
            ${r.title}
          </h2>


          <!-- MOVIE META -->

          <div class="modal-meta">

            <span>${r.year}</span>

            <span class="meta-divider">•</span>

            <span>${r.genre || 'Movie'}</span>

            <span class="meta-divider">•</span>

            <span>${r.runtime || 0} min</span>

          </div>


          <!-- RATING -->

          <div class="modal-rating-row">

            <div class="modal-stars">
              ${starsHTML(r.rating)}
            </div>

            <div class="modal-rating-number">
              ${Number(r.rating || 0).toFixed(1)}
              <span>/ 5</span>
            </div>

          </div>


          <!-- INFORMATION GRID -->

          <div class="modal-info-grid">

            <div class="modal-info-item">

              <span class="modal-info-label">
                DIRECTOR
              </span>

              <strong>
                ${r.director || 'Unknown'}
              </strong>

            </div>


            <div class="modal-info-item">

              <span class="modal-info-label">
                YEAR
              </span>

              <strong>
                ${r.year}
              </strong>

            </div>


            <div class="modal-info-item">

              <span class="modal-info-label">
                RUNTIME
              </span>

              <strong>
                ${r.runtime || 0} min
              </strong>

            </div>


            <div class="modal-info-item">

              <span class="modal-info-label">
                IMDb
              </span>

              <strong>
                ${r.imdb_id || 'N/A'}
              </strong>

            </div>

          </div>


          <!-- VERDICT -->

          <div class="modal-verdict">

            <span class="modal-info-label">
              VERDICT
            </span>

            <span class="verdict-value">
              ${r.verdict || 'REVIEWED'}
            </span>

          </div>


          <!-- BLURB -->

          ${
            r.blurb
              ? `
                <div class="modal-blurb">
                  ${r.blurb}
                </div>
              `
              : ''
          }


          <!-- COMPLETE REVIEW -->

          <div class="modal-review-section">

            <div class="modal-section-heading">

              <span>
                FULL REVIEW
              </span>

              <span class="review-line"></span>

            </div>


            <div class="modal-review-text">

              ${r.review || 'No review content available.'}

            </div>

          </div>


        </div>

      </div>



      <!-- ==================================================
           NAVIGATION
           ================================================== -->

      <div class="modal-nav">

        <button
          id="prevBtn"
          class="modal-nav-btn"
          ${atStart ? 'disabled' : ''}
          type="button"
        >

          <span class="nav-arrow">←</span>

          <span>
            PREVIOUS
          </span>

        </button>


        <div class="modal-position">

          <span class="position-current">
            ${String(currentIndex + 1).padStart(2, '0')}
          </span>

          <span class="position-divider">
            /
          </span>

          <span>
            ${String(currentList.length).padStart(2, '0')}
          </span>

        </div>


        <button
          id="nextBtn"
          class="modal-nav-btn"
          ${atEnd ? 'disabled' : ''}
          type="button"
        >

          <span>
            NEXT
          </span>

          <span class="nav-arrow">→</span>

        </button>

      </div>

    </div>
  `;


  /* ========================================================
     MODAL EVENTS
     ======================================================== */

  document
    .getElementById('modalClose')
    .addEventListener(
      'click',
      closeModal
    );


  document
    .getElementById('prevBtn')
    .addEventListener(
      'click',
      () => step(-1)
    );


  document
    .getElementById('nextBtn')
    .addEventListener(
      'click',
      () => step(1)
    );

}

function step(dir){
  const next = currentIndex + dir;
  if(next < 0 || next >= currentList.length) return;
  currentIndex = next;
  paintModal(currentList[currentIndex]);
}

function modalKeys(e){
  if(e.key === 'Escape') closeModal();
  if(e.key === 'ArrowRight') step(1);
  if(e.key === 'ArrowLeft') step(-1);
}

function closeModal(){
  backdrop.classList.remove('show');
  document.removeEventListener('keydown', modalKeys);
  setTimeout(()=> backdrop.classList.remove('open'), 200);
}
backdrop.addEventListener('click', e => { if(e.target === backdrop) closeModal(); });

/* ---------- filters / sort / search wiring ---------- */
function setupGenres() {
  pillsEl.innerHTML = "";

  const genres = ["All", ...new Set(REVIEWS.map(r => r.genre))];

  genres.forEach(g => {
    const btn = document.createElement('button');

    btn.className = 'pill';
    btn.textContent = g;

    btn.setAttribute(
      'aria-pressed',
      g === "All" ? "true" : "false"
    );

    btn.addEventListener('click', () => {
      activeGenre = g;

      [...pillsEl.children].forEach(c => {
        c.setAttribute(
          'aria-pressed',
          c === btn ? 'true' : 'false'
        );
      });

      render(true);
    });

    pillsEl.appendChild(btn);
  });
}


searchInput.addEventListener('input', () => render(true));
sortSelect.addEventListener('change', () => render(true));

document.getElementById('shuffleBtn').addEventListener('click', () => {
  const pick = REVIEWS[Math.floor(Math.random() * REVIEWS.length)];
  currentList = computeList();
  openModal(pick);
});

/* ---------- ticker ---------- */
function updateTicker() {
  const tickerItems = REVIEWS.map(
    r => `<span><b>${r.rating}/5</b> — ${r.title} (${r.year})</span>`
  );

  document.getElementById('ticker').innerHTML =
    tickerItems.concat(tickerItems).join('');
}


/* ---------- animated hero counter ---------- */
function countUp() {
  let n = 0;
  const target = REVIEWS.length;

  const iv = setInterval(() => {
    n++;
    heroCount.textContent = n;

    if (n >= target) {
      clearInterval(iv);
    }
  }, 90);
}

loadReviews();
