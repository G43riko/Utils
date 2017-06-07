/**
 * Konštruktor G objektu
 *
 * G(selector) - vyhladá elementy podla selectora a vráti G object
 * G(nazov, {attr:{}, "obsah elementu", style:{}}) - vytvorý nový G object
 * G(nazov, {attr:{}, element, style:{}}) - vytvorý nový G object
 *
 * @returns {G}
 * @constructor
 */
let G = function(...args){
	//ak sa nevolá ako konštruktor
	if(!(this instanceof G)){
		const inst = Object.create(G.prototype);
		G.apply(inst, args);
		return inst;
	}
	//ak nieje žiadny argument tak vytoríme prazdne pole objektov a skončíme
	if(args.length === 0){
		this.elements = [];
		return;
	}

	//ak su 2 argumenty a prvý je string a druhý objekt tak vytvoríme pole z jedným, práve vytvorenym elementom
	if(args.length === 2 && G.isString(args[0]) && G.isObject(args[1])){
		this.elements = [G.createElement(args[0], 
										 args[1].attr  || {}, 
										 args[1].cont  || "", 
										 args[1].style || {})];
		return;
	}

	if(args.length === 1){
		if(G.isString(args[0])){ //query selector
			this.elements = G.find(args[0]);
		}
		else if(G.isArray(args[0])){ //pole elementov
			this.elements = [];
			G.each(args[0], e => {
				if(G.isElement(e)){
					this.elements[this.elements.length] = e;
				}
			});
		}
		else if(G.isElement(args[0])){ //HTML Element
			this.elements = [args[0]];
		}
		else if(args[0] !== null && G.isDefined(args[0]) && G.isG(args[0])){ //G Object
			this.elements = args[0].elements;
		}
	}

	//ak nieje definované pole elementov upozorníme používatela a vytvoríme ho
	if(G.isUndefined(this.elements)){
		G.warn("G: nepodarilo sa rozpoznať argumenty: ", args);
		this.elements = [];
	}
	//ak zoznam elementov nieje pole tak vytvoríme pole a upozorníme používatela
	if(!G.isArray(this.elements)){
		G.warn("G: elementy niesu pole ale " + G.typeOf(this.elements), args);
		this.elements = [];
	}
	this.size = this.length();
};


