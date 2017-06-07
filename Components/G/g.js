/**
 * Konštruktor G objektu
 *
 * G(selector) - vyhladá elementy podla selectora a vráti G object
 * G(nazov, {attr:{}, "obsah elementu", style:{}}) - vytvorý nový G object
 * G(nazov, {attr:{}, element, style:{}}) - vytvorý nový G object
 *
 * @param {Element|*[]} args
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
        return this;
    }

    //ak su dva parametre a prvý je string a druhý objekt tak vytvoríme pole z jedným, práve vytvorenym elementom
    if(args.length === 2 && G.isString(args[0]) && G.isObject(args[1])){
        this.elements = [G.createElement(args[0],
            args[1].attr  || {},
            args[1].cont  || "",
            args[1].style || {})];
        return this;
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
        G.warn("G: nepodarilo sa rozpoznať parametre: ", args);
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
    function justCallFunctions(){
        function callAndPrint(title, ...args){
            G.log("vola sa:" + title + ":", G[title].apply(window, args));
        }
        G();
        let bodyElement = document.body;
        callAndPrint("loadScript");
        callAndPrint("byClass", "*");
        callAndPrint("byName", "*");
        callAndPrint("byTag", "*");
        callAndPrint("byId", "*");
        callAndPrint("hasClass", bodyElement, "*");
        callAndPrint("error");
        callAndPrint("warn");
        callAndPrint("log");
        callAndPrint("createElement", "input");
        callAndPrint("now");
        callAndPrint("typeOf", bodyElement);
        callAndPrint("last");
        callAndPrint("isIn");
        callAndPrint("extend", {});
        callAndPrint("matches", bodyElement);
        callAndPrint("each", {}, a => a);
        callAndPrint("find", "*");
        callAndPrint("parent", bodyElement);
        callAndPrint("parents", bodyElement);
        callAndPrint("text", bodyElement);
        callAndPrint("html", bodyElement);
        callAndPrint("next", bodyElement);
        callAndPrint("prev", bodyElement);
        callAndPrint("childrens", bodyElement);
        callAndPrint("class", bodyElement);
        callAndPrint("css", bodyElement);
        callAndPrint("attr", bodyElement);
        callAndPrint("_modifyListener", bodyElement, "click", a => a);
        callAndPrint("position", bodyElement);
        callAndPrint("width", bodyElement);
        callAndPrint("height", bodyElement);
        callAndPrint("size", bodyElement);
        callAndPrint("top", bodyElement);
        callAndPrint("left", bodyElement);
        //callAndPrint("delete", bodyElement.firstElementChild);

    }

    let localTests = {};
    localTests.find = function(){
        let a = G.createElement("input", {"class": "a b"});
        let b = G.createElement("div", {"class": "b c"});
        let parent = G.createElement("div", {"class": "a b c"});
        parent.appendChild(a);
        parent.appendChild(b);
        let res = new G(G.find(".b", parent));
        window.console.assert(res.size === 2);
    };
    localTests.createElement = function(){
        let a = G.createElement("input");
        window.console.assert(G.isEmpty(G.attr(a)), "nevytvoril sa prazdny element ale ", G.attr(a));
        let b = G.createElement("div", {"class": "aa"});
        window.console.assert(G.class(b, "aa"), "nevytvoril sa element z triedov");
        let c = G.createElement("span", {}, "gabriel");
        window.console.assert(G.text(c) === "gabriel", "nepriradil sa string ako obsah pri vytvarani objektu");
        let d = G.createElement("a", {}, c);
        window.console.assert(G.html(d) === c.outerHTML, "vnútorne HTML nieje rovnake");
        let e = G.createElement("a", {}, "", {border: "1px solid black"});
        window.console.assert(G.css(e, "border") === "1px solid black", "nenastavil sa správne štýl");
    };
    localTests.testAttr = function(){
        let element = G.createElement("input");
        window.console.assert(G.isEmpty(G.attr(element)), "prázdny element má nejaký atribúty");
        G.attr(element, "type", "text");
        window.console.assert(G.attr(element).type === "text", "po nastavení typu niee známy typ");
        window.console.assert(G.attr(element, "type") === "text", "po nastavení typu niee známy typ");
        G.attr(element, "type", "password");
        window.console.assert(G.attr(element, "type") === "password", "po nastavení typu niee známy typ");
        G.attr(element, {value: "val", "class": "classa"});
        window.console.assert(G.attr(element).class === "classa", "nanastavila sa class");
        window.console.assert(G.attr(element, "value") === "val", "nanastavila sa value");
        G.attr(element, "-value");
        window.console.assert(!G.isString(G.attr(element).value), "navymazal sa value1");
        window.console.assert(!G.isString(G.attr(element, "value")), "navymazal sa value2");
    };
    localTests.testClass = function(){
        let element = G.createElement("div");
        window.console.assert(!G.class(element, "nieco"), "obsahuje triedu ktorú nemá zadanú");
        G.class(element, "+nieco");
        window.console.assert(G.class(element, "nieco"), "neeobsahuje triedu ktorú má zadanú");
        G.class(element, "-nieco");
        window.console.assert(!G.class(element, "nieco"), "obsahuje triedu ktorú nemá zadanú2");
        G.class(element, "/macka");
        window.console.assert(G.class(element, "macka"), "neeobsahuje triedu ktorú má zadanú2");
        G.class(element, "/macka");
        window.console.assert(!G.class(element, "macka"), "obsahuje triedu ktorú nemá zadanú3");
        G.class(element, "/macka", false);
        window.console.assert(!G.class(element, "macka"), "obsahuje triedu ktorú nemá zadanú4");
        G.class(element, "/macka", true);
        window.console.assert(G.class(element, "macka"), "neeobsahuje triedu ktorú má zadanú3");
        G.class(element, "/macka", true);
        window.console.assert(G.class(element, "macka"), "neeobsahuje triedu ktorú má zadanú4");
        G.class(element, ["+a", "/b", "+c"]);
        window.console.assert(G.class(element, "a"), "neeobsahuje triedu ktorú má zadanú5");
        window.console.assert(G.class(element, "b"), "neeobsahuje triedu ktorú má zadanú6");
        window.console.assert(G.class(element, "c"), "neeobsahuje triedu ktorú má zadanú7");
        G.class(element, ["/a", "-b", "/c"]);
        window.console.assert(!G.class(element, "a"), "obsahuje triedu ktorú nemá zadanú5");
        window.console.assert(!G.class(element, "b"), "obsahuje triedu ktorú nemá zadanú6");
        window.console.assert(!G.class(element, "c"), "obsahuje triedu ktorú nemá zadanú7");
    };
    localTests.testHTML = function(){};
    localTests.testText = function(){
        let a = G.createElement("input");
        window.console.assert(G.text(a) === "", "text nieje prázdny");
        let b = G.createElement("div", {}, "gabriel");
        window.console.assert(G.text(b) === "gabriel", "text nieje správny");
        let c = G.createElement("span", {}, b);
        window.console.assert(G.text(c) === "gabriel", "text z vnoreneho elementu nieje správny");
        G.text(b, "kvetina");
        window.console.assert(G.text(c) === "kvetina", "text z vnoreneho elementu po zmene nieje správny");
        G.text(c, "jahoda");
        window.console.assert(G.text(c) === "jahoda", "text z po zmenenieje správny");
    };
    localTests.testExtends = function(){
        let a = {
            a: "a",
            aa: {
                a: "a",
                b: "bb"
            }
        };
        let b = {
            b: "b",
            c: "c",
            aa: {
                a: "aa",
                c: "c",
                d: "dd"
            }
        };
        let c = {
            d: "d",
            c: "cc"
        };

        let result = G.extend(a, b, c);
        window.console.assert(result.aa.b === "bb", "nefunguje extends");
    };
    localTests.testAjax = function(){};
    localTests.testParents = function(){};
    localTests.testEach = function(){};
    localTests.testContainsIsHas = function(){};


    //zavoláme všetky lokálne testy
    G.each(localTests, e => e());

    //zavoláme všetky funkcie z defaultným argumentom aby prešli
    //justCallFunctions();

    G.log("...................................");
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
        window.console.log("zlihalo 1");
    }
    if(G(".thirdLink").parents("#wrapper").is(".wrappedDiv") !== true){
        window.console.log("zlihalo 2");
    }
    if(G("#rightMenu").find("ul").children(":not(.disabled)").is(".firstLi") === false){
        window.console.log("zlihalo 3");
    }
    if(G(".middleLi").prev().is(".firstLi") !== true){
        window.console.log("zlihalo 4");
    }
    if(G(".middleLi").next().is(".lastLi") !== true){
        window.console.log("zlihalo 5");
    }
    if(G(".secondUl").parent().is("#rightMenu") !== true){
        window.console.log("zlihalo 6");
    }

    /*
     * //click
     */

    body.append(G.createElement("span", {id: "resultSpan"}));

    if(G("#resultSpan").text() !== ""){
        window.console.log("zlahalo 1");
    }
    body.append(G.createElement("input", {type: "button", id: "resultButton", value: "klikni"}));


    let clickFunction = function(){
        G("#resultSpan").text("kuriatko");
    };

    G("#resultButton").click(clickFunction);

    G("#resultButton").first().click();

    if(G("#resultSpan").text() !== "kuriatko"){
        window.console.log("zlahalo 2");
    }

    G("#resultButton").unbind("click", clickFunction);
    G("#resultSpan").text("maciatko");
    G("#resultButton").first().click();

    if(G("#resultSpan").text() !== "maciatko"){
        window.console.log("zlahalo 3");
    }

    /*
     * APPEND
     */
    let parent = new G("div", {attr: {id :"parentElement"}});
    parent.append("<li>a</li>");
    parent.append(new G("li", {cont: "b"}));
    parent.append(G.createElement("li", {}, "c"));
    if(parent.text() !== "abc"){
        window.console.log("append nefunguje");
    }

    /*
     * HTML
     */
    parent = new G("div", {attr: {id :"parentElement"}});
    parent.html("<li>abc</li>");
    if(parent.text() !== "abc" && parent.html() !== "<li>abc</li>"){
        window.console.log("html nefunguje 1");
    }
    parent.html("abc");
    if(parent.text() !== "abc" && parent.html() !== "abc"){
        window.console.log("html nefunguje 2");
    }
    parent.html(G.createElement("li", {}, "abc"));
    if(parent.text() !== "abc" && parent.html() !== "<li>abc</li>"){
        window.console.log("html nefunguje 3");
    }
    parent.html("+abc");
    if(parent.text() !== "abcabc" && parent.html() !== "<li>abc</li>abc"){
        window.console.log("html nefunguje 4");
    }
    parent.html("+<li>abc</li>");
    if(parent.text() !== "abcabcabc" && parent.html() !== "<li>abc</li>abc<li>abc</li>"){
        window.console.log("html nefunguje 5");
    }
    if(parent.children().length() !== 2){
        window.console.log("html nefunguje 6");
    }


    //add, contains, equalAll

    let data = new G();
    let el = G.createElement("span", {class: "pes macka"}, "volačo");
    data.add(el);
    data.add(G.createElement("div", {class: "pes kura"}, "niečo iné"));
    data.add(G.createElement("p", {class: "macka kura"}, "niečo zasa iné"));
    if(data.has(".pes").length() !== 2){
        window.console.log("add nefunguje 1");
    }
    if(data.has(".pterodaktil").length() !== 0){
        window.console.log("add nefunguje 2");
    }
    if(data.not(".kura").length() !== 1){
        window.console.log("not nefunguje 2");
    }

    if(!data.contains(el)){
        window.console.log("nefunguje contains");
    }

    data.remove(el);

    if(data.length() !== 2){
        window.console.log("nefunguje remove");
    }

    if(data.contains(el)){
        window.console.log("nefunguje remove alebo contains");
    }

    let dataNew = new G(data);

    if(!data.equalAll(dataNew)){
        window.console.log("nefunguje equalAll alebo konštruktor kde argument je G objekt");
    }
    dataNew.clear();
    if(!dataNew.isEmpty()){
        window.console.log("nefunguje clear");
    }
    if(data.equalAll(dataNew)){
        window.console.log("nefunguje equalAll alebo clear");
    }

    //delete, deleteAll
    let items = new G(".disabled");
    items.delete();
    if(items.length() !== 1){
        window.console.log("nefunguje delete");
    }

    let items2 = new G("ul");
    items2.deleteAll();
    if(!items2.isEmpty()){
        window.console.log("nefunguje deleteAll");
    }
};

