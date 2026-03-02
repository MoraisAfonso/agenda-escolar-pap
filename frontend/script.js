// Função para obter o token
function getToken() {
    return localStorage.getItem('token');
}

// Função para carregar aulas do servidor
async function carregarAulas() {
    try {
        const token = getToken();
        const response = await fetch('/api/aulas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.aulas;
        }
        return [];
    } catch (error) {
        console.error('Erro ao carregar aulas:', error);
        return [];
    }
}

// Função para guardar aulas no servidor
async function guardarAulas(aulas) {
    try {
        const token = getToken();
        const response = await fetch('/api/aulas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ aulas: aulas })
        });

        if (!response.ok) {
            console.error('Erro ao guardar aulas no servidor');
        }
    } catch (error) {
        console.error('Erro ao guardar aulas:', error);
    }
}

// Função para adicionar aulas ao horário
async function adicionarAula() {
    console.log('adicionarAula chamada'); // DEBUG
    
    let dia = document.getElementById('diaSemana').value;
    let disciplina = document.getElementById('disciplina').value;
    let hora = document.getElementById('horaAula').value;
    
    console.log('Valores:', dia, disciplina, hora); // DEBUG
    
    if (dia === '' || disciplina === '' || hora === '') {
        alert('Por favor, preenche todos os campos!');
        return;
    }
    
    let aula = {
        id: Date.now(),
        dia: dia,
        disciplina: disciplina,
        hora: hora
    };
    
    console.log('Nova aula:', aula); // DEBUG
    
    // Carregar aulas existentes
    let aulas = await carregarAulas();
    console.log('Aulas antes:', aulas); // DEBUG
    
    // Adicionar nova aula
    aulas.push(aula);
    console.log('Aulas depois:', aulas); // DEBUG
    
    // Guardar no servidor
    await guardarAulas(aulas);
    
    // Limpar os campos
    document.getElementById('diaSemana').value = '';
    document.getElementById('disciplina').value = '';
    document.getElementById('horaAula').value = '';
    
    // Atualizar a lista
    await mostrarAulas();
}

// Função para mostrar as aulas em formato de tabela
async function mostrarAulas() {
    console.log('mostrarAulas chamada'); // DEBUG
    let aulas = await carregarAulas();
    console.log('Aulas carregadas:', aulas); // DEBUG
    let lista = document.getElementById('listaAulas');
    
    if (!lista) {
        console.error('Elemento listaAulas não encontrado!');
        return;
    }
    
    if (aulas.length === 0) {
        console.log('Nenhuma aula encontrada'); // DEBUG
        lista.innerHTML = '<p class="mensagem-vazio">Ainda não tens aulas adicionadas.</p>';
        return;
    }
    
    // Organizar aulas por dia e hora
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const aulasPorDia = {
        'Segunda': [],
        'Terça': [],
        'Quarta': [],
        'Quinta': [],
        'Sexta': []
    };
    
    aulas.forEach(aula => {
        if (aulasPorDia[aula.dia]) {
            aulasPorDia[aula.dia].push(aula);
        }
    });
    
    console.log('Aulas por dia:', aulasPorDia); // DEBUG
    
    // Ordenar aulas dentro de cada dia por hora
    diasSemana.forEach(dia => {
        aulasPorDia[dia].sort((a, b) => a.hora.localeCompare(b.hora));
    });
    
    // Criar a tabela HTML
    let html = `
        <table class="horario-table">
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Segunda</th>
                    <th>Terça</th>
                    <th>Quarta</th>
                    <th>Quinta</th>
                    <th>Sexta</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Obter todas as horas únicas
    let horasUnicas = new Set();
    aulas.forEach(aula => horasUnicas.add(aula.hora));
    let horasOrdenadas = Array.from(horasUnicas).sort();
    
    console.log('Horas ordenadas:', horasOrdenadas); // DEBUG
    
    // Criar linhas para cada hora
    horasOrdenadas.forEach(hora => {
        html += '<tr>';
        html += `<td class="hora-col"><strong>${hora}</strong></td>`;
        
        diasSemana.forEach(dia => {
            const aulasDaHora = aulasPorDia[dia].filter(a => a.hora === hora);
            
            if (aulasDaHora.length > 0) {
                const aula = aulasDaHora[0];
                html += `
                    <td class="aula-cell">
                        <div class="aula-info">
                            <span class="disciplina-nome">${aula.disciplina}</span>
                            <button class="btn-apagar-mini" onclick="apagarAula(${aula.id})" title="Apagar">✕</button>
                        </div>
                    </td>
                `;
            } else {
                html += '<td class="aula-cell vazia">-</td>';
            }
        });
        
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    console.log('HTML gerado'); // DEBUG
    lista.innerHTML = html;
}

// Função para apagar uma aula
async function apagarAula(id) {
    console.log('Apagar aula:', id); // DEBUG
    let aulas = await carregarAulas();
    aulas = aulas.filter(aula => aula.id !== id);
    await guardarAulas(aulas);
    await mostrarAulas();
}

// Carregar as aulas quando a página abre
window.onload = function() {
    console.log('Página carregada'); // DEBUG
    mostrarAulas();
};