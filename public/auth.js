const formTitle = document.getElementById('form-title');
const authContainer = document.getElementById('auth-container');
const authForm = document.getElementById('auth-form');
const usernameField = document.getElementById('username-field');
const toggleForm = document.getElementById('toggle-form');
const submitButton = authForm.querySelector('button[type="submit"]');

toggleForm.addEventListener('click', () => {
    const isSignup = formTitle.textContent === 'Sign Up';

    authContainer.classList.remove('opacity-100');
    authContainer.classList.add('opacity-0');

    setTimeout(() => {
        formTitle.textContent = isSignup ? 'Login' : 'Sign Up';
        toggleForm.textContent = isSignup ? 'Sign up' : 'Login';
        
        usernameField.classList.toggle('hidden', isSignup);
        submitButton.textContent = isSignup ? 'Login' : 'Sign Up';
        
        authContainer.classList.remove('opacity-0');
        authContainer.classList.add('opacity-100');
    }, 500); 
});

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username') ? document.getElementById('username').value : '';
    const password = document.getElementById('password').value;

    const formData = {
        email,
        password,
        ...(username ? { username } : {})
    };

    const endpoint = formTitle.textContent === 'Sign Up' ? '/signup' : '/login';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }

        alert(data.message || 'Success');
        if (endpoint === '/signup') {
            // Implement logic after successful signup
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