/**
 * Funkcia spustí AJAXové volanie na danu url a po uspešnej odpovedi zavolá callback funkciu
 *
 * @param {String}			url
 * @param {Object|Function}	options
 * @param {Function=}	    options.loadStart
 * @param {Function=}	    options.loadEnd
 * @param {String=}         options.method
 * @param {String=}         options.dataType
 * @param {Boolean=}	    options.async
 * @param {String=} 		dataType
 * @returns {Boolean|Object}
 */
G.ajax = function(url, options, dataType){//TODO pred options(ako callback) by mali ísť parametre
    let start = 0;
    /*
     if(!window.XMLHttpRequest){
     G.warn("Lutujeme ale váš prehliadaš nepodporuje AJAX");
     return false;
     }
     */
    //let http = window.XMLHttpRequest ?  new XMLHttpRequest() :  new ActiveXObject("Microsoft.XMLHTTP");
    let http = new XMLHttpRequest();

    if(!G.isString(url)){
        G.warn("G.ajax: prvý parameter url{String} je: ", url);
        return false;
    }

    if(G.isFunction(options)){
        options = {success: options};
        if(G.isString(dataType)){
            options.dataType = dataType;
        }
    }
    else if(!G.isObject(options)){
        options = {};
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
 * @param {String}		url
 * @param {Function=}	callback
 * @returns {Element|*}
 */
G.loadScript = function(url, callback){
    let script = document.createElement("script");
    script.type = "text/javascript";

    if(script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState === "loaded" || script.readyState === "complete"){
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
    G.byTag('head')[0].appendChild(script);
};
/*
 G.loadScript = function(src, async) {
 let script, tag;

 if(!G.isBool(async)){
 async = false;
 }

 script = document.createElement('script');
 script.type = 'text/javascript';
 script.async = async;
 script.src = src;

 tag = G.byTag('script')[0];
 tag.parentNode.insertBefore(script, tag);
 return script;
 };
 */

/*************************************************************************************
 UTILITOVE FUNKCIE
 *************************************************************************************/

G.byClass 	= title => document.getElementsByClassName(title);
G.byName 	= title => document.getElementsByName(title);
G.byTag 	= title => document.getElementsByTagName(title);
G.byId 		= title => document.getElementById(title);

/**
 * Funkcia zistí či element má danú triedu
 *
 * @param {Element}	element
 * @param {String}	className
 * @returns {Boolean}
 */
G.hasClass = function(element, className){
    //ak nieje zadaný element kotrý sa má overovať
    if(!G.isElement(element)){
        G.warn("G.hasClass: prvý parameter element{Element} je: ", element);
        return false;
    }

    //ak nieje zadaný trieda ktorá sa má overovať
    if(!G.isString(className)){
        G.warn("G.hasClass: druhý parameter className{String} je: ", className);
        return false;
    }

    //vrátime výsledok overovania
    return element.classList.contains(className);
};

/**
 * Funkcie spracuje chybové hlášky
 *
 * @param {*[]} args
 */
G.error = function(...args){
    window.console.error.apply(window.console, args);
};

/**
 * Funkcie spracuje chybové hlášky
 *
 * @param {*[]} args
 */
G.warn = function(...args){
    window.console.warn.apply(window.console, args);
};

/**
 * Funkcie spracuje chybové hlášky
 *
 * @param {*[]} args
 */
G.log = function(...args){
    window.console.log.apply(window.console, args);
};

/*
 G._error = function(key, ...args){
 //TODO všetky výpisi budú du zoradené podla IDčka chyby
 };
 */

/**
 * Funkcia vytvorý nový element a vráty ho
 *
 * G.createElement("div") => <div></div>;
 * G.createElement("div", {id: "ide"}) => <div id="ide"></div>;
 * G.createElement("div", {}, "text") => <div>text</div>;
 * G.createElement("div", {}, "<b>text</b>") => <div><b>text</b></div>;
 * G.createElement("div", {}, "text", {color: "blue"}) => <div style="color: blue;">text</div>
 *
 * G.createElement({name: "div"}) => <div></div>;
 * G.createElement({name: "div"}) => <div></div>;
 * G.createElement({name: "div", attr: {id: "ide"}}) => <div id="ide"></div>;
 *
 * @param {String|Object} 	    name  - názov elementu alebo object {name: "", attr: {}, style: {}, cont: ""}
 * @param {Object} 			    attr  - objekt kde kluče su nazvy atribútov a hodnoty su hodnoty atribútov
 * @param {String|Element|G} 	cont  - string s textom alebo element alebo pole elementov
 * @param {Object} 			    style - objekt kde kluče su nazvy štýlov a hodnoty su hodnoty štýlov
 * @returns {Element} - novo vytvorený element
 */
G.createElement = function(name, attr, cont, style){
    let el;

    //ak je prvý parameter objekt tak zavoláme rekurzívne túto funkciu s hodnotami objektu
    if(G.isObject(name)){
        //ak objekt s udajmy o novom element neobsahuje názov elementu
        if(!G.isString(name.name)){
            G.warn("G.createElement: prví parameter musí byť typu {Object} ktorý obsahuje name{String} a je: ", name);
            return null;
        }

        return G.createElement(name.name, name.attr || {}, name.cont || "", name.style || {});
    }

    //ak nieje zadané meno elementu
    if(!G.isString(name)){
        G.warn("G.createElement: prvý parameter name{String} je: ", name);
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
G.isEmpty = val => Object.keys(val).length === 0 || val === [] || val === "";
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


/**
 * Funkcia vráti posledný prvok pola ak existuje alebo null
 *
 * @param {*[]}	arr - pole ktorého posledný prvok potrebujeme
 * @returns {*} - posledný prvok alebo null
 */
G.last = function(arr){//TODO malo by to vedieť vytiahnuť aj posledny prvok z objektu
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
 * Funkcia či sa prvok nachádza v poli alebo v zozname parametrov
 *
 * @param {*}		obj
 * @param {*|*[]}	data
 * @returns {Boolean}
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
 * @param {Object}			target
 * @param {Object|Object[]}	args
 * @returns {Object}
 */
G.extend = function(target, ... args){
    //ak objekt do ktorého sa ide mergovať nieje objekt tak skončíme
    if(!G.isObject(target)){
        G.warn("G.extend: prvý parameter target{Object} je: ", target);
        return target;
    }

    G.each(args, (e, i) => {//TODO ak je to objekt musí sa toto pravdepodobne volať rekurzivne
        //ak argument nieje objekt
        if(G.isObject(e)){
            //ak je aktualny argument objekt prejdeme všetky jeho atribúty
            G.each(e, (ee, key) => {
                //ak je atribút objekt ktorý sa merguje do objektu
                if(G.isObject(target[key]) && G.isObject(ee)){
                    G.extend(target[key], ee);
                }
                else{
                    target[key] = ee;
                }
            });
        }
        else{
            G.warn("G.extend:  argument args[" + i + "]{Object} je : ", e);
        }
    });

    //vrátime zmergovaný objekt
    return target;
};

/**
 * Funkcia zistí či element spĺňa daný selector
 *
 * @param {Element}	    element
 * @param {Function}	element.matches
 * @param {String}	    queryString
 * @returns {Boolean}
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
 * @param {Object}		obj - objekt ktorý sa má preloopovať
 * @param {Function}	func - funkcia ktorá sa má zavoláť pre každý objekt a jej parametre su: (element, index, pole)
 * @param {Object=}		thisArg - objekt ktorý má byť dosadený sa this premennú
 */
G.each = function(obj, func, thisArg){
    let i;
    if(!G.isObject(obj)){
        G.warn("G.each: prvý parameter obj{Object} je:", obj);
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
 * @param {String}	queryString - klúč podla ktorého sa má hladať
 * @param {Element}	parent - element v ktorom sa má hladadť. Defaultne je do document
 * @returns {Element[]} - pole nájdených výsledkov
 */
G.find = function(queryString, parent){//testovane 28.1.2017
    let result = [];

    //ak queryString nieje String
    if(!G.isString(queryString)){
        G.warn("G.find: prvý parameter queryString{String} je ", queryString);
        return result;
    }

    //ak nieje zadaný parent alebo parent nieje element tak sa parent nastavný na document
    if(!G.isElement(parent)){
        //G.warn("G.find: druhý parameter parent{Element} je ", parent);
        parent = window.document.body;
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
 * @param {Element}	element - element ktorému sa hladá rodičovský element
 * @returns {Element} - rodičovský element alebo null ak sa nenašiel rodič
 */
G.parent = function(element){//testovane 28.1.2017
    //ak argument nieje element;
    if(!G.isElement(element)){
        G.warn("G.parent: prvý parameter element{Element} je: ", element);
        return null;
    }

    //vrátime rodičovský element
    return element.parentElement;
};

/**
 * Funkcia vráti rodičovské elementy elementu na vstupe alebo []
 *
 * @param {Object} 		params - parametre funkcie
 * @param {Element}		params.element - element ktorému sa hladájú rodičovské elementy
 * @param {String=""}	params.condition - podmienka pre rodičovksé elementy ktoré sa majú vrátiť
 * @param {String=""}	params.finish - podmienka rodičovký element po ktorý sa má hladať
 * @param {Number=0}	params.limit- maximálne počet elementov kolko sa má nájsť alebo 0 ak hladáme všetky
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
 * @param {Object} 		params - parametre funkcie
 * @param {Element}		params.element - element ktorému sa hladájú rodičovské elementy
 * @param {String=""}	params.condition - podmienka pre rodičovksé elementy ktoré sa majú vrátiť
 * @param {Function}	params.operation - funkcia ktorou sa dostaneme k dalšiemu elementu
 * @param {String=""}	params.finish - podmienka rodičovký element po ktorý sa má hladať
 * @param {Number=0}	params.limit- maximálne počet elementov kolko sa má nájsť alebo 0 ak hladáme všetky
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
 * Funkcia nastavý alebo pridá obsah elementu
 *
 * @param {Element}			element
 * @param {String}			text
 * @param {Boolean=false}	append = false
 * @returns {String|Element}
 */
G.text = function(element, text, append = false){
    //ak prvý parameter nieje element
    if(!G.isElement(element)) {
        G.warn("G.text: prvý parameter element{Element} je: ", element);
        return "";
    }

    //ak druhý parameter nieje string tak vrátime text
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
 * @param {Element}			element
 * @param {Element|String}	html
 * @param {Boolean=false}	append = true
 * @returns {String|Element}
 */
G.html = function(element, html, append = false){//testovane 29.1.2017

    //ak prvý parameter nieje element
    if(!G.isElement(element)) {
        G.warn("G.html: prvý parameter element{Element} je: ", element);
        return "";
    }

    //ak druhý parameter nieje string
    if(!G.isString(html)) {
        return element.innerHTML;
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
 * Funkcia vráti dalšieho surodenca elementu
 *
 * @param {Object} 		params - parametre funkcie
 * @param {Element}		params.element - element ktorému sa hladájú rodičovské elementy
 * @param {String=""}	params.condition - podmienka pre rodičovksé elementy ktoré sa majú vrátiť
 * @param {String=""}	params.finish - podmienka rodičovký element po ktorý sa má hladať
 * @param {Number=0}	params.limit- maximálne počet elementov kolko sa má nájsť alebo 0 ak hladáme všetky
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
 * @param {Object} 		params - parametre funkcie
 * @param {Element}		params.element - element ktorému sa hladájú rodičovské elementy
 * @param {String=""}	params.condition - podmienka pre rodičovksé elementy ktoré sa majú vrátiť
 * @param {String=""}	params.finish - podmienka rodičovký element po ktorý sa má hladať
 * @param {Number=0}	params.limit- maximálne počet elementov kolko sa má nájsť alebo 0 ak hladáme všetky
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

/**
 * Funkcia vráti pole deti elementu na vstupe
 *
 * @param {Element}		element - element ktorého deti sa majú vrátiť
 * @param {String=""}	condition - podmienka pre deti ktoré sa majú vrátiť
 * @returns {Element[]} - pole elementov detí elebo prázdne pole ak element nemá žiadne deti
 */
G.childrens = function(element, condition = ""){
    //ak nieje podmienka vyhladavanie nieje string alebo je prázdny string tak ho nastavíme na predvolený
    if(!G.isString(condition) || G.isEmpty(condition)){
        condition = "*";
    }
    let result = [];
    if(!G.isElement(element)){
        G.warn("G.childrens: prvý paramter element{Element} je: ", element);
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
 * @deprecated od 29.1.2017 - použiť G.childrens
 * @param element
 * @param condition
 * @returns {Element[]}
 */
G.children = function(element, condition = "*"){//testovane 28.1.2017
    return G.childrens(element, condition);
};

/**
 * Funkcia vymaže element na vstupe
 *
 * @param {Element}	element - element ktorý sa má vymazať
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

/*************************************************************************************
 FUNKCIE NA UPRAVU G ELEMENTU
 *************************************************************************************/

/**
 * Funcia zistí čí prví element spĺňa podmienku
 *
 * @param {String}	selectorString - podmienka ktorú musí element splniť
 * @return {Boolean} - či objekt spĺňa podmienku alebo null ak sa žiadny objekt nenachádza alebo je zlý selector
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
 * @param {String}	selectorString - paramter ktorý sa negovaný porovná s elementom
 * @returns {G} - či objekt spĺna podmienku
 */
G.prototype.not = function(selectorString){
    return this.has(":not(" + selectorString + ")");
};

/**
 * Funkcia vráti G objekt obsahujúci elementy s pôvodného objektu
 * ktoré spĺnajú podmienku danú ako parameter
 *
 * @param {String}	selectorString - podmienka podla ktorého sa vyberajú vhodné elementy
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
 * @param {Element[]|String[]}	args - objekty ktoré sa majú pridať
 * @returns {G} - G objekt
 */
G.prototype.add = function(...args){//testovane 21.2.2017
    G.each(args, (e, i) => {
        if(G.isElement(e)){
            this.elements[this.elements.length] = e;
        }
        else if(G.isString(e)){
            this.elements.push.apply(this, G.find(e));
        }
        else{
            G.warn("G.prototype.add: parametre funkcie: (Element[]|String[]), " + i +" -ty argument: ", e);
        }
    });
    return this;
};

/**
 *
 * @param   {String}selectorString
 * @returns {G}
 */
/*
 G.prototype.find = function(selectorString){
 let result = new G();
 if(this.isEmpty()){
 return result;
 }
 const elements = G.find(selectorString, this.first());
 G.each(elements, e => result.add(e));
 return result;
 };
 /*

 /**
 * Funkcia vymaže všetky objekty na vstupe
 *
 * @param {Element[]}	arguments
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
 * @param {G|Element[]}	obj - G objekt s ktorým sa má porovnať
 * @returns {Boolean}
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
 * @param {Element}	element
 * @returns {Boolean}
 */
G.prototype.contains = function(element){//testovane 21.2.2017
    if(!G.isElement(element)){
        G.warn("G.prototype.contains: prvý paramter element{Element} je: ", element);
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
 * @param {Element|G}	element
 * @returns {Boolean}
 */
G.prototype.equal = function(element) {
    if (G.isG(element)){
        return this.first() === element.first();
    }
    else if (G.isElement(element)){
        return this.first() === element;
    }
    else{
        G.warn("G.prototype.equal: prvý parameter element{Element|G} je ", element);
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
 * @param {String=""}	selectorString
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
 * @param {String=""}	selectorString
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
 * @param {String}	selectorString
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
 * @param {String=""}	selectorString
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
 * @param {String=""}	selectorString
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
 * @param {String=""}	selectorString
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
 * @param {String=""}	selectorString
 * @returns {G}
 */
G.prototype.prevUntil = function(selectorString = ""){//TODO otestovať
    return new G(G.prev({
        element: this.first(),
        finish: selectorString
    }));
};

/**
 * @deprecated od 11.2.2017 - použiť G.prototype.childrens
 * @param {String=""}	selectorString
 * @returns {G}
 */
G.prototype.children = function(selectorString = ""){
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

/**
 * Funkcia vráti prvý element z G objektu
 */
G.prototype.first = function(){//testovane 29.1.2017
    return this.elements[0];
};

/**
 * Funkcia vráti počet elementov v G objekte
 *
 * @returns {Number} - počet elementov v G objekte
 */
G.prototype.length = function(){//testovane 29.1.2017
    return this.elements.length;
};

/**
 * Funkcia vráti true ak je G objekt prázdny ináč vráti false
 *
 * @returns {Boolean}
 */
G.prototype.isEmpty = function(){//testovane 29.1.2017
    return this.length() === 0;
};

/**
 * Funkcia zavolá callback pre každý jeden element
 *
 * @param {Function}    func - callback ktorý sa zavolá pre každý jeden element
 * @param {*[]}         args - argument callbacku
 * @returns {G}
 */
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
 * @param {Element|G} data
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
        G.warn("G.prototype.prependTo: prvý parameter data{Element|G} je: ", data);
    }
    return this;
};

/**
 *
 * @param {Element|G} data
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
        G.warn("G.prototype.appendTo: prvý parameter data{Element|G} je: ", data);
    }

    return this;
};

/**
 *
 * @param {Element|G} data
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
        G.warn("G.prototype.prepend: prvý parameter data{Element|G} je: ", data);
    }
    return this;
};

/**
 * funkcia pridá text, objekt alebo G objekt na začiatok prvého elementu
 *
 * @param {Element|G} data - objekt ktorý sa má pridať
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
        G.warn("G.prototype.append: prvý parameter data{Element|G} je: ", data);
    }

    return this;
};

/**
 *
 * @param {Function}	func
 * @param {Number=0}	delay
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
 * @param {String}			text
 * @param {Boolean=False}	append
 * @returns {String|G}
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
 * @param {(String|Element)=}	html
 * @returns {Element|G}
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

//TODO select, selectAll

/**
 *
 * @param {Element}         element
 * @param {String|String[]} name
 * @param {Boolean}         force
 * @returns {boolean}
 */
G.class = function(element, name, force){
    if(G.isArray(name)){
        G.each(name, e => G.class(element, e, force));
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

/**
 * class("nazov") - vrati true ak ma objekt danú triedu ináč vrát false
 * class("+nazov") - pridá objektu danú triedu
 * class("-nazov") - odstráni objektu danú triedu
 * class("/nazov") - pridá objektu danú triedu ak neexistuje ináč ju odstráni
 *
 * @param {String} 	name - názov triedy
 * @param {Boolean}	force - hodnota pri toggleovaní triedy
 * @returns {G|Boolean}
 */
G.prototype.class = function(name, force){//testovane 28.1.2017
    let result = G.class(this.first(), name, force);
    return G.isUndefined(result) ? this : result;
};

/**
 * Funkcia nastavý alebo vráti štýl emenetu poprípade vráti všetky štýli elementu
 *
 * @param {Element}                 element
 * @param {String|String[]|Object}  args
 * @returns {*}
 */
G.css = function(element, ...args){
    if(!G.isElement(element)){
        G.warn("G.css: prvý parameter element{Element} je:", element);
        return;
    }

    //ak je 0 parametrov vráti objekt z CSS štýlmi
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

    //ak je prvý parameter string
    if(G.isString(args[0])){
        //a druhý parameter je zadaný a dá sa prepísať na string nastav štýl
        if(args.length === 2 && G.isString(args[1])){
            element.style[args[0]] = args[1];
        }
        //ak prvý parameter neobsahuje symbol pre vymazanie tak vráť hodnotu štýlu
        else if(args[0][0] !== "-"){
            return element.style[args[0]];
        }
        //ináč štýl odstráň
        else{
            element.style[args[0].substring(1)] = "";
        }
    }
    //ak je prvý parameter objekt nastav všetky štýli podla objektu
    else if(G.isObject(args[0])){
        G.each(args[0], (e, i) => {
            if(G.isString(i) && G.isString(e)){
                element.style[i] = e;
            }
        });
    }
};

/**
 * css() - vráti všetky nastavené CSS štýly;
 * css("nazov") - vráti hodnotu CSS štýlu;
 * css("-nazov") - vymaža daný CSS štýl;
 * css("nazov", "hodnota") - nastavý danému CSS štýlu hodnotu;
 * css({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým CSS štýlom hodnoty;
 *
 * @param {Object|String} key
 * @param {String=} value
 * @returns {G|element}
 */
G.prototype.css = function(key, value){//testovane 29.1.2017
    const result = G.css(this.first(), key, value);
    return G.isUndefined(result) ? this : result;
};

/**
 * Funkcia nastavý alebo vráti atribút elementu poprípade vráti všetky atribúty elementu
 *
 * @param {Element}                         element
 * @param {String|Object|String[]|} arg
 * @returns {*}
 */
G.attr = function(element, ...arg){
    if(!G.isElement(element)){
        G.warn("G.attr: prvý parameter element{Element} je:", element);
        return;
    }

    //ak je 0 parametrov vráti objekt z atribútmi
    if(arg.length === 0){
        let result = {};
        //prejde všetky atribúty elementu a pridá ich do výsledku
        G.each(element.attributes, e => {
            result[e.nodeName] = e.nodeValue;
        });
        return result;
    }

    //ak je prvý parameter string
    if(G.isString(arg[0])){
        //a druhý parameter je zadaný a dá sa prepísať na string nastav štýl
        if(arg.length === 2 && G.isString(arg[1])){
            element.setAttribute(arg[0], arg[1]);
        }
        //ak prvý parameter obsahuje symbol pre vymazanie tak vymaž atribút
        else if(arg[0][0] === "-"){
            element.removeAttribute(arg[0].substring(1));
        }
        //ináč vrá atribút
        else{
            return element.getAttribute(arg[0]);
        }
    }
    //ak je prvý parameter objekt nastav všetky štýli podla objektu
    else if(G.isObject(arg[0])){
        G.each(arg[0], (e, i) => {
            if(G.isString(i) && G.isString(e)){
                element.setAttribute(i, e);
            }
        });
    }
    else{
        G.warn("G.attr: druhý parameter key{String|Object} je: ", arguments[0]);
    }
};

/**
 * attr() - vráti všetky atribúty;
 * attr("nazov") - vráti hodnotu atribútu;
 * attr("-nazov") - vymaža daný atribút;
 * attr("nazov", "hodnota") - nastavý danému atribútu hodnotu;
 * attr({"nazov1": "hodnota1", "nazov2" : "hodnota2"}) - nastavý všétkým atribútom hodnoty;
 *
 * @param {String|Object}	key
 * @param {String=}			value
 * @returns {G|Object|String}
 */
G.prototype.attr = function(key, value){//testovane 29.1.2017
    let result = G.attr(this.first(), key, value);
    return G.isUndefined(result) ? this : result;
};

/**
 * LISTENERS
 */

/**
 * Funkcia upravý listener na elemente
 *
 * @param {Element}		element
 * @param {String}		listener
 * @param {Function}	func
 * @param {String}		type
 * @returns {Element}
 * @private
 */
G._modifyListener = function(element, listener, func, type){//testovane 29.1.2017
    let allowedListeners = ["click", "blur", "submit", "focus", "scroll", "keydown", "keyup", "dblclick"];

    //ak element ktorý sa ide modifikovať nieje element tak skončíme
    if(!G.isElement(element)){
        G.warn("G._modifyListener: prvý parameter element{Element} je", element);
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
 * @param {String}		listener
 * @param {Function}	func
 */
G.prototype.undelegate = function(listener, func){//TODO otestovať
    this.unbind(listener, func);
};

/**
 * Funkcia bindne k elementu listener na počúvanie udalosti u všetkých deťoch
 *
 * @param {String}		condition - selector ktorým vyberie deti pri ktorých sa má zavolať funkcia
 * @param {String}		listener
 * @param {Function}	func
 * @returns {G}
 */
G.prototype.delegate = function(condition, listener, func){//TODO otestovať
    if(!G.isString(condition)){
        G.warn("G.prototype.delegate: prvy parameter contidion{String} je ", condition);
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
 * @param {String}		listener - typ listeneru o aký sa jedná
 * @param {Function}	func - funkcia ktorá sa má udiať pri udalosti
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
 * @param {String}		listener - typ listeneru o aký sa jedná
 * @param {Function}	func - funkcia ktorá sa má udiať pri udalosti
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

/**
 * Funkcia vráti relatívnu pozícii elementu vzhladom k lavému hornému okraju stránky
 *
 * @param {Element}	element
 * @returns {Object}
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
        G.warn("G.position: prvý parameter element{Element} je:", element);
    }

    return {
        y: top,
        x: left
    };
};

/**
 * Funkcia vráti počet pixelov od lavého okraja stránky
 *
 * @param {Element} element
 * @returns {Number}
 */
G.left = function(element){//testovane 29.1.2017
    return G.position(element).left;
};

/**
 * Funckia vráti počet pixelov od horného okraja stránky
 *
 * @param {Element} element
 * @returns {Number}
 */
G.top = function(element){//testovane 29.1.2017
    return G.position(element).top;
};

/**
 * Funckia vráti velkosť elementu
 *
 * @param {Element}	element
 * @returns {Object}
 */
G.size = function(element){//testovane 29.1.2017
    if(!G.isElement(element)){
        G.warn("G.size: prvý parameter element{Element} je: ", element);
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
 * @param {Element} element
 * @returns {Number}
 */
G.width = function(element){//testovane 26.1.2017
    return G.size(element).width;
};

/**
 * Funkcia vráti výšku elementu
 *
 * @param {Element} element
 * @returns {Number}
 */
G.height = function(element){//testovane 26.1.2017
    return G.size(element).height;
};


let GO = function(element){
    "use strict";
    let makeGO = function(target){
        if(!G.isElement(target) || target.setGO === true){
            return target;
        }
        target.setGO = true;
        target.parent = () => makeGO(target.parentElement);
        target.delete = () => target.parentElement.removeChild(target);
        target.prev = () => makeGO(target.previousSibling);
        target.next = () => makeGO(target.nextSibling);

        target.text = () => {
            return {
                get: () => target.textContent,
                set: content => {
                    if(!G.isString(content)){
                        G.warn("Argument[content] musí byť typu string a teraz je ", content);

                    }
                    target.textContent = content;
                    return target;
                },
                add: content => {
                    if(!G.isString(content)){
                        G.warn("Argument[content] musí byť typu string a teraz je ", content);
                        return;
                    }
                    target.textContent += content;
                    return target;
                },
                clear: () => {
                    target.textContent = "";
                    return target;
                }
            };
        };
        target.attr = name => {
            if(!G.isString(name)){
                G.warn("Argument[name] musí byť typu string a teraz je ", name);
                return target;
            }
            return {
                set: value => {
                    target.setAttribute(name, value);
                    return target;
                },
                get: () => target.getAttribute(name),
                remove: () => {
                    target.removeAttribute(name);
                    return target;
                }
            };
        };
        target.css = function(name){
            if(!G.isString(name)){
                G.warn("Argument[name] musí byť typu string a teraz je ", name);
                return target;
            }
            return {
                set: value => {
                    target.style[name] = value;
                    return target;
                },
                get: () => target.style[name],
                remove: () => {
                    target.style[name] = null;
                    return target;
                }
            };
        };
        target.class = function(name){
            if(!G.isString(name)){
                G.warn("Argument[name] musí byť typu string a teraz je ", name);
                return;
            }
            return {
                add: () => {
                    target.classList.add(name);
                    return target;
                },
                has: () => target.classList.has(name),
                remove: () => {
                    target.classList.remove(name);
                    return target;
                },
                toggle: (force = false) => target.classList.toggle(name, force)
            };
        };
        return target;
    };

    if(!G.isElement(element)) {
        G.warn("Argument[element] musí byť element a teraz je:", element);
    }
    else{
        makeGO(element);
    }
    return element;
};


G.create = {
    table: function(args){

    },
    input: function(argument){
        let data = {
            name: "input"
        };
        return {
            text: function(args = {}){
                let attributes = {type: "text"};
                if(args.placeholder){attributes.placeholder = args.placeholder;}
                if(args.onchange){attributes.onchange = args.onchange;}
                if(args.value){attributes.value = args.value;}
                if(args.class){attributes.class = args.class;}
                if(args.name){attributes.name = args.name;}
                if(args.id){attributes.id = args.id;}
                data.attr = attributes;
                return G.createElement(data);
            }
        };
    }
};

G.object = function(element){
    "use strict";
    if(!G.isElement(element)){
        G.warn("Argument[element] musí byť element a teraz je:", element);
    }
    return {
        delete: () => element.parentElement.removeChild(element),
        parent: () => element.parentElement,
        prev: () => element.previousSibling,
        next: () => element.nextSibling,
        text: () => {
            return {
                get: () => element.textContent,
                set: content => element.textContent = content,
                add: content => element.textContent += content,
                clear: () => element.textContent = ""
            };
        },
        attr: name => {
            return {
                set: value => element.setAttribute(name, value),
                get: () => element.getAttribute(name),
                remove: () => element.removeAttribute(name)
            };
        },
        css: name => {
            return {
                set: value => element.style[name] = value,
                get: () => element.style[name],
                remove: () => element.style[name] = null
            };
        },
        class: name => {
            return {
                add: () => element.classList.add(name),
                has: () => element.classList.has(name),
                remove: () => element.classList.remove(name),
                toggle: (force) => element.classList.toggle(name, force)
            };
        }
    };
};
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