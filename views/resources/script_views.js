var app = new Vue({
    el: '#app',
    data: {
        showResponseScreem: false,
        retornoCotacao:null,
        prazo:0,
        valorFrete:"",
        dominio:"TDD",
        cnpjPagador:"63004030005740",
        cepOrigem:"07031000",
        cepDestino:"01415001",
        valorNF:1300.00,
        quantidade:2,
        peso:31.812,
        volume:2,
        cnpjDestinatario:"00001837825181"
    },
    methods: {
        cotar: function () {
            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/cotacao`,
                    data: {
                            "dominio": this.dominio,
                            "cnpjPagador": this.cnpjPagador,
                            "cepOrigem": this.cepOrigem,
                            "cepDestino": this.cepDestino,
                            "valorNF": this.valorNF,
                            "quantidade": this.quantidade,
                            "peso": this.peso,
                            "volume": this.volume,
                            "cnpjDestinatario": this.cnpjDestinatario
                    }
                }
            ).then((response) => {
                console.log("response", response)
                this.retornoCotacao = response.data;
                this.showResponseScreem = true;
                this.prazo = response.data.cotacao.prazo._text;
                this.valorFrete = parseFloat(response.data.cotacao.totalFrete._text).toLocaleString('pt-br', {style: 'currency', currency:'BRL'});
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação")
            })

        },
        voltar: function(){
            this.showResponseScreem = false;
        }

    },

})