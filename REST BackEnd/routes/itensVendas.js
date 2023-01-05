const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODAS AS VENDAS
router.get('/sale_item', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM sale_item',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});



//INSERE UMA VENDA
router.post('/sale_item', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `INSERT INTO sale_item 
            (   product_id_product_pdt, 
                sale_id , 
                quantity_item, 
                price_item ) 
                VALUES (?,?,?,?)`,
            [
                req.body.product_id_product_pdt,
                req.body.sale_id,
                req.body.quantity_item,
                req.body.price_item
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Venda inserida com sucesso',
                    id_sale_item: resultado.insertId
                })
            }

        )
    })


});

//RETORNA OS DADOS DE UMA VENDA ATRAVÉS DO ID
router.get('/:id_sale_item ', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM sale_item WHERE id_sale_item  = ?',
            [req.params.id_sale_item],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
});

//RETORNA OS DADOS DE UMA VENDA ATRAVÉS DO ID DINAMICAMENTE
router.get('/itens/:sale_id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT sale_id , name_pdt ,quantity_item, price_item 
                FROM sale_item 
                INNER JOIN product 
                ON sale_item.product_id_product_pdt  = product.id_product_pdt
                WHERE sale_id = ?  `,
                [req.params.sale_id],
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
            `UPDATE  sale_item
                 SET product_id_product_pdt  = ?,
                     sale_id                 = ?,
                     quantity_item           = ?,
                     price_item              = ?
                 WHERE   id_sale_item        = ?`,

            [
                req.body.product_id_product_pdt,
                req.body.sale_id,
                req.body.quantity_item,
                req.body.price_item,
                req.body.id_sale_item

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

//EXCLUI 
router.delete('/sale_item', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM sale_item WHERE id_sale_item  = ?`, [req.body.id_sale_item],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Venda excluída com sucesso',
                })
            }

        )
    })
});


module.exports = router;