let tests = function(G){
    let body = new G(document.body);

	body.append(G.createElement("div", {id: "idecko"}, "id"));
	body.append(G.createElement("div", {class: "classa"}, "id"));
	body.append(G.createElement("div", {id: "rodic"}, [
		G.createElement("div", {class: "aaa"}),
		G.createElement("div", {class: "aaa"},
			G.createElement("ul", {}, [
				G.createElement("li"),
				G.createElement("li", {class: "temno"}, "temno vnutorne"),
				G.createElement("li"),
				G.createElement("li")
			])
		),
		G.createElement("div", {class: "aaa"})
	]));
	body.append(G.createElement("div", {class: "temno"}, "temno vonkajsie"));

	/*
	 * empty();
	 * append();
	 * length();
	 * createElement();
	 */
	body.empty();
	if(body.children().length() !== 0){
		G.warn("dlžka prazdneho objektu je: " + body.length());
	}

	body.append("<div id='idecko'>jupilajda</div>");
	body.append(new G("div", {
		attr : {
			class: "clasa"
		},
		cont: "toto je classsa"
	}));
    let elementP = document.createElement("p");
	elementP.appendChild(document.createTextNode("juhuuu toto je paragraf"));
	body.append(elementP);
	if(body.children().length() !== 3){
		G.warn("dlžka objektu s 2 detmi je: " + body.children().length());
	}

    let idecko = new G("#idecko");
    let clasa = new G(".clasa");
    let par = new G("p");

	/*
	 * constructor()
	 * find()
	 * first();
	 */

	if(G.isDefined(new G().first())){
		G.warn("pri prazdnom G to nevratilo ako prvý element null");
	}

	if(idecko.first() !== document.getElementById("idecko")){
		G.warn("nenašiel sa správny element podla id");
	}

	if(clasa.first() !== document.getElementsByClassName("clasa")[0]){
		G.warn("nenašiel sa správny element podla class");
	}

	if(par.first() !== document.getElementsByTagName("p")[0]){
		G.warn("nenašiel sa správny element podla tagu");
	}

	/*
	 * css
	 */

	if(!G.isObject(idecko.css())){
		G.warn("css() nevratilo objekt");
	}

	idecko.css("color", "");
	if(idecko.css("color") !== ""){
		G.warn("nenastavený css nieje prazdny");
	}

	idecko.css("color", "red");
	if(idecko.css("color") !== "red"){
		G.warn("nesprávne to nastavilo css štýl");
	}

	idecko.css({color: "blue", width: "200px"});

	if(idecko.css("color") !== "blue" || idecko.css("width") !== "200px"){
		G.warn("nesprávne to nastavilo css štýl s objektu");
	}

	if(idecko.parent().first() !== body.first()){
		G.warn("parent nefunguje správne");
	}

	/*
	 * extends
	 */

    let a = {a: "aa"};
    let b = {b: "bb", c: "cc"};
    let c = {a: "aaa", c: "cccc"};

    let res = G.extend({}, a, b, c);

	if(res.a !== "aaa" || res.b !== "bb" || res.c !== "cccc"){
		G.warn("nefunguje extendse pretože po zlučenie", a, b, c, " vzniklo: ", res, "a malo vzniknut: ", {a: "aaa", b: "bb", c: "cccc"});
	}


	/*
	 * find, parents, parent, is, prev, childrens, next, attr
	 */

	G("div", {
		attr: {id: "container"},
		cont: [
			G.createElement("nav", {id: "topMenu"}, [
					G.createElement("ul", {}, [
						G.createElement("li", {},
							G.createElement("a", {class: "firstLink", href: "stranka"})
						),
						G.createElement("li", {},
							G.createElement("a", {class: "secondLink"})
						)
					]),
					G.createElement("div", {id: "wrapper", class: "wrappedDiv"},
						G.createElement("nav", {id: "rightMenu"},
							G.createElement("ul", {class: "secondUl"}, [
								G.createElement("li", {class: "firstLi"},
									G.createElement("a", {class: "firstLink"})
								),
								G.createElement("li", {class: "middleLi disabled"},
									G.createElement("a", {class: "secondLink"})
								),
								G.createElement("li", {class: "lastLi disabled"},
									G.createElement("a", {class: "thirdLink"})
								),
							])
						)
					)
				]
			)]
	}).appendTo(body);

	if(G("#topMenu").find(".firstLink").attr("href") !== "stranka"){
		console.log("zlihalo 1");
	}
	if(G(".thirdLink").parents("#wrapper").is(".wrappedDiv") !== true){
		console.log("zlihalo 2");
	}
	if(G("#rightMenu").find("ul").children(":not(.disabled)").is(".firstLi") === false){
		console.log("zlihalo 3");
	}
	if(G(".middleLi").prev().is(".firstLi") !== true){
		console.log("zlihalo 4");
	}
	if(G(".middleLi").next().is(".lastLi") !== true){
		console.log("zlihalo 5");
	}
	if(G(".secondUl").parent().is("#rightMenu") !== true){
		console.log("zlihalo 6");
	}

	/*
     * //click
	 */

	body.append(G.createElement("span", {id: "resultSpan"}));

	if(G("#resultSpan").text() !== ""){
		console.log("zlahalo 1");
	}
	body.append(G.createElement("input", {type: "button", id: "resultButton", value: "klikni"}));


    let clickFunction = function(){
		G("#resultSpan").text("kuriatko");
	};

	G("#resultButton").click(clickFunction);

	G("#resultButton").first().click();

	if(G("#resultSpan").text() !== "kuriatko"){
		console.log("zlahalo 2");
	}

	G("#resultButton").unbind("click", clickFunction);
	G("#resultSpan").text("maciatko");
	G("#resultButton").first().click();

	if(G("#resultSpan").text() !== "maciatko"){
		console.log("zlahalo 3");
	}

	/*
	 * APPEND
	 */
    let parent = new G("div", {attr: {id :"parentElement"}});
	parent.append("<li>a</li>");
	parent.append(new G("li", {cont: "b"}));
	parent.append(G.createElement("li", {}, "c"));
	if(parent.text() !== "abc"){
		console.log("append nefunguje");
	}

	/*
	 * HTML
	 */
	parent = new G("div", {attr: {id :"parentElement"}});
	parent.html("<li>abc</li>");
	if(parent.text() !== "abc" && parent.html() !== "<li>abc</li>"){
		console.log("html nefunguje 1");
	}
	parent.html("abc");
	if(parent.text() !== "abc" && parent.html() !== "abc"){
		console.log("html nefunguje 2");
	}
	parent.html(G.createElement("li", {}, "abc"));
	if(parent.text() !== "abc" && parent.html() !== "<li>abc</li>"){
		console.log("html nefunguje 3");
	}
	parent.html("+abc");
	if(parent.text() !== "abcabc" && parent.html() !== "<li>abc</li>abc"){
		console.log("html nefunguje 4");
	}
	parent.html("+<li>abc</li>");
	if(parent.text() !== "abcabcabc" && parent.html() !== "<li>abc</li>abc<li>abc</li>"){
		console.log("html nefunguje 5");
	}
	if(parent.children().length() !== 2){
		console.log("html nefunguje 6");
	}
	

	//add, contains, equalAll

    let data = new G();
    let el = G.createElement("span", {class: "pes macka"}, "volačo");
	data.add(el);
	data.add(G.createElement("div", {class: "pes kura"}, "niečo iné"));
	data.add(G.createElement("p", {class: "macka kura"}, "niečo zasa iné"));
	if(data.has(".pes").length() !== 2){
		console.log("add nefunguje 1");
	}
	if(data.has(".pterodaktil").length() !== 0){
		console.log("add nefunguje 2");
	}
	if(data.not(".kura").length() !== 1){
		console.log("not nefunguje 2");
	}

	if(!data.contains(el)){
		console.log("nefunguje contains");
	}

	data.remove(el);

	if(data.length() !== 2){
		console.log("nefunguje remove");
	}

	if(data.contains(el)){
		console.log("nefunguje remove alebo contains");
	}

	let dataNew = new G(data);

	if(!data.equalAll(dataNew)){
		console.log("nefunguje equalAll alebo konštruktor kde argument je G objekt");
	}
	dataNew.clear();
	if(!dataNew.isEmpty()){
		console.log("nefunguje clear");
	}
	if(data.equalAll(dataNew)){
		console.log("nefunguje equalAll alebo clear");
	}

	//delete, deleteAll
	let items = new G(".disabled");
	items.delete();
	if(items.length() !== 1){
		console.log("nefunguje delete");
	}

	let items2 = new G("ul");
	items2.deleteAll();
	if(!items2.isEmpty()){
		console.log("nefunguje deleteAll");
	}
};


