# REELMARK — Frontend

The web frontend for **REELMARK**, a film review platform. Browse, search, and filter movie reviews, write your own, and manage everything from a profile page or an admin dashboard.

Built with plain **HTML, CSS, and vanilla JavaScript**. There is no build step and no framework.

- **Backend API:** https://reelmark-backend-hrqa.onrender.com
- **Health check:** https://reelmark-backend-hrqa.onrender.com/api/health/

## Features

- Browse all reviews with search by title or director
- Filter by genre and sort by rating, year, or title
- "Shuffle a pick" button for a random review
- User registration and login (JWT authentication)
- Add reviews with movie lookup by title and year
- Edit and delete your own reviews
- Personal profile page showing your reviews
- Admin dashboard to manage users, roles, and reviews, with analytics
- Automatic logout when the session token expires

## Project Structure

```
frontend/
├── index.html          # Home page: review grid, search, filters
├── login.html          # Login page
├── register.html       # Registration page
├── add-review.html     # Create / edit a review
├── profile.html        # Logged-in user's profile and reviews
├── admin.html          # Admin dashboard
├── config.js           # Backend API URL (API_BASE_URL)
├── session.js          # authenticatedFetch() helper and logout
├── auth.js             # Route protection and token expiry check
├── script.js           # Home page logic
├── login.js            # Login logic
├── register.js         # Registration logic
├── review-form.js      # Add / edit review logic
├── profile.js          # Profile page logic
├── admin.js            # Admin dashboard logic
└── style.css           # Styles
```

## Getting Started

### Run locally

No installation is needed. Because the pages call an API, serve the folder over HTTP rather than opening the files directly.

**Option 1: VS Code**
Install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

**Option 2: Python**
```bash
cd frontend
python -m http.server 5500
```
Then open http://localhost:5500

### Configure the API URL

The backend URL lives in a single file, `config.js`:

```js
const API_BASE_URL = "https://reelmark-backend-hrqa.onrender.com";
```

To test against a local backend, change it to your local address (for example `http://127.0.0.1:8000`) and change it back before deploying.

## API Endpoints Used

| Area    | Endpoint |
|---------|----------|
| Auth    | `POST /api/auth/register`, `POST /api/auth/login` |
| Reviews | `GET /api/reviews`, `POST /api/reviews`, `PUT/DELETE /api/reviews/:id`, `GET /api/reviews/my`, `GET /api/reviews/search-movie` |
| Admin   | `GET /api/admin/users`, `PUT/DELETE /api/admin/users/:id`, `GET /api/admin/reviews`, `PUT/DELETE /api/admin/reviews/:id`, `GET /api/admin/analytics` |

Authenticated requests send the JWT in the `Authorization: Bearer <token>` header. The token and user info are stored in `localStorage`.

## Deployment

Since this is a static site, it can be hosted for free on any static host:

- **Render** (Static Site): set the publish directory to the folder that contains `index.html`, with no build command
- **Netlify** or **Vercel**: import the GitHub repo, no build command needed
- **GitHub Pages**: enable Pages in the repo settings and select the `main` branch

### Important: CORS

After deploying, add your frontend's URL (for example `https://reelmark.netlify.app`) to the allowed origins in the backend's CORS settings. Without it, the browser will block API requests.

### Note on cold starts

If the backend is on Render's free plan, it sleeps after a period of inactivity. The first request after a while can take 30 to 60 seconds, so the first login or page load may seem slow.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+, Fetch API)
- JWT authentication via `localStorage`

## License

Add your preferred license here (for example MIT).
