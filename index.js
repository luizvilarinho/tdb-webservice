const express = require("express");
const app = express();
const soap = require('soap');
const url = 'https://ssw.inf.br/ws/sswCotacao/index.php?wsdl';
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

app.post("/tdbwebservice/v1/cotacao", (req, res)=>{
    

    const obj = {
        dominio:req.body.dominio,
        login:"wservice",
        senha:"wservice",
        cnpjPagador:req.body.cnpjPagador,
        cepOrigem:req.body.cepOrigem,
        cepDestino:req.body.cepDestino,
        valorNF:req.body.valorNF,
        quantidade:req.body.quantidade,
        peso:req.body.peso,
        volume:req.body.volume,
        mercadoria:1,
        cnpjDestinatario:req.body.cnpjDestinatario
    };

    soap.createClient(url, (err,client) =>{
        if(!err){client.cotar(obj, (err, response) =>{
            console.log(response.return.$value);
            var data = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
            console.log(data);
            res.json(data);
             
         })
         console.log("OK")   
        }else{
            console.log("um erro ocorreu ", err) 
        }
    })
    // var obj = {nome:"Luiz", idade: 20}
    // res.render('index', {data:obj})
})


var port = process.env.PORT || 3003
app.listen(port, function() {
  console.log(`APP backend rodando na porta ${port}.`)
})

