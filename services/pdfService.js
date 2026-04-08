import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';

//path da pasta pdfs -> dentro de public
const PASTA_PDFS = path.join(process.cwd(), 'public', 'pdfs');

export async function gerarPDFOrcamento(orcamento) {
    return new Promise((resolve, reject) => {
        try {
            //se a pasta pdfs não existir,cria a pasta pdfs que armazenará os pdfs
            if (!fs.existsSync(PASTA_PDFS)) {
                fs.mkdirSync(PASTA_PDFS, { recursive: true });
                console.log('📁 Pasta criada:', PASTA_PDFS);
            }
            
            //criaa o nome do arquivo com base no id e nome do cliente
            //usei o regex para tirar os espaços do nome do cliente e passar pro nome do documento
            const nomeLimpo = (orcamento.cliente || 'cliente').replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `orcamento_${orcamento.id}_${nomeLimpo}.pdf`;
            const filePath = path.join(PASTA_PDFS, fileName);
            
            console.log('📄 Salvando PDF em:', filePath);
            
            //cria o pdf
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            
            //conteudo do pdf, usei um layout simples com base na documentação do pdfkit -> https://pdfkit.org/docs/text.html
            doc.fontSize(20).text('GARAGEM REIS', { align: 'center' });
            doc.fontSize(14).text('Oficina Mecânica Especializada', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text('ORÇAMENTO DE SERVIÇOS', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10);
            doc.text(`Nº Orçamento: ${orcamento.id}`);
            doc.text(`Data: ${new Date(orcamento.data_criacao).toLocaleString('pt-BR')}`);
            doc.text(`Cliente: ${orcamento.cliente}`);
            doc.text(`Veículo: ${orcamento.veiculo}`);
            doc.text(`Serviço: ${orcamento.servico}`);
            doc.text(`Valor: R$ ${parseFloat(orcamento.valor).toFixed(2)}`);
            doc.text(`Status: ${orcamento.status}`);
            doc.end();
            
            //stream -> quando terminar de salvar o pdf mostra o link dele
            stream.on('finish', () => {
                const pdfUrl = `/pdfs/${fileName}`;
                console.log('✅ PDF salvo:', pdfUrl);
                resolve({
                    success: true,
                    pdfUrl: pdfUrl,
                    filePath: filePath
                });
            });
            
            stream.on('error', (err) => {
                console.error('❌ Erro ao salvar PDF:', err);
                reject(err);
            });
            
        } catch (error) {
            console.error('❌ Erro no gerarPDFOrcamento:', error);
            reject(error);
        }
    });
}