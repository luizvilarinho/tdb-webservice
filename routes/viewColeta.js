const express = require("express");
const viewColetaRouter = express.Router();
const getDateColeta = require('../modules/getDateColeta');
const soap = require('soap');
var convert = require('xml-js');
const urlColeta = 'https://ssw.inf.br/ws/sswColeta/index.php?wsdl';

viewColetaRouter.get("/", (req, res)=>{
    res.render('viewColeta')   
})

viewColetaRouter.post("/", (req, res)=>{

    var limiteColeta = getDateColeta();

    var coletaObj = {
        dominio:req.body.dominio,
        login:"wservice",
        senha:"wservice",
        cnpjRemetente:req.body.cnpjRemetente,
        cnpjDestinatario:req.body.cnpjDestinatario,
        numeroNF:req.body.numeroNF,
        tipoPagamento:req.body.tipoPagamento,
        enderecoEntrega:req.body.enderecoEntrega,
        cepEntrega:req.body.cepEntrega,
        solicitante:req.body.solicitante,
        limiteColeta:limiteColeta,
        quantidade:req.body.quantidade,
        peso:req.body.peso,
        observacao:req.body.observacao,
        instrucao:req.body.instrucao,
        cubagem:req.body.cubagem,
        valorMerc:req.body.valorMerc,
        especie:req.body.especie,
        chaveNF:req.body.chaveNF
    }

    soap.createClient(urlColeta, (error,client) =>{
        if(!error){
            client.coletar(coletaObj, (responseError, response)=>{
    
                if(!responseError){
                    var data = JSON.parse(convert.xml2json(response.return.$value, {compact: true, spaces: 4}));
                    console.log("colectINPUT", coletaObj);
                    console.log("colectOUTPUT", data);
                    
                    if(data.coletar.erro._text > 0 || data.coletar.erro._text < 0){
                        var coletaData = {
                            sucesso:false,
                            qntErros:data.coletar.erro._text,
                            mensagem:data.coletar.mensagem._text.replace(/(&atilde;)/g, "ã").replace(/(&ccedil;)/g, "ç").replace(/(&aacute;)/g, "á"),
                            data:data.coletar
                        }
                    }else{
                        var coletaData = {
                            sucesso:true,
                            numeroColeta:data.coletar.numeroColeta._text,
                            data:data.coletar
                        }
                    }

                    res.json(coletaData);
                }else{
                    console.log("erro no response do método coletar", responseError);
                }
                
            })
    
        }else{
            console.log("um erro ocorreu ", error) 
        }
    })
})



module.exports = viewColetaRouter;