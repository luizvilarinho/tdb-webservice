const express = require("express");
const consultarClienteRouter = express.Router();
const soap = require('soap');
var convert = require('xml-js');
const urlConsultarCliente = 'https://ssw.inf.br/ws/sswCotacaoColeta/index.php?wsdl';

consultarClienteRouter.post("/", (req, res)=>{

    const consultaClienteObject = {
        dominio:"TDD",
        login:"wservice",
        senha:"wservice",
        cgc:req.body.cpfCnpj
    }

    soap.createClient(urlConsultarCliente, (error, client) =>{
        if(!error){
            client.consultaClientes(consultaClienteObject, (responseError, response)=>{

                if(!responseError){
                    var normalize = response.return.$value.replace("&", "");
                    var clienteData = JSON.parse(convert.xml2json(normalize, {compact: true, spaces: 4}));

                    clienteData = {
                        razaoSocial:clienteData.coleta.nome._text,
                        endereco:clienteData.coleta.endereco._text
                    }

                    res.json(clienteData);
                }else{
                    console.log("erro no response do método Consultar Cliente", responseError);
                }
                
            })
    
        }else{
            console.log("um erro ocorreu ", error) 
        }
    })

})

module.exports = consultarClienteRouter;