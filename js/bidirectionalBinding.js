/**
 * Created by gabriel on 23.2.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */
let data = (function(){
    //zoznam uložených objektov
    let items = {};

    /**
     * funkcia na bindnutie eventu k elementu
     *
     * @param name
     * @param element
     * @param func
     * @returns {boolean}
     */
    let bind = function(name, element, func){
        //ak chcem vložiť atribút ktorého názov je funkcia tak vypíšem error a vrátim false
        if(name === "bind" || name === "get" || name === "unbind"){
            alert("neplatný názov");
            return false;
        }

        //uložím nový objekt s udajmi
        items["_" + name] = {
            el: element,
            func: func
        };

        //pridám listener
        element.addEventListener("input", func);
    };

    /**
     * Funkcia na unbindnutie eventu
     *
     * @param name
     * @returns {boolean}
     */
    let unbind = function(name){
        //pokúsim sa získať uložený objekt
        let data = items["_" + name];

        //ak sa mi to podarilo
        if(data){
            //odstránim listener
            data.el.removeEventListener("input", data.func);

            //a zmažem objekt
            delete items["_" + name];
        }

        //vrátim true ak sa našiel uložený objekt ináč vrátim false
        return typeof data === "object";
    };
    return new Proxy({}, {
        /**
         * Funkcia na spracovanie getterov
         *
         * @param target
         * @param name
         * @returns {*}
         */
        get: function(target, name) {
            if(name === "bind"){
                return bind;
            }
            if(name === "unbind"){
                return unbind;
            }
            //ináč sa pokúsim získať uložený objekt
            let item = items["_" + name];

            //ak sa ho podarilo získať tak vrátim jeho hodnotu ináč vrátim undefined
            return item ? item.el.value : undefined;
        },

        /**
         * Funkcia na spracovanie setterov
         *
         * @param target
         * @param name
         * @param value
         * @returns {string}
         */
        set: function(target, name, value) {
            //umožnuje bindnutie dalším spôsobom
            if(typeof value === "object"){
                if(typeof value.callback === "function" && typeof value.element === "object"){
                    bind(name, value.element, value.callback);
                    return "success";
                }
            }

            //pokúsim sa získať uložený objekt
            let item = items["_" + name];

            //ak taký existuje
            if(item){
                //nastavím mu hodnotu
                item.el.value = value;
            }
        }
    });
})();