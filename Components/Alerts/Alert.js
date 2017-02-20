
"use strict";

let Alert = {
	_closeParent: function(el){
		el.parentElement.style.opacity = 0;
		setTimeout(() => {
			if(el.parentElement.parentElement !== null)
				el.parentElement.parentElement.removeChild(el.parentElement)
		}, 300);
	},
	success: (text, time = 5000) => Alert._showAlert(text, "success", time),
	warning: (text, time = 5000) => Alert._showAlert(text, "warning", time),
	danger: (text, time = 5000) => Alert._showAlert(text, "danger", time),
	info: (text, time = 5000) => Alert._showAlert(text, "info", time),
	_showAlert: function(text, type = "success", time){
		let createElement = function(name, params, text){
            let el = document.createElement(name);
			if(typeof params === "object"){
				for(let i in params){
					if(params.hasOwnProperty(i)){
						el.setAttribute(i, params[i]);
                    }
				}
			}
			typeof text === "string" && el.appendChild(document.createTextNode(text));
			return el;
		};
		let div = createElement("div",{class: "alert alert-" + type});
        let a = createElement("a", {
			onclick: "Alert.removeEvent(event)",
			class: "close"
		}, "×");

		switch(type){
			case "success":
				type = "success! ";
				break;
			case "info":
				type = "Info! ";
				break;
			case "warning":
				type = "Warning! ";
				break;
			case "danger":
				type = "Danger! ";
				break;
		}

		div.appendChild(createElement(  "strong", {}, type));
		div.appendChild(a);
		div.appendChild(document.createTextNode(text));
		document.body.appendChild(div);
		setTimeout(() => Alert.removeEvent({target: a}), time);
	},

	removeEvent: function(event){
		Alert._closeParent(event.target);
		return false;
	},
	show: function(){
		Alert._showAlert("warningoš", "warning");
		Alert._showAlert("successoš", "success");
		Alert._showAlert("infoš", "info");
		Alert._showAlert("dangeroš", "danger");
	}
};
