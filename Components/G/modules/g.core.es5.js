"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var G = {};

G.byClass = function (title) {
	return document.getElementsByClassName(title);
};
G.byName = function (title) {
	return document.getElementsByName(title);
};
G.byTag = function (title) {
	return document.getElementsByTagName(title);
};
G.byId = function (title) {
	return document.getElementById(title);
};

/**
 * Funkcie spracuje chybové hlášky
 * @param args
 */
G.error = function () {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	console.error.apply(console, args);
};

G.warn = function () {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	console.warn.apply(console, args);
};

G.log = function () {
	for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		args[_key3] = arguments[_key3];
	}

	console.log.apply(console, args);
};

//G.now = () => new Date().getTime();
G.now = function () {
	return (performance || Date).now();
};
G.typeOf = function (val) {
	return typeof val === "undefined" ? "undefined" : _typeof(val);
};
G.isFunction = function (val) {
	return G.typeOf(val) === "function";
};
G.isDefined = function (val) {
	return G.typeOf(val) !== "undefined";
};
G.isString = function (val) {
	return G.typeOf(val) === "string";
};
G.isObject = function (val) {
	return G.typeOf(val) === "object";
};
G.isNumber = function (val) {
	return G.typeOf(val) === "number";
};
//G.isNum = obj => !G.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
G.isInt = function (val) {
	return G.isNumber(val) && val % 1 === 0;
};
G.isFloat = function (val) {
	return G.isNumber(val) && val % 1 !== 0;
};
G.isBool = function (val) {
	return G.typeOf(val) === "boolean";
};
//G.isG = val => G.isObject(val) && val.__proto__ === G.prototype;
G.isG = function (val) {
	return G.isObject(val) && Object.getPrototypeOf(val) === G.prototype;
};
G.isUndefined = function (val) {
	return !G.isDefined(val);
};
//G.isArray = val => Array.isArray(val);
G.isArray = function (val) {
	return Object.prototype.toString.call(val) === '[object Array]';
};
G.isToStringable = function (val) {
	return G.isNumber(val) || G.isString(val) || G.isBool(val);
}; //deprecated since 29.1.2017
G.isEmpty = function (val) {
	return val === {} || val === [] || val === "";
};
//G.isGElement = val => val["isGElement"] === true;
G.isElement = function (obj) {
	try {
		return obj instanceof HTMLElement;
	} catch (e) {
		return G.isObject(obj) && obj.nodeType === 1 && G.isObject(obj.style) && G.isObject(obj.ownerDocument);
	}
};

exports.G = G;
