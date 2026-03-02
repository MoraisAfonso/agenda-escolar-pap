// Verificar se o utilizador está autenticado
async function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    
    // Se não tem token, redireciona para login
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }

    try {
        // Verificar se o token é válido
        const response = await fetch('/api/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Token inválido, limpar e redirecionar
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = 'login.html';
        return false;
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Mostrar email do utilizador
function mostrarEmailUtilizador() {
    const email = localStorage.getItem('userEmail');
    const emailElement = document.getElementById('userEmail');
    if (emailElement && email) {
        emailElement.textContent = email;
    }
}

// Executar verificação quando a página carrega
verificarAutenticacao();