/**
 * Created by gabriel on 16.5.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */
import G from "g.core.js";

let DOM = {};

/**
 * Funkcia najde v rodičovnskom objekde objekty ktoré najde CSS selector
 *
 * @param queryString - klúč podla ktorého sa má hladať
 * @param parent - element v ktorom sa má hladadť. Defaultne je do document
 * @returns {Array} - pole nájdených výsledkov
 */
DOM.find = function(queryString, parent){//testovane 28.1.2017
    let result = [];

    //ak nieje zadaný parent alebo parent nieje element tak parent bude document
    if(!G.isElement(parent)){
        parent = document;
    }

    //ak queryString nieje String
    if(!G.isString(queryString)){
        G.warn("argument funkcie musí byť string a je ", queryString);
        return result;
    }

    //získame elementy a pridáme ich do pola
    let data = parent.querySelectorAll(queryString);
    G.each(data, e => result[result.length] = e);

    //vrátime výsledok
    return result;
};

/**
 * Funkcia vráti rodičovský element elementu na vstupe alebo null
 *
 * @param element - element ktorému sa hladá rodičovský element
 * @returns {Element} - rodičovský element alebo null ak sa nenašiel rodič
 */
DOM.parent = function(element){//testovane 28.1.2017
    //ak argument nieje element;
    if(!G.isElement(element)){
        G.warn("argument funcie musí byť element a teraz je: ", element);
        return null;
    }

    //vrátime rodičovský element
    return element.parentElement;
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
DOM.parents = function(params){//testovane 28.1.2017
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
DOM._iterate = function(params){
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
DOM.next = function (params){//testovane 28.1.2017
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
DOM.prev = function (params){//testovane 28.1.2017
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
 * @param element - element ktorého deti sa majú vrátiť
 * @param condition = "" - podmienka pre deti ktoré sa majú vrátiť
 * @returns {Element[]} - pole elementov detí elebo prázdne pole ak element nemá žiadne deti
 */

DOM.childrens = function(element, condition = "*"){
    if(!G.isString(condition) || G.isEmpty(condition)){
        condition = "*";
    }
    let result = [];
    if(G.isElement(element)){
        let data = element.children;
        G.each(data, element => {
            if(result.indexOf(element) < 0){//ak sa nenachádze medzi výsledkami
                if(G.matches(element, condition)){
                    result[result.length] = element;
                }
            }
        });
    }
    else{
        G.warn("argument funcie musí byť element a teraz je: ", element);
    }
    return result;
};

DOM.children = function(element, condition = "*"){//testovane 28.1.2017 //deprecated since 29.1.2017, poižiť G.childrens
    return G.childrens(element, condition);
};


/**
 * Funkcia vymaže element na vstupe
 *
 * @param element - element ktorý sa má vymazať
 */
DOM.delete = function(element){//testovane 21.2.2017
    //pokúsime sa získať rodičovy element;
    let parent = G.parent(element);

    //ak získaný rodič nieje element
    if(!G.isElement(parent)){
        G.warn("nepodarilo sa získať rodičovský element");
        return;
    }
    //zmažeme element
    parent.removeChild(element);
};

export {DOM};