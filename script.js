// Função para adicionar uma tarefa
function adicionarTarefa() {
    // Buscar os valores que o utilizador escreveu
    let nome = document.getElementById('nomeTarefa').value;
    let data = document.getElementById('dataTarefa').value;
    
    // Verificar se preencheu tudo
    if (nome === '' || data === '') {
        alert('Por favor, preenche todos os campos!');
        return;
    }
    
    // Buscar onde vamos mostrar as tarefas
    let lista = document.getElementById('listaTarefas');
    
    // Criar uma nova tarefa
    let novaTarefa = document.createElement('div');
    novaTarefa.innerHTML = nome + ' - ' + data;
    
    // Adicionar à lista
    lista.appendChild(novaTarefa);
    
    // Limpar os campos
    document.getElementById('nomeTarefa').value = '';
    document.getElementById('dataTarefa').value = '';
}

// Função para adicionar aulas ao horário
function adicionarAula() {
    // Buscar os valores que o utilizador escolheu
    let dia = document.getElementById('diaSemana').value;
    let disciplina = document.getElementById('disciplina').value;
    let hora = document.getElementById('horaAula').value;
    
    // Verificar se preencheu tudo
    if (dia === '' || disciplina === '' || hora === '') {
        alert('Por favor, preenche todos os campos!');
        return;
    }
    
    // Buscar onde vamos mostrar o horário
    let horario = document.getElementById('horario');
    
    // Criar uma nova aula
    let novaAula = document.createElement('div');
    novaAula.innerHTML = dia + ' - ' + hora + ' - ' + disciplina;
    
    // Adicionar ao horário
    horario.appendChild(novaAula);
    
    // Limpar os campos
    document.getElementById('diaSemana').value = '';
    document.getElementById('disciplina').value = '';
    document.getElementById('horaAula').value = '';
}