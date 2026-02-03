// Função para adicionar tarefas
function adicionarTarefa() {
    // Buscar os valores que o utilizador escreveu
    let nome = document.getElementById('nomeTarefa').value;
    let data = document.getElementById('dataTarefa').value;
    
    // Verificar se preencheu tudo
    if (nome === '' || data === '') {
        alert('Por favor, preenche todos os campos!');
        return;
    }
    
    // Criar objeto da tarefa
    let tarefa = {
        id: Date.now(),
        nome: nome,
        data: data
    };
    
    // Buscar tarefas existentes do LocalStorage
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    
    // Adicionar a nova tarefa
    tarefas.push(tarefa);
    
    // Guardar no LocalStorage
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    
    // Limpar os campos
    document.getElementById('nomeTarefa').value = '';
    document.getElementById('dataTarefa').value = '';
    
    // Atualizar a lista
    mostrarTarefas();
}

// Função para mostrar as tarefas
function mostrarTarefas() {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    let lista = document.getElementById('listaTarefas');
    
    // Se não houver tarefas
    if (tarefas.length === 0) {
        lista.innerHTML = '<p class="mensagem-vazio">Ainda não tens testes marcados.</p>';
        return;
    }
    
    // Limpar a lista
    lista.innerHTML = '';
    
    // Ordenar por data
    tarefas.sort((a, b) => new Date(a.data) - new Date(b.data));
    
    // Mostrar cada tarefa
    tarefas.forEach(tarefa => {
        // Formatar a data
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
function apagarTarefa(id) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    mostrarTarefas();
}

// Carregar as tarefas quando a página abre
window.onload = function() {
    mostrarTarefas();
};