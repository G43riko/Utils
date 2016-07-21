var Modal = {
	_isDefined: function(){
		for(var i in arguments)
			if(arguments.hasOwnProperty(i) && typeof arguments[i] === "undefined")
				return false;
		return true;
	},
	_createElement: function(name, attr, cont, style){
		if(typeof name === "object"){
			if(Modal._isDefined(name.name, name.attr, name.cont, name.style))
				return Modal._createElement(name.name, name.attr, name.cont, name.style);
			else
				return console.error("zle zadane parametre");
		}

		var el = document.createElement(name);
		if(typeof attr === "object")
			for(var i in attr)
				el.setAttribute(i, attr[i]);

		if(typeof style === "object")
			for(var i in style)
				el.style[i] = style[i];

		if(typeof cont === "string") 
			el.innerHTML = cont 
		else if(Array.isArray(cont)){
			for(var i in cont)
				if(cont.hasOwnProperty(i) && typeof cont[i] === "object")
					el.appendChild(cont[i]);
		}	
		else if(typeof cont === "object")
			el.appendChild(cont);

		return el;
	},
	showModal: function(data, title, end = "ukončiť"){
		var bg = document.getElementById("modalBackground");
		if(bg === null)
			document.body.appendChild(Modal._createElement("div", {id: "modalBackground"}));
		else
			bg.style.opacity = 1;
		var modal = Modal._createElement("div", {id: "modal"}, [
			Modal._createElement("div", {id: "modalHeader"}, 
				[
					Modal._createElement("h4", {}, title), 
					Modal._createElement("span", {
						onclick: "Modal.hideModal(this)"
					}, "×")
				]
			), 
			Modal._createElement("div", {id: "modalBody"}, data), 
			Modal._createElement("div", {id: "modalFooter"}, 
				[
					Modal._createElement("input", {
						type: "button",
						value: end, 
						onclick: "Modal.hideModal(this)"})
				]
			)
		]);
		document.body.appendChild(modal);
	},
	hideModal: function(el){
		var elem = el.parentElement.parentElement;
		elem.parentElement.removeChild(elem);
		document.getElementById("modalBackground").style.opacity = 0;
	}
}
