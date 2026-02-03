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
    
    // Criar objeto da aula
    let aula = {
        id: Date.now(),
        dia: dia,
        disciplina: disciplina,
        hora: hora
    };
    
    // Buscar aulas existentes do LocalStorage
    let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    
    // Adicionar a nova aula
    aulas.push(aula);
    
    // Guardar no LocalStorage
    localStorage.setItem('aulas', JSON.stringify(aulas));
    
    // Limpar os campos
    document.getElementById('diaSemana').value = '';
    document.getElementById('disciplina').value = '';
    document.getElementById('horaAula').value = '';
    
    // Atualizar a lista
    mostrarAulas();
}

// Função para mostrar as aulas
function mostrarAulas() {
    let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    let lista = document.getElementById('listaAulas');
    
    // Se não houver aulas
    if (aulas.length === 0) {
        lista.innerHTML = '<p class="mensagem-vazio">Ainda não tens aulas adicionadas.</p>';
        return;
    }
    
    // Limpar a lista
    lista.innerHTML = '';
    
    // Ordenar por dia e hora
    aulas.sort((a, b) => {
        const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
        if (dias.indexOf(a.dia) !== dias.indexOf(b.dia)) {
            return dias.indexOf(a.dia) - dias.indexOf(b.dia);
        }
        return a.hora.localeCompare(b.hora);
    });
    
    // Mostrar cada aula
    aulas.forEach(aula => {
        let item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-info">
                <strong>${aula.dia}</strong> - ${aula.hora} - ${aula.disciplina}
            </div>
            <button class="btn-apagar" onclick="apagarAula(${aula.id})">Apagar</button>
        `;
        lista.appendChild(item);
    });
}

// Função para apagar uma aula
function apagarAula(id) {
    let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    aulas = aulas.filter(aula => aula.id !== id);
    localStorage.setItem('aulas', JSON.stringify(aulas));
    mostrarAulas();
}

// Carregar as aulas quando a página abre
window.onload = function() {
    mostrarAulas();
};