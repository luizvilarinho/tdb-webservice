var app = new Vue({
    el: '#app',
    data: {
        showResponseScreem: false,
        retornoCotacao:null,
        prazo:0,
        pesoCalculo:0,
        valorFrete:"",
        dominio:"TDD",
        login:"",
        senha:"",
        cnpjPagador:"",
        cepOrigem:"",
        cepDestino:"",
        quantidade:"",
        peso:"",
        volume:"",
        cnpjDestinatario:"",
        altura:"",
        largura:"",
        profundidade:"",
        cidadeCepOrigem:"",
        cidadeCepDestino:""
        /*
        showResponseScreem: false,
        retornoCotacao:null,
        prazo:0,
        pesoCalculo:0,
        valorFrete:"",
        dominio:"TDD",
        login:"wservice",
        senha:"wservice",
        cnpjPagador:"63004030005740",
        cepOrigem:"07031-000",
        cepDestino:"01415-001",
        quantidade:"",
        peso:"",
        volume:"",
        cnpjDestinatario:"00001837825181",
        altura:"",
        largura:"",
        profundidade:"",
        cidadeCepOrigem:"",
        cidadeCepDestino:""
        */
    },
    methods: {
        cotar: function () {
            validar();
            if($(".alertError").is(":visible")){
                return false;
            }
            
            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/cotacao`,
                    data: {
                            "dominio": "TDD",
                            "login": this.login,
                            "senha": this.senha,
                            "cnpjPagador": this.cnpjPagador,
                            "cepOrigem": this.cepOrigem.replace("-", ""),
                            "cepDestino": this.cepDestino.replace("-", ""),
                            "valorNF": $(".maskMoney").val().replace(/[^0-9,]/g, "").replace(",", "."),
                            "quantidade": this.quantidade,
                            "peso": this.peso,
                            "volume": this.volume / 1000000,
                            "cnpjDestinatario": this.cnpjDestinatario
                    }
                }
            ).then((response) => {
                console.log("response", response)
                this.retornoCotacao = response.data;
                this.showResponseScreem = true;
                this.prazo = response.data.prazo;
                this.pesoCalculo = response.data.pesoCalculo;
                this.valorFrete = parseFloat(response.data.valorFrete).toLocaleString('pt-br', {style: 'currency', currency:'BRL'});
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })
            
        },
        buscarCidade:function(tipoCep){
            var cep = "";
            console.log("buscarCidade");
            if(tipoCep == 'origem'){
                this.cidadeCepOrigem = "...";
                cep = this.cepOrigem.replace("-", "").trim();
            }else{
                this.cidadeCepDestino = "...";
                cep = this.cepDestino.replace("-", "").trim();
            }

            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/getcidade`,
                    data: {
                        "dominio": "TDD",
                        "login": this.login,
                        "senha": this.senha,
                        "cep": cep,
                    }
                }
            ).then((response) => {
                console.log("response", response);
                if(tipoCep == 'origem'){
                    this.cidadeCepOrigem = response.data.nomeCidade;
                }else{
                    this.cidadeCepDestino = response.data.nomeCidade;
                }
                
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })
        },
        voltar: function(){
            this.showResponseScreem = false;
            setTimeout(validationInit, 1000);
        },
        calcularCubagem: function(){
            if(this.quantidade == ''){
                alert("Preencha a quantidade de volumes para calcular a cubagem");
                return false;
            }
            this.volume = (this.altura * this.largura * this.profundidade) * this.quantidade;
        },
        limparCampoVolume:function(){
            this.volume = "";
        }


    },

})