const express = require("express");
const coletaRouter = express.Router();
const soap = require('soap');
var convert = require('xml-js');
const transformDate = require('../modules/transformDate');
const urlCotacaoColeta = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';

coletaRouter.post("/", (req, res)=>{

    var dataColeta = transformDate(req.body.limiteColeta);

    var coletaObject = {
        dominio:"TDD",
        login:"wservice",
        senha:"wservice",
        cotacao:req.body.cotacao,
        limiteColeta:dataColeta, //dateTime
        token:req.body.token,
        solicitante:req.body.solicitante,
        observacao:req.body.observacao,
        chaveNFe:""
    }

    soap.createClient(urlCotacaoColeta, (error,client) =>{
        if(!error){
            client.coletar(coletaObject, (responseError, response)=>{

                if(!responseError){
                    var coletaData = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                    console.log("colectINPUT", coletaObject);
                    console.log("colectOUTPUT", coletaData);
                    
                    var coletaReturObject = {}
                   
                    if(coletaData.coleta.erro._text == '-2'){
                        coletaReturObject.hasError = true,
                        coletaReturObject.error = coletaData.coleta.erro._text;
                        coletaReturObject.errorMessage = coletaData.coleta.mensagem._text;
                    }else{
                        coletaReturObject.sucesso = true
                    }

                    res.json(coletaReturObject);
                }else{
                    console.log("erro no response do método coletar", responseError);
                }
                
            })
    
        }else{
            console.log("um erro ocorreu ", error) 
        }
    })
    

})

module.exports = coletaRouter;