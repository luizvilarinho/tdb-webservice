const express = require('express');
const viaCep = express.Router();
const fetch = require('node-fetch');

//const viaCepUrl = 'https://viacep.com.br/ws/07073160/json';

const app = express();

viaCep.get('/:cep', async(req, res)=>{

    let cep = req.params.cep;

    let viaCepUri = `https://viacep.com.br/ws/${cep}/json`;

    let endereco = await fetch(viaCepUri).then(response=>{
        return response.json();
    }).catch((err) => {
        console.log(err);
        let error = {
            status: 400,
            err:err.message
        }
        res.status(404).json(error);
    })

    var objEndereco = {
        rua:endereco.logradouro,
        bairro:endereco.bairro,
        cidade:endereco.localidade,
        estado:endereco.uf,
    }
    
   res.status(200).json(objEndereco)
   
})


module.exports = viaCep;
