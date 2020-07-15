const express = require("express");
const app = express();
const soap = require('soap');
const url = 'https://ssw.inf.br/ws/sswCotacao/index.php?wsdl';
const buscaCepUrl = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';
var convert = require('xml-js');
var bodyParser = require("body-parser");
var path = require("path");

app.set('view engine','ejs');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'views/resources')));

app.get("/tdbwebservice/v1/cotacao", (req, res)=>{
    
    res.render('index')   
            
})

app.post("/tdbwebservice/v1/getcidade", (req, res)=>{
    
    const getCepBody = {
        dominio:req.body.dominio,
        login:req.body.login,
        senha:req.body.senha,
        cep:req.body.cep
    };


    soap.createClient(buscaCepUrl, (err,client) =>{
        if(!err){
            client.consultaCep(getCepBody, (err, response) =>{
                var cidade = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                console.log("cidade", cidade);
                var cidadeReturn = {
                    nomeCidade:cidade.coleta.cidade._text,
                    unidade:cidade.coleta.unidade._text
                }
                
                res.json(cidadeReturn);
         })
        }else{
            console.log("um erro ocorreu ", err) 
        }
    })
    

            
})

app.post("/tdbwebservice/v1/cotacao", (req, res)=>{
    

    const obj = {
        dominio:req.body.dominio,
        login:req.body.login,
        senha:req.body.senha,
        cnpjPagador:req.body.cnpjPagador,
        cepOrigem:req.body.cepOrigem,
        cepDestino:req.body.cepDestino,
        valorNF:req.body.valorNF,
        quantidade:req.body.quantidade,
        peso:req.body.peso,
        volume:req.body.volume,
        mercadoria:null,
        cnpjDestinatario:req.body.cnpjDestinatario
    };

    var objGetMercadoria = {
        dominio:obj.dominio,
        login:obj.login,
        senha:obj.senha,
        cnpjPagador:obj.cnpjPagador
    }

    soap.createClient(url, (err,client) =>{
        if(!err){
            client.getMercadoria(objGetMercadoria, (err, response) =>{
                var dataGetMercadoria = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                var numeroMercadoria = dataGetMercadoria.mercadorias.mercadoria.codigo._text;
                obj.mercadoria = numeroMercadoria;

            client.cotar(obj, (err, response) =>{
                var data = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                console.log(data);
                data = {
                    valorFrete:data.cotacao.totalFrete._text,
                    prazo: data.cotacao.prazo._text,
                    pesoCalculo: data.cotacao.pesoCalculo._text
                }
                console.log(data);
                res.json(data);
             })
         })
        }else{
            console.log("um erro ocorreu ", err) 
        }
    })
    // var obj = {nome:"Luiz", idade: 20}
    // res.render('index', {data:obj})
})


var port = process.env.PORT || 5005
app.listen(port, function() {
  console.log(`APP backend rodando na porta ${port}.`)
})

