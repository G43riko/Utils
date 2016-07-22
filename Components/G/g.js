G = function(args){
	this.elements = G.find(args, document);
}

G.isElement = (obj) => {
	try {
		return obj instanceof HTMLElement;
	}
	catch(e){
		return typeof obj === "object" && obj.nodeType === 1 && typeof obj.style === "object" && typeof obj.ownerDocument === "object";
	}
}
G.isString = (val) => typeof val === "string";
G.isObject = (val) => typeof val === "object";
G.isNumber = (val) => typeof val === "number";
G.isBool = (val) => typeof val === "boolean";
G.isToStringable = (val) => typeof val === "number" || typeof val === "string" || typeof val === "boolean";
G.isGElement = (val) => typeof val["isGElement"] === "boolean" && val["isGElement"];

G.prototype.first = function(func, ... args){
	if(this.elements.length == 0)
		return this;

	return func.apply(this.elements[0], args);
}

G.prototype.each = function(func, ... args){
	for(var i in this.elements)
		func.apply(this.elements[i], args);

	return this;
}

G.find = function(args, parent){
	if(typeof args === "string")
		return parent.querySelectorAll(args);
	else if(G.isElement(args))
		return [args];
}

G.prototype.css = function(){

}
