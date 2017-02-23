let data = (function(){
    //zoznam uložených objektov
    let items = {};

    //funkcia na bindnutie eventu k elementu
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

    //funkcia na unbindnutie eventu
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
            //funkcia na spracovanie getterov
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
            //funkcia na spracovanie setterov
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
        }
    );
})();