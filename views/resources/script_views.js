var app = new Vue({
    el: '#app',
    data: {
        showResponseScreem: false,
        showHide:{
            showdadosAcessos:true,
            showDadosPessoais:true,
            showEnderecoColeta:true,
            showCubagem: false,
            showCalculoVolume:false
        },
        formParams:{
            cnpjPagador:"63004030005740",
            senhaPagador:"cec63",
            nome:"Luiz",
            email:"luiz@gmial.com",
            telefone:"(11)98221-4786",
            celular:"(11)98221-4786",
            cifFob:"",
            cnpjPagadorOrigem:"63004030005740",
            cepOrigem:"07031000",
            enderecoCepOrigem:"",
            numeroCepOrigem:"",
            complementoCepOrigem:"",
            bairroCepOrigem:"",
            cidadeCepOrigem:"",
            estadoCepOrigem:"",
            quantidade:"2",
            peso:"31,12",
            volume:"0,04",
            dominio:"TDD",
            cepDestinatario:"01415001",
            cnpjDestinatario:"00001837825181",
            enderecoDestinatario:"",
            numeroDestinatario:"321",
            complementoDestinatario:"",
            bairroDestinatario:"",
            cidadeDestinatario:"",
            estadoDestinatario:"",
            volumeCalculado:"",
            quantidadeCubagem:""
        },
        paramsColeta:{
            token:"",
            cotacao:"",
            limiteColeta:"",
            solicitante:""
        },
        prazo:0,
        qntLinhasCubagem:0,
        desabilitarVolume:false,
        retornoCotacao:null,               
    },
    methods: {
        cotar: function () {
            validar();
            if($(".alertError").is(":visible")){
                console.log("error");
                return false;
            }

            var volume = 0;
            var quantidade = 0;

            if(this.showHide.showCubagem){
                volume = this.formParams.volumeCalculado / 1000000;
                quantidade = this.formParams.quantidadeCubagem;
                
            }else{
                volume = this.formParams.volume / 1000000;
                quantidade = this.formParams.quantidade;
            }
            
            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/cotacao/`,
                    data: {
                        "dominio": "TDD",
                        "cnpjPagador": this.formParams.cnpjPagador,
                        "senhaPagador":this.formParams.senhaPagador,
                        "cepOrigem": this.formParams.cepOrigem.replace("-", ""),
                        "cepDestino": this.formParams.cepDestinatario.replace("-", ""),
                        "valorNF": $("input[name='valorCarga']").val().replace(/[^0-9,]/g, "").replace(",", "."),
                        "quantidade": quantidade,
                        "peso": this.formParams.peso,
                        "volume": volume,
                        "cnpjDestinatario": this.formParams.cnpjDestinatario,
                        "ciffob":this.formParams.cifFob,
                        "cnpjRemetente":this.formParams.cnpjPagador
                    }
                }
            ).then((response) => {
                console.log("response", response)
                this.retornoCotacao = response.data;
                this.showResponseScreem = true;
                this.prazo = response.data.prazo;
                this.valorFrete = parseFloat(response.data.valorFrete.replace(",",".")).toLocaleString('pt-br', {style: 'currency', currency:'BRL'});
                this.paramsColeta.token = response.data.token;
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })
            
        },
        buscarCidade:function(tipoCep){
            var cep = "";
            console.log("buscarCidade");
            if(tipoCep == 'origem'){
                this.formParams.enderecoCepOrigem = "...";
                cep = this.formParams.cepOrigem.replace("-", "").trim();
            }else{
                this.formParams.enderecoDestinatario = "...";
                cep = this.formParams.cepDestinatario.replace("-", "").trim();
            }

            console.log("CEP", cep);

            axios(
                {
                    method: 'get',
                    url: `/tdbwebservice/v1/buscaCep/${cep}`,
                    data: {}
                }
            ).then((response) => {
                console.log("response", response.data);
                if(tipoCep == 'origem'){
                    this.formParams.enderecoCepOrigem = response.data.rua;
                    this.formParams.bairroCepOrigem = response.data.bairro;
                    this.formParams.cidadeCepOrigem = response.data.cidade;
                    this.formParams.estadoCepOrigem = response.data.estado;
                }else{
                    this.formParams.enderecoDestinatario = response.data.rua;
                    this.formParams.bairroDestinatario = response.data.bairro;
                    this.formParams.cidadeDestinatario = response.data.cidade;
                    this.formParams.estadoDestinatario = response.data.estado;
                }
                
                
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })
        },
        voltar: function(){
            this.showResponseScreem = false;
            setTimeout(validationInit, 1000);
        },
        abrirBlocoCubagem: function(){
            this.formParams.quantidade = 0;
            this.formParams.volume = 0;
            this.showHide.showCubagem = !this.showHide.showCubagem;
            this.zerarCampoVolumeCubagem();

        },
        calcularCubagem: function(){
            var resultado = 0;
            $(".linha-calculo__cubagem").each(function(){
                var altura = parseFloat($(this).find(".altura").val());
                var largura = parseFloat($(this).find(".largura").val());
                var profundidade = parseFloat($(this).find(".profundidade").val());
                var quantidade = parseFloat($(this).find(".quantidade").val());

                resultado = resultado + (altura * largura * profundidade * quantidade);
            });

            var qntProduto = 0;
            $(".quantidade").each(function(){
                var qnt =parseFloat($(this).val());
                qntProduto = qntProduto + qnt;
            })

            this.formParams.quantidadeCubagem = qntProduto;

            console.log("QUANTIDADE", this.formParams.quantidadeCubagem);
            console.log("resultado", resultado);
            this.formParams.volumeCalculado = resultado;
            this.showHide.showCalculoVolume = true;
            $(".volumeCalculado__container").show(300);
        },
        adicionarLinha: function(){
            this.qntLinhasCubagem++;
        },
        deletarLinha: function(n){
            this.$refs['line'][n-1].remove();
            this.calcularCubagem();
        },
        limparCampoVolume:function(){
            this.volume = "";
        },
        zerarCampoVolumeCubagem: function(){
            if($(".volumeCalculado__container").find("input").val() == 0 ){
                return false;
            }

            this.formParams.volumeCalculado = 0;
            $(".volumeCalculado__container").hide(300);
        },
        //TODO
        realizarColeta:function(){
            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/coleta`,
                    data: {
                        cotacao:this.paramsColeta.cotacao,
                        limiteColeta:this.paramsColeta.limiteColeta,
                        token:this.paramsColeta.token,
                        solicitante:this.paramsColeta.solicitante
                    }
                }
            ).then((responseColeta) => {
                console.log("response", responseColeta.data);
                                
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })
        }
    },

})