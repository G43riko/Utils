/**
 * Created by gabriel on 16.5.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */

import G from "g.core.js";

let Obj = function(){
    //ak sa nevolá ako konštruktor
    if(!(this instanceof G)){
        let inst = Object.create(G.prototype);
        G.apply(inst, arguments);
        return inst;
    }
    if(arguments.length === 0){
        this.elements = [];
    }
    else if(arguments.length === 1){
        if(G.isString(arguments[0])){ //query selector
            this.elements = G.find(arguments[0]);
        }
        else if(G.isArray(arguments[0])){ //pole elementov
            this.elements = [];
            G.each(arguments[0], e => {
                if(G.isElement(e)){
                    this.elements[this.elements.length] = e;
                }
            });
        }
        else if(G.isElement(arguments[0])){ //HTML Element
            this.elements = [arguments[0]];
        }
        else if(arguments[0] !== null && G.isDefined(arguments[0]) && G.isG(arguments[0])){ //G Object
            this.elements = arguments[0].elements;
        }
    }
    else if(arguments.length === 2 && G.isString(arguments[0]) && G.isObject(arguments[1])){
        this.elements = [G.createElement(arguments[0], arguments[1].attr, arguments[1].cont, arguments[1].style)];
    }

    //ak nieje definované pole elementov upozorníme používatela a vytvoríme ho
    if(G.isUndefined(this.elements)){
        G.warn("nepodarilo sa rozpoznať argumenty: ", arguments);
        this.elements = [];
    }
    //ak zoznam elementov nieje pole tak vytvoríme pole a upozorníme používatela
    if(!G.isArray(this.elements)){
        G.warn("elementy niesu pole ale " + G.typeOf(this.elements), arguments);
        this.elements = [];
    }
    this.size = this.length();
};


/**
 * Funcia zistí čí prví element spĺňa podmienku
 *
 * @param selectorString - podmienka ktorú musí element splniť
 * @return boolean - či objekt spĺňa podmienku alebo null ak sa žiadny objekt nenachádza alebo je zlý selector
 */

Obj.prototype.is = function(selectorString){//testovane 28.1.2017
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
Obj.prototype.not = function(selectorString){
    return this.has(":not(" + selectorString + ")");
};

/**
 * Funkcia vráti G objekt obsahujúci elementy s pôvodného objektu
 * ktoré spĺnajú podmienku danú ako parameter
 *
 * @param selectorString - podmienka podla ktorého sa vyberajú vhodné elementy
 * @returns {G} - G objekt
 */
Obj.prototype.has = function(selectorString){
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
Obj.prototype.add = function(){//testovane 21.2.2017
    G.each(arguments, (e, i) => {
        if(G.isElement(e)){
            this.elements[this.elements.length] = e;
        }
        else if(G.isString(e)){
            this.elements.push.apply(this, G.find(e));
        }
        else{
            G.warn("argumenty funkcie: (string[]), " + i +" -ty argument: ", e);
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
Obj.prototype.remove = function(){//testovane 21.2.2017
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
Obj.prototype.clear = function(){//testovane 21.2.2017
    this.elements = [];
    return this;
};

/**
 * Funckia porovná 2 G objekty či majú všetky prvky rovnaké
 *
 * @param obj - G objekt s ktorým sa má porovnať
 * @returns {boolean}
 */
Obj.prototype.equalAll = function(obj){//testovane 21.2.2017
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
Obj.prototype.contains = function(element){//testovane 21.2.2017
    if(G.isElement(element)){
        for(let i=0 ; i<this.elements.length ; i++){
            if(this.elements[i] === element){
                return true;
            }
        }
    }
    else{
        G.warn("argument funkcie musí byť element a teraz je: ", element);
    }

    return false;
};

/**
 * Funcka porovná či sa G objekt zhoduje s parametrom čo je buď G objekt alebo element
 *
 * @param element
 * @returns {boolean}
 */
Obj.prototype.equal = function(element) {
    if (G.isG(element)){
        return this.first() === element.first();
    }
    else if (G.isElement(element)){
        return this.first() === element;
    }
    else{
        G.warn("argument funkcie môže byť iba element alebo G objekt");
    }
    return false;
};


