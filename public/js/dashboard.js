document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('parking_token');
    
    if (!token) {
        window.location.href = '/login';
        return;
    }
    
    // Cargar datos del usuario
    loadUserData();
    
    // Configurar botones/eventos
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

async function loadUserData() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('parking_token')}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            document.getElementById('userName').textContent = userData.username;
        } else {
            throw new Error('Error al cargar datos');
        }
    } catch (error) {
        console.error(error);
        logout();
    }
}

function logout() {
    localStorage.removeItem('parking_token');
    window.location.href = '/login';
}