// routes/index.js
// Centraliza as rotas

import orcamentoRoutes from './orcamentoRoutes.js';

export default function setupRoutes(app) {
    app.use('/', orcamentoRoutes);

    console.log('Rotas configuradas com sucesso');
    console.log('Rotas disponíveis:');
    console.log('POST   /orcamento      - Criar um novo orçamento');
    console.log('GET    /orcamentos     - Listar todos os orçamentos');
    console.log('GET    /orcamento/:id  - Buscar um orçamento por ID');
    console.log('PUT    /orcamento/:id  - Atualizar um orçamento por ID');
    console.log('DELETE /orcamento/:id  - Deletar um orçamento por ID');
}