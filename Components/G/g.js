/*
 * G(selector) - vyhladá elementy podla selectora a vráti G object
 * G(nazov, {attr:{}, "obsah elementu", style:{}}) - vytvorý nový G object
 * G(nazov, {attr:{}, element, style:{}}) - vytvorý nový G object
 */
G = function(... args){//TODO otestovať
	if(args.length === 0)
		this.elements = [];
	else if(args.length === 1){
		if(G.isString(args[0]))
			this.elements = G.find(args[0]);
		else if(G.isArray(args[0]))
			this.elements = args[0];
		else if(G.isElement(args[0]))
			this.elements = [args[0]];
		else if(G.isObject(args[0]) && G.isArray(args[0].elements))
			this.elements = args[0].elements;
	}
	else if(args.length === 2 && G.isString(args[0]) && G.isObject(args[1])){
		this.elements = [G.createElement(args[0], args[1].attr, args[1].cont, args[1].style)]
	}
	this.size = this.elements.length;
}

/*************************************************************************************
                      UTILITOVE FUNKCIE
*************************************************************************************/

/**
 * G.createElement("div") => <div></div>;
 * G.createElement("div", {id: "ide"}) => <div id="ide"></div>;
 * G.createElement("div", {}, "text") => <div>text</div>;
 * G.createElement("div", {}, "<b>text</b>") => <div><b>text</b></div>;
 * G.createElement("div", {}, "text", {color: "blue"}) => <div style="color: blue;">text</div>
 */
G.createElement = function(name, attr, cont, style){
	if(G.isObject(name)){
		if(Modal._isDefined(name.name, name.attr, name.cont, name.style))
			return G.createElement(name.name, name.attr, name.cont, name.style);
		else
			return console.error("zle zadane parametre");
	}
	if(G.isString(name))
		var el = document.createElement(name);
	else
		return console.error("prvý parameter(nazov elementu) musí byť string");

	if(G.isObject(attr))
		for(var i in attr)
			el.setAttribute(i, attr[i]);

	if(G.isObject(style))
		for(var i in style)
			el.style[i] = style[i];

	if(G.isString(cont)) 
		el.innerHTML = cont 
	else if(G.isArray(cont)){
		for(var i in cont)
			if(cont.hasOwnProperty(i) && G.isObject(cont[i]))
				el.appendChild(cont[i]);
	}	
	else if(G.isObject(cont))
		el.appendChild(cont);

	return el;
}

G.isDefined = (val) => typeof val !== "undefined";
G.isString = (val) => typeof val === "string";
G.isObject = (val) => typeof val === "object";
G.isNumber = (val) => typeof val === "number";
G.isBool = (val) => typeof val === "boolean";
G.isArray = (val) => Array.isArray(val);
G.isToStringable = (val) => G.isNumber(val) || G.isString(val) || G.isBool(val);
G.isGElement = (val) => val["isGElement"] === true;
G.isElement = (obj) => {
	try {return obj instanceof HTMLElement;}
	catch(e){return G.isObject(obj) && obj.nodeType === 1 && G.isObject(obj.style) && G.isObject(obj.ownerDocument);}
}

/**
 * Funkcia zlúči objekty na vstupe do jedného (prvého) objektu
 * 
 * G.extend({a: "aa", b: "bb"}, {c: "cc", a: "aaa"}, {c: "ccc"}) => Object {a: "aaa", b: "bb", c: "ccc"}
 */
G.extend = function(){
	if(G.isObject(arguments[0]))
	for(var i=1; i<arguments.length; i++)
		if(G.isObject(arguments[i]))
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
	return arguments[0];
}

/**
 * Funkcia preloopuje pole alebo objekt daný ako argument a zavolá funkciu a umožnuje nastaviť lubovolný this objekt
 */
G.each = function(obj, func, thisArg){
	var i = 0;
	if(G.isArray(obj)){
		if(G.isDefined(thisArg))
			for(; i<obj.length ; i++)
				func.call(thisArg, obj[i], i, obj);
		else
			for(; i<obj.length ; i++)
				func(obj[i], i, obj);
	}
	else{
		if(G.isDefined(thisArg)){
			for(i in obj)
				if(obj.hasOwnProperty(i))
					func.call(thisArg, obj[i], i, obj);
		}
		else
			for(i in obj)
				if(obj.hasOwnProperty(i))
					func(obj[i], i, obj);
	}
}


/**
 * Funkcia najde v rodičovnskom objekde objekty ktoré najde CSS selector
 */
