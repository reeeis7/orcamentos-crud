//sql para criar o banco de dados e a tabela de orçamentos
// CREATE DATABASE garage;

// USE garage;

// CREATE TABLE IF NOT EXISTS orcamentos (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     cliente VARCHAR(100) NOT NULL,
//     veiculo VARCHAR(100) NOT NULL,
//     servico VARCHAR(100) NOT NULL,
//     valor DECIMAL(10,2) NOT NULL,
//     status ENUM('pendente', 'aprovado', 'cancelado') DEFAULT 'pendente',
//     data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// DESCRIBE orcamentos;

import mariadb from 'mysql2/promise';

// configurações de conexão com o banco de dados
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'garage',
    port: 3306,
});

export default pool;