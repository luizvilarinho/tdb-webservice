var getDateColeta =function (){
    var today = new Date();
    var tomorrow = new Date(today.setDate(today.getDate() + 1));

    if(tomorrow.getDay() == 6){
        var dataColeta = new Date(today.setDate(today.getDate() + 2));
        dataColeta = dataColeta.toLocaleDateString();
    }
    
    if(tomorrow.getDay() == 0){
        var dataColeta = new Date(today.setDate(today.getDate() + 1));
        dataColeta = dataColeta.toLocaleDateString();
    }

    if(tomorrow.getDay() != 0 && tomorrow.getDay() != 6 ){
        var dataColeta = new Date();
        dataColeta = dataColeta.toLocaleDateString();
    }

    dataColeta = dataColeta + "T17:30" 
    
    return dataColeta
    
}

module.exports = getDateColeta;