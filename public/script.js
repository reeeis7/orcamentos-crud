// public/script.js
// Funções reutilizáveis para todas as páginas

// ============================================
// FUNÇÕES DE UTILIDADE
// ============================================

function mostrarSucesso(elemento, mensagem) {
    const div = document.getElementById(elemento);
    div.innerHTML = `<div class="mensagem-sucesso">✅ ${mensagem}</div>`;
    div.classList.add('show');
}

function mostrarErro(elemento, mensagem) {
    const div = document.getElementById(elemento);
    div.innerHTML = `<div class="mensagem-erro">❌ ${mensagem}</div>`;
    div.classList.add('show');
}

function limparResultado(elemento) {
    const div = document.getElementById(elemento);
    div.innerHTML = '';
    div.classList.remove('show');
}

function mostrarLoading(botao, textoOriginal) {
    botao.innerHTML = `${textoOriginal} <span class="loading"></span>`;
    botao.disabled = true;
}

function restaurarBotao(botao, textoOriginal) {
    botao.innerHTML = textoOriginal;
    botao.disabled = false;
}

function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString('pt-BR');
}

function formatarMoeda(valor) {
    return `R$ ${parseFloat(valor).toFixed(2)}`;
}

// ============================================
// FUNÇÕES DE API (COMPATÍVEIS COM AS ROTAS)
// ============================================

// Buscar todos os orçamentos (GET /orcamentos)
async function buscarOrcamentos() {
    try {
        const response = await fetch('/orcamentos');
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
        return [];
    }
}

// Buscar um orçamento por ID (GET /orcamento/:id)
async function buscarOrcamentoPorId(id) {
    try {
        const response = await fetch(`/orcamento/${id}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar orçamento:', error);
        return null;
    }
}

// Criar novo orçamento (POST /orcamento)
async function criarOrcamento(dados) {
    const response = await fetch('/orcamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    return await response.json();
}

// Atualizar orçamento (PUT /orcamento/:id)
async function atualizarOrcamento(id, dados) {
    const response = await fetch(`/orcamento/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    return await response.json();
}

// Deletar orçamento (DELETE /orcamento/:id)
async function deletarOrcamento(id) {
    const response = await fetch(`/orcamento/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}