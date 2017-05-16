/**
 * Created by gabriel on 16.5.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */

let utils = {};
utils.now = () => new Date().getTime();
utils.typeOf = val => typeof val;
utils.isFunction = val => utils.typeOf(val) === "function";
utils.isDefined = val => utils.typeOf(val) !== "undefined";
utils.isString = val => utils.typeOf(val) === "string";
utils.isObject = val => utils.typeOf(val) === "object";
utils.isNumber = val => utils.typeOf(val) === "number";
//G.isNum = obj => !G.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
utils.isInt = val => utils.isNumber(val) && val % 1 === 0;
utils.isFloat = val => utils.isNumber(val) && val % 1 !== 0;
utils.isBool = val => utils.typeOf(val) === "boolean";
//G.isG = val => G.isObject(val) && val.__proto__ === G.prototype;
//utils.isG = val => G.isObject(val) && Object.getPrototypeOf(val) === G.prototype;
utils.isUndefined = val => !utils.isDefined(val);
//G.isArray = val => Array.isArray(val);
utils.isArray = val => Object.prototype.toString.call(val) === '[object Array]';
utils.isToStringable = val => utils.isNumber(val) || utils.isString(val) || utils.isBool(val); //deprecated since 29.1.2017
utils.isEmpty = val => val === {} || val === [] || val === "";
//G.isGElement = val => val["isGElement"] === true;
utils.isElement = obj => {
    try {
        return obj instanceof HTMLElement;
    }
    catch(e){
        return utils.isObject(obj) &&
            obj.nodeType === 1 &&
            utils.isObject(obj.style) &&
            utils.isObject(obj.ownerDocument);
    }
};

export {utils};
