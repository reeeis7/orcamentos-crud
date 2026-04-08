import express from 'express';
import * as orcamentoController from '../controllers/orcamentoController.js';

const router = express.Router();

router.post('/orcamento', orcamentoController.criarOrcamento);           //criar.html
router.get('/orcamentos', orcamentoController.listarOrcamentos);        //listar.html -> todos criados
router.get('/orcamento/:id', orcamentoController.buscarOrcamento);      //listar por id -> para editar ou deletar
router.put('/orcamento/:id', orcamentoController.atualizarOrcamento);   //editar.html
router.delete('/orcamento/:id', orcamentoController.deletarOrcamento);  //deletar.html

export default router;