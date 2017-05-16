/**
 * Created by gabriel on 16.5.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */

let Utils = {};

Utils.createElement = function(name, attr, cont, style){
    let el;

    //ak je prvý parameter objekt tak zavoláme rekurzívne túto funkciu s hodnotami objektu
    if(G.isObject(name)){
        if(G.isString(name.name)){
            G.createElement(name.name, name.attr || {}, name.cont || "", name.style || {});
        }
        else{
            return G.warn("prví parameter funkcie[Object] musí obsahovať name[String] ale ten je: ", name.name);
        }
    }

    //Vytvoríme element podla názvu
    if(G.isString(name)){
        el = document.createElement(name);
    }
    else{
        return G.warn("prvý parameter(nazov elementu) musí byť string a je: ", name);
    }
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
 * Funkcia vráti posledný prvok pola ak existuje alebo undefined
 *
 * @param arr - pole ktorého posledný prvok potrebujeme
 * @returns {*} - posledný prvok alebo undefined
 */
Utils.last = function(arr){
    if(!G.isArray(arr)){
        return undefined;
    }

    if(arr.length === 0){
        return undefined;
    }

    return arr[arr.length - 1];
};

/**
 * Funkcia či sa prvok nachádza v poli alebo v zozname argumentov
 *
 * @param obj
 * @param data
 * @returns {boolean}
 */
Utils.isIn = function(obj, data){//testovane 8.1.2017
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
Utils.extend = function(target, ... args){
    if(G.isObject(target)){
        G.each(args, (e, i) => {
            if(G.isObject(e)){
                G.each(e, (ee, key) => target[key] = ee);
            }
            else{
                G.warn("args[" + i + "] ma byť object a je : ", e);
            }
        });
    }
    else{
        G.warn("prvý argument musí byť objekt. teraz je: ", target);
    }
    return target;
};

/**
 * Funkcia zistí či element spĺňa daný selector
 *
 * @param element
 * @param queryString
 * @returns {*}
 */
Utils.matches = function(element, queryString){
    //porovnám či element vyhovuje selectoru
    try{
        return element.matches(queryString);
    }
    catch(err){
        G.warn(err);
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
Utils.each = function(obj, func, thisArg){
    let i;
    if(G.isObject(obj) && G.isFunction(func)){
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
    }
    else{
        G.warn("argumenty majú byť (object, function) a sú:", obj, func);
    }
};

export {Utils};
