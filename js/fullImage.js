/**
 * Created by gabriel on 23.2.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 * @type {{bind, cleanUp}}
 */
let imageManipulator = (function(){
    "use strict";
    let loaded          = false;
    let init            = false;
    let g_background    = null;
    let g_image         = null;
    let elements        = null;
    let onKeyDown       = null;
    let waitingArg      = undefined;
    let def = {
        duration: 1000,
        offset: 40,
        radius: 10,
        borderColor: "white",
        keyClose : 27,
        keyNext : 39,
        keyPrev : 37,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        imageBorderWidth : 1,
        imageBackground: "white",
        imageShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    };

    /**
     * Funkcia na zobrazenie obrázku
     *
     * @param element
     * @param index
     */
    function showImage(element, index){
        new G(g_image).attr({
            src : element.src,
            act_index: index
        });

        let background = new G(g_background).css("display", "block");
        background.delay(() => background.css("opacity", "1"));
    }

    function imageListener(){
        showImage(this, this.getAttribute("l_index"));
    }

    /**
     * Funckia na načítanie externých knižníc
     *
     * @param url
     * @param callback
     */
    function loadScript(url, callback){
        let script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                if(typeof callback === "function"){
                    callback();
                }
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    //načítanie GQuery
    loadScript("https://rawgit.com/G43riko/Utils/master/Components/G/g.js", () => {
        loaded = true;
        //ak sa volalo pred načítaním tak zavolá znovu
        if(typeof waitingArg !== "undefined"){
            initImages(waitingArg);
        }
    });

    /**
     * Inicializácia celého modulu
     *
     * @param data
     */
    function initImages(data = {}){
        if(init){
            alert("nemôžu sa viac krát bindúť obrázky.\nNajprv ich odbindni!");
            return;
        }
        elements = document.querySelectorAll(data.query || "img");
        let backgroundColor   = data.backgroundColor || def.backgroundColor;
        let duration          = isNaN(data.duration) ? def.duration : data.duration;
        let imageBorderWidth  = isNaN(data.borderWidth) ? 1 : data.borderWidth;
        let imageOffset       = isNaN(data.offset) ? def.offset : data.offset;
        let imageRadius       = isNaN(data.radius) ? def.radius : data.radius;
        let imageBackground   = data.imageBackground || def.imageBackground;
        let imageBorderColor  = data.borderColor || def.borderColor;
        let imageShadow       = data.imageShadow || def.imageShadow;
        let keyClose          = data.keyClose || def.keyClose;
        let keyNext           = data.keyNext || def.keyNext;
        let keyPrev           = data.keyPrev || def.keyPrev;

        function hideImage(image = g_background){
            if(image.isHiding !== true  && typeof image.act_index === "undefined" ){
                image.isHiding = true;
                image.style.opacity = 0;
                setTimeout(() => {
                    image.style.display = "none";
                    image.isHiding = false;
                }, duration);
            }
        }


        onKeyDown = function(e){
            if(e.keyCode === keyClose){
                hideImage();
            }
            if(e.keyCode === keyNext){
                showNextImage();
            }
            if(e.keyCode === keyPrev){
                showPrevImage();
            }
        };

        //pridáme key listenery na window
        window.addEventListener("keydown", onKeyDown);

        /**
         * Funckia na inicializáciu pozadia
         *
         */
        function initBackground(){
            let result = new G("div", {
                style : {
                    display: "none",
                    position: "fixed",
                    opacity: "0",
                    zIndex: "1000",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    transition: "all " + duration + "ms",
                    backgroundColor: backgroundColor
                }
            }).appendTo(document.body).click(function(e){
                if(e.target === this){
                    hideImage(this);
                }
            });

            g_background = result.first();
            return result;
        }

        /**
         * Funkcia na inicializáciu obrázku
         */
        function initImage(){
            let result = new G("img", {
                style: {
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    backgroundColor: imageBackground,
                    zIndex: "1100",
                    left: 0,
                    right: 0,
                    boxShadow: imageShadow,
                    maxWidth: "calc(100% - " + imageOffset + "px)",
                    maxHeight: "calc(100% - " + imageOffset + "px)",
                    opacity: 1,
                    cursor: "pointer",
                    margin: "auto",
                    overflow: "auto",
                    border: imageBorderWidth + "px solid " + imageBorderColor,
                    borderRadius: imageRadius + "px"
                }
            }).click(function(){showNextImage(this);}).appendTo(initBackground());
            g_image = result.first();
        }

        /**
         *
         * @param element
         */
        function showNextImage(element = g_image){
            let elem      = new G(element);
            let newIndex  = (parseInt(elem.attr("act_index")) + 1) % elements.length;
            element.src   = elements[newIndex].src;
            elem.attr("act_index", newIndex + "");
        }

        /**
         *
         * @param element
         */
        function showPrevImage(element = g_image){
            let elem      = new G(element);
            let newIndex  = (parseInt(elem.attr("act_index")) - 1) % elements.length;
            if(newIndex < 0){
                newIndex += elements.length;
            }
            element.src   = elements[newIndex].src;
            elem.attr("act_index", newIndex + "");
        }

        //prejdem všetky vyhovujúce elementy
        G.each(elements, (e, i) => {
            try{
                //ak je najdený element obrázok
                if(e.matches("img")){
                    e.setAttribute("l_index", i);
                    e.addEventListener("click", imageListener);
                    e.style.cursor = "pointer";
                }
            }
            catch(err){
                console.error(err);
            }
        });

        //inicializujeme pozadie a globálny obrázok
        initImage();

        //nastavíme flag že je všetko inicializované
        init = true;
    }

    return {
        /**
         * Funkcia na bindtunie listenerov a inicializácia modulu
         *
         * @param data
         */
        bind: function(data = {}){
            //ak nieje načítaný GQuery tak sa uloží argument do objektu
            if(!loaded){
                waitingArg = data;
            }
            //ináč sa zavolá inicializícia
            else{
                initImages(data);
            }
        },

        /**
         * Funkcia pre odpbindnutie všetkých listenerov
         */
        cleanUp(){
            if(!init){
                return;
            }

            //odstránim keylistener s windowu
            window.removeEventListener("keydown", onKeyDown);

            //vyčistím všetky elementy
            G.each(elemnts, e => {
                try{
                    e.removeAttribute("l_index");
                    e.removeEventListener("click", imageListener);
                    e.style.cursor = "auto";
                }
                catch(err){
                    console.error(err);
                }
            });
            //zmažem pozadie
            G.delete(g_background);

            //nastavíme všetky premenné na defaultné
            init          = false;
            g_background  = undefined;
            g_image       = undefined;
            elements      = undefined;
            onKeyDown     = undefined;

        }
    };
})();