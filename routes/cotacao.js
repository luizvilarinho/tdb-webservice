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
        cnpjRemetente:req.body.cnpjRemetente,
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
                var a= response.return.$value.replace("&", "");
                var dataGetMercadoria = JSON.parse(convert.xml2json(a, {compact: true, spaces: 4, ignoreAttributes: true}));
                
                if(dataGetMercadoria.mercadorias.mercadoria.length > 1){
                    var numeroMercadoria = dataGetMercadoria.mercadorias.mercadoria[0].codigo._text;
                }else{
                    var numeroMercadoria = dataGetMercadoria.mercadorias.mercadoria.codigo._text;
                }
                
                obj.mercadoria = numeroMercadoria;

            soap.createClient(urlCotacaoColeta, (errCotacaoColeta, clienteCotacaoColeta) =>{
                if(!errCotacaoColeta){
                    clienteCotacaoColeta.cotarSite(obj, (errCotar, cotacaoResponse) =>{
                        if(!errCotar){
                            console.log("HERE1");

                            var data = JSON.parse(convert.xml2json(cotacaoResponse.return.$value, {compact: true, spaces: 4}));

                            console.log("OUTPUT", data);

                            if(data.cotacao == undefined){
                                var objectPath = data.coleta;
                            }else{
                                var objectPath = data.cotacao
                            }


                            if(parseFloat(objectPath.erro._text) > 0){
                                data = {
                                    sucesso:false,
                                    qntErros:objectPath.erro._text,
                                    mensagem:objectPath.mensagem._text.replace(/(&atilde;)/g, "ã").replace(/(&ccedil;)/g, "ç").replace(/(&aacute;)/g, "á"),
                                    data:objectPath
                                }
                            }else{
                                data = {
                                    sucesso:true,
                                    valorFrete:objectPath.frete._text,
                                    prazo: objectPath.prazo._text,
                                    token: objectPath.token._text,
                                    numeroCotacao: objectPath.cotacao._text,
                                    data:objectPath
                                }
                            }
                            
                            res.json(data);
                        }else{
                            console.log("HERE2");
                            var data = JSON.parse(convert.xml2json(cotacaoResponse.return.$value, {compact: true, spaces: 4}));

                            if(data.cotacao == undefined){
                                var objectPath = data.coleta;
                            }else{
                                var objectPath = data.cotacao
                            }

                            data = {
                                sucesso:false,
                                qntErros:objectPath.erro._text,
                                mensagem:objectPath.mensagem._text.replace(/(&atilde;)/g, "ã").replace(/(&ccedil;)/g, "ç").replace(/(&aacute;)/g, "á"),
                            }
        
                            res.json(data);
                        }
                       
                     })
                }else{
                    console.log("HERE3");

                    if(data.cotacao == undefined){
                        var objectPath = data.coleta;
                    }else{
                        var objectPath = data.cotacao
                    }

                    data = {
                        sucesso:false,
                        qntErros:objectPath.erro._text,
                        mensagem:objectPath.mensagem._text.replace(/(&atilde;)/g, "ã").replace(/(&ccedil;)/g, "ç").replace(/(&aacute;)/g, "á"),
                    }

                    res.json(data);
                }
              
            })
         })
        }else{
            console.log("HERE4");
            data = {
                sucesso:false,
                qntErros:data.cotacao.erro._text,
                mensagem:data.cotacao.mensagem._text.replace(/(&atilde;)/g, "ã").replace(/(&ccedil;)/g, "ç").replace(/(&aacute;)/g, "á"),
            }

            res.json(data);
            
        }
    })
})



module.exports = cotacaoRouter;