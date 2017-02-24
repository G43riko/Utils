/**
 * Created by gabriel on 24.2.2017.
 */
class CanvasManager{
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


    get canvas(){return this._canvas;}
    get context(){return this._context;}

    setShadow(x, y, color, blur){
        CanvasManager.setShadow(this._context, x, y, color, blur);
    }

    show(format = "image/png"){
        window.open(this._canvas.toDataURL(format), '_blank');
    }

    clear(){
        CanvasManager.clearCanvas(this._context);
    }

    setCanvasSize(width = window.innerWidth, height = window.innerHeight){
        CanvasManager.setCanvasSize(this._canvas, width, height);
    }

    appendTo(element){
        element.appendChild(this._canvas);
    }

    /***************************************STATIC***************************************/

    static clearCanvas(ctx){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    static setCanvasSize(c, width = window.innerWidth, height = window.innerHeight){
        c.width = width;
        c.height = height;
    }

    static setShadow(ctx, x, y, color, blur){
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
    }

    static imageToCanvas(image){
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas;
    }

    static setLineDash(ctx, ...args){
        ctx.setLineDash(args);
    }

    static calcTextWidth(ctx, value, font = false){
        if(font){
            ctx.font = font;
        }
        return ctx.measureText(value).width;
    }

    static canvasToImage(canvas, format = "image/png"){
        let image = new Image();
        image.src = canvas.toDataURL(format);
        image.width = canvas.width;
        image.height = canvas.height;
        return image;
    }
}