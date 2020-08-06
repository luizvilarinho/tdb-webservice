const express = require("express");
const cotacaoRouter = express.Router();
const soap = require('soap');
var convert = require('xml-js');
const url = 'https://ssw.inf.br/ws/sswCotacao/index.php?wsdl';
const urlCotacaoColeta = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';

cotacaoRouter.get("/", (req, res)=>{
    
    res.render('index')   
            
})

cotacaoRouter.post("/", (req, res)=>{
    
    const obj = {
        dominio:req.body.dominio,
        login:"wservice",
        senha:"wservice",
        cnpjPagador:req.body.cnpjPagador,
        senhaPagador:req.body.senhaPagador,
        cepOrigem:req.body.cepOrigem,
        cepDestino:req.body.cepDestino,
        valorNF:req.body.valorNF,
        quantidade:req.body.quantidade,
        peso:req.body.peso,
        volume:req.body.volume,
        mercadoria:null,
        ciffob:req.body.ciffob,
        cnpjRemetente:req.body.cnpjPagador,
        cnpjDestinatario:req.body.cnpjDestinatario,
        observacao:"",
        trt:""
    };

    var objGetMercadoria = {
        dominio:"TDD",
        login:"wservice",
        senha:"wservice",
        cnpjPagador:obj.cnpjPagador
    }

    soap.createClient(url, (err,client) =>{
        if(!err){
            client.getMercadoria(objGetMercadoria, (err, response) =>{
                var dataGetMercadoria = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                var numeroMercadoria = dataGetMercadoria.mercadorias.mercadoria.codigo._text;
                obj.mercadoria = numeroMercadoria;

            

            soap.createClient(urlCotacaoColeta, (errCotacaoColeta, clienteCotacaoColeta) =>{
                if(!errCotacaoColeta){
                    clienteCotacaoColeta.cotarSite(obj, (errCotar, cotacaoResponse) =>{
                        if(!errCotar){
                            console.log("input", obj);
                            var data = JSON.parse(convert.xml2json(cotacaoResponse.return.$value, {compact: true, spaces: 4}));
                            console.log("outputServico", data);
                            data = {
                                valorFrete:data.cotacao.frete._text,
                                prazo: data.cotacao.prazo._text,
                                token: data.cotacao.token._text
                            }
                            console.log("outputTDBSERVICE",data);
                            res.json(data);
                        }else{
                            console.log("erro ao realizar cotação", errCotar)
                        }
                       
                     })
                }else{
                    console.log("um erro ocorreu ", errCotacaoColeta) 
                }
              
            })
         })
        }else{
            console.log("um erro ocorreu ", err) 
        }
    })
})



module.exports = cotacaoRouter;