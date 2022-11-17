const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODAS AS VENDAS
router.get('/sale', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM sale',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({response: resultado})
            }
        )
    })

});

//INSERE UMA VENDA
router.post('/sale', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO sale (client_id_cli , gross_amount_sl, creationdate_sl, status_sl) VALUES (?,?,?,?)',
           [req.body.client_id_cli, req.body.gross_amount_sl, req.body.creationdate_sl,req.body.status_sl],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error})}

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
                return res.status(200).send({response: resultado})
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
                if(error) { return res.status(500).send({ error: error})}

                res.status(201).send({
                    mensagem:'Venda alterada com sucesso'
                });
            }

        )
    });
});

//EXCLUI UM PRODUTO
router.delete('/sale', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM sale WHERE sale_id  = ?`, [req.body.sale_id ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error})}

                res.status(202).send({
                    mensagem: 'Venda excluída com sucesso',
                })
            }

        )
    })
});
module.exports = router;