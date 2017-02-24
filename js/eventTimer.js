/**
 * Created by gabriel on 24.2.2017.
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */
class EventTimer{
    /**
     *
     * @param event
     * @param time
     */
    constructor(event, time){
        this._event = event;
        this._time = time;
        this._timeOut = false;
        this._lastTime = Date.now();
    }

    /**
     *
     * @param inst
     * @private
     */
    _callEvent(inst = this){
        inst._event();
        if(inst._timeOut){
            clearTimeout(inst._timeOut);
            inst._timeOut = false;
        }
        inst._lastTime = Date.now();
    }

    /**
     *
     * @param diff
     * @private
     */
    _setTimeOut(diff){
        if(this._timeOut){
            return;
        }
        this._timeOut = setTimeout(() => this._callEvent(this) , this._time - diff);
    }

    /**
     *
     */
    callIfCan(){
        let diff = Date.now() - this._lastTime;
        diff > this._time ? this._callEvent() : this._setTimeOut(diff);
    }
}