/**
 * Funkcia vráti rodičovské elementy elementu na vstupe alebo []
 *
 * @param params.element - element ktorému sa hladájú rodičovské elementy
 * @param params.condition = "" - podmienka pre rodičovksé elementy ktoré sa majú vrátiť
 * @param params.finish = "" - podmienka rodičovký element po ktorý sa má hladať
 * @param params.limit = 0 - maximálne počet elementov kolko sa má nájsť alebo 0 ak hladáme všetky
 * @returns {Element[]} - rodičovské elementy alebo [] ak sa nenašiel žiadny rodič
 */
G.parents = function(params){//testovane 28.1.2017
	return G._iterate({
		condition: 	G.isString(params.condition) ? params.condition : "",
		finish: 	G.isString(params.finish) ? params.finish : "",
		limit: 		G.isNumber(params.limit) ? params.limit : 0,
		operation: 	e => e.parentElement,
		element: 	params.element
	});
};

/**
 * Funkcia preiteruje všetky elementy a vráti ich zoznam
 *
 * @param params.operation = operácia ktorou s získa další element
 * @param params.element - element ktorému sa hladájú rodičovské elementy
 * @param params.condition = "" - podmienka pre rodičovksé elementy ktoré sa majú vrátiť
 * @param params.finish = "" - podmienka rodičovký element po ktorý sa má hladať
 * @param params.limit = 0 - maximálne počet elementov kolko sa má nájsť alebo 0 ak hladáme všetky
 * @returns {Element[]} - rodičovské elementy alebo [] ak sa nenašiel žiadny rodič
 * @private
 */
G._iterate = function(params){
	let result 	= [];

	if(!G.isElement(params.element) || !G.isFunction(params.operation)){
		return result;
	}

	params.element = params.operation(params.element);
	while(params.element){
		if(G.isEmpty(params.condition) || G.matches(params.element, params.condition)){
			result[result.length] = params.element;
			if(params.limit && result.length === params.limit){
				break;
			}
			if(params.finish && G.matches(params.element, params.finish)){
				break;
			}
		}
		params.element = params.operation(params.element);
	}
	return result;
};