G.find = function(args, parent = document){//TODO otestovať
	var result = [];
	if(G.isString(args)){
		var datas = parent.querySelectorAll(args);
		for(var i in datas)
			if(datas.hasOwnProperty(i))
				result.push(datas[i]);
	}
	else if(G.isElement(args))
		result.push(args);
	return result;
}

/**
 * Funkcia vráti rodičovský element elementu na vstupe
 */
G.parent = function(element){
	return G.isElement(element) ? element.parentElement : null;
}

G.children = function(element){//TODO prerobiť
	var result = [];
	if(G.isElement(element)){
		var datas = element.children;
		for(var i in datas)
			if(datas.hasOwnProperty(i))
				result.push(datas[i]);
	}
	return result;
}

/**
 * Funkcia vymaže element na vstupe
 */
G.delete = function(element){
	if(G.isElement(element))
		element.parentElement.removeChild(element);
}

/*************************************************************************************
                      PROTOTYPOVO-UTILITOVE FUNKCIE
*************************************************************************************/

G.prototype.add = function(...args){
	for(var i in args)
		if(args.hasOwnProperty(i)){
			if(G.isElement(args[i]))
				this.element.push(args[i]);
			else if(G.isString(args[i]))
				this.elements.push.apply(this, G.find(args[i]));
		}
}

G.prototype.empty = function(){
	return this.html("");;
}

G.prototype.hasClass = function(className){
	return this.class(className);
}

G.prototype.val = function(){
	return this.attr("value", arguments[0]);
}

G.prototype.addClass = function(className){
	return this.class("+" + className);
}

G.prototype.removeClass = function(className){
	return this.class("-" + className);
}

G.prototype.toggleClass = function(className){
	return this.class("/" + className);
}

/*************************************************************************************
                      TRAVERSINGOVE FUNKCIE
*************************************************************************************/


/**
 * Funkcia vráti G objekt obsahujuci rodiča daného elementu
 */
G.prototype.parent = function(){
	return new G(G.parent(this.first()));
}

G.prototype.children = function(){//TODO otestovať - pridať možnosť filtrovať deti
	return new G(G.children(this.first()));
}

//TODO childrens
//TODO next
//TODO prev

G.prototype.each = function(func, ... args){//TODO otestovať
	for(var i in this.elements)
		func.apply(this.elements[i], args);

	return this;
}

/*************************************************************************************
                      NEZARADENE FUNKCIE
*************************************************************************************/

G.prototype.first = function(){
	return this.elements[0];
}

G.prototype.length = function(){//TODO prerobiť na size
	return this.elements.length;
}

G.prototype.isEmpty = function(){
	return this.length() === 0;
}

/*************************************************************************************
                      HTML/CSS FUNKCIE
*************************************************************************************/


G.prototype.prependTo = function(data){//TODO otestovať
	if(this.isEmpty())
		return this;

	if(G.isElement(data))
		data.parentElement.insertBefore(this.first(), data.parentElement.firstElementChild);
	return this;
}

G.prototype.appendTo = function(data){//TODO otestovať
	if(this.isEmpty())
		return this;

	if(G.isElement(data))
		data.appendChild(this.first());

	return this;
}

G.prototype.prepend = function(data){//TODO otestovať
	if(this.isEmpty())
		return this;

	if(G.isElement(data))
		this.first().insertBefore(data, this.first().firstElementChild);
	else if(typeof data === "string")
		this.html(data + this.html());
	return this;
}

G.prototype.append = function(data){//TODO otestovať
	if(this.isEmpty())
		return this;

	if(G.isElement(data))
		this.first().appendChild(data);
	else if(typeof data === "string")
		this.first().innerHTML += data;

	return this;
}

/**
 * text() - vráti obsah ako text
 * text("juhuuu") - text elementu bude "juchuuu"
 * text("<b>bold</>") - text elementu bude "bold"
 */
G.prototype.text = function(){//TODO otestovať
			if(this.isEmpty())
				return this;

			if(arguments.length == 0)
				return this.textContent;

			this.html(arguments[0].replace(/<[^>]*>/g, ""));
			return this;
		}

/*
 * html() - vráti HTML obsah elementu
 * html("<b>bold</b>") - nastavý HTML obsah elementu
 * html("Element") - nastavý ako jedine dieťa nový element
 */
G.prototype.html = function(){
	if(this.isEmpty())
		return this;

	if(arguments.length == 0)
		return this.first().innerHTML;
	if(G.isString(arguments[0])){
		if(arguments[0][0] === "+")
			this.append(arguments[0].substring(1));
		else
			this.first().innerHTML = arguments[0];
	}
	else if(G.isElement(arguments[0])){//TODO otestovať
		this.first().innerHTML = "";
		this.append(arguments[0]);
	}
	//TODO ak je G tak pridá všetky elementy čo obsahuje argument G
	return this;
}

