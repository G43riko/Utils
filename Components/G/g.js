/*
 G(selector) - vyhladá elementy podla selectora a vráti G object
 G(nazov, {attr:{}, "obsah elementu", style:{}}) - vytvorý nový G object
 G(nazov, {attr:{}, element, style:{}}) - vytvorý nový G object
 */
G = function(... args){//TODO otestovať
	if(args.length === 1){
		this.size = 0;
		this.elements = G.find(args[0]);
	}
	else if(args.length === 2 && G.isString(args[0]) && G.isObject(args[1])){
		G.createElement(args[0], args[1].attr, args[1].cont, args[1].style)
	}
}
G.createElement(name, attr, cont, style){
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
	else if(Array.isArray(cont)){
		for(var i in cont)
			if(cont.hasOwnProperty(i) && typeof G.isObject(cont[i]))
				el.appendChild(cont[i]);
	}	
	else if(G.isObject(cont))
		el.appendChild(cont);

	return el;
}
G.isElement = (obj) => {
	try {
		return obj instanceof HTMLElement;
	}
	catch(e){
		return typeof obj === "object" && obj.nodeType === 1 && typeof obj.style === "object" && typeof obj.ownerDocument === "object";
	}
}
G.isString = (val) => typeof val === "string";
G.isObject = (val) => typeof val === "object";
G.isNumber = (val) => typeof val === "number";
G.isBool = (val) => typeof val === "boolean";
G.isToStringable = (val) => typeof val === "number" || typeof val === "string" || typeof val === "boolean";
G.isGElement = (val) => typeof val["isGElement"] === "boolean" && val["isGElement"];

G.prototype.first = function(func, ... args){//TODO otestovať
	if(this.isEmpty())
		return this;//asi má vrátiť null

	return func.apply(this.elements[0], args);
}

G.prototype.size = function(){
	return this.size;
}

G.prototype.isEmpty = function(){
	return this.size() === 0;
}

G.prototype.each = function(func, ... args){//TODO otestovať
	for(var i in this.elements)
		func.apply(this.elements[i], args);

	return this;
}

G.find = function(args, parent = document){//TODO otestovať
	if(typeof args === "string")
		return parent.querySelectorAll(args);
	else if(G.isElement(args))
		return [args];
}


/*
 css() - vráti všetky nastavené CSS štýly;
 css("nazov") - vráti hodnotu CSS štýlu;
 css("-nazov") - vymaža daný CSS štýl;
 css("nazov", "hodnota") - nastavý danému CSS štýlu hodnotu;
 css({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým CSS štýlom hodnoty;
 */
G.prototype.css = function(){//TODO otestovať
	//ak je 0 argumentov vráti objekt z CSS štýlmi
	if(arguments.length == 0){
		var result = {};
		var css = window.getComputedStyle(this);
		for(var i in css)
			if(css.getPropertyValue(css[i]) !== "")
				result[css[i]] = css.getPropertyValue(css[i]);
		return result;
	}
	
	//ak je prvý argument CSS string
	if(G.isString(arguments[0])){
		//a druhý argument je zadaný a dá sa prepísať na string nastav štýl
		if(arguments.length == 2 && G.isToStringable(arguments[1])){
			this.style[arguments[0]] = arguments[1];
		}
		//ak prvý argument neobsahuje symbol pre vymazanie tak vráť hodnotu štýlu
		else if(arguments[0][0] !== "-"){
			return this.style[arguments[0]];
		}
		//ináč štýl odstráň
		else{
			this.style[arguments[0].substring(1)] = "";
		}
	}
	//ak je prvý argument objekt nastav všetky štýli podla objektu
	else if(G.isObject(arguments[0]))
		for(var i in arguments[0])
			if(arguments[0].hasOwnProperty(i) && G.isString(i) && G.isToStringable(arguments[0][i]))
				this.style[i] = arguments[0][i];
	return this;
}