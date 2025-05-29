document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Guardar token y redirigir
                localStorage.setItem('parking_token', data.token);
                window.location.href = '/dashboard';
            } else {
                showError(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Error de conexión con el servidor');
        }
    });
    
    function showError(message) {
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        const form = document.querySelector('.login-form');
        const existingError = form.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        form.appendChild(errorElement);
    }
});