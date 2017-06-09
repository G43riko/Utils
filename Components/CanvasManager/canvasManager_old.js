import "./canvasHander.js";

function isUndefined(val){return typeof val === "undefined";}
function isNumber(val){return typeof val === "number";}
function isDefined(val){return !isUndefined(val);}
function error(...msg){window.console.error.apply(window.console, msg);}
function isArray(val){return Object.prototype.toString.call(val) === "[object Array]";}
function _initDef(obj){
    let def = {
        borderWidth : DEFAULT_BORDER_WIDTH,
        borderColor : DEFAULT_BORDER_COLOR,
        ctx : context,
        fillColor : DEFAULT_FILL_COLOR,
        radius : {tl: 0, tr: 0, br: 0, bl: 0},
        shadow: false,
        lineCap: LINE_CAP_BUTT,
        center: false,
        startAngle: 0,
        endAngle: PI2,
        offset: null,
        joinType: LINE_JOIN_MITER,
        lineStyle: LINE_STYLE_NORMAL,
        lineType: JOIN_LINEAR,
        lineDash: [],
        bgImage: false
    };
    def.draw = isDefined(obj.borderColor) || isDefined(obj.borderWidth);
    def.fill = isDefined(obj.fillColor);

    return def;
}

function _checkPosAndSize(obj, name){

    if((isUndefined(obj.x) || isUndefined(obj.y)) && isUndefined(obj.position)){
        error(getMessage(MSG_TRY_DRAW_WITHOUT_POSITION, name));
    }

    if((isUndefined(obj.width) || isUndefined(obj.height)) && isUndefined(obj.size)){
        error(getMessage(MSG_TRY_DRAW_WITHOUT_SIZE, name));
    }

    if(obj.width <= 0 || obj.height <= 0){
        error(getMessage(MSG_TRY_DRAW_WITH_NEG_POSITION, name));
    }

    return glob._initDef(obj);
}

function _remakePosAndSize(def, obj){
    let res = $.extend(def, obj);

    if(isDefined(res.size)){
        if(isNumber(res.size)){
            res.width = res.size;
            res.height = res.size;
        }
        else if(isArray(res.size)){
            res.width = res.size[0];
            res.height = res.size[1];
        }
        else{
            res.width = res.size.x;
            res.height = res.size.y;
        }
    }

    if(isDefined(res.position)){
        if(isNumber(res.position)){
            res.x = res.position;
            res.y = res.position;
        }
        else if(isArray(res.position)){
            res.x = res.position[0];
            res.y = res.position[1];
        }
        else{
            res.x = res.position.x;
            res.y = res.position.y;
        }
    }

    if(res.center){
        res.x -= res.width >> 1;
        res.y -= res.height >> 1;
    }
    return res;
}

function _process(res){
    if(res.shadow && Project.options.shadows){
        setShadow(res.shadow);
    }
    if(res.bgImage){
        res.ctx.save();
        res.ctx.clip();
        if(res.bgImage instanceof HTMLImageElement){
            res.ctx.drawImage(res.bgImage, res.x, res.y, res.width, res.height);
        }
        else{
            res.ctx.drawImage(res.bgImage.img,
                res.bgImage.x,
                res.bgImage.y,
                res.bgImage.w,
                res.bgImage.h,
                res.x,
                res.y,
                res.width,
                res.height);
        }
        res.ctx.restore();
    }
    else if (res.fill){
        res.ctx.fillStyle = res.fillColor;
        res.ctx.fill();
    }

    if(res.shadow){
        setShadow(false);
    }
    /*
     if(isDefined(res.shadow)){
     setShadow(res.shadow);
     }
     */

    res.ctx.lineCap = res.lineCap;
    res.ctx.lineJoin = res.joinType;
    if(typeof res.ctx.setLineDash === "function"){
        res.ctx.setLineDash(res.lineDash);
    }

    if (res.draw){
        res.ctx.lineWidth = res.borderWidth;
        res.ctx.strokeStyle = res.borderColor;
        res.ctx.stroke();
    }
}

