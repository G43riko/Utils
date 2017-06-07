"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.G = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _gCore = require("./g.core.es5");

/**
 * Funkcia spustí AJAXové volanie na danu url a po uspešnej odpovedi zavolá callback funkciu
 *
 * @param url
 * @param options
 * @param dataType
 * @returns {*}
 */
_gCore.G.ajax = function (url, options, dataType) {
  var start = 0;
  /*
  if(!window.XMLHttpRequest){
  	G.warn("Lutujeme ale váš prehliadaš nepodporuje AJAX");
  	return false;
  }
  */
  var http = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

  if (_gCore.G.isFunction(options)) {
    options = { success: options };
    if (_gCore.G.isString(dataType)) {
      options.dataType = dataType;
    }
  } else if (!_gCore.G.isObject(options)) {
    options = {};
  }

  if (!_gCore.G.isString(url)) {
    _gCore.G.warn("url nieje string a je: ", url);
    return false;
  }

  options.method = options.method || "GET";
  options.async = options.async || true;

  if (_gCore.G.isFunction(options.abort)) {
    http.onabort = options.abort;
  }
  if (_gCore.G.isFunction(options.error)) {
    http.onerror = options.error;
  }
  if (_gCore.G.isFunction(options.progress)) {
    http.onprogress = options.progress;
  }
  if (_gCore.G.isFunction(options.timeout)) {
    http.ontimeout = options.timeout;
  }
  if (_gCore.G.isFunction(options.loadEnd)) {
    http.onloadend = function () {
      return options.loadEnd(_gCore.G.now() - start);
    };
  }
  if (_gCore.G.isFunction(options.loadStart)) {
    http.onloadstart = function () {
      options.loadStart();
      start = _gCore.G.now();
    };
  }

  if (_gCore.G.isFunction(options.success)) {
    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
        switch (options.dataType) {
          case "json":
            options.success(JSON.parse(http.responseText));
            break;
          case "html":
            options.success(new DOMParser().parseFromString(http.responseText, "text/xml"));
            break;
          case "xml":
            options.success(new DOMParser().parseFromString(http.responseText, "text/xml"));
            break;
          default:
            options.success(http.responseText);
        }
      }
    };
  } else {
    _gCore.G.warn("nieje zadaná Succes funkcia");
  }
  http.open(options.method, url, options.async);
  http.send();
  return http;
};

/**
 * Funkcia načíta a spustí externý Script
 *
 * @param src
 * @param async
 * @returns {Element|*}
 */
_gCore.G.loadScript = function (url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    //IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    //Others
    script.onload = function () {
      callback();
    };
  }

  script.src = url;
  document.G.byTag('head')[0].appendChild(script);
};

/**
 * Funkcia zistí či element má danú triedu
 *
 * @param element
 * @param className
 * @returns {boolean}
 */
_gCore.G.hasClass = function (element, className) {
  //ak nieje zadaný element kotrý sa má overovať
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.hasClass: prvý argument element[Element] je: ", element);
    return false;
  }

  //ak nieje zadaný trieda ktorá sa má overovať
  if (!_gCore.G.isString(className)) {
    _gCore.G.warn("G.hasClass: druhý argument className[String] je: ", className);
    return false;
  }

  //vrátime výsledok overovania
  return element.classList.contains(className);
};

/**
 * Funkcia vytvorý nový element a vráty ho
 *
 * G.createElement("div") => <div></div>;
 * G.createElement("div", {id: "ide"}) => <div id="ide"></div>;
 * G.createElement("div", {}, "text") => <div>text</div>;
 * G.createElement("div", {}, "<b>text</b>") => <div><b>text</b></div>;
 * G.createElement("div", {}, "text", {color: "blue"}) => <div style="color: blue;">text</div>
 *
 * @param name - názov elementu
 * @param attr - objekt kde kluče su nazvy atribútov a hodnoty su hodnoty atribútov
 * @param cont - string s textom alebo element alebo pole elementov
 * @param style - objekt kde kluče su nazvy štýlov a hodnoty su hodnoty štýlov
 * @returns {Element} - novo vytvorený element
 */
