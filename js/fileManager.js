/**
 * Created by gabriel on 24.2.2017.
 *
 * @author Gabriel Csollei[gcsollei@hotmail.com]
 */
let fileInput = (function(){
    "use strict";
    let input = document.createElement("input");
    let link = document.createElement("a");

    input.setAttribute("type", "file");
    input.setAttribute("value", "files");
    input.setAttribute("class", "hide");

    link.setAttribute("class", "hide");
    link.setAttribute("href", "");

    return {
        /**
         *
         * @param name
         * @param text
         * @param type
         */
        saveLocalFile: (name, text, type = "text/plain") => {
            link.href = URL.createObjectURL(new Blob([text], {type: type}));
            link.download = name;
            link.click();
        },

        /**
         *
         * @param name
         * @param image
         */
        saveLocalImage: (name, image) => {
            link.href = typeof image === "string" ? image : image.src;
            link.download = name;
            link.click();
        },

        /**
         *
         * @param func
         */
        loadLocalImage: func => {
            input.onchange = function(e){
                let reader = new FileReader();
                reader.onload = function(){
                    let image = new Image();
                    image.src = reader.result;
                    func(image);
                };
                reader.readAsDataURL(e.target.files[0]);
            };
            input.click();
        },

        /**
         *
         * @param func
         */
        loadLocalFile: func => {
            input.onchange = function(e){
                let reader = new FileReader();
                reader.onload = () => func(reader.result);
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        }
    }
})();