var transformDate =function (stringBrDate){
    [dd, mm, yyyy] = stringBrDate.split("/");
    var serviceDate = `${yyyy}-${mm}-${dd}T18:00`
    return serviceDate
}

module.exports = transformDate;