Utils = {
	isElement: function(obj){
		try {
			return obj instanceof HTMLElement;
		}
		catch(e){
			return typeof obj === "object" && obj.nodeType === 1 && typeof obj.style === "object" && typeof obj.ownerDocument === "object";
		}
	},
	getGObject: function(obj, parent = document){
		if(typeof obj === "string"){
			if(obj[0] === "#"){
				return GE(parent.getElementById(obj.substring(1)));
			}
			else if(obj[0] === "."){
				return GAE(parent.getElementsByClassName(obj.substring(1)));
			}
			else{
				//TODO kontrolovať aj meno tagu alebo priamo tag
				return GAE(parent.getElementsByTagName(obj));
			}
		}
		else if(Utils.isElement(obj)){
			return GE(obj);
		}
	},
	isString: (val) => typeof val === "string",
	isObject: (val) => typeof val === "object",
	isNumber: (val) => typeof val === "number",
	isBool:   (val) => typeof val === "boolean",
	isToStringable: (val) => typeof val === "number" || typeof val === "string" || typeof val === "boolean",
	isGElement: (val) => typeof val["isGElement"] === "boolean" && val["isGElement"]
}


G = function(obj){
	if(Utils.isGElement(obj))
		return obj;
	var result = null;
	result = Utils.getGObject(obj)
	return result;
};

GAE_imp = function(elements){
	this.elements = [];
	for(var i in elements)
		if(elements.hasOwnProperty(i))
			this.elements.push(GE(elements[i]));
	//TODO filter

	this["each"] = function(func){
		for(var i in this.elements)
			func.call(this.elements[i], i);
	}

	this["class"] = function(){
		if(arguments.length > 0)
			this.each(function(){
				this.class.apply(this, arguments);
			});
		return this;
	}
	this["css"] = function(){
		if(arguments.length > 0)
			this.each(function(){
				this.css.apply(this, arguments);
			});
		return this;
	}

	this["attr"] = function(){
		if(arguments.length > 0)
			this.each(function(){
				this.attr.apply(this, arguments);
			});
		return this;
	}
}

GAE = function(obj){
	result = null;
	if(Utils.isObject(obj) || Array.isArray(obj))
		result = new GAE_imp(obj);
	return result
}




GE = function(obj){
	if(Utils.isElement(obj)){
		obj["isGElement"] = true;

		obj["parent"] = function(){
			return G(obj.parentElement);
		}

		obj["delete"] = function(){
			this.parentElement.removeChild(this);
			return this;
		}
		obj["html"] = function(){
			if(arguments.length == 0)
				return this.innerHTML;
			
			if(Utils.isToStringable(arguments[0]))
				this.innerHTML = arguments[0];
			else if(Utils.isElement(arguments[0])){//TODO otestovať
				this.innerHTML = "";
				this.appendChild(arguments[0]);
			}
			return this;
		}

		obj["text"] = function(){//TODO otestovať
			if(arguments.length == 0)
				//return this.html().replace(/<[^>]*>/g, "");
				return this.textContent;

			this.html(arguments[0].replace(/<[^>]*>/g, ""));
			return this;
		}

		obj["append"] = function(data){
			if(Utils.isElement(data))
				this.appendChild(data);
			else if(typeof data === "string")
				this.innerHTML += data;

			return this;
		}
		obj["appendTo"] = function(data){//TODO otestovať
			if(Utils.isElement(data))
				data.appendChild(this);

			return this;
		}

		obj["prependTo"] = function(data){//TODO otestovať
			if(Utils.isElement(data))
				data.parentElement.insertBefore(this, data.parentElement.firstElementChild);
			return this;
		}

		obj["prepend"] = function(data){
			if(Utils.isElement(data))
				this.insertBefore(data, this.firstElementChild);
			else if(typeof data === "string")
				this.html(data + this.html());
			return this;
		}

		obj["find"] = function(data){
			return Utils.getGObject(data, this);
		}

		obj["attr"] = function(){
			if(arguments.length == 0){
				var result = {};
				for(var i=0, tmp=[] ; i<this.attributes.length ; i++)
					result[this.attributes[i].nodeName] = this.attributes[i].nodeValue;
				return result;
			}

			if(Utils.isString(arguments[0])){
				if(arguments.length == 1){
					if(arguments[0][0] !== "-")
						return this.getAttribute(arguments[0]);
					this.removeAttribute(arguments[0].substring(1))	
				}
				else if(arguments.length == 2 && Utils.isToStringable(arguments[1]))
					this.setAttribute(arguments[0], arguments[1]);
			}
			else if(Utils.isObject(arguments[0]))
				for(var i in arguments[0])
					if(arguments[0].hasOwnProperty(i) && Utils.isToStringable(arguments[0][i]))
						this.setAttribute(i, arguments[0][i]);
			return this;
		}

		obj["css"] = function(){//TODO otestovať
			if(arguments.length == 0){
				var result = {};
				var css = window.getComputedStyle(this);
				for(var i in css)
					if(css.getPropertyValue(css[i]) !== "")
						result[css[i]] = css.getPropertyValue(css[i]);
				return result;
			}
			
			if(Utils.isString(arguments[0])){
				if(arguments.length == 2 && Utils.isToStringable(arguments[1]))
					this.style[arguments[0]] = arguments[1];
				else{
					if(arguments[0][0] !== "-")
						return this.style[arguments[0]];
					this.style[arguments[0].substring(1)] = "";
				}
			}
			else if(Utils.isObject(arguments[0]))
				for(var i in arguments[0])
					if(arguments[0].hasOwnProperty(i) && Utils.isString(i) && Utils.isToStringable(arguments[0][i]))
						this.style[i] = arguments[0][i];
			return this;
		}

		obj["class"] = function(name){
			if(Utils.isString(name)){
				switch(name[0]){
					case "+":
						this.classList.add(name.substring(1));
						break;
					case "-":
						this.classList.remove(name.substring(1));
						break;
					case "/":
						name = name.substring(1)
						this.attr("class").indexOf(name) > -1 ? this.classList.remove(name) : this.classList.add(name);
						break;
					default:
						return this.attr("class").indexOf(name) > -1;
				}
				return this;
			}
		}
		
		obj["wrap"] = function(element){ //TODO otestovať - opraviť
			if(Utils.isString(element) || Utils.isElement(element)){
				var parent = this.parent();
				element = G(element);
				element.html(parent.html());
				parent.html(element);
			}
			return this;
		}

		/*********************UTILS*********************/

		obj["empty"] = function(){
			this.html("");
			return this;
		}

		obj["hide"] = function(){
			this.css("display", "none");
			return this;
		}

		obj["show"] = function(){
			this.css("display", "block");
			return this;
		}
		//appendTo
		//prependTo
		//after - pridá za
		//before - prida pred
		//unwrap;
	}
	return obj;;
}

function tests(){
	var body = G(document.body);
	body.append("<b>tučný text</b><br>");
	body.append("<b class='trieda'>tučný text s triedov</b><br>");
	body.append(d);
}
