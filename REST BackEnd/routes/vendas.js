const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA O VALOR TOTAL DE VENDAS (Quantidade de Vendas)
router.get('/salesTotal', (req, res, next) => {
    debugger

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT COUNT (sale_id) As vendasTotal   
            FROM sale` ,

            (error, resultado, fields) => {
                debugger
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//RETORNA O VALOR TOTAL DE VENDAS (TOTAL CAIXA)
router.get('/caixa', (req, res, next) => {
    debugger

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT SUM (gross_amount_sl) As valorTotal   
            FROM sale`,

            (error, resultado, fields) => {
                debugger
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//RELACIONADO AO FILTRO DE DATA  DE VENDAS (TOTAL CAIXA)
router.get('/FiltroVendasCaixa', (req, res, next) => {
    debugger

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT COUNT (sale_id) As vendasTotal   
            FROM sale
            WHERE creationdate_sl >= ? 
            AND creationdate_sl <= ?` ,

            [
                req.query.sDataInicioCaixa,
                req.query.sDataFinalCaixa
            ],
            
            (error, resultado, fields) => {
                debugger
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//RELACIONADO AO FILTRO DE DATA DO CAIXA (TOTAL CAIXA)
router.get('/filtroCaixa', (req, res, next) => {
    debugger

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT SUM (gross_amount_sl) As valorTotal   
            FROM sale
            WHERE creationdate_sl >= ? 
            AND creationdate_sl <= ?` ,

            [
                req.query.sDataInicioCaixa,
                req.query.sDataFinalCaixa
            ],

            (error, resultado, fields) => {
                debugger
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//RETORNA TODAS AS VENDAS
router.get('/sale', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT sale_id , gross_amount_sl, creationdate_sl,
             CONCAT(name_cli, " ", surname_cli) As fullName_sl 
             FROM sale  
             INNER JOIN client ON sale.client_id_cli = client.client_id_cli
             ORDER BY sale_id DESC` ,

            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//RELACIONADO AO FILTRO DE DATA DAS VENDAS
router.get('/:filterDate', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT sale_id , gross_amount_sl, creationdate_sl,
            CONCAT(name_cli, " ", surname_cli) As fullName_sl 
            FROM sale  
            INNER JOIN client ON sale.client_id_cli = client.client_id_cli
            WHERE creationdate_sl >= ? 
            AND creationdate_sl <= ? 
            ORDER BY sale_id DESC `,

            [
                req.query.sDataInicio,
                req.query.sDataFinal
            ],

            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
});

//INSERE UMA VENDA
router.post('/sale', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `INSERT INTO sale 
            (   client_id_cli , 
                gross_amount_sl, 
                creationdate_sl 
                ) 
                VALUES (?,?,?)`,
            [
                req.body.client_id_cli,
                req.body.gross_amount_sl,
                req.body.creationdate_sl

            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Venda inserido com sucesso',
                    sale_id: resultado.insertId
                })
            }

        )
    })


});

//RETORNA OS DADOS DE UMA VENDA ATRAVÉS DO ID
router.get('/:sale_id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM sale WHERE sale_id = ?',
            [req.params.sale_id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
});

// ALTERA UMA VENDA
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE  sale
                 SET client_id_cli     = ?,
                     gross_amount_sl   = ?,
                     creationdate_sl   = ?,
                     status_sl         = ?
                 WHERE   sale_id       = ?`,

            [
                req.body.client_id_cli,
                req.body.gross_amount_sl,
                req.body.creationdate_sl,
                req.body.status_sl,
                req.body.sale_id

            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Venda alterada com sucesso'
                });
            }

        )
    });
});

//EXCLUI UM PRODUTO
/*router.delete('/sale', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM sale WHERE sale_id  = ?`, [req.body.sale_id],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Venda excluída com sucesso',
                })
            }

        )
    })
});*/



module.exports = router;