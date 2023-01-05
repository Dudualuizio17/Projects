
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

const rotaProdutos = require('./routes/produtos')
const rotaClientes = require('./routes/clientes')
const rotaVendas = require('./routes/vendas')
const rotaItensVendas = require('./routes/itensVendas')
const rotaUsuarios = require('./routes/usuarios')


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); // apenas dados simples
app.use(bodyParser.json()); // entrada no body apenas em formato JSON

app.use('/produtos', rotaProdutos);
app.use('/clientes', rotaClientes);
app.use('/vendas', rotaVendas);
app.use('/itensVendas', rotaItensVendas);
app.use('/usuarios', rotaUsuarios);

//Quando não encontrar rota, entra aqui.
app.use((req, res, next) => {
   // const erro = new Error('Não Encontrado');
    //erro.status = 404;
    next();
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;

