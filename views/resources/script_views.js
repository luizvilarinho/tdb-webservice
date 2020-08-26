var app = new Vue({
    el: '#app',
    data: {
        showResponseScreem: false, //mock:default false 
        showHide:{
            showdadosAcessos:true,
            showDadosPessoais:true,
            showEnderecoColeta:true,
            showCubagem: false,
            showCalculoVolume:false,
            dadosAcessoShow:true,
            showDadosColeta:false, //mock default false
            showColetaSucesso:false //mock default false
        },
        formParams:{
            cnpjPagador:"",
            senhaPagador:"",
            nome:"",
            email:"",
            telefone:"",
            celular:"",
            cifFob:"",
            cnpjPagadorOrigem:"",
            cepOrigem:"",
            enderecoCepOrigem:"",
            numeroCepOrigem:"",
            complementoCepOrigem:"",
            bairroCepOrigem:"",
            cidadeCepOrigem:"",
            estadoCepOrigem:"",
            quantidade:"",
            peso:0,
            volume:"",
            dominio:"TDD",
            cepDestinatario:"",
            cnpjDestinatario:"",
            enderecoDestinatario:"",
            numeroDestinatario:"",
            complementoDestinatario:"",
            bairroDestinatario:"",
            cidadeDestinatario:"",
            estadoDestinatario:""
        },
        /*
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
            peso:31.12,
            volume:"0,04",
            dominio:"TDD",
            cepDestinatario:"01415001",
            cnpjDestinatario:"00001837825181",
            enderecoDestinatario:"",
            numeroDestinatario:"321",
            complementoDestinatario:"",
            bairroDestinatario:"",
            cidadeDestinatario:"",
            estadoDestinatario:""
        */
        paramsColeta:{
            token:"",
            limiteColeta:"",
            observacao:""
        },
        prazo:0,
        qntLinhasCubagem:0,
        desabilitarVolume:false,
        retornoCotacao:null,
        numeroCotacao:0,
        valorFrete:0 // mock: default 0               
    },
    methods: {
        cotar: function () {
            validar("#dados-cotacao");
            if($(".alertError").is(":visible")){
                console.log("error");
                return false;
            }

            if(this.formParams.peso == 0){
                alert("O peso deve ser maior que zero");
                return false;
            }

            if(this.formParams.quantidade == 0){
                alert("A quantidade deve ser maior que zero");
            }

            var volume = 0;
            var quantidade = 0;

            if(this.showHide.showCubagem){
                alert("Calcule a cubagem apra continuar");
                return false;
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
                        "quantidade": this.formParams.quantidade,
                        "peso": this.formParams.peso,
                        "volume": this.formParams.volume / 1000000,
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
                this.numeroCotacao = response.data.numeroCotacao
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
        limparDadosTela:function(){
            this.formParams.cnpjPagador="";
            this.formParams.senhaPagador="";
            this.formParams.nome="";
            this.formParams.email="",
            this.formParams.telefone="";
            this.formParams.celular="";
            this.formParams.cifFob="";
            this.formParams.cnpjPagadorOrigem="";
            this.formParams.cepOrigem="";
            this.formParams.enderecoCepOrigem="";
            this.formParams.numeroCepOrigem="";
            this.formParams.complementoCepOrigem="";
            this.formParams.bairroCepOrigem="";
            this.formParams.cidadeCepOrigem="";
            this.formParams.estadoCepOrigem="";
            this.formParams.quantidade="";
            this.formParams.peso=0;
            this.formParams.volume="";
            this.formParams.dominio="TDD";
            this.formParams.cepDestinatario="";
            this.formParams.cnpjDestinatario="";
            this.formParams.enderecoDestinatario="";
            this.formParams.numeroDestinatario="";
            this.formParams.complementoDestinatario="";
            this.formParams.bairroDestinatario="";
            this.formParams.cidadeDestinatario="";
            this.formParams.estadoDestinatario="";
        },
        voltar: function(currentLocation){

            if(currentLocation == 'resultadoCotacao'){
                this.showResponseScreem = false;
                this.showHide.dadosAcessoShow = true;
                setTimeout(validationInit, 1000);
            }

            if(currentLocation == 'dadosColeta'){
                this.showHide.showDadosColeta = false;
            }

            if(currentLocation == 'sucessoColeta'){
                this.limparDadosTela();
                this.showResponseScreem = false;
                this.showHide.dadosAcessoShow = true;
                this.showHide.showDadosColeta = false;
                this.showHide.showColetaSucesso = false;
                
            }
        },
        abrirBlocoCubagem: function(){
            this.formParams.quantidade = 0;
            this.formParams.volume = 0;
            this.showHide.showCubagem = !this.showHide.showCubagem;
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
            
            this.formParams.quantidade = qntProduto ;
            this.formParams.volume = resultado;
            //this.formParams.peso = this.formParams.peso * qntProduto;

            this.showHide.showCubagem = false;
        },
        //doing
        adicionarLinha: function(){
            validar("#container__calcular-cubagem");
            if($(".alertError").is(":visible")){
                console.log("error");
                return false;
            }
            
            this.qntLinhasCubagem++;
        },
        deletarLinha: function(n){
            this.$refs['line'][n-1].remove();
        },
        limparCampoVolume:function(){
            this.volume = "";
        },
        preencherDadosColeta:function(){
            this.showHide.showDadosColeta = true;
        },
        //TODO
        realizarColeta:function(){
            if(1===1){
                var data={
                    cotacao:this.numeroCotacao,
                    limiteColeta:this.paramsColeta.limiteColeta,
                    token:this.paramsColeta.token,
                    solicitante:this.formParams.email,
                    observacao: this.paramsColeta.observacao
                }
                console.log(data)
                //return false;
            }
            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/coleta`,
                    data: {
                        cotacao:this.numeroCotacao,
                        limiteColeta:this.paramsColeta.limiteColeta,
                        token:this.paramsColeta.token,
                        solicitante:this.formParams.email,
                        observacao: this.paramsColeta.observacao
                    }
                }
            ).then((responseColeta) => {
                console.log("responseCOLETA", responseColeta.data);
                if(responseColeta.data.hasError == true){
                    alert("Não foi possível realizar a solicitação " + responseColeta.data.errorMessage);
                }
                if(responseColeta.data.sucesso == true){
                    this.showHide.showColetaSucesso = true;
                }
                                
            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })
        },
        continuar:function(){
            validar("#dados-acesso");
            if($(".alertError").is(":visible")){
                console.log("error");
                return false;
            }

            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/consultarCliente`,
                    data: {
                        cpfCnpj:this.formParams.cnpjPagador,
                    }
                }
            ).then((responseConsultarCliente) => {
                console.log("response", responseConsultarCliente.data);
                
                if(this.formParams.cifFob == "C"){
                    this.formParams.nome = responseConsultarCliente.data.razaoSocial; 
                    this.formParams.cnpjPagadorOrigem = this.formParams.cnpjPagador; 
                }else{
                    this.formParams.cnpjDestinatario = this.formParams.cnpjPagador;
                }
                this.showHide.dadosAcessoShow=false;

                setTimeout(validationInit, 1000);

            }).catch(error => {
                alert("houve um problema ao tentar realizar a operação");
            })

            

            
        }
    },
    

})