var app = new Vue({
    el: '#app',
    data: {
        showResponseScreem: false, //mock:default false 
        showHide:{
            showCubagem: false,
            dadosAcessoShow:true,
            showColetaError:false
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
            cepDestinatario:"02174-010",
            cnpjDestinatario:"",
            enderecoDestinatario:"",
            numeroDestinatario:"",
            complementoDestinatario:"",
            bairroDestinatario:"",
            cidadeDestinatario:"",
            estadoDestinatario:"",
            tipoPagamento:"",
            numeroNF:"",
            observacao:""
        },
        /*
            cnpjPagador:"63004030005740",
            senhaPagador:"cec63",
            nome:"Luiz",
            email:"luiz@gmial.com",
            //telefone:"(11)98221-4786",
           // celular:"(11)98221-4786",
            tipoPagamento:"O",
            numeroNF:"",
            cnpjPagadorOrigem:"63004030005740",
            cepOrigem:"07031000",
            enderecoCepOrigem:"R Helia",
            numeroCepOrigem:"123",
            complementoCepOrigem:"",
            bairroCepOrigem:"asdasd",
            cidadeCepOrigem:"asdasd",
            estadoCepOrigem:"SP",
            quantidade:"2",
            peso:31.12,
            volume:"0,04",
            dominio:"TDD",
            cepDestinatario:"74740570",
            cnpjDestinatario:"00001837825181",
            enderecoDestinatario:"dasdasdas",
            numeroDestinatario:"321",
            complementoDestinatario:"",
            bairroDestinatario:"dsadgfgfg",
            cidadeDestinatario:"asgt45",
            estadoDestinatario:"GO"
        */
        
        errorMessages:{
            coleta:""
        },
        numeroColeta:0,
        qntLinhasCubagem:0,
        desabilitarVolume:false,
        retornoCotacao:null,
    },
    methods: {
        coletar: function () {
            
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

            var volume = this.formParams.volume || 0;

            if(this.showHide.showCubagem){
                alert("Calcule a cubagem para continuar");
                return false;
            }
            
            var enderecoEntrega = `${this.formParams.enderecoDestinatario},${this.formParams.numeroDestinatario}-${this.formParams.bairroDestinatario}. ${this.formParams.cidadeDestinatario}-${this.formParams.estadoDestinatario}`;
                var data= {
                    "dominio": "TDD",
                    "cnpjRemetente": this.formParams.tipoPagamento == "O"?  this.formParams.cnpjPagador : this.formParams.cnpjDestinatario,
                    "cnpjDestinatario": this.formParams.tipoPagamento == "O" ? this.formParams.cnpjDestinatario : this.formParams.cnpjPagador,
                    "numeroNF":this.formParams.numeroNF,
                    "tipoPagamento":this.formParams.tipoPagamento,
                    "enderecoEntrega":enderecoEntrega,
                    "cepEntrega": this.formParams.cepDestinatario.replace("-", ""),
                    "solicitante":this.formParams.email,
                    "quantidade": this.formParams.quantidade,
                    "peso": this.formParams.peso,
                    "observacao":this.formParams.observacao,
                    "instrucao":"",
                    "cubagem": volume,
                    "valorMerc": $("input[name='valorCarga']").val().replace(/[^0-9,]/g, "").replace(",", "."),
                    "especie":"",
                    "chaveNF":""
                }
                console.log("FRONTEND_SENDING...", data);

            axios(
                {
                    method: 'post',
                    url: `/tdbwebservice/v1/viewcoleta`,
                    data: {
                        "dominio": "TDD",
                        "cnpjRemetente": this.formParams.tipoPagamento == "O"?  this.formParams.cnpjPagador : this.formParams.cnpjDestinatario,
                        "cnpjDestinatario": this.formParams.tipoPagamento == "O" ? this.formParams.cnpjDestinatario : this.formParams.cnpjPagador,
                        "numeroNF":this.formParams.numeroNF,
                        "tipoPagamento":this.formParams.tipoPagamento,
                        "enderecoEntrega":enderecoEntrega,
                        "cepEntrega": this.formParams.cepDestinatario.replace("-", "").trim(),
                        "solicitante":this.formParams.email,
                        "quantidade": this.formParams.quantidade,
                        "peso": this.formParams.peso,
                        "observacao":this.formParams.observacao,
                        "instrucao":"",
                        "cubagem": volume,
                        "valorMerc": $("input[name='valorCarga']").val().replace(/[^0-9,]/g, "").replace(",", "."),
                        "especie":"",
                        "chaveNF":""
                    }
                }
            ).then((response) => {
                console.log("response", response)

                if(response.data.sucesso == true){
                    console.log("true")
                    this.showResponseScreem = true;
                    this.showHide.showColetaError = false;
                    this.numeroColeta = response.data.numeroColeta
                }else{
                    console.log("false")
                    this.showHide.showColetaError = true;
                    this.errorMessages.coleta = response.data.mensagem
                }
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
            this.formParams.cnpjPagador = "",
            this.formParams.senhaPagador = "",
            this.formParams.nome = "",
            this.formParams.email = "",
            this.formParams.telefone = "",
            this.formParams.celular = "",
            this.formParams.cifFob = "",
            this.formParams.cnpjPagadorOrigem = "",
            this.formParams.cepOrigem = "",
            this.formParams.enderecoCepOrigem = "",
            this.formParams.numeroCepOrigem = "",
            this.formParams.complementoCepOrigem = "",
            this.formParams.bairroCepOrigem = "",
            this.formParams.cidadeCepOrigem = "",
            this.formParams.estadoCepOrigem = "",
            this.formParams.quantidade = "",
            this.formParams.peso = 0,
            this.formParams.volume = "",
            this.formParams.dominio = "TDD",
            this.formParams.cepDestinatario = "02174-010",
            this.formParams.cnpjDestinatario = "",
            this.formParams.enderecoDestinatario = "",
            this.formParams.numeroDestinatario = "",
            this.formParams.complementoDestinatario = "",
            this.formParams.bairroDestinatario = "",
            this.formParams.cidadeDestinatario = "",
            this.formParams.estadoDestinatario = "",
            this.formParams.tipoPagamento = "",
            this.formParams.numeroNF = "",
            this.formParams.observacao = ""
        },
        voltar: function(currentLocation){
            if(currentLocation == 'dadosColeta'){
                this.showResponseScreem = false;
                this.showHide.dadosAcessoShow = true;
                this.showHide.showColetaError = false;
                setTimeout(validationInit, 1000);
            }

            if(currentLocation == 'coletaError'){
                this.showResponseScreem = false;
                this.showHide.dadosAcessoShow = true;
                this.showHide.showColetaError = false;
                setTimeout(validationInit, 1000);
            }
            

            if(currentLocation == 'resultadoColeta'){
                this.showResponseScreem = false;
                this.showHide.dadosAcessoShow = true;
                this.showHide.showColetaError = false;
                this.limparDadosTela();
                setTimeout(validationInit, 1000);
            }

            

            setTimeout(function(){
                $(".maskMoney").maskMoney({
                    prefix: "R$ ",
                    decimal: ",",
                    thousands: "."
                }).attr("placeholder", "R$ 0,00");
            }, 1500)
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
            this.formParams.volume = resultado / 1000000;
            //this.formParams.peso = this.formParams.peso * qntProduto;

            this.showHide.showCubagem = false;
        },
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
                
                if(this.formParams.tipoPagamento == "O"){
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