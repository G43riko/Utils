let Util = {};

/**
 *
 * @param time
 * @param decimals
 * @returns {string}
 */
Util.toHHMMSS = function(time, decimals = 0) {
    let sec_num = parseInt(time, 10) / 1000;
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10){ hours   = "0" + hours;}
    if (minutes < 10){ minutes = "0" + minutes;}
    if (seconds < 10){
        seconds = "0" + seconds.toFixed(decimals);
    }
    else {
        seconds = seconds.toFixed(decimals);
    }
    return hours + ':' + minutes + ':' + seconds;
};

/**
 *
 * @returns {{}}
 */
Util.queryString = function(){
    let query_string = {};
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i=0 ; i<vars.length ; i++) {
        let pair = vars[i].split("=");
        if(typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        }
        else if(typeof query_string[pair[0]] === "string") {
            query_string[pair[0]] = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
        }
        else{
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
};

/**
 *
 * @param object
 * @returns {number}
 */
Util.roughSizeOfObject = function(object) {
    let objectList = [];
    let stack = [object];
    let bytes = 0;

    while (stack.length) {
        let value = stack.pop();
        if(isBoolean(value)){
            bytes += 4;
        }
        else if(isString(value)){
            bytes += value.length << 1;
        }
        else if(isNumber(value)){
            bytes += 8;
        }
        else if(isObject(value) && objectList.indexOf( value ) === -1){
            objectList.push(value);
            for(let i in value){
                if(value.hasOwnProperty(i)){
                    stack.push(value[i]);
                }
            }
        }
    }
    return bytes;
};

/**
 *
 * @param obj
 * @returns {boolean}
 */
Util.isIn = function(obj){
	for(let i=1 ; i<arguments.length ; i++){
		if(arguments[i] === obj){
			return true;
        }
    }

	return false;
};

/**
 *
 * @param cname
 * @param cvalue
 * @param exdays
 */
Util.setCookie = function(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = cname + "=" + cvalue + ";expires="+ d.toUTCString();
};

/**
 *
 * @param cname
 * @returns {*}
 */
Util.getCookie = function(cname) {
    let name = cname + "=",
        ca = document.cookie.split(';'),
        i, c;
    for(i = 0; i <ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0){
            return c.substring(name.length,c.length);
        }
    }
    return "";
};


/**
 *
 * @param func
 * @returns {Function}
 */
function negate(func) {
	return function(x) {
		return !func(x);
	};
}

/**
 *
 * @param el1
 * @param el2
 * @returns {boolean}
 */
function equal(el1, el2){
	return el1 == el2;
}

/**
 *
 * @param el1
 * @param el2
 * @returns {boolean}
 */
function greaterThen(el1, el2){
	return el1 > el2;
}

/**
 *
 * @param el1
 * @param el2
 * @returns {boolean}
 */
function lessThen(el1, el2){
	return el1 < el2;
}

/**
 *
 * @param total
 * @returns {number}
 */
Array.prototype.sum = function(total = 0) {
	this.forEach(number => total += number);
	return total;
};

/**
 *
 * @param numbers
 * @returns {*}
 */
Array.prototype.max = function(numbers) {
	let max, j = 0;
	this.forEach(number => max = equal(j++, 0) ? number : (greaterThen(max, number) ? max : number));
	return max;
};

/**
 *
 * @param min
 * @param max
 * @param result
 * @returns {Array}
 */
Array.prototype.range = function(min, max, result = []){
	this.forEach(number => greaterThen(number, min - 1) && lessThen(number, max + 1) && result.push(number));
	return result;
};

/**
 *
 * @param result
 * @returns {number}
 */
Array.prototype.avg = function(result = 0){
	return this.sum() / this.length;
};

/**
 *
 * @param numbers
 * @returns {*}
 */
Array.prototype.min = function(numbers) {
	let min, j = 0;
	this.forEach(number => min = equal(j++, 0) ? number : (lessThen(min, number) ? min : number));
	return min;
};

/**
 *
 * @returns {boolean}
 */
Array.prototype.head = function(){//existuje shift - ale ten vymazava
    return this.length > 0 ? this[0] : false;
};

/**
 *
 * @returns {boolean}
 */
Array.prototype.last = function(){//existuje pop - ale ten vymazava
	return this.length > 0 ? this[this.length - 1] : false;
};

/**
 *
 * @returns {Array.<*>}
 */
Array.prototype.merge = function(){
	return this.concat().sort();
};

/**
 *
 * @param func
 * @param result
 * @returns {Array}
 */
Array.prototype.product = function(func, result = []){
	this.forEach(element => result.push(func(element)));
	return result;
};