/**
 * Funkcia vráti dalšieho surodenca elementu
 * @param params
 * @returns {*}
 */
G.next = function (params){//testovane 28.1.2017
	if(G.isElement(params)){
		return params.nextElementSibling;
	}
	return G._iterate({
		condition: 	G.isString(params.condition) ? params.condition : "",
		finish: 	G.isString(params.finish) ? params.finish : "",
		limit: 		G.isNumber(params.limit) ? params.limit : 0,
		operation: 	e => e.nextElementSibling,
		element: 	params.element
	});
};


/**
 * Funkcia vráti predchádzajúceho súrodenca elementu
 *
 * @param params
 * @returns {*}
 */
G.prev = function (params){//testovane 28.1.2017
	if(G.isElement(params)){
		return params.previousElementSibling;
	}
	return G._iterate({
		condition: 	G.isString(params.condition) ? params.condition : "",
		finish: 	G.isString(params.finish) ? params.finish : "",
		limit: 		G.isNumber(params.limit) ? params.limit : 0,
		operation: 	e => e.previousElementSibling,
		element: 	params.element
	});
};

/*************************************************************************************
 FUNKCIE NA UPRAVU G ELEMENTU
 *************************************************************************************/

/**
 * Funcia zistí čí prví element spĺňa podmienku
 *
 * @param selectorString - podmienka ktorú musí element splniť
 * @return boolean - či objekt spĺňa podmienku alebo null ak sa žiadny objekt nenachádza alebo je zlý selector
 */

G.prototype.is = function(selectorString){//testovane 28.1.2017
	//ak je prázdy
	if(this.isEmpty()){
		return false;
	}

	//vrátime výsledok porovnania
	return G.matches(this.first(), selectorString);
};

/**
 * Funckia zistí či sa selector zadaný ako parameter nezhoduje s elementom
 *
 * @param selectorString - paramter ktorý sa negovaný porovná s elementom
 * @returns {G} - či objekt spĺna podmienku
 */
G.prototype.not = function(selectorString){
	return this.has(":not(" + selectorString + ")");
};

/**
 * Funkcia vráti G objekt obsahujúci elementy s pôvodného objektu 
 * ktoré spĺnajú podmienku danú ako parameter
 *
 * @param selectorString - podmienka podla ktorého sa vyberajú vhodné elementy
 * @returns {G} - G objekt
 */
G.prototype.has = function(selectorString){
    let result = new G();

	this.each(function(){
		if(G.matches(this, selectorString)){
			result.add(this);
		}
	});

	return result;
};

/**
 * Funkcia pridá do objektu elementy ktoré sú na vstupe alebo string pre vyhladanie
 *
 * @param arguments - objekty ktoré sa majú pridať
 * @returns {G} - G objekt
 */
G.prototype.add = function(){//testovane 21.2.2017
	G.each(arguments, (e, i) => {
		if(G.isElement(e)){
			this.elements[this.elements.length] = e;
		}
		else if(G.isString(e)){
			this.elements.push.apply(this, G.find(e));
		}
		else{
			G.warn("G.prototype.add: argumenty funkcie: (string[]), " + i +" -ty argument: ", e);
		}
	});
	return this;
};


/**
 * Funkcia vymaže všetky objekty na vstupe
 *
 * @param arguments
 * @returns {G}
 */
G.prototype.remove = function(){//testovane 21.2.2017
	let index;
	G.each(arguments, e => {
		if(G.isElement(e)){
			index = this.elements.indexOf(e);
			if(index >= 0){
				this.elements.splice(index, 1);
			}
		}
	});
	return this;
};


/**
 * Funkcia vyprázdni obsah G objektu
 *
 * @returns {G}
 */
G.prototype.clear = function(){//testovane 21.2.2017
	this.elements = [];
	return this;
};

/**
 * Funckia porovná 2 G objekty či majú všetky prvky rovnaké
 *
 * @param obj - G objekt s ktorým sa má porovnať
 * @returns {boolean}
 */
G.prototype.equalAll = function(obj){//testovane 21.2.2017
	//ak parameter nieje G objekt tak vráti false
	if(!G.isG(obj)){
		return false;
	}

	//ak nesedia dĺžky tak vráti false
	if(obj.length() !== this.length()){
		return false;
	}

	//ak sa nejaký element nenachádza v druhom elemente tak vráti false
	G.each(this.elements, e => {
		if(obj.elements.indexOf(e) < 0){
			return false;
		}
	});

	//ak sa nejaký element nenachádza v tomto element tak vráti false
	G.each(obj.elements, e => {
		if(this.elements.indexOf(e) < 0){
			return false;
		}
	});
	//ak všetko úspešne skontrolovalo tak vráti true
	return true;
};

