class LayersViewerAbstract{

};


class LayersViewer extends LayersViewerAbstract{
	_createDiv(){
		this._layers = [];
		this._layersBody = G("div", {attr: {id: "layersBody"}});
		return G("div", {
			attr: {id: "layersViewer"}, 
			cont: [
				G.createElement("div", {id: "layersHeader"}, [
		 				G.createElement("div", {
		 					class: "layersHeaderButton", 
		 					id: "addLayerButton", 
		 					onclick: "LayersViewer.createAnonymLayer()"
		 				}, "+"),
		 				G.createElement("div", {
		 					class: "layersHeaderButton", 
							id: "removeLayerButton", 
							onclick: "LayersViewer.removeActiveLayer()"
						}, "×"),
		 				G.createElement("div", {
		 					class: "layersHeaderButton", 
		 					id: "toggleLayerButton",
		 					onclick: "G('#layersViewer').toggleClass('minimalized')"
		 				}, "-")
	 				]),
	 			this._layersBody.first()
 			]
		});
	}
	static setName(element){
		var input = G(element);
		var text = input.first().value;
		input.parent().text(text);


	}
	static changeName(element){
		var textBox = G(element);
		var text = textBox.text();
		var input = G.createElement("input", {
			class: "tmpLayerInput",
			type: "text",
			onblur:"LayersViewer.setName(this)",
			onkeydown:"if(event.keyCode === 13){LayersViewer.setName(this)}",
			value: text
		});
		textBox.text("").append(input);
		input.focus();

	}
	static changeVisibility(layerName){
		G("#id_" + layerName).toggleClass("true").toggleClass("false")
	}
	static removeActiveLayer(){
		console.log("maže sa aktualna vrstva");
	}
	static createAnonymLayer(){
		console.log("vytvara sa nova vrstva");
	}
	static makeSelected(element){
		var layer = new G(element);
		if(layer.hasClass("selected")){
			return;
		}
		G(".layer").each(function(){
			G(this).removeClass("selected");
		});
		layer.addClass("selected");
	}
	constructor(element){
		super();
		this._layersViewer = this._createDiv();
		element.appendChild(this._layersViewer.first());
		var element = this._layersViewer.first();

		/*
		this._layersViewer.first().onmousedown = function(e){
			
			element.onmousemove = function(ee){
				element.style.top = ee.y + "px";
				element.style.left = ee.x + "px";
				console.log(element.style.top, element.style.left, ee);
			};
			element.onmouseup = function(ee){
				element.onmousemove = null;
				element.onmouseup = null;
			};
		};
		*/

		this.createLayer("desti");
		this.createLayer("destiA");
		this.createLayer("destiB");
		this.deleteLayer("desti");
	};
	_createLayerDiv(title){
		var layer = G("div", {
			attr: {class: "layer", id: title, onclick: "LayersViewer.makeSelected(this)"},
			cont: [
				G.createElement("div", {class: "visible true", onclick: "LayersViewer.changeVisibility('" + title + "')", id: "id_" + title}),
				G.createElement("div", {class: "title", ondblclick: "LayersViewer.changeName(this)"}, title),
				G.createElement("div", {class: "options"})
			]
		})


		this._layers[title] = layer;
		return layer;
	}
	createLayer(title){
		this._layersBody.append(this._createLayerDiv(title));
	};
	onScreenResize(){
	};

	deleteLayer(title){
		this._layers[title].delete();
		this._layers[title] = null;
	};
};
