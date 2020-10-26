const express = require("express");
const coletaRouter = express.Router();
const soap = require('soap');
var convert = require('xml-js');
const getDateColeta = require('../modules/getDateColeta');
const urlCotacaoColeta = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';

coletaRouter.post("/", (req, res)=>{

    //var hj = new Date();
    //var dataColeta = transformDate(req.body.limiteColeta);
    var dataColeta = getDateColeta();

    console.log("dataColeta2", dataColeta);
     
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

    /*//mock
    var mockerror={
        "hasError": true,
        "error": "1",
        "errorMessage": "COTACAO JA CONTRATADA"
    }

    var mocksucesso={
        sucesso:true,
        codigoColeta:166888
    }

    res.json(mocksucesso);
    return;
    */
       soap.createClient(urlCotacaoColeta, (error,client) =>{
        if(!error){
            client.coletar(coletaObject, (responseError, response)=>{

                if(!responseError){
                    var coletaData = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                    console.log("colectINPUT", coletaObject);
                    console.log("colectOUTPUT", coletaData);
                    
                    var coletaReturObject = {}
                   
                    if(coletaData.coleta.erro._text != '0'){
                        coletaReturObject.hasError = true;
                        coletaReturObject.error = coletaData.coleta.erro._text;
                        coletaReturObject.errorMessage = coletaData.coleta.mensagem._text;
                    }else{
                        coletaReturObject.sucesso = true;
                        coletaReturObject.codigoColeta = coletaData.coleta.coleta._text;
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