/**
 * Created by gabriel on 25.2.2017.
 */
let GMath = (function(){
    "use strict";
    return {
        /**
         *
         * @param n
         * @param k
         * @returns {number}
         */
        binomialCoefficient: (n, k) => {
            let r = 1;
            if (k > n) {
                return 0;
            }
            for (let d = 1; d <= k; d++) {
                r *= (r * n--) / d;
            }
            return r;
        },

        /**
         *
         * @param value
         * @returns {number}
         */
        log2i: value => {
            let r = 0;
            while ((value >>= 1) > 0){
                r++;
            }
            return r;
        },

        /**
         *
         * @returns {number}
         */
        average: () => {
            let sum = 0;
            for(let i in arguments){
                if(arguments.hasOwnProperty(i)){
                    sum += arguments[i];
                }
            }
            return sum / arguments.length;
        },

        /**
         *
         */
        choose: () => arguments[(Math.random() * arguments.length)],

        /**
         *
         * @param value
         * @param min
         * @param max
         */
        between: (value, min, max) => Math.max(min, Math.min(value, max)),

        /**
         *
         * @param min
         * @param max
         */
        rand: (min, max) => (Math.random() * (max - min)) + min,

        /**
         *
         * @param min
         * @param max
         * @param scale
         */
        interpolateLinear: (min, max, scale) => between((max - min) * scale + min, min, max)
    }
})();
