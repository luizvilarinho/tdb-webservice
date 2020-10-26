
const express = require('express');
const viaCep = express.Router();
const axios = require('axios');

//const viaCepUrl = 'https://viacep.com.br/ws/07073160/json';

const app = express();

viaCep.get('/:cep', async (req, res)=>{
    let cep = req.params.cep;
    let viaCepUri = `https://viacep.com.br/ws/${cep}/json`;

       // res.json(viaCepUri);

       var config = {
        method: 'get',
        url: viaCepUri,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
        let data=response.data;
        
        let getError = data.erro;

        console.log("erro", getError);
        if(getError === true){
            var objEndereco = {
                message:"Não foi possível localizar o cep indicado",
                cep:cep,
                sucesso:false
            }
        } else{
            var objEndereco = {
                rua:data.logradouro,
                bairro:data.bairro,
                cidade:data.localidade,
                estado:data.uf,
                sucesso:true
            }
        }

        res.status(200).json(objEndereco)
      })

      .catch(function (error) {
        console.log(error);
        let objError={
            message:"um erro ocorreu",
            err:error,
            sucesso:false
        }
        res.status(400).json(objError)
      });

    /*
    let endereco = await fetch(viaCepUri).then(response=>{
        console.log("EXEC")
        return response.json();
    }).catch(err => {
        console.log(err);
      }).catch((err) => {
        console.log(err);
        let error = {
            status: 400,
            err:err.message
        }
        res.status(404).json(error);
    })
    

    console.log("endereco", endereco);
    
    var objEndereco = {
        rua:endereco.logradouro,
        bairro:endereco.bairro,
        cidade:endereco.localidade,
        estado:endereco.uf,
    }
    res.status(200).json(objEndereco)
    
   */
})


module.exports = viaCep;
