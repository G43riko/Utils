/**
 * Created by gabriel on 10.6.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 *
 *
 */

/*jshint bitwise: false*/

import {CanvasHandler} from "./canvasHandler";

const MSG_DIVIDER = "########";
const MSG_TRY_DRAW_WITHOUT_POSITION		= "Chce sa vykresliť " + MSG_DIVIDER + " bez pozície";
const MSG_TRY_DRAW_WITHOUT_SIZE			= "Chce sa vykresliť " + MSG_DIVIDER + " bez veľkosti";
const MSG_TRY_DRAW_WITH_NEG_POSITION	= "Chce sa vykresliť " + MSG_DIVIDER + " zo zápornou velkosťou";

function getMessage(text){
    if(!arguments.length){
        return text;
    }


    for(let i=1 ; i<arguments.length ; i++){
        text = text.replace(MSG_DIVIDER, arguments[i]);
    }

    return text;
}

function isUndefined(val){return typeof val === "undefined";}
function isNumber(val){return typeof val === "number";}
function isObject(val){return typeof val === "object";}
function isDefined(val){return !isUndefined(val);}
function error(...msg){window.console.error.apply(window.console, msg);}
function isArray(val){return Object.prototype.toString.call(val) === "[object Array]";}

function initDef(obj){
    let def = {
        borderWidth : 2,
        borderColor : "#000000",
        fillColor : "#FFFFFF",
        radius : {tl: 0, tr: 0, br: 0, bl: 0},
        shadow: false,
        lineCap: "butt",
        center: false,
        startAngle: 0,
        endAngle: Math.PI,
        offset: null,
        joinType: "miter",
        lineStyle: 2100,
        lineType: 2000,
        lineDash: [],
        bgImage: false
    };
    def.draw = isDefined(obj.borderColor) || isDefined(obj.borderWidth);
    def.fill = isDefined(obj.fillColor);

    return def;
}
function GVector2f(value) {}
/**
 *
 * @param {Object}     params
 * @param {Number=}    params.x
 * @param {Number=}    params.y
 * @param {GVector2f=} params.position
 * @param {Number=}    params.width
 * @param {Number=}    params.height
 * @param {GVector2f=} params.size
 * @param name
 * @returns {*}
 */
function checkPosAndSize(params, name){

    if((isUndefined(params.x) || isUndefined(params.y)) && isUndefined(params.position)){
        error(getMessage(MSG_TRY_DRAW_WITHOUT_POSITION, name));
    }

    if((isUndefined(params.width) || isUndefined(params.height)) && isUndefined(params.size)){
        error(getMessage(MSG_TRY_DRAW_WITHOUT_SIZE, name));
    }

    if(params.width <= 0 || params.height <= 0){
        error(getMessage(MSG_TRY_DRAW_WITH_NEG_POSITION, name));
    }

    return initDef(params);
}

function remakePosAndSize(def, obj){
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

const OBJECT_RECT = "Rect";
const ATTRIBUTE_RADIUS = "radius";

/**
 *
 * @param {Object}    params
 * @param {Object}   params.shadow
 * @param {Element}   params.ctx
 * @param {Boolean}   params.fill
 * @param {Boolean}   params.draw
 * @param {Number}    params.x
 * @param {Number}    params.y
 * @param {Number}    params.radius
 * @param {Number}    params.width
 * @param {Number}    params.height
 * @param {String}    params.fillColor
 * @param {String}    params.borderColor
 * @param {Number}    params.borderWidth
 * @param {Number}    params.lineCap
 * @param {Number}    params.joinType
 * @param {Function}  params.lineDash
 *
 */
function process(params){
    if(isObject(params.shadow)){
        CanvasHandler.setShadow(params.ctx, params.shadow.x, params.shadow.y, params.shadow.color, params.shadow.blor);
    }


    if(params.bgImage){
        params.ctx.save();
        params.ctx.clip();
        if(params.bgImage instanceof HTMLImageElement){
            params.ctx.drawImage(params.bgImage, params.x, params.y, params.width, params.height);
        }
        else{
            params.ctx.drawImage(params.bgImage.img,
                              params.bgImage.x,
                              params.bgImage.y,
                              params.bgImage.w,
                              params.bgImage.h,
                              params.x,
                              params.y,
                              params.width,
                              params.height);
        }
        params.ctx.restore();
    }
    else if (params.fill){
        params.ctx.fillStyle = params.fillColor;
        params.ctx.fill();
    }

    if(isObject(params.shadow)){
        CanvasHandler.setShadow(params.ctx);
    }
    params.ctx.lineCap = params.lineCap;
    params.ctx.lineJoin = params.joinType;
    if(typeof params.ctx.setLineDash === "function"){
        params.ctx.setLineDash(params.lineDash);
    }

    if (params.draw){
        params.ctx.lineWidth = params.borderWidth;
        params.ctx.strokeStyle = params.borderColor;
        params.ctx.stroke();
    }
}

/**
 *
 * @param {Object} params
 * @param {Object=}params.radius
 */
export function doRect(params){
    let def = checkPosAndSize(params, OBJECT_RECT);

    if(isDefined(params.radius)){
        if(isNumber(params.radius)){
            params.radius = {
                tl: params.radius,
                tr: params.radius,
                br: params.radius,
                bl: params.radius};
        }
        else{
            for(let i in def.radius){
                if(def.radius.hasOwnProperty(i)){
                    params.radius[i] = params.radius[i] || def.radius[i];
                }
            }
        }
    }

    let res = remakePosAndSize(def, params);

    res.ctx.beginPath();
    res.ctx.moveTo(res.x + res.radius.tl, res.y);
    res.ctx.lineTo(res.x + res.width - res.radius.tr, res.y);
    res.ctx.quadraticCurveTo(res.x + res.width,
                             res.y,
                             res.x + res.width,
                             res.y + res.radius.tr);
    res.ctx.lineTo(res.x + res.width, res.y + res.height - res.radius.br);
    res.ctx.quadraticCurveTo(res.x + res.width,
                             res.y + res.height,
                             res.x + res.width - res.radius.br,
                             res.y + res.height);
    res.ctx.lineTo(res.x + res.radius.bl, res.y + res.height);
    res.ctx.quadraticCurveTo(res.x,
                             res.y + res.height,
                             res.x,
                             res.y + res.height - res.radius.bl);
    res.ctx.lineTo(res.x, res.y + res.radius.tl);
    res.ctx.quadraticCurveTo(res.x,
                             res.y,
                             res.x + res.radius.tl,
                             res.y);
    res.ctx.closePath();

    process(res);
}