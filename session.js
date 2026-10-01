function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = 'login.html';
}

async function authenticatedFetch(url, options = {}) {

    const token = localStorage.getItem('token');

    if (!token) {
        logoutUser();
        return;
    }

    const headers = new Headers(
        options.headers || {}
    );

    headers.set(
        'Authorization',
        `Bearer ${token}`
    );

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logoutUser();
    }

    return response;
}