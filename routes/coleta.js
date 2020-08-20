const express = require("express");
const coletaRouter = express.Router();
const soap = require('soap');
var convert = require('xml-js');
const urlCotacaoColeta = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';

coletaRouter.post("/", (req, res)=>{

    var coletaObject = {
        dominio:"TDD",
        login:"wservice",
        senha:"wservice",
        cotacao:req.body.cotacao,
        limiteColeta:req.body.limiteColeta, //dateTime
        token:req.body.token,
        solicitante:req.body.solicitante,
        observacao:"",
        chaveNFe:"" // string
    }

    soap.createClient(urlCotacaoColeta, (error,client) =>{
        if(!error){
            client.coletar(coletaObject, (responseError, response)=>{

                if(!responseError){
                    var coletaData = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                    console.log("coletaObject", coletaObject);
                    console.log("coletaData", coletaData);
                    res.json(coletaObject);
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