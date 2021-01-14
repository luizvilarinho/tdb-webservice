var getDateColeta =function (){
    var today = new Date();
    var tomorrow = new Date(today.setDate(today.getDate() + 1));

    if(tomorrow.getDay() == 6){
        var dataColeta = new Date(tomorrow.setDate(today.getDate() + 2));
        [dd, mm, yyyy] = [dataColeta.getDate(), dataColeta.getMonth()+1, dataColeta.getFullYear()];
        
        var mes = new String(mm);
        if(mes.length < 2){
            mm = "0" + mm;
        }

        dataColeta = yyyy + "-" + mm + "-" + dd;
    }
    
    if(tomorrow.getDay() == 0){
        var dataColeta = new Date(tomorrow.setDate(today.getDate() + 1));
        [dd, mm, yyyy] = [dataColeta.getDate(), dataColeta.getMonth()+1, dataColeta.getFullYear()];

        var mes = new String(mm);
        if(mes.length < 2){
            mm = "0" + mm;
        }

        dataColeta = yyyy + "-" + mm + "-" + dd;
    }

    if(tomorrow.getDay() != 0 && tomorrow.getDay() != 6 ){
        var dataColeta = tomorrow;
        [dd, mm, yyyy] = [dataColeta.getDate(), dataColeta.getMonth()+1, dataColeta.getFullYear()];

        var mes = new String(mm);
        if(mes.length < 2){
            mm = "0" + mm;
        }
        
        dataColeta = yyyy + "-" + mm + "-" + dd;
    }

    dataColeta = dataColeta + "T17:30:00" 
    
    return dataColeta
}

module.exports = getDateColeta;