/**
 *
 * @param element
 * @returns {boolean}
 */
G.prototype.contains = function(element){//testovane 21.2.2017
	if(!G.isElement(element)){
		G.warn("G.prototype.contains: prvý paramter element[Element] je: ", element);
		return false;
	}

	for(let i=0 ; i<this.elements.length ; i++){
		if(this.elements[i] === element){
			return true;
		}
	}

	return false;
};

/**
 * Funcka porovná či sa G objekt zhoduje s parametrom čo je buď G objekt alebo element 
 *
 * @param element
 * @returns {boolean}
 */
G.prototype.equal = function(element) {
	if (G.isG(element)){
		return this.first() === element.first();
	}
	else if (G.isElement(element)){
		return this.first() === element;
	}
	else{
		G.warn("G.prototype.equal: prvý parameter element[Element|G] je ", element);
	}
	return false;
};

/*************************************************************************************
 FUNKCIE NA ZJEDNODUSENIE
 *************************************************************************************/


G.prototype.width = function(){//testovane 26.1.2017
	if(this.isEmpty()){
		return null;
	}
	return this.first().offsetWidth;
};

G.prototype.height = function(){//testovane 26.1.2017
	if(this.isEmpty()){
		return null;
	}
	return this.first().offsetHeight;
};

G.prototype.show = function(){
	return this.css("display", "block");
};

G.prototype.hide = function(){
	return this.css("display", "none");
};

G.prototype.toggle = function(){
	return  this.css("display") === "none" ? this.show() : this.hide();
};

G.prototype.emptyAll = function(){
	G.each(this.elements, e => G.html(e, ""));
	return this;
};

G.prototype.empty = function(){
	return this.html("");
};

G.prototype.hasClass = function(className){
	return this.class(className);
};

G.prototype.val = function(){
	return this.attr("value", arguments[0]);
};

G.prototype.addClass = function(className){
	return this.class("+" + className);
};

G.prototype.removeClass = function(className){
	return this.class("-" + className);
};

G.prototype.toggleClass = function(className){
	return this.class("/" + className);
};

/*************************************************************************************
 TRAVERSINGOVE FUNKCIE
 *************************************************************************************/

/**
 * Funkcia vráti všetkých rodičov elementu ktorý spĺňajú selector v argumente
 *
 * @param selectorString = ""
 * @returns {G}
 */
G.prototype.parents = function(selectorString = ""){//testovane 28.1.2017
	return new G(G.parents({
		element: this.first(), 
		condition: selectorString
	}));
};

/**
 * Funkcia vráti všetkych rodičov až kým neobjaví rodiča ktorý spĺňa selector v argumente
 * @param selectorString
 * @returns {G}
 */
G.prototype.parentsUntil = function(selectorString = ""){//testovane 28.1.2017
	return new G(G.parents({
		element: this.first(), 
		finish: selectorString
	}));
};

/**
 * Funkcia vyhladá v element všetky elementy spĺnajúce selector a vráti ich v novom G objekte
 * @param selectorString
 * @returns {G}
 */
G.prototype.find = function(selectorString){//testovane 28.1.2017
	return new G(G.find(selectorString, this.first()));
};


/**
 * Funkcia vráti G objekt obsahujuci rodiča daného elementu
 *
 * @returns {G}
 */
G.prototype.parent = function(){//testovane 29.1.2017
	return new G(G.parent(this.first()));
};

/**
 *
 * @returns {G}
 */
G.prototype.next = function(){//testovane 29.1.2017
	return new G(G.next(this.first()));
};

/**
 *
 * @param selectorString
 * @returns {G}
 */
G.prototype.nextAll = function(selectorString = ""){//TODO otestovať
	return new G(G.next({
		element: this.first(),
		condition: selectorString
	}));
};

/**
 *
 * @param selectorString
 * @returns {G}
 */
G.prototype.nextUntil = function(selectorString = ""){//TODO otestovať
	return new G(G.next({
		element: this.first(),
		finish: selectorString
	}));
};

/**
 *
 * @returns {G}
 */
G.prototype.prev = function(){//testovane 29.1.2017
	return new G(G.prev(this.first()));
};

