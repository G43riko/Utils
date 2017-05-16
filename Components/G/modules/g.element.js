/**
 * Created by gabriel on 16.5.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */

let G = {};

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
    if(G.isElement(element)) {
        G.warn("prvý argument musí byť objekt a je: ", element);
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
        G.warn("Prvý agument[element] musí byť element a teraz je:", element);
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
        G.warn("Prvý agument[element] musí byť element a teraz je:", element);
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
        G.warn("prvý parameter musí byť String alebo objekt a je: ", arguments[0]);
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
        G.warn("argument musí byť element");
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