export function doPolygon(obj){
    if(isUndefined(obj.points)){
        error(getMessage(MSG_TRY_DRAW_EMPTY_POLYGON));
    }

    let res = $.extend(glob._initDef(obj), obj),
        offX = obj.offset ? obj.offset.x : 0,
        offY = obj.offset ? obj.offset.y : 0;


    res.ctx.beginPath();

    let drawLines = function(points){
        let size = points.length;

        if(res.radius === 0 || isNaN(res.radius)){
            each(points, (e, i) => {
                if(i){
                    res.ctx.lineTo(e.x + offX, e.y + offY);
                }
                else{
                    res.ctx.moveTo(e.x + offX, e.y + offY);
                }
            });
        }
        else{
            each(points, (e, i) => {
                let v1, l1,
                    v2 = e.getClone().sub(points[size - 1]),
                    l2 = v2.getLength();
                v2.div(l2);

                if (i === 0) {
                    v1 = points[i + 1].getClone().sub(e);
                    l1 = v1.getLength();

                    v1.div(l1);
                    if(isNumber(res.radius)){
                        l1 >>= 1;
                        l2 >>= 1;
                    }
                    else{
                        res.radius.replace("px", "");
                        l1 = l2 = 1;
                        res.radius = parseInt(res.radius);
                    }
                    res.ctx.moveTo(points[size - 1].x + v2.x * l2 * res.radius + offX,
                        points[size - 1].y + v2.y * l2 * res.radius + offY);
                    res.ctx.quadraticCurveTo(e.x + offX,
                        e.y + offY,
                        e.x + v1.x * l1 * res.radius + offX,
                        e.y + v1.y * l1 * res.radius + offY);
                }
                else{
                    v1 = points[(i + 1) % size].getClone().sub(e);
                    l1 = v1.getLength();
                    v1.div(l1);
                    if(isNumber(res.radius)){
                        l1 >>= 1;
                        l2 >>= 1;
                    }
                    else{
                        res.radius.replace("px", "");
                        l1 = l2 = 1;
                    }
                    res.ctx.lineTo(e.x - v2.x * l2 * res.radius + offX,
                        e.y - v2.y * l2 * res.radius + offY);
                    res.ctx.quadraticCurveTo(e.x + offX,
                        e.y + offY,
                        e.x + v1.x * l1 * res.radius + offX,
                        e.y + v1.y * l1 * res.radius + offY);
                }
            });
        }
        res.ctx.closePath();
    };

    isArray(res.points[0]) ? each(res.points, drawLines) : drawLines(res.points);

    _process(res);
}

export function doArc(obj){
    let res = glob._remakePosAndSize(glob._checkPosAndSize(obj, "Arc"), obj);

    res.ctx.beginPath();
    if(typeof res.ctx.ellipse === "function"){
        res.ctx.ellipse(res.x + (res.width >> 1),
            res.y + (res.height >> 1),
            res.width >> 1,
            res.height >> 1,
            0,
            res.startAngle,
            res.endAngle);
    }
    else{
        res.ctx.rect(res.x + (res.width >> 1),
            res.y + (res.height >> 1),
            res.width >> 1,
            res.height >> 1);
    }

    _process(res);
}

export function doRect(obj){
    let def = glob._checkPosAndSize(obj, OBJECT_RECT);

    if(isDefined(obj[ATTRIBUTE_RADIUS])){
        if(isNumber(obj[ATTRIBUTE_RADIUS])){
            obj[ATTRIBUTE_RADIUS] = {
                tl: obj[ATTRIBUTE_RADIUS],
                tr: obj[ATTRIBUTE_RADIUS],
                br: obj[ATTRIBUTE_RADIUS],
                bl: obj[ATTRIBUTE_RADIUS]};
        }
        else{
            each(def[ATTRIBUTE_RADIUS], (e, i) => obj[ATTRIBUTE_RADIUS][i] = obj[ATTRIBUTE_RADIUS][i] || def[ATTRIBUTE_RADIUS][i]);
        }
    }

    let res = glob._remakePosAndSize(def, obj);

    res.ctx.beginPath();
    res.ctx.moveTo(res.x + res[ATTRIBUTE_RADIUS].tl,
        res.y);
    res.ctx.lineTo(res.x + res.width - res[ATTRIBUTE_RADIUS].tr,
        res.y);
    res.ctx.quadraticCurveTo(res.x + res.width,
        res.y,
        res.x + res.width,
        res.y + res[ATTRIBUTE_RADIUS].tr);
    res.ctx.lineTo(res.x + res.width,
        res.y + res.height - res[ATTRIBUTE_RADIUS].br);
    res.ctx.quadraticCurveTo(res.x + res.width,
        res.y + res.height,
        res.x + res.width - res[ATTRIBUTE_RADIUS].br,
        res.y + res.height);
    res.ctx.lineTo(res.x + res[ATTRIBUTE_RADIUS].bl,
        res.y + res.height);
    res.ctx.quadraticCurveTo(res.x,
        res.y + res.height,
        res.x,
        res.y + res.height - res[ATTRIBUTE_RADIUS].bl);
    res.ctx.lineTo(res.x,
        res.y + res[ATTRIBUTE_RADIUS].tl);
    res.ctx.quadraticCurveTo(res.x,
        res.y,
        res.x + res[ATTRIBUTE_RADIUS].tl,
        res.y);
    res.ctx.closePath();

    _process(res);
}

