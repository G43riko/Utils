/**
 * Created by gabriel on 24.2.2017.
 */

let setConstants = (function(){
    let pattern = new RegExp("^<%= .* %>$");
    let loadOptions = (data, key = "") => {
        let i, actualKey, options = {}, templates = {};

        for(i in data){
            if(data.hasOwnProperty(i)){
                actualKey = key ? key + "_" : "";
                actualKey = i.charAt(0) === "!" ? i : actualKey + i;

                if(typeof data[i] === "object"){
                    loadOptions(data[i], actualKey);
                }
                else{
                    if(pattern.test(data[i])){
                        templates[actualKey] = data[i];
                    }
                    options[actualKey] = data[i];
                }
            }
        }
        if(key === ""){//ak je prvá iterácia tak opraví všetky templaty
            for(i in templates){
                if(templates.hasOwnProperty(i)){
                    let value = templates[i];
                    value = value.substring(4, value.length - 3);
                    key = value.replace(/\./g, "_");
                    if(options.hasOwnProperty(key)){
                        options[i] = options[key];
                    }
                    delete templates[i];

                }
            }
        }
        return options;
    };
    return (data, object = window) => {
        let options = loadOptions(data);
        for(let key in options){
            if(options.hasOwnProperty(key)){
                Object.defineProperty(object, key.toUpperCase(), {
                    value : options[key],
                    writable: false
                });
            }
        }
    };
})();