/**
 *
 * @param selectorString
 * @returns {G}
 */
G.prototype.prevAll = function(selectorString = ""){//TODO otestovať
	return new G(G.prev({
		element: this.first(),
		condition: selectorString
	}));
};

/**
 *
 * @param selectorString
 * @returns {G}
 */
G.prototype.prevUntil = function(selectorString = ""){//TODO otestovať
	return new G(G.prev({
		element: this.first(),
		finish: selectorString
	}));
};

/**
 *
 * @param selectorString
 */
G.prototype.children = function(selectorString = ""){//deprecated 11.2.2017
	return this.childrens(selectorString);
};

/**
 *
 * @param selectorString
 * @returns {G}
 */
G.prototype.childrens = function(selectorString = ""){//TODO otestovať - pridať možnosť filtrovať deti
	return new G(G.childrens(this.first(), selectorString));
};
/*************************************************************************************
 NEZARADENE FUNKCIE
 *************************************************************************************/

G.prototype.first = function(){//testovane 29.1.2017
	return this.elements[0];
};

G.prototype.length = function(){//testovane 29.1.2017
	return this.elements.length;
};

G.prototype.isEmpty = function(){//testovane 29.1.2017
	return this.length() === 0;
};

G.prototype.each = function(func, ...args){//testovane 29.1.2017
	//aj callback nieje funkcia tak skončíme
	if(!G.isFunction(func)){
		G.warn("G.prototype.each: prvý parameter func[Function] je: ", func);
		return this;
	}

	G.each(this.elements, e => func.apply(e, args));

	return this;
 };
 

/*************************************************************************************
 HTML/CSS FUNKCIE
 *************************************************************************************/
/**
 * Funkcia zmaže všetky objekty uložené v G objekte
 *
 * @returns {G}
 */
G.prototype.deleteAll = function(){//testovane 21.2.2017
	G.each(this.elements, e => G.delete(e));
	this.elements = [];
	return this;
};

/**
 *
 * @param data
 * @returns {G}
 */
G.prototype.prependTo = function(data){//TODO otestovať
	if(this.isEmpty()){
		return this;
	}

	if(G.isElement(data)){
		data.parentElement.insertBefore(this.first(), data.parentElement.firstElementChild);
	}
	else if(G.isG(data) && !data.isEmpty()){
		data.parent().first().insertBefore(this.first(), data.parent().first().firstElementChild);
	}
	else{
		G.warn("G.prototype.prependTo: argument funkcie musí byť element a je: ", data);
	}
	return this;
};

/**
 *
 * @param data
 * @returns {G}
 */
G.prototype.appendTo = function(data){//testovane 28.1.2017
	if(this.isEmpty()){
		return this;
	}

	if(G.isElement(data)){
		data.appendChild(this.first());
	}
	else if(G.isG(data) && !data.isEmpty()){
		data.first().appendChild(this.first());
	}
	else{
		G.warn("G.prototype.appendTo: argument funkcie musí byť element a je: ", data);
	}

	return this;
};

/**
 *
 * @param data
 * @returns {G}
 */
G.prototype.prepend = function(data){//testovane 29.1.2017
	if(this.isEmpty()){
		return this;
	}

	if(G.isElement(data)){
		this.first().insertBefore(data, this.first().firstElementChild);
	}
	else if(G.isString(data)){
		this.html(data + this.html());
	}
	else{
		G.warn("G.prototype.prepend: argument funkcie musí byť element alebo string a teraz je: ", data);
	}
	return this;
};

/**
 * funkcia pridá text, objekt alebo G objekt na začiatok prvého elementu
 *
 * @param data - objekt ktorý sa má pridať
 * @return {*}
 */
G.prototype.append = function(data){//testovane 28.1.2017 //testovane 29.1.2017
	if(this.isEmpty()){
		return this;
	}

	if(G.isElement(data)){
		this.first().appendChild(data);
	}
	else if(G.isString(data)){
		G.html(this.first(), data, true);
	}
	else if(G.isG(data) && !data.isEmpty()){
		this.first().appendChild(data.first());
	}
	else{
		G.warn("G.prototype.append: argument funkcie musí byť element alebo string a teraz je: ", data);
	}

	return this;
};

/**
 *
 * @param func
 * @param delay
 * @returns {G}
 */
G.prototype.delay = function(func, delay = 0){
	setTimeout(func, delay);
	return this;
};

//TODO after
//TODO before


