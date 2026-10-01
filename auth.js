// ==========================================================
// REELMARK — SESSION LOGOUT
// ==========================================================

function logoutUser() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = 'login.html';
}

/* ==========================================================
   REELMARK — Authentication Protection
   ========================================================== */

const token = localStorage.getItem('token');


// ==========================================================
// NO TOKEN
// ==========================================================

if (!token) {

    window.location.href = 'login.html';

}


// ==========================================================
// CHECK TOKEN
// ==========================================================

else {

    try {

        // JWT format:
        // header.payload.signature

        const payload = JSON.parse(
            atob(token.split('.')[1])
        );


        // ==================================================
        // CHECK EXPIRATION
        // ==================================================

        if (
            payload.exp &&
            payload.exp * 1000 < Date.now()
        ) {

            console.log(
                'Session expired. Logging out.'
            );

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href =
                'login.html';

        }

    } catch (error) {

        console.error(
            'Invalid authentication token:',
            error
        );

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.location.href =
            'login.html';

    }

}