export class CanvasHandler{
    /**
     *
     * @param {String|Image|Number} arg1
     * @param {Number}              arg2
     * @param {Number}              arg3
     */
    constructor(arg1, arg2, arg3){
        if(typeof arg1 === "string"){
            this._canvas = document.getElementById(arg1);
            if(arg2 && arg3){
                CanvasHandler.setCanvasSize(this._canvas, arg2, arg3);
            }
        }
        else if(arg1 instanceof HTMLImageElement){//ARGUMENT JE OBRAZOK
            this._canvas = CanvasHandler.imageToCanvas(arg1);
            CanvasHandler.setCanvasSize(this._canvas, arg1.width, arg1.height);
        }
        else{
            this._canvas = document.createElement("canvas");

            if(arg1 && arg2){//ARGUMENTY SU VELKOST
                this.setCanvasSize(arg1, arg2);
            }
        }
        this._context = this._canvas.getContext("2d");
    }

    get canvas(){return this._canvas;}
    get context(){return this._context;}
    getImage(){return CanvasHandler.canvasToImage(this._canvas);}

    /**
     * Funcia nastaví tieň canvasu
     *
     * @param {Number} x - offset X
     * @param {Number} y - offset Y
     * @param {String} color - farba tieňa
     * @param {Number} blur - rozmazanie tieňa
     */
    setShadow(x, y, color, blur){
        CanvasHandler.setShadow(this._context, x, y, color, blur);
    }

    /**
     * Funkcia otvorí canvas ako obrázov v novom okne
     *
     * @param {String} format - formát obrázku v ktorom sa má canvas otvoriť
     */
    show(format = "image/png"){
        //window.open(this._canvas.toDataURL(format), '_blank');
        CanvasHandler.showCanvas(this._canvas, format);
    }

    /**
     * Funkcia vymaže všetko z canvasu
     */
    clearCanvas(){
        CanvasHandler.clearCanvas(this._context);
    }

    /**
     * Funkcia nastaví šrafovanie čiar
     *
     * @param {Number[]} args - pole určujúce kolo pixelov sa kreslí čiara a koľko nie
     */
    setLineDash(args){
        CanvasHandler.setLineDash(this._context, args);
    }

    /**
     * Funkcia nastaví velkosť canvasu
     * @param {Number=} width  - šírka canvasu
     * @param {Number=} height - výška canvasu
     */
    setCanvasSize(width = window.innerWidth, height = window.innerHeight){
        CanvasHandler.setCanvasSize(this._canvas, width, height);
    }

    /**
     * Funckia pridá canvas do elementu
     *
     * @param {Element} element
     */
    appendTo(element){
        element.appendChild(this._canvas);
    }

    /**
     * Vyčistí context canvasu
     *
     * @param {Element} ctx             - context ktorý sa má vyčistiť
     * @param {Function} ctx.clearRect  - context ktorý sa má vyčistiť
     */
    static clearCanvas(ctx){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     * Nataví velkosť canvasu
     *
     * @param {Element} canvas          - canvas ktorému sa má zmeniť velkosť
     * @param {Number} canvas.width     - canvas ktorému sa má zmeniť velkosť
     * @param {Number} canvas.height    - canvas ktorému sa má zmeniť velkosť
     * @param {Number}  width           - nová širka canvasu
     * @param {Number}  height          - nová výška canvasu
     */
    static setCanvasSize(canvas, width, height){
        canvas.width = width;
        canvas.height = height;
    }

    static setShadow(ctx, x = 0, y = 0, color = "#000000", blur = 0){
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
    }

    /**
     * Vytvorí nový canvas z obrázku
     *
     * @param {Image} image - obrázok podla ktorého sa má vytvoriť canvas
     * @returns {Element} - canvas vytvorený podla obrázku
     */
    static imageToCanvas(image){
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas;
    }

    /**
     * Zobrazí canvas ako obrázok v novom okne
     *
     * @param {Element} canvas - canvas ktorý sa má zobraziť
     * @param {String=} format - formát obrázku v ktorom sa má canvas zobraziť
     */
    static showCanvas(canvas, format = "image/png"){
        window.open(canvas.context.toDataURL(format), '_blank');
    }

    /**
     * Nastaví šrafovanie contextu
     *
     * @param {Element}  ctx             - context ktorému sa má nastaviť šrafovanie
     * @param {Function} ctx.setLineDash - funkcia na nastavenie šrafovania
     * @param {Number[]} args            - pole určujúce kolo pixelov sa kreslí čiara a koľko nie
     */
    static setLineDash(ctx, args){
        //TODO otestovať;
        if(typeof ctx.setLineDash === "function"){
            ctx.setLineDash(args);
        }
    }

    /**
     * Funkcia vyráta šírku textu na základe velkosti textu, textu a fontu
     *
     * @param {Element}  ctx             - context v ktorom sa má vyrátať širka textu
     * @param {String}   ctx.font        - atribút určujúci typ fontu
     * @param {Function} ctx.measureText - funkcia na vypočítanie šírky textu
     * @param {String}   text            - text ktorého šírka sa má vyrátať
     * @param {String}   font            - font ktorý je nastaevný
     * @returns {Number}
     */
    static calcTextWidth(ctx, text, font = "10px sans-serif"){
        if(font){
            ctx.font = font;
        }
        return ctx.measureText(text).width;
    }

    /**
     * Funkcia vytvorí obrázok z canvasu
     *
     * @param {Element} canvas            - canvas ktorý sa má uločiť do obrázku
     * @param {Function} canvas.toDataURL - funkcia na vytvorenie obrázku
     * @param {String}  format            - formát obrázku do ktorého sa má canvas uložiť
     * @returns {Image}
     */
    static canvasToImage(canvas, format = "image/png"){
        let image = new Image();
        image.src = canvas.toDataURL(format);
        image.width = canvas.width;
        image.height = canvas.height;
        return image;
    }
}