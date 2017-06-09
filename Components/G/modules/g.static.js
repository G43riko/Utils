import {G} from "g.core.js";

/**
 * Funkcia spustí AJAXové volanie na danu url a po uspešnej odpovedi zavolá callback funkciu
 *
 * @param url
 * @param options
 * @param dataType
 * @returns {*}
 */
G.ajax = function(url, options, dataType){
    let start = 0;
	/*
	if(!window.XMLHttpRequest){
		G.warn("Lutujeme ale váš prehliadaš nepodporuje AJAX");
		return false;
	}
	*/
    let http = window.XMLHttpRequest ?  new XMLHttpRequest() :  new ActiveXObject("Microsoft.XMLHTTP");

	if(G.isFunction(options)){
		options = {success: options};
		if(G.isString(dataType)){
			options.dataType = dataType;
		}
	}
	else if(!G.isObject(options)){
		options = {};
	}

	if(!G.isString(url)){
		G.warn("url nieje string a je: ", url);
		return false;
	}

	options.method = options.method || "GET";
	options.async  = options.async || true;

	if(G.isFunction(options.abort)){
		http.onabort = options.abort;
	}
	if(G.isFunction(options.error)){
		http.onerror = options.error;
	}
	if(G.isFunction(options.progress)){
		http.onprogress = options.progress;
	}
	if(G.isFunction(options.timeout)){
		http.ontimeout = options.timeout;
	}
	if(G.isFunction(options.loadEnd)){
		http.onloadend = () => options.loadEnd((G.now() - start));
	}
	if(G.isFunction(options.loadStart)){
		http.onloadstart = () => {
			options.loadStart();
			start = G.now();
		};
	}

	if(G.isFunction(options.success)){
		http.onreadystatechange = () => {
			if (http.readyState === 4 && http.status === 200){
				switch(options.dataType){
					case "json" :
						options.success(JSON.parse(http.responseText));
						break;
					case "html" :
						options.success(new DOMParser().parseFromString(http.responseText, "text/xml"));
						break;
					case "xml" :
						options.success(new DOMParser().parseFromString(http.responseText, "text/xml"));
						break;
					default :
						options.success(http.responseText);
				}
			}
		};
	}
	else{
		G.warn("nieje zadaná Succes funkcia");
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
G.loadScript = function(url, callback){
    let script = document.createElement("script")
    script.type = "text/javascript";

    if(script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    }
    else{  //Others
        script.onload = function(){
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
G.hasClass = function(element, className){
	//ak nieje zadaný element kotrý sa má overovať
	if(!G.isElement(element)){
		G.warn("G.hasClass: prvý argument element[Element] je: ", element);
		return false;
	}

	//ak nieje zadaný trieda ktorá sa má overovať
	if(!G.isString(className)){
		G.warn("G.hasClass: druhý argument className[String] je: ", className);
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
G.createElement = function(name, attr, cont, style){
    let el;

	//ak je prvý parameter objekt tak zavoláme rekurzívne túto funkciu s hodnotami objektu
	if(G.isObject(name)){
		//ak objekt s udajmy o novom element neobsahuje názov elementu
		if(!G.isString(name.name)){
			G.warn("G.createElement: prví parameter musí byť typu [Object] ktorý obsahuje name[String] a je: ", name);
			return null;
		}

		return G.createElement(name.name, name.attr || {}, name.cont || "", name.style || {});
	}

	//ak nieje zadané meno elementu
	if(!G.isString(name)){
		G.warn("G.createElement: prvý parameter name[String] je: ", name);
		return null;
		
	}

	el = document.createElement(name);

	//Ak sú atributy objekt tak priradíme elementu všetky atribúty
	if(G.isObject(attr)){
		G.each(attr, (e, i) => el.setAttribute(i, e));
	}

	//Ak sú štýly objekt tak priradíme elementu všetky štýly
	if(G.isObject(style)){
		G.each(style, (e, i) => el.style[i] = e);
	}

	//Priradíme elementu obsah
	if(G.isString(cont)){
		G.html(el, cont);
	}
	else if(G.isArray(cont)){
		G.each(cont, e => {
			if(G.isElement(e)){
				el.appendChild(e);
			}
		});
	}
	else if(G.isElement(cont)){
		el.appendChild(cont);
	}
	else if(G.isG(cont)){
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
G.last = function(arr){
	//ak pole ktorému hladáme koniec nieje pole tak vrátime null
	if(!G.isArray(arr)){
		return null;
	}


	//ak je pole prázdne vrátime null
	if(G.isEmpty(arr)){
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
G.isIn = function(obj, data){//testovane 8.1.2017
	if(G.isArray(data)){
		if(data.indexOf(obj) >= 0){
			return true;
		}
	}
	else{
		for(let i=1 ; i<arguments.length ; i++){
			if(arguments[i] === obj){
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
G.extend = function(target, ... args){
	//ak objekt do ktorého sa ide mergovať nieje objekt tak skončíme
	if(!G.isObject(target)){
		G.warn("G.extend: prvý parameter target[Object] je: ", target);
		return target;
 	}

	G.each(args, (e, i) => {//TODO ak je to objekt musí sa toto pravdepodobne volať rekurzivne
		//ak argument nieje objekt
		if(G.isObject(e)){
			G.each(e, (ee, key) => target[key] = ee);
		}
		else{
			G.warn("G.extend:  argument args[" + i + "][Object] je : ", e);
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
G.matches = function(element, queryString){
	//porovnám či element vyhovuje selectoru
	try{
		return element.matches(queryString);
	}
	catch(err){
		G.warn("G.matches: ", err);
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
G.each = function(obj, func, thisArg){
    let i;
    if(!G.isObject(obj)){
		G.warn("G.each: prvý parameter obj[Object] je:", obj);
		return false;
    }
    if(!G.isFunction(func)){
		G.warn("G.each: druhý parameter func[Function] je:", func);
		return false;
    }


	if(G.isArray(obj)){
		if(G.isObject(thisArg)){
			for(i = 0 ; i<obj.length ; i++){
				if(func.call(thisArg, obj[i], i, obj) === false){
					break;
				}
			}
		}
		else{
			for(i = 0 ; i<obj.length ; i++){
				if(func(obj[i], i, obj) === false){
					break;
				}
			}
		}
	}
	else{
		if(G.isObject(thisArg)){
			for(i in obj){
				if(obj.hasOwnProperty(i)){
					if(func.call(thisArg, obj[i], i, obj) === false){
						break;
					}
				}
			}
		}
		else{
			for(i in obj){
				if(obj.hasOwnProperty(i)){
					if(func(obj[i], i, obj) === false){
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
G.find = function(queryString, parent){//testovane 28.1.2017
    let result = [];

	//ak queryString nieje String
	if(!G.isString(queryString)){
        G.warn("G.find: prvý parameter queryString[String] je ", queryString);
        return result;
	}

    //ak nieje zadaný parent alebo parent nieje element tak sa parent nastavný na document
	if(!G.isElement(parent)){
        //G.warn("G.find: druhý parameter parent[Element] je ", parent);
		parent = document;
	}


	//získame elementy do notlive collection
    const data = parent.querySelectorAll(queryString);

    //prejdeme všetký elementy a pridáme ich do výsledného pola
    G.each(data, e => result[result.length] = e);

    //vrátime výsledné pole
    return result;
};

/**
 * Funkcia vráti rodičovský element elementu na vstupe alebo null
 *
 * @param element - element ktorému sa hladá rodičovský element
 * @returns {Element} - rodičovský element alebo null ak sa nenašiel rodič
 */
G.parent = function(element){//testovane 28.1.2017
	//ak argument nieje element;
	if(!G.isElement(element)){
        G.warn("G.parent: prvý parameter element[Element] je: ", element);
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
G.text = function(element, text, append = false){
	//ak prvý argument nieje element
	if(!G.isElement(element)) {
        G.warn("prvý argument musí byť objekt a je: ", element);
        return null;
    }

	//ak druhý argument nieje string tak vrátime text
	if(!G.isString(text)){
        return element.textContent;
    }

	//pridá k elementu text
	if(append === true){
		element.textContent += text;
	}
	//nahradí text elementu;
	else{
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
G.html = function(element, html, append = false){//testovane 29.1.2017
	//ak prvý argument nieje element
	if(!G.isElement(element)) {
        G.warn("G.html: prvý parameter element[Element] je: ", element);
        return null;
    }

    //ak druhý argument nieje string
    if(!G.isString(html)) {
        return element.innerHTML();
    }

    //pridám html
    if(append === true){
        element.innerHTML += html;
    }
    //nahradím html
    else{
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
G.childrens = function(element, condition = "*"){
	//ak nieje podmienka vyhladavanie nieje string alebo je prázdny string tak ho nastavíme na predvolený
	if(!G.isString(condition) || G.isEmpty(condition)){
		condition = "*";
	}
	let result = [];
	if(!G.isElement(element)){
		G.warn("G.childrens: prvý paramter element[element] je: ", element);
		return result;
	}

    const data = element.children;
	G.each(data, element => {
		if(result.indexOf(element) < 0){//ak sa nenachádze medzi výsledkami
			if(G.matches(element, condition)){
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
G.delete = function(element){//testovane 21.2.2017
	//pokúsime sa získať rodičovy element;
	const parent = G.parent(element);

	//ak získaný rodič nieje element
	if(!G.isElement(parent)){
		G.warn("G.delete: nepodarilo sa získať rodiča elementu ", element);
		return;
	}
	//zmažeme element
	parent.removeChild(element);
};

G.class = function(element, name, force){
    if(G.isArray(name)){
        G.each(name, (e) => this.class(e));
    }
    else if(G.isString(name)){
        switch(name[0]){
            case "+":
                element.classList.add(name.substring(1));
                break;
            case "-":
                element.classList.remove(name.substring(1));
                break;
            case "/":
                name = name.substring(1);
                if(G.isBool(force)){
                    element.classList.toggle(name, force);
                }
                else{
                    element.classList.toggle(name);
                }
                break;
            default:
                return element.classList.contains(name);
        }
    }
};


G.css = function(element, ...args){
    if(!G.isElement(element)){
        G.warn("G.css: prvý parameter element[Element] je:", element);
        return;
    }

    //ak je 0 argumentov vráti objekt z CSS štýlmi
    if(args.length === 0){
        let result = {};
        let css = window.getComputedStyle(element);
        G.each(css, e => {
            if(css.getPropertyValue(e) !== ""){
                result[e] = css.getPropertyValue(e);
            }
        });
        return result;
    }

    //ak je prvý argument string
    if(G.isString(args[0])){
        //a druhý argument je zadaný a dá sa prepísať na string nastav štýl
        if(args.length === 2 && G.isString(args[1])){
            element.style[args[0]] = args[1];
        }
        //ak prvý argument neobsahuje symbol pre vymazanie tak vráť hodnotu štýlu
        else if(args[0][0] !== "-"){
            return element.style[args[0]];
        }
        //ináč štýl odstráň
        else{
            element.style[args[0].substring(1)] = "";
        }
    }
    //ak je prvý argument objekt nastav všetky štýli podla objektu
    else if(G.isObject(args[0])){
        G.each(args[0], (e, i) => {
            if(G.isString(i) && G.isString(e)){
                element.style[i] = e;
            }
        });
    }
};


G.attr = function(element, ...arg){
	if(!G.isElement(element)){
		G.warn("G.attr: prvý parameter element[Element] je:", element);
		return;
	}

    //ak je 0 argumentov vráti objekt z atribútmi
    if(arg.length === 0){
        let result = {};
        //prejde všetky atribúty elementu a pridá ich do výsledku
        G.each(element.attributes, e => {
            result[e.nodeName] = e.nodeValue;
        });
        return result;
    }

    //ak je prvý argument string
    if(G.isString(arg[0])){
        //a druhý argument je zadaný a dá sa prepísať na string nastav štýl
        if(arg.length === 2 && G.isString(arg[1])){
            element.setAttribute(arg[0], arg[1]);
        }
        //ak prvý argument obsahuje symbol pre vymazanie tak vymaž atribút
        else if(arg[0][0] === "-"){
            element.removeAttribute(arg[0].substring(1));
        }
        //ináč vrá atribút
        else{
            return element.getAttribute(arg[0]);
        }
    }
    //ak je prvý argument objekt nastav všetky štýli podla objektu
    else if(G.isObject(arg[0])){
        G.each(arg[0], (e, i) => {
            if(G.isString(i) && G.isString(e)){
                element.setAttribute(i, e);
            }
        });
    }
    else{
        G.warn("G.attr: druhý parameter arg[0][String|Object] je: ", arguments[0]);
    }
};


/**
 * Funkcia vráti relatívnu pozícii elementu vzhladom k lavému hornému okraju stránky
 *
 * @param element
 * @returns {*}
 */
G.position = function(element){//testovane 29.1.2017
    let top  = 0,
		left = 0;
	if(G.isElement(element)){
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);
	}
	else{
        G.warn("argument musí byť element");
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
G.left = function(element){//testovane 29.1.2017
	return G.position(element).left;
};

/**
 * Funckia vráti počet pixelov od horného okraja stránky
 *
 * @param element
 * @returns {number}
 */
G.top = function(element){//testovane 29.1.2017
    return G.position(element).top;
};

/**
 * Funckia vráti velkosť elementu
 *
 * @param element
 * @returns {*}
 */
G.size = function(element){//testovane 29.1.2017
	if(!G.isElement(element)){
		G.warn("G.size: prvý parameter element[Element] je: ", element);
		return {width: 0, height: 0};
	}
	return {
		width  : element.offsetWidth,
		height : element.offsetHeight
	};
};

/**
 * Funkcia vráti šírku elementu
 *
 * @param element
 * @returns {number}
 */
G.width = function(element){//testovane 26.1.2017
	return G.size(element).width;
};

/**
 * Funkcia vráti výšku elementu
 *
 * @param element
 * @returns {number}
 */
G.height = function(element){//testovane 26.1.2017
    return G.size(element).height;
};


export {G};