let G = {};

G.byClass 	= title => document.getElementsByClassName(title);
G.byName 	= title => document.getElementsByName(title);
G.byTag 	= title => document.getElementsByTagName(title);
G.byId 		= title => document.getElementById(title);

/**
 * Funkcie spracuje chybové hlášky
 * @param args
 */
G.error = function(...args){
    window.console.error.apply(window.console, args);
};

G.warn = function(...args){
    window.console.warn.apply(window.console, args);
};

G.log = function(...args){
    window.console.log.apply(window.console, args);
};

//G.now = () => new Date().getTime();
G.now = () => (performance || Date).now();
G.typeOf = val => typeof val;
G.isFunction = val => G.typeOf(val) === "function";
G.isDefined = val => G.typeOf(val) !== "undefined";
G.isString = val => G.typeOf(val) === "string";
G.isObject = val => G.typeOf(val) === "object";
G.isNumber = val => G.typeOf(val) === "number";
//G.isNum = obj => !G.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
G.isInt = val => G.isNumber(val) && val % 1 === 0;
G.isFloat = val => G.isNumber(val) && val % 1 !== 0;
G.isBool = val => G.typeOf(val) === "boolean";
//G.isG = val => G.isObject(val) && val.__proto__ === G.prototype;
G.isG = val => G.isObject(val) && Object.getPrototypeOf(val) === G.prototype;
G.isUndefined = val => !G.isDefined(val);
//G.isArray = val => Array.isArray(val);
G.isArray = val => Object.prototype.toString.call(val) === '[object Array]';
G.isToStringable = val => G.isNumber(val) || G.isString(val) || G.isBool(val); //deprecated since 29.1.2017
G.isEmpty = val => val === {} || val === [] || val === "";
//G.isGElement = val => val["isGElement"] === true;
G.isElement = obj => {
    try {
        return obj instanceof HTMLElement;
    }
    catch(e){
        return G.isObject(obj) &&
            obj.nodeType === 1 &&
            G.isObject(obj.style) &&
            G.isObject(obj.ownerDocument);
    }
};

export {G};