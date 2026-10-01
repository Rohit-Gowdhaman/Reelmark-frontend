const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const message = document.getElementById('registerMessage');

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/auth/register`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            message.style.color = '#ff6b6b';

            message.textContent =
                data.error || 'Registration failed';

            return;
        }

        message.style.color = 'lightgreen';

        message.textContent =
            'Registration successful!';

        setTimeout(() => {

            window.location.href = 'login.html';

        }, 1000);

    } catch (error) {

        console.error('Registration error:', error);

        message.style.color = '#ff6b6b';

        message.textContent =
            'Unable to connect to the server';
    }

});