/**
 * text() - vráti obsah ako text
 * text("juhuuu") - text elementu bude "juchuuu"
 * text("<b>ju</b><p>huuu</p>") - text elementu bude "juhuuu"
 *
 * @param text
 * @param append
 * @returns {*}
 */
G.prototype.text = function(text, append = false){//testovane 29.1.2017
	if(this.isEmpty()){
		return this;
	}
	if(G.isUndefined(text)){
		return G.text(this.first());
	}

	if(text[0] === "+"){
		G.text(this.first(), text.substring(1), true);
	}
	else if(append){
        G.text(this.first(), text, true);
	}
	else{
		G.text(this.first(), text);
	}
	return this;
};

/**
 * html() - vráti HTML obsah elementu
 * html("<b>bold</b>") - nastavý HTML obsah elementu
 * html("Element") - nastavý ako jedine dieťa nový element
 *
 * @param html
 * @returns {*}
 */
G.prototype.html = function(html){//testovane 26.1.2017 //testovane 29.1.2017
	//ak je G objekt prázdny tak vráti G objekt
	if(this.isEmpty()){
		return this;
	}

	//ak nieje zadaný parameter tak sa vráti HTML prvého elementu 
	if(G.isUndefined(html)){
		return G.html(this.first());
	}
	else if(G.isString(html)){
		if(html[0] === "+"){
			G.html(this.first(), html.substring(1), true);
		}
		else{
			G.html(this.first(), html);
		}
	}
	else if(G.isElement(html)){
		G.html(this.first(), "");
		this.append(html);
	}
	return this;
};

/**
 * Funkcia vymaže prvý element v zozname a vráti G object
 *
 * @returns {G}
 */
G.prototype.delete = function(){//testovane 21.2.2017 //TODO pridať možnosť filtrovať vymazane //testovane 29.1.2017
	if(this.isEmpty()){
		return this;
	}

	G.delete(this.first());
	this.elements.splice(0, 1);

	return this;
};

/**
 * class("nazov") - vrati true ak ma objekt danú triedu ináč vrát false
 * class("+nazov") - pridá objektu danú triedu
 * class("-nazov") - odstráni objektu danú triedu
 * class("/nazov") - pridá objektu danú triedu ak neexistuje ináč ju odstráni
 *
 * @param name - názov triedy
 * @param force - hodnota pri toggleovaní triedy
 * @returns {*}
 */
G.prototype.class = function(name, force){//testovane 28.1.2017
    let result = G.class(this.first(), arguments[0], arguments[1]);
    return G.isUndefined(result) ? this : result;
};

/**
 * css() - vráti všetky nastavené CSS štýly;
 * css("nazov") - vráti hodnotu CSS štýlu;
 * css("-nazov") - vymaža daný CSS štýl;
 * css("nazov", "hodnota") - nastavý danému CSS štýlu hodnotu;
 * css({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým CSS štýlom hodnoty;
 *
 * @param arguments
 * @returns {*}
 */
G.prototype.css = function(){//testovane 29.1.2017
    const result = G.css(this.first(), arguments[0], arguments[1]);
    return G.isUndefined(result) ? this : result;
};

/**
 * attr() - vráti všetky atribúty;
 * attr("nazov") - vráti hodnotu atribútu;
 * attr("-nazov") - vymaža daný atribút;
 * attr("nazov", "hodnota") - nastavý danému atribútu hodnotu;
 * attr({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým atribútom hodnoty;
 *
 * @param arguments
 * @returns {*}
 */
G.prototype.attr = function(){//testovane 29.1.2017
	let result = G.attr(this.first(), arguments[0], arguments[1]);
    return G.isUndefined(result) ? this : result;
};

/**
 * LISTENERS
 */

/**
 * Funkcia upravý listener na elemente
 *
 * @param element
 * @param listener
 * @param func
 * @param type
 * @returns {*}
 * @private
 */
G._modifyListener = function(element, listener, func, type){//testovane 29.1.2017
    let allowedListeners = ["click", "blur", "submit", "focus", "scroll", "keydown", "keyup", "dblclick"];

    //ak element ktorý sa ide modifikovať nieje element tak skončíme
    if(!G.isElement(element)){
    	G.warn("G._modifyListener: prvý parameter element[Element] je", element);
    	return element;
    }

    //ak listener ktorý sa ide modifikovať nieje platný tak skončíme
    if(!G.isIn(listener, allowedListeners)){
    	G.warn("G._modifyListener: druhý parameter(", listener, ") nieje platný listenre");
    	return element;
    }

    //ak callback nieje funkcia tak skončíme
    if(!G.isFunction(func)){
    	G.warn("G._modifyListener: tretí parameter func[Function] je ",func);
    	return element;
    }

	if(type === "unbind"){
		element.removeEventListener(listener, func);
	}
	else if(type === "bind"){
		element.addEventListener(listener, func);
	}

	return element;
};

