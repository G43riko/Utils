/**
 * Created by gabriel on 24.2.2017.
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
        saveFile: (name, text, type = "text/plain") => {
            link.href = URL.createObjectURL(new Blob([text], {type: type}));
            link.download = name;
            link.click();
        },
        saveImage: (name, image) => {
            link.href = typeof image === "string" ? image : image.src;
            link.download = name;
            link.click();
        },

        loadImage: func => {
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
        loadFile: func => {
            input.onchange = function(e){
                let reader = new FileReader();
                reader.onload = () => func(reader.result);
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        }
    }
})();