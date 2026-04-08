import express from 'express';
import path from 'path';
import pool from './config/database.js';
import setupRoutes from './routes/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

//midlewares
app.use(express.json()); // -> aceita reqs com corpo json e (le elas)
app.use(express.static('public')); // -> serve arquivos estáticos da pasta public (html, css...)

//testa a conn com o banco de dados

async function testarConexao() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        connection.release();
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error.message);
    }
}
testarConexao();

//configura as rotas       

setupRoutes(app);

//configura a pagina inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//inicia o servidor

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Acesse: http://localhost:${PORT}`);
    console.log(`\n📂 Estrutura Model-View-Controller:`);
    console.log(`   📁 models/     - Acesso ao banco`);
    console.log(`   📁 controllers - Lógica de negócio`);
    console.log(`   📁 routes/     - Definição das rotas`);
    console.log(`   📁 services/   - Serviços (PDF, email)`);
    console.log(`   📁 public/     - Frontend (HTML/CSS/JS)`);
});