/**
 * Funkcia odbindne listener z elementu
 *
 * @param listener
 * @param func
 */
G.prototype.undelegate = function(listener, func){//TODO otestovať
	this.unbind(listener, func);
};

/**
 * Funkcia bindne k elementu listener na počúvanie udalosti u všetkých deťoch
 *
 * @param condition - selector ktorým vyberie deti pri ktorých sa má zavolať funkcia
 * @param listener - typ listeneru
 * @param func - funlcia
 * @returns {G}
 */
G.prototype.delegate = function(condition, listener, func){//TODO otestovať
	if(!G.isString(condition)){
		G.warn("G.prototype.delegate: prvy parameter contidion[String] je ", condition);
		return this;
	}

	this.bind(listener, (e) => {
		if(G.matches(e.target, condition)){
			func(e);
		}
	});

	return this;
	
};

/**
 * Funkcia odbindne listener z elementu
 *
 * @param listener
 * @param func
 * @returns {G}
 */
G.prototype.unbind = function(listener, func){//testovane 29.1.2017
	if(this.isEmpty()){
		return this;
	}
	G._modifyListener(this.first(), listener, func, "unbind");
	return this;
};

/**
 * Funkcia binde k elementu listener na zavolanie funkcie
 *
 * @param listener - typ listeneru o aký sa jedná
 * @param func - funkcia ktorá sa má udiať pri udalosti
 * @returns {G}
 */
G.prototype.bind = function(listener, func){//testovane 29.1.2017
	if(this.isEmpty()){
		return this;
	}
	G._modifyListener(this.first(), listener, func, "bind");
	return this;
};

G.prototype.blur = function(func){return this.bind("blur", func);};
G.prototype.keyup = function(func){return this.bind("keyup", func);};
G.prototype.click = function(func){return this.bind("click", func);};
G.prototype.focus = function(func){return this.bind("focus", func);};
G.prototype.submit = function(func){return this.bind("submit", func);};
G.prototype.scroll = function(func){return this.bind("scroll", func);};
G.prototype.keydown = function(func){return this.bind("keydown", func);};
G.prototype.dblclick = function(func){return this.bind("dblclick", func);};

/*
 G.ajax();
 G.warn();
 G.createElement();
 G.extend();
 G.each();
 G.find();
 G.parent();
 G.html();
 G.next();
 G.prev();
 G.children();
 G.delete();

 // FUNKCIE NA UPRAVU G ELEMENTU

 G.prototype.add();
 G.prototype.remove();
 G.prototype.clear();
 G.prototype.contains();
 G.prototype.equal();

 // FUNKCIE NA ZJEDNODUSENIE

 G.prototype.show();
 G.prototype.hide();
 G.prototype.toggle();
 G.prototype.emptyAll();
 G.prototype.empty();
 G.prototype.hasClass();
 G.prototype.val();
 G.prototype.addClass();
 G.prototype.removeClass();
 G.prototype.toggleClass();

 // TRAVERSINGOVE FUNKCIE

 G.prototype.parent();
 G.prototype.next();
 G.prototype.prev();
 G.prototype.children();

 // NEZARADENE FUNKCIE

 G.prototype.first();
 G.prototype.length();
 G.prototype.isEmpty();
 G.prototype.each();

 // UTILITOVE FUNKCIE
 G.isFunction();
 G.isDefined();
 G.isString();
 G.isObject();
 G.isNumber();
 G.isNum();
 G.isBool();
 G.isG();
 G.isUndefined();
 G.isArray();
 G.isString();
 G.isGElement();
 G.isElement();

 // HTML/CSS FUNKCIE

 G.prototype.deleteAll();
 G.prototype.prependTo();
 G.prototype.appendTo();
 G.prototype.prepend();
 G.prototype.append();
 G.prototype.text();
 G.prototype.html();
 G.prototype.delete();
 G.prototype.class();
 G.prototype.css();
 G.prototype.attr();
 */

// exports.Tests = tests;
// exports.G = G;