const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const message = document.getElementById('message');

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.error || 'Login failed';
            return;
        }

        // Save JWT token
        localStorage.setItem('token', data.token);

        // Save user information
        localStorage.setItem('user', JSON.stringify(data.user));

        message.style.color = 'lightgreen';
        message.textContent = 'Login successful!';

        // Go to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {

        console.error('Login error:', error);

        message.textContent =
            'Unable to connect to the server';
    }

});