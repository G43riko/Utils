/**
 *
 * @param variable
 * @param value
 * @param newValue
 * @returns {*}
 */
function changeIfEqual(variable, value, newValue){
    return variable == value ? newValue : variable;
}

/**
 *
 * @param obj
 * @returns {boolean}
 */
function isIn(obj){
	for(let i=1 ; i<arguments.length ; i++){
		if(arguments[i] === obj){
			return true;
        }
    }

	return false;
}

/**
 *
 * @param val
 * @returns {boolean}
 */
function isFunction(val){
	return typeof val === "function";
}

/**
 *
 * @param val
 * @returns {boolean}
 */
function callIfFunc(val){
	return isFunction(val) ? val() : false;
}

/**
 *
 * @param val
 * @returns {boolean}
 */
function isUndefined(val){
	return typeof val === "undefined";
}

/**
 *
 * @param n
 * @returns {boolean}
 */
function isInt(n){
	return Number(n) === n && n % 1 === 0;
}

/**
 *
 * @param n
 * @returns {boolean}
 */
function isFloat(n){
	return Number(n) === n && n % 1 !== 0;
}

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
