/**
 * Created by gabriel on 24.2.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */
class CanvasManager{
    /**
     *
     * @param arg1
     * @param arg2
     * @param arg3
     */
    constructor(arg1, arg2, arg3){
        //ak je argument obrázov
        if(arg1 instanceof HTMLImageElement){
            this._canvas = CanvasManager.imageToCanvas(arg1);
        }
        //ak je argument canvas
        else if(arg1 instanceof HTMLCanvasElement){
            this._canvas = arg1;

            //ak su nastavené argumenty tak sa nastaví velkosť
            if(arg2 && arg3){
                this.setCanvasSize(arg1, arg2);
            }
        }
        //ak sú argumenty velkosť
        else{
            this._canvas = document.createElement("canvas");

            //ak su nastavené argumenty tak sa nastaví velkosť
            if(arg1 && arg2){
                this.setCanvasSize(arg1, arg2);
            }
        }
        this._context = this._canvas.getContext("2d");
    }

    /**
     *
     * @returns {*|Element|HTMLCanvasElement}
     */
    get canvas(){return this._canvas;}

    /**
     *
     * @returns {CanvasRenderingContext2D|WebGLRenderingContext|*}
     */
    get context(){return this._context;}

    /**
     *
     * @param x
     * @param y
     * @param color
     * @param blur
     */
    setShadow(x, y, color, blur){
        CanvasManager.setShadow(this._context, x, y, color, blur);
    }

    /**
     *
     * @returns {{color: string, blur: Number, x: Number, y: Number}}
     * @constructor
     */
    get Shadow(){
        return {
            color : this._context.shadowColor,
            blur: this._context.shadowBlur,
            x: this._context.shadowOffsetX,
            y: this._context.shadowOffsetY
        }
    }

    /**
     *
     * @param format
     */
    show(format = "image/png"){
        window.open(this._canvas.toDataURL(format), '_blank');
    }

    /**
     *
     * @param color
     */
    clear(color = undefined){
        CanvasManager.clearCanvas(this._context, color);
    }

    /**
     *
     * @param width
     * @param height
     */
    setCanvasSize(width = window.innerWidth, height = window.innerHeight){
        CanvasManager.setCanvasSize(this._canvas, width, height);
    }

    /**
     *
     * @returns {{width: number, height: number}}
     */
    getCanvasSize(){
        return {
            width: this._canvas.width,
            height: this._canvas.height,
        }
    }

    /**
     *
     * @param element
     */
    appendTo(element){
        element.appendChild(this._canvas);
    }

    /***************************************STATIC***************************************/

    /**
     *
     * @param ctx
     * @param color
     */
    static clearCanvas(ctx, color){
        if(color){
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     *
     * @param c
     * @param width
     * @param height
     */
    static setCanvasSize(c, width = window.innerWidth, height = window.innerHeight){
        c.width = width;
        c.height = height;
    }

    /**
     *
     * @param ctx
     * @param x
     * @param y
     * @param color
     * @param blur
     */
    static setShadow(ctx, x, y, color, blur){
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
    }

    /**
     *
     * @param image
     * @returns {Element}
     */
    static imageToCanvas(image){
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas;
    }

    /**
     *
     * @param ctx
     * @param args
     */
    static setLineDash(ctx, ...args){
        ctx.setLineDash(args);
    }

    /**
     *
     * @param ctx
     * @param value
     * @param font
     * @returns {Number}
     */
    static calcTextWidth(ctx, value, font = false){
        if(font){
            ctx.font = font;
        }
        return ctx.measureText(value).width;
    }

    /**
     *
     * @param canvas
     * @param format
     * @returns {*}
     */
    static canvasToImage(canvas, format = "image/png"){
        let image = new Image();
        image.src = canvas.toDataURL(format);
        image.width = canvas.width;
        image.height = canvas.height;
        return image;
    }
}