const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS USUÁRIOS
router.get('/user_betelgas', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM user_betelgas',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({response: resultado})
            }
        )
    })

});

//VALIDAÇÃO DE LOGIN
router.post('/validate', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT   * 
            FROM user_betelgas
            WHERE user_name = ?
            AND password = ?`,

        [ 
            req.body.sUserValidate,
            req.body.sPasswordValidade,
        ],
            
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error})}

                res.status(201).send({response: resultado})
            }

        )
    })


});

//INSERE UM USUÁRIO
router.post('/user_betelgas', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `INSERT INTO user_betelgas (
                 user_name ,
                 password, 
                 status_user ) VALUES (?,?,?)`,

           [ req.body.user_name,
             req.body.password,
            req.body.status_user],
            
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error})}

                res.status(201).send({
                    mensagem: 'Usuário inserido com sucesso',
                    user_id: resultado.insertId
                })
            }

        )
    })


});

//RETORNA OS DADOS DE UM USUÁRIO ATRAVÉS DO ID
router.get('/:user_id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM user_betelgas WHERE user_id = ?',
            [req.params.user_id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({response: resultado})
            }
        )
    })
});

// ALTERA UM USUÁRIO
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE  user_betelgas
                 SET    user_name    = ?,
                        password     = ?,
                        status_user  = ?
                 WHERE   user_id     = ?`,

            [
                req.body.user_name,
                req.body.password,
                req.body.status_user,
                req.body.user_id
                 
            ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error})}

                res.status(201).send({
                    mensagem:'Usuário alterada com sucesso'
                });
            }

        )
    });
});

//EXCLUI UM USUÁRIO
router.delete('/user_betelgas', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM user_betelgas WHERE user_id   = ?`, [req.body.user_id ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error})}

                res.status(202).send({
                    mensagem: 'Usuário excluído com sucesso',
                })
            }

        )
    })
});
module.exports = router;