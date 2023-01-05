const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS CLIENTES
router.get('/client', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM client',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })

});

//INSERE UM CLIENTE
router.post('/client', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `INSERT INTO client 
              ( name_cli,
                surname_cli,
                fone1_cli, 
                fone2_cli, 
                adress_cli, 
                cep_cli, 
                createdate_cli, 
                status_cli ) 
                VALUES (?,?,?,?,?,?,?,?)`,

            [
                req.body.name_cli,
                req.body.surname_cli,
                req.body.fone1_cli,
                req.body.fone2_cli,
                req.body.adress_cli,
                req.body.cep_cli,
                req.body.createdate_cli,
                req.body.status_cli
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Cliente inserido com sucesso',
                    client_id_cli: resultado.insertId
                })
            }

        )
    })


});

//RETORNA OS DADOS DE UM CLIENTE
router.get('/:client_id_cli', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM client WHERE client_id_cli = ?',
            [req.params.client_id_cli],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
});

// ALTERA UM CLIENTE
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE  client
                 SET name_cli          = ?,
                     surname_cli       = ?,
                     fone1_cli         = ?,
                     fone2_cli         = ?,
                     adress_cli        = ?,
                     cep_cli           = ?,
                     createdate_cli    = ?, 
                     status_cli        = ?

               WHERE client_id_cli     = ?`,

            [
                req.body.name_cli,
                req.body.surname_cli,
                req.body.fone1_cli,
                req.body.fone2_cli,
                req.body.adress_cli,
                req.body.cep_cli,
                req.body.createdate_cli,
                req.body.status_cli,
                req.body.client_id_cli

            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Cliente alterado com sucesso'
                });
            }

        )
    })
});

//EXCLUI UM CLIENTE
router.delete('/client', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM client WHERE client_id_cli  = ?`, [req.body.client_id_cli],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Cliente excluído com sucesso',
                })
            }

        )
    })
});
module.exports = router;