_gCore.G.createElement = function (name, attr, cont, style) {
  var el = void 0;

  //ak je prvý parameter objekt tak zavoláme rekurzívne túto funkciu s hodnotami objektu
  if (_gCore.G.isObject(name)) {
    //ak objekt s udajmy o novom element neobsahuje názov elementu
    if (!_gCore.G.isString(name.name)) {
      _gCore.G.warn("G.createElement: prví parameter musí byť typu [Object] ktorý obsahuje name[String] a je: ", name);
      return null;
    }

    return _gCore.G.createElement(name.name, name.attr || {}, name.cont || "", name.style || {});
  }

  //ak nieje zadané meno elementu
  if (!_gCore.G.isString(name)) {
    _gCore.G.warn("G.createElement: prvý parameter name[String] je: ", name);
    return null;
  }

  el = document.createElement(name);

  //Ak sú atributy objekt tak priradíme elementu všetky atribúty
  if (_gCore.G.isObject(attr)) {
    _gCore.G.each(attr, function (e, i) {
      return el.setAttribute(i, e);
    });
  }

  //Ak sú štýly objekt tak priradíme elementu všetky štýly
  if (_gCore.G.isObject(style)) {
    _gCore.G.each(style, function (e, i) {
      return el.style[i] = e;
    });
  }

  //Priradíme elementu obsah
  if (_gCore.G.isString(cont)) {
    _gCore.G.html(el, cont);
  } else if (_gCore.G.isArray(cont)) {
    _gCore.G.each(cont, function (e) {
      if (_gCore.G.isElement(e)) {
        el.appendChild(e);
      }
    });
  } else if (_gCore.G.isElement(cont)) {
    el.appendChild(cont);
  } else if (_gCore.G.isG(cont)) {
    el.appendChild(cont.first());
  }

  return el;
};

/**
 * Funkcia vráti posledný prvok pola ak existuje alebo null
 *
 * @param arr - pole ktorého posledný prvok potrebujeme
 * @returns {*} - posledný prvok alebo null
 */
_gCore.G.last = function (arr) {
  //ak pole ktorému hladáme koniec nieje pole tak vrátime null
  if (!_gCore.G.isArray(arr)) {
    return null;
  }

  //ak je pole prázdne vrátime null
  if (_gCore.G.isEmpty(arr)) {
    return null;
  }

  //vrátime posledný prvok
  return arr[arr.length - 1];
};

/**
 * Funkcia či sa prvok nachádza v poli alebo v zozname argumentov
 *
 * @param obj
 * @param data
 * @returns {boolean}
 */
_gCore.G.isIn = function (obj, data) {
  //testovane 8.1.2017
  if (_gCore.G.isArray(data)) {
    if (data.indexOf(obj) >= 0) {
      return true;
    }
  } else {
    for (var i = 1; i < arguments.length; i++) {
      if (arguments[i] === obj) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Funkcia zlúči objekty na vstupe do jedného (prvého) objektu
 * G.extend({a: "aa", b: "bb"}, {c: "cc", a: "aaa"}, {c: "ccc"}) => Object {a: "aaa", b: "bb", c: "ccc"}
 *
 * @param target
 * @param args
 * @returns {*}
 */
_gCore.G.extend = function (target) {
  //ak objekt do ktorého sa ide mergovať nieje objekt tak skončíme
  if (!_gCore.G.isObject(target)) {
    _gCore.G.warn("G.extend: prvý parameter target[Object] je: ", target);
    return target;
  }

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  _gCore.G.each(args, function (e, i) {
    //TODO ak je to objekt musí sa toto pravdepodobne volať rekurzivne
    //ak argument nieje objekt
    if (_gCore.G.isObject(e)) {
      _gCore.G.each(e, function (ee, key) {
        return target[key] = ee;
      });
    } else {
      _gCore.G.warn("G.extend:  argument args[" + i + "][Object] je : ", e);
    }
  });

  //vrátime zmergovaný objekt
  return target;
};

/**
 * Funkcia zistí či element spĺňa daný selector
 *
 * @param element
 * @param queryString
 * @returns {*}
 */
_gCore.G.matches = function (element, queryString) {
  //porovnám či element vyhovuje selectoru
  try {
    return element.matches(queryString);
  } catch (err) {
    _gCore.G.warn("G.matches: ", err);
  }
  return false;
};

/**
 * Funkcia preloopuje pole alebo objekt daný ako argument a zavolá funkciu a
 * umožnuje nastaviť lubovolný this objekt.
 * V prípade že funckia daná ako argument vráti false tak sa loop ukončí
 *
 * @param obj - objekt ktorý sa má preloopovať
 * @param func - funkcia ktorá sa má zavoláť pre každý objekt a jej parametre su: (element, index, pole)
 * @param thisArg - objekt ktorý má byť dosadený sa this premennú
 */
_gCore.G.each = function (obj, func, thisArg) {
  var i = void 0;
  if (!_gCore.G.isObject(obj)) {
    _gCore.G.warn("G.each: prvý parameter obj[Object] je:", obj);
    return false;
  }
  if (!_gCore.G.isFunction(func)) {
    _gCore.G.warn("G.each: druhý parameter func[Function] je:", func);
    return false;
  }

  if (_gCore.G.isArray(obj)) {
    if (_gCore.G.isObject(thisArg)) {
      for (i = 0; i < obj.length; i++) {
        if (func.call(thisArg, obj[i], i, obj) === false) {
          break;
        }
      }
    } else {
      for (i = 0; i < obj.length; i++) {
        if (func(obj[i], i, obj) === false) {
          break;
        }
      }
    }
  } else {
    if (_gCore.G.isObject(thisArg)) {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (func.call(thisArg, obj[i], i, obj) === false) {
            break;
          }
        }
      }
    } else {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (func(obj[i], i, obj) === false) {
            break;
          }
        }
      }
    }
  }
};

/**
 * Funkcia najde v rodičovnskom objekde objekty ktoré najde CSS selector
 *
 * @param queryString - klúč podla ktorého sa má hladať
 * @param parent - element v ktorom sa má hladadť. Defaultne je do document
 * @returns {Array} - pole nájdených výsledkov
 */
_gCore.G.find = function (queryString, parent) {
  //testovane 28.1.2017
  var result = [];

  //ak queryString nieje String
  if (!_gCore.G.isString(queryString)) {
    _gCore.G.warn("G.find: prvý parameter queryString[String] je ", queryString);
    return result;
  }

  //ak nieje zadaný parent alebo parent nieje element tak sa parent nastavný na document
  if (!_gCore.G.isElement(parent)) {
    //G.warn("G.find: druhý parameter parent[Element] je ", parent);
    parent = document;
  }

  //získame elementy do notlive collection
  var data = parent.querySelectorAll(queryString);

  //prejdeme všetký elementy a pridáme ich do výsledného pola
  _gCore.G.each(data, function (e) {
    return result[result.length] = e;
  });

  //vrátime výsledné pole
  return result;
};

/**
 * Funkcia vráti rodičovský element elementu na vstupe alebo null
 *
 * @param element - element ktorému sa hladá rodičovský element
 * @returns {Element} - rodičovský element alebo null ak sa nenašiel rodič
 */
_gCore.G.parent = function (element) {
  //testovane 28.1.2017
  //ak argument nieje element;
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.parent: prvý parameter element[Element] je: ", element);
    return null;
  }

  //vrátime rodičovský element
  return element.parentElement;
};

/**
 * Funkcia nastavý alebo pridá obsah elementu
 *
 * @param element
 * @param text
 * @param append = false
 * @returns {*}
 */
_gCore.G.text = function (element, text) {
  var append = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  //ak prvý argument nieje element
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("prvý argument musí byť objekt a je: ", element);
    return null;
  }

  //ak druhý argument nieje string tak vrátime text
  if (!_gCore.G.isString(text)) {
    return element.textContent;
  }

  //pridá k elementu text
  if (append === true) {
    element.textContent += text;
  }
  //nahradí text elementu;
  else {
      element.textContent = text;
    }

  //vrátime element
  return element;
};

/**
 * Funkcia nastavý alebo pridá html obsah elementu
 *
 * @param element
 * @param html
 * @param append
 * @returns {*}
 */
_gCore.G.html = function (element, html) {
  var append = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  //testovane 29.1.2017
  //ak prvý argument nieje element
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.html: prvý parameter element[Element] je: ", element);
    return null;
  }

  //ak druhý argument nieje string
  if (!_gCore.G.isString(html)) {
    return element.innerHTML();
  }

  //pridám html
  if (append === true) {
    element.innerHTML += html;
  }
  //nahradím html
  else {
      element.innerHTML = html;
    }

  //vrátim element
  return element;
};

/**
 * Funkcia vráti pole deti elementu na vstupe
 *
 * @param element - element ktorého deti sa majú vrátiť
 * @param condition = "" - podmienka pre deti ktoré sa majú vrátiť
 * @returns {Element[]} - pole elementov detí elebo prázdne pole ak element nemá žiadne deti
 */
_gCore.G.childrens = function (element) {
  var condition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "*";

  //ak nieje podmienka vyhladavanie nieje string alebo je prázdny string tak ho nastavíme na predvolený
  if (!_gCore.G.isString(condition) || _gCore.G.isEmpty(condition)) {
    condition = "*";
  }
  var result = [];
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.childrens: prvý paramter element[element] je: ", element);
    return result;
  }

  var data = element.children;
  _gCore.G.each(data, function (element) {
    if (result.indexOf(element) < 0) {
      //ak sa nenachádze medzi výsledkami
      if (_gCore.G.matches(element, condition)) {
        result[result.length] = element;
      }
    }
  });
  return result;
};

/**
 * Funkcia vymaže element na vstupe
 *
 * @param element - element ktorý sa má vymazať
 */
_gCore.G.delete = function (element) {
  //testovane 21.2.2017
  //pokúsime sa získať rodičovy element;
  var parent = _gCore.G.parent(element);

  //ak získaný rodič nieje element
  if (!_gCore.G.isElement(parent)) {
    _gCore.G.warn("G.delete: nepodarilo sa získať rodiča elementu ", element);
    return;
  }
  //zmažeme element
  parent.removeChild(element);
};

_gCore.G.class = function (element, name, force) {
  var _this = this;

  if (_gCore.G.isArray(name)) {
    _gCore.G.each(name, function (e) {
      return _this.class(e);
    });
  } else if (_gCore.G.isString(name)) {
    switch (name[0]) {
      case "+":
        element.classList.add(name.substring(1));
        break;
      case "-":
        element.classList.remove(name.substring(1));
        break;
      case "/":
        name = name.substring(1);
        if (_gCore.G.isBool(force)) {
          element.classList.toggle(name, force);
        } else {
          element.classList.toggle(name);
        }
        break;
      default:
        return element.classList.contains(name);
    }
  }
};

_gCore.G.css = function (element) {
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.css: prvý parameter element[Element] je:", element);
    return;
  }

  //ak je 0 argumentov vráti objekt z CSS štýlmi

  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (args.length === 0) {
    var _ret = function () {
      var result = {};
      var css = window.getComputedStyle(element);
      _gCore.G.each(css, function (e) {
        if (css.getPropertyValue(e) !== "") {
          result[e] = css.getPropertyValue(e);
        }
      });
      return {
        v: result
      };
    }();

    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
  }

  //ak je prvý argument string
  if (_gCore.G.isString(args[0])) {
    //a druhý argument je zadaný a dá sa prepísať na string nastav štýl
    if (args.length === 2 && _gCore.G.isString(args[1])) {
      element.style[args[0]] = args[1];
    }
    //ak prvý argument neobsahuje symbol pre vymazanie tak vráť hodnotu štýlu
    else if (args[0][0] !== "-") {
        return element.style[args[0]];
      }
      //ináč štýl odstráň
      else {
          element.style[args[0].substring(1)] = "";
        }
  }
  //ak je prvý argument objekt nastav všetky štýli podla objektu
  else if (_gCore.G.isObject(args[0])) {
      _gCore.G.each(args[0], function (e, i) {
        if (_gCore.G.isString(i) && _gCore.G.isString(e)) {
          element.style[i] = e;
        }
      });
    }
};

_gCore.G.attr = function (element) {
  for (var _len3 = arguments.length, arg = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    arg[_key3 - 1] = arguments[_key3];
  }

  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.attr: prvý parameter element[Element] je:", element);
    return;
  }

  //ak je 0 argumentov vráti objekt z atribútmi
  if (arg.length === 0) {
    var _ret2 = function () {
      var result = {};
      //prejde všetky atribúty elementu a pridá ich do výsledku
      _gCore.G.each(element.attributes, function (e) {
        result[e.nodeName] = e.nodeValue;
      });
      return {
        v: result
      };
    }();

    if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
  }

  //ak je prvý argument string
  if (_gCore.G.isString(arg[0])) {
    //a druhý argument je zadaný a dá sa prepísať na string nastav štýl
    if (arg.length === 2 && _gCore.G.isString(arg[1])) {
      element.setAttribute(arg[0], arg[1]);
    }
    //ak prvý argument obsahuje symbol pre vymazanie tak vymaž atribút
    else if (arg[0][0] === "-") {
        element.removeAttribute(arg[0].substring(1));
      }
      //ináč vrá atribút
      else {
          return element.getAttribute(arg[0]);
        }
  }
  //ak je prvý argument objekt nastav všetky štýli podla objektu
  else if (_gCore.G.isObject(arg[0])) {
      _gCore.G.each(arg[0], function (e, i) {
        if (_gCore.G.isString(i) && _gCore.G.isString(e)) {
          element.setAttribute(i, e);
        }
      });
    } else {
      _gCore.G.warn("G.attr: druhý parameter arg[0][String|Object] je: ", arguments[0]);
    }
};

/**
 * Funkcia vráti relatívnu pozícii elementu vzhladom k lavému hornému okraju stránky
 *
 * @param element
 * @returns {*}
 */
_gCore.G.position = function (element) {
  //testovane 29.1.2017
  var top = 0,
      left = 0;
  if (_gCore.G.isElement(element)) {
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
  } else {
    _gCore.G.warn("argument musí byť element");
  }

  return {
    y: top,
    x: left
  };
};

/**
 * Funkcia vráti počet pixelov od lavého okraja stránky
 * 
 * @param element
 * @returns {number}
 */
_gCore.G.left = function (element) {
  //testovane 29.1.2017
  return _gCore.G.position(element).left;
};

/**
 * Funckia vráti počet pixelov od horného okraja stránky
 *
 * @param element
 * @returns {number}
 */
_gCore.G.top = function (element) {
  //testovane 29.1.2017
  return _gCore.G.position(element).top;
};

/**
 * Funckia vráti velkosť elementu
 *
 * @param element
 * @returns {*}
 */
_gCore.G.size = function (element) {
  //testovane 29.1.2017
  if (!_gCore.G.isElement(element)) {
    _gCore.G.warn("G.size: prvý parameter element[Element] je: ", element);
    return { width: 0, height: 0 };
  }
  return {
    width: element.offsetWidth,
    height: element.offsetHeight
  };
};

/**
 * Funkcia vráti šírku elementu
 *
 * @param element
 * @returns {number}
 */
_gCore.G.width = function (element) {
  //testovane 26.1.2017
  return _gCore.G.size(element).width;
};

/**
 * Funkcia vráti výšku elementu
 *
 * @param element
 * @returns {number}
 */
_gCore.G.height = function (element) {
  //testovane 26.1.2017
  return _gCore.G.size(element).height;
};

exports.G = _gCore.G;
