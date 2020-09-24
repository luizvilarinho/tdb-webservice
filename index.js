const express = require("express");
const morgan = require('morgan');
const cotacaoRouter = require("./routes/cotacao");
const coletaRouter = require("./routes/coleta");
const viewColetaRouter = require("./routes/viewColeta");
const viaCep = require("./routes/viaCep");
const consultarClienteRouter = require("./routes/consultarCliente");
const app = express();

const buscaCepUrl = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';
var bodyParser = require("body-parser");
var path = require("path");

app.set('view engine','ejs');

app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/tdbwebservice/v1/cotacao/', cotacaoRouter);
app.use('/tdbwebservice/v1/viewcoleta/', viewColetaRouter);
app.use('/tdbwebservice/v1/buscaCep/', viaCep);
app.use('/tdbwebservice/v1/coleta', coletaRouter);
app.use('/tdbwebservice/v1/consultarCliente', consultarClienteRouter);


app.use(express.static(path.join(__dirname, 'views/resources')));


var port = process.env.PORT || 5005
app.listen(port, function() {
  console.log(`APP backend rodando na porta ${port}.`)
})