export function doLine(obj){
    if(isUndefined(obj.points)){
        Logger.error(getMessage(MSG_TRY_DRAW_EMPTY_LINE));
    }

    if(!isArray(obj.points[0]) && obj.points.length < 2){
        Logger.error(getMessage(MSG_TRY_DRAW_ONE_POINT_LINE));
    }

    let res = $.extend(glob._initDef(obj), obj),//TODOD nefunguje G.extend
        offX = obj.offset ? obj.offset.x : 0,
        offY = obj.offset ? obj.offset.y : 0,
        v1, v2, l1, l2;
    res.ctx.beginPath();

    let drawLines = function(points){
        if(isNaN(points[0])){
            if(res.radius === 0 || isNaN(res.radius)){
                each(points, (e, i) => {
                    if(i > 0){
                        res.ctx.lineTo(e.x + offX, e.y + offY);
                    }
                    else{
                        res.ctx.moveTo(e.x + offX, e.y + offY);
                    }
                });
            }
            else{
                each(points, (e, i) => {
                    if(i === 0){
                        res.ctx.moveTo(e.x, e.y);
                    }
                    else if(i + 1 < points.length){
                        v1 = points[i + 1].getClone().sub(e);
                        v2 = e.getClone().sub(points[i - 1]);
                        l1 = v1.getLength();
                        l2 = v2.getLength();
                        v2.div(l2);
                        v1.div(l1);
                        if(isNumber(res.radius)){
                            l1 >>= 1;
                            l2 >>= 1;
                        }
                        else{
                            res.radius.replace("px", "");
                            l1 = l2 = 1;
                        }
                        res.ctx.lineTo(e.x - v2.x * l2 * res.radius + offX,
                            e.y - v2.y * l2 * res.radius + offY);
                        res.ctx.quadraticCurveTo(e.x + offX,
                            e.y + offY,
                            e.x + v1.x * l1 * res.radius + offX,
                            e.y + v1.y * l1 * res.radius + offY);
                    }
                    else{
                        res.ctx.lineTo(e.x + offX, e.y + offY);
                    }
                });
            }
        }
        else{
            res.ctx.moveTo(points[0] + offX, points[1] + offY);
            res.ctx.lineTo(points[2] + offX, points[3] + offY);
        }
    };
    isArray(res.points[0]) ? each(res.points, drawLines) : drawLines(res.points);

    res.fill = false;
    _process(res);
}

export function doText(obj){
    if(isObject(obj.position) && isNumber(obj.position.x) && isNumber(obj.position.y)){
        obj.x = obj.position.x;
        obj.y = obj.position.y;
    }

    if(isUndefined(obj.text) || isUndefined(obj.x) || isUndefined(obj.y) || isUndefined(obj.ctx)){
        return;
    }

    let fontSize = obj.fontSize || 20;
    let font = fontSize + "pt " + (obj.font || DEFAULT_FONT_FAMILY);
    let halign = obj.textHalign || FONT_HALIGN_LEFT;
    let valign = obj.textValign || FONT_VALIGN_BOTT;

    let offset = CanvasHandler.calcTextWidth(obj.ctx, obj.text, font) * 1.2;
    let rectPos = new GVector2f(obj.x, obj.y);
    fontSize *=  1.2;
    if(isString(obj.background)){
        if(halign = FONT_HALIGN_CENTER){
            rectPos.x -= offset >> 1;
        }
        else if(halign = FONT_HALIGN_RIGHT){
            rectPos.x -= offset;
        }

        if(balign = FONT_VALIGN_BOTT){
            rectPos.y -= fontSize >> 1;
        }
        doRect({
            position: rectPos,
            fillColor: obj.background,
            width: offset,
            height: fontSize,
            ctx: obj.ctx
        });
    }
    obj.ctx.textAlign = halign;
    obj.ctx.textBaseline = valign;
    obj.ctx.font = font;
    obj.ctx.fillStyle = obj.fontColor || "#000000";
    obj.ctx.fillText(obj.text, obj.x, obj.y);
}

export function drawQuadraticCurve(param){
    let points = param.points,
        borderWidth = param.borderWidth || DEFAULT_BORDER_WIDTH,
        borderColor = param.borderColor || DEFAUL_BORDER_COLOR,
        ctx = param.ctx || Project.context;
    if(points.length < 2){
        return;
    }

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    //points.forEach((e, i) => i === 0 ? ctx.moveTo(e.x, e.y) : ctx.quadraticCurveTo(e[0].x, e[0].y, e[1].x, e[1].y));
    each(points, (e, i) => {
        if(i === 0){
            ctx.moveTo(e.x, e.y);
        }
        else{
            ctx.quadraticCurveTo(e[0].x, e[0].y, e[1].x, e[1].y);
        }
    });
    ctx.stroke();
}

export function fillText(text, x, y, size = DEFAULT_FONT_SIZE, color = DEFAULT_FONT_COLOR, offset = 0, align = FONT_ALIGN_NORMAL, ctx = context){
    ctx.font = size + "pt " + DEFAULT_FONT_FAMILY;
    ctx.fillStyle = color;

    if(align === FONT_ALIGN_NORMAL){
        ctx.textAlign = FONT_HALIGN_LEFT;
        ctx.textBaseline = FONT_VALIGN_TOP;
        if(isArray(offset)){
            ctx.fillText(text, x + offset[0], y + offset[1]);
        }
        else{
            ctx.fillText(text, x + offset, y + offset);
        }
    }
    else if(align === FONT_ALIGN_CENTER){
        ctx.textAlign = FONT_HALIGN_CENTER;
        ctx.textBaseline = FONT_VALIGN_MIDDLE;
        ctx.fillText(text, x, y);
    }
}