const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS PRODUTOS
router.get('/product', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM product',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//INSERE UM PRODUTO
router.post('/product', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
        `INSERT INTO product 
             ( name_pdt,
               description_pdt, 
               stock_control_pdt, 
               stock_min_pdt, 
               creation_date_pdt, 
               status_pdt, 
               price_pdt ) 
               VALUES (?,?,?,?,?,?,?)`,
            [
                req.body.name_pdt,
                req.body.description_pdt,
                req.body.stock_control_pdt,
                req.body.stock_min_pdt,
                req.body.creation_date_pdt,
                req.body.status_pdt,
                req.body.price_pdt
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_produto: resultado.insertId
                })
            }

        )
    })


});

//RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_product_pdt', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM product WHERE id_product_pdt = ?',
            [req.params.id_product_pdt],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
});

// ALTERA UM PRODUTO
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE  product
                 SET name_pdt            = ?,
                     description_pdt     = ?,
                     stock_control_pdt   = ?,
                     stock_min_pdt       = ?,
                     creation_date_pdt   = ?,
                     status_pdt          = ?,
                     price_pdt           = ?
                     
             WHERE   id_product_pdt      = ?`,

            [
                req.body.name_pdt,
                req.body.description_pdt,
                req.body.stock_control_pdt,
                req.body.stock_min_pdt,
                req.body.creation_date_pdt,
                req.body.status_pdt,
                req.body.price_pdt,
                req.body.id_product_pdt
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Produto alterado com sucesso'
                });
            }

        )
    });
});

//EXCLUI UM PRODUTO
router.delete('/product', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM product WHERE id_product_pdt  = ?`, [req.body.id_product_pdt],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Produto excluído com sucesso',
                })
            }

        )
    })
});
module.exports = router;