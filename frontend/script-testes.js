// Função para obter o token
function getToken() {
    return localStorage.getItem('token');
}

// Função para carregar tarefas do servidor
async function carregarTarefas() {
    try {
        const token = getToken();
        const response = await fetch('/api/tarefas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.tarefas;
        }
        return [];
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        return [];
    }
}

// Função para guardar tarefas no servidor
async function guardarTarefas(tarefas) {
    try {
        const token = getToken();
        const response = await fetch('/api/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tarefas: tarefas })
        });

        if (!response.ok) {
            console.error('Erro ao guardar tarefas no servidor');
        }
    } catch (error) {
        console.error('Erro ao guardar tarefas:', error);
    }
}

// Função para adicionar tarefas
async function adicionarTarefa() {
    let nome = document.getElementById('nomeTarefa').value;
    let data = document.getElementById('dataTarefa').value;
    
    if (nome === '' || data === '') {
        alert('Por favor, preenche todos os campos!');
        return;
    }
    
    let tarefa = {
        id: Date.now(),
        nome: nome,
        data: data
    };
    
    // Carregar tarefas existentes
    let tarefas = await carregarTarefas();
    
    // Adicionar nova tarefa
    tarefas.push(tarefa);
    
    // Guardar no servidor
    await guardarTarefas(tarefas);
    
    // Limpar os campos
    document.getElementById('nomeTarefa').value = '';
    document.getElementById('dataTarefa').value = '';
    
    // Atualizar a lista
    mostrarTarefas();
}

// Função para mostrar as tarefas
async function mostrarTarefas() {
    let tarefas = await carregarTarefas();
    let lista = document.getElementById('listaTarefas');
    
    if (tarefas.length === 0) {
        lista.innerHTML = '<p class="mensagem-vazio">Ainda não tens testes marcados.</p>';
        return;
    }
    
    lista.innerHTML = '';
    
    // Ordenar por data
    tarefas.sort((a, b) => new Date(a.data) - new Date(b.data));
    
    tarefas.forEach(tarefa => {
        let dataFormatada = new Date(tarefa.data + 'T00:00:00').toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        let item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-info">
                <strong>${tarefa.nome}</strong> - ${dataFormatada}
            </div>
            <button class="btn-apagar" onclick="apagarTarefa(${tarefa.id})">Apagar</button>
        `;
        lista.appendChild(item);
    });
}

// Função para apagar uma tarefa
async function apagarTarefa(id) {
    let tarefas = await carregarTarefas();
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);
    await guardarTarefas(tarefas);
    mostrarTarefas();
}

// Carregar as tarefas quando a página abre
window.onload = function() {
    mostrarTarefas();
};