//aqui estão as funções que vão ser chamadas pelas rotas, 
//elas recebem a requisição e resposta, fazem as validações,
//chamam o model para acessar o banco e depois respondem para o cliente

import * as orcamentoModel from '../models/orcamentoModel.js';
import { gerarPDFOrcamento } from '../services/pdfService.js';
//create
export async function criarOrcamento(req, res) {
    try {
        const { cliente, veiculo, servico, valor } = req.body;
        
        console.log('📝 Recebendo dados:', { cliente, veiculo, servico, valor });
        
        // validação dos campos
        if (!cliente || !veiculo || !servico || !valor) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        
        if (parseFloat(valor) <= 0) {
            return res.status(400).json({ error: 'O valor deve ser maior que zero' });
        }
        
        // armazena no banco
        const novoOrcamento = await orcamentoModel.criarOrcamentoModel({
            cliente,
            veiculo,
            servico,
            valor: parseFloat(valor)
        });
        
        console.log('💾 Orçamento salvo no banco ID:', novoOrcamento.id);
        
        // gera pdf
        const pdf = await gerarPDFOrcamento(novoOrcamento);
        
        console.log('📄 PDF gerado:', pdf.pdfUrl);
        
        // se passar por tudo responde com o orçamento criado e o link do pdf
        res.json({
            success: true,
            message: `Orçamento #${novoOrcamento.id} criado com sucesso!`,
            pdf: pdf.pdfUrl,
            orcamento: novoOrcamento
        });
        
    } catch (error) {
        console.error('❌ Erro no controller criarOrcamento:', error);
        res.status(500).json({ 
            error: 'Erro interno ao criar orçamento: ' + error.message 
        });
    }
}

//read - listar todos
export async function listarOrcamentos(req, res) {
    try {
        const orcamentos = await orcamentoModel.listarOrcamentosModel();
        console.log(`📋 Listando ${orcamentos.length} orçamentos`);
        res.json(orcamentos);
    } catch (error) {
        console.error('❌ Erro no controller listarOrcamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar orçamentos' });
    }
}

//read - lista pelo id
export async function buscarOrcamento(req, res) {
    try {
        const id = req.params.id;
        
        //verifica se o id é válido(positivo e numérico)
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        
        const orcamento = await orcamentoModel.buscarOrcamentoPorIdModel(id);
        
        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        
        res.json(orcamento);
    } catch (error) {
        console.error('❌ Erro no controller buscarOrcamento:', error);
        res.status(500).json({ error: 'Erro ao buscar orçamento' });
    }
}

//update
export async function atualizarOrcamento(req, res) {
    try {
        const id = req.params.id;
        const dados = req.body;
        
        // verificação -> orçamento existe?
        const existe = await orcamentoModel.orcamentoExisteModel(id);
        if (!existe) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        
        // validações dos campos do json -> passa os dados que vieram do body para o banco
        if (dados.valor && parseFloat(dados.valor) <= 0) {
            return res.status(400).json({ error: 'O valor deve ser maior que zero' });
        }
        
        // atualizar
        const orcamentoAtualizado = await orcamentoModel.atualizarOrcamentoModel(id, dados);
        
        console.log(`✏️ Orçamento #${id} atualizado`);
        
        res.json({
            success: true,
            message: `Orçamento #${id} atualizado com sucesso!`,
            orcamento: orcamentoAtualizado
        });
        
    } catch (error) {
        console.error('❌ Erro no controller atualizarOrcamento:', error);
        res.status(500).json({ error: 'Erro ao atualizar orçamento' });
    }
}

//delete
export async function deletarOrcamento(req, res) {
    try {
        const id = req.params.id;
        
        // verificação -> orçamento existe?
        const existe = await orcamentoModel.orcamentoExisteModel(id);
        if (!existe) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        
        // deletar
        await orcamentoModel.deletarOrcamentoModel(id);
        
        console.log(`🗑️ Orçamento #${id} removido`);
        
        res.json({
            success: true,
            message: `Orçamento #${id} removido com sucesso!`
        });
        
    } catch (error) {
        console.error('❌ Erro no controller deletarOrcamento:', error);
        res.status(500).json({ error: 'Erro ao deletar orçamento' });
    }
}