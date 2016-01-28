function changeIfEqual(variable, value, newValue){
    return variable == value ? newValue : variable;
}
Array.prototype.contains = function(obj){
    var i = this.length;
    while(i--)
        if(this[i] == obj)
            return true;
    return false;
    
    for(var i in this)
        if(this[i] == obj)
            return true;
    return false;
}