/**
 * Funkcia vymaže prvý element v zozname a vráti G object
 */
G.prototype.delete = function(){//TODO otestovať - pridať možnosť filtrovať vymazane
	if(this.isEmpty())
		return this;

	G.delete(this.first());
	if(G.isArray(this.elements))
		this.elements.splice(0, 1);
	else if(G.isObject(this.elements))
		delete this.first();

	return this;
}

/**
 * class("nazov") - vrati true ak ma objekt danú triedu ináč vrát false
 * class("+nazov") - pridá objektu danú triedu
 * class("-nazov") - odstráni objektu danú triedu
 * class("/nazov") - pridá objektu danú triedu ak neexistuje ináč ju odstráni
 */
G.prototype.class = function(name){//TODO prerobiť - nemôže vracať this ak ma vratit T/F
	if(this.isEmpty())
		return this;
	var clases = this.first().classList;
	if(G.isArray(name))
		G.each(name, (e) => this.class(e));
	else if(G.isString(name)){
		switch(name[0]){
			case "+":
				clases.add(name.substring(1));
				break;
			case "-":
				clases.remove(name.substring(1));
				break;
			case "/":
				name = name.substring(1)
				this.attr("class").indexOf(name) > -1 ? clases.remove(name) : clases.add(name);
				break;
			default:
				return this.attr("class").indexOf(name) > -1;
		}
	}
	return this;
}

/**
 * css() - vráti všetky nastavené CSS štýly;
 * css("nazov") - vráti hodnotu CSS štýlu;
 * css("-nazov") - vymaža daný CSS štýl;
 * css("nazov", "hodnota") - nastavý danému CSS štýlu hodnotu;
 * css({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým CSS štýlom hodnoty;
 */
G.prototype.css = function(...args){
	if(this.isEmpty())
		return this;
	//ak je 0 argumentov vráti objekt z CSS štýlmi
	if(args.length == 0){
		var result = {};
		var css = window.getComputedStyle(this.first());
		for(var i in css)
			if(css.getPropertyValue(css[i]) !== "")
				result[css[i]] = css.getPropertyValue(css[i]);
		return result;
	}
	
	//ak je prvý argument string
	if(G.isString(args[0])){
		//a druhý argument je zadaný a dá sa prepísať na string nastav štýl
		if(args.length == 2 && G.isToStringable(args[1])){
			this.first().style[args[0]] = args[1];
		}
		//ak prvý argument neobsahuje symbol pre vymazanie tak vráť hodnotu štýlu
		else if(args[0][0] !== "-"){
			return this.first().style[args[0]];
		}
		//ináč štýl odstráň
		else{
			this.first().style[args[0].substring(1)] = "";
		}
	}
	//ak je prvý argument objekt nastav všetky štýli podla objektu
	else if(G.isObject(args[0]))
		for(var i in args[0])
			if(args[0].hasOwnProperty(i) && G.isString(i) && G.isToStringable(args[0][i]))
				this.first().style[i] = args[0][i];
	return this;
}

/**
 * attr() - vráti všetky atribúty;
 * attr("nazov") - vráti hodnotu atribútu;
 * attr("-nazov") - vymaža daný atribút;
 * attr("nazov", "hodnota") - nastavý danému atribútu hodnotu;
 * attr({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým atribútom hodnoty;
 */
G.prototype.attr = function(...args){
	if(this.isEmpty())
		return this;
	//ak je 0 argumentov vráti objekt z atribútmi
	if(args.length == 0){
		var result = {};
		for(var i=0, tmp=[] ; i<this.first().attributes.length ; i++)
				result[this.first().attributes[i].nodeName] = this.first().attributes[i].nodeValue;
		return result;
	}
	
	//ak je prvý argument string
	if(G.isString(args[0])){
		//a druhý argument je zadaný a dá sa prepísať na string nastav štýl
		if(args.length == 2 && G.isToStringable(args[1])){
			this.first().setAttribute(args[0], args[1]);
		}
		//ak prvý argument neobsahuje symbol pre vymazanie tak vráť hodnotu štýlu
		else if(args[0][0] !== "-"){
			return this.first().getAttribute(args[0]);
		}
		//ináč štýl odstráň
		else{
			this.first().removeAttribute(args[0].substring(1));
		}
	}
	//ak je prvý argument objekt nastav všetky štýli podla objektu
	else if(G.isObject(args[0]))
		for(var i in args[0])
			if(args[0].hasOwnProperty(i) && G.isString(i) && G.isToStringable(args[0][i]))
				this.first().setAttribute(i, args[0][i]);
	return this;
}