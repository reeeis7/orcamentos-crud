//todas as operações do crud estão aqui,
//o js executa o sql e retorna os dados para o controller
//o controller chama essas funções para acessar o banco de dados
//fetch do controller -> model -> database


import pool from '../config/database.js';

//criar um novo orçamento
export async function criarOrcamentoModel(dados) {
    let connection;
    try {
        const { cliente, veiculo, servico, valor } = dados;
        
        //receber a conexão do pool
        connection = await pool.getConnection();
        
        // executa o sql -> insert
        const [resultado] = await connection.execute(
            'INSERT INTO orcamentos (cliente, veiculo, servico, valor, status) VALUES (?, ?, ?, ?, ?)',
            [cliente, veiculo, servico, valor, 'pendente']
        );
        
        // listar o orçamento recém-criado
        const [rows] = await connection.execute(
            'SELECT * FROM orcamentos WHERE id = ?',
            [resultado.insertId]
        );
        
        return rows[0];
        
    } catch (error) {
        console.error('Erro no model criarOrcamentoModel:', error);
        throw error;
    } finally {
        // liberar a conexão de volta para o pool
        if (connection) connection.release();
    }
}

//lista todos os orçamentos
export async function listarOrcamentosModel() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM orcamentos ORDER BY data_criacao DESC'
        );
        
        // converter valor para número
        return rows.map(o => ({ ...o, valor: parseFloat(o.valor) }));
        
    } catch (error) {
        console.error('Erro no model listarOrcamentosModel:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

//lista pelo id
export async function buscarOrcamentoPorIdModel(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM orcamentos WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
        
    } catch (error) {
        console.error('Erro no model buscarOrcamentoPorIdModel:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

//atualizar orçamento
export async function atualizarOrcamentoModel(id, dados) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Construir query dinâmica
        const updates = [];
        const valores = [];
        
        if (dados.cliente !== undefined && dados.cliente !== '') {
            updates.push('cliente = ?');
            valores.push(dados.cliente);
        }
        if (dados.veiculo !== undefined && dados.veiculo !== '') {
            updates.push('veiculo = ?');
            valores.push(dados.veiculo);
        }
        if (dados.servico !== undefined && dados.servico !== '') {
            updates.push('servico = ?');
            valores.push(dados.servico);
        }
        if (dados.valor !== undefined && dados.valor !== '') {
            updates.push('valor = ?');
            valores.push(parseFloat(dados.valor));
        }
        if (dados.status !== undefined && dados.status !== '') {
            updates.push('status = ?');
            valores.push(dados.status);
        }
        
        if (updates.length === 0) return null;
        
        valores.push(id);
        
        await connection.execute(
            `UPDATE orcamentos SET ${updates.join(', ')} WHERE id = ?`,
            valores
        );
        
        // listar o orçamento atualizado
        const [rows] = await connection.execute(
            'SELECT * FROM orcamentos WHERE id = ?',
            [id]
        );
        
        return rows[0];
        
    } catch (error) {
        console.error('Erro no model atualizarOrcamentoModel:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

//deletar orçamento
export async function deletarOrcamentoModel(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [resultado] = await connection.execute(
            'DELETE FROM orcamentos WHERE id = ?',
            [id]
        );
        
        return resultado.affectedRows > 0;
        
    } catch (error) {
        console.error('Erro no model deletarOrcamentoModel:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

//verificar se o orçamento existe
export async function orcamentoExisteModel(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM orcamentos WHERE id = ?',
            [id]
        );
        return rows.length > 0;
        
    } catch (error) {
        console.error('Erro no model orcamentoExisteModel:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}