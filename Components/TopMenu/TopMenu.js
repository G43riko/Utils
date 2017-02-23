"use strict"

class TopMenu{
	constructor(data){
		let parent = new G("#topMenuHolder").html(this.createMainMenu(data["mainMenu"], data));

        let items = G.byClass("itemLink");
		document.onclick = e => {//TODO toto treba pridať ku akemukolvek kliku na canvas
            let elements = G.byClass("selected");
			for(let i=0 ; i<elements.length ; i++){
				if(G.isDefined(elements[i]) && e.target != elements[i].children[0]){
					elements[i].classList.remove("selected");
				}
			}
		}
	}

	disabled(value, menu, submenu = null){
        let string = "#topMenuHolder .item_" + menu;
		if(G.isString(submenu)){
			string += " .item_" + submenu
		}

		G(string).class((value ? "+" : "-") + "disabled");
	}

	visible(value, menu, submenu = null){
        let string = "#topMenuHolder .item_" + menu;
		if(G.isString(submenu)){
			string += " .item_" + submenu
		}

		G(string).class((value ? "-" : "+") + "hidden");
	}

	createMainMenu(menuData, allData = null){
		var ul = G("ul", {attr: {class: "menu"}})
		G.each(menuData, function(e, i, array){
			var classes = "menuItem item_" + i;
			if(e.disabled === true){
				classes += " disabled";
			}
			if(e.visible === false){
				classes += " hidden";
			}
			var li = G("li", {
				attr: {class: classes}, 
				cont: G.createElement("a", {
					href: "javascript: void(0)",
					class: "itemLink",
					onclick: allData !== null ? "if(!G.hasClass(G.parent(this), \"disabled\"))G.parent(this).classList.toggle(\"selected\");" : ""
				}, i)
			});
			if(allData && allData.hasOwnProperty(i)){
				li.append(this.createMainMenu(allData[i]));
			}

			ul.append(li);
		}, this);
		return ul.first();
	}
}
var dataNew = {
	"items" : [
		{
			"key" : "tools",
			"label" : "Nástroje",
			"visible" : true,
			"disable" : false,
			"items" : [
				{
					"key" : "draw",
					"visible" : true,
					"disable" : false
				},
				{
					"key" : "rect",
					"visible" : true,
					"disable" : false
				}
			]
		}
	]
};
var data = {
	"mainMenu" : {
		"tools" : {
			"visible" : true,
			"disabled" : false
		},
		"file": {
			"visible" : true,
			"disabled" : false
		},
		"content" : {
			"visible" : true,
			"disabled" : false
		},
		"sharing": {
			"visible" : true,
			"disabled" : false
		},
		"options" : {
			"visible" : true,
			"disabled" : false
		},
		"help" : {
			"visible" : true,
			"disabled" : true
		},
		"undo": {
			"visible" : false,
			"disabled" : true
		},
		"redo" : {
			"visible" : false,
			"disabled" : true
		},
		"rubber" : {
			"visible" : true,
			"disabled" : false
		},
		"area" : {
			"visible" : true,
			"disabled" : false
		},
		"ctrl": {
			"visible" : false,
			"disabled" : true
		},
		"lineWidth" : {
			"visible" : false,
			"disabled" : true
		},
		"brushes" : {
			"visible" : false,
			"disabled" : true
		}
	},
	"tools": {
		"draw": {
			"visible" : true,
			"disabled" : false
		},
		"rect": {
			"visible" : true,
			"disabled" : false
		},
		"line": {
			"visible" : true,
			"disabled" : false
		},
		"arc": {
			"visible" : true,
			"disabled" : false
		},
		"text": {
			"visible" : true,
			"disabled" : true
		},
		"join": {
			"visible" : true,
			"disabled" : false
		},
		"table": {
			"visible" : true,
			"disabled" : true
		},
		"class": {
			"visible" : true,
			"disabled" : true
		},
		"image": {
			"visible" : true,
			"disabled" : false
		},
		"polygon": {
			"visible" : true,
			"disabled" : true
		}
	},
	"file": {
		"saveImg" : {
			"visible" : true,
			"disabled" : false
		},
		"saveXML" : {
			"visible" : true,
			"disabled" : false
		},
		"saveTask" : {
			"visible" : true,
			"disabled" : false
		},
		"loadXML" : {
			"visible" : true,
			"disabled" : false
		}
	},
	"content": {
		"loadLocalImage" : {
			"visible" : true,
			"disabled" : false
		},
		"loadLocalHTML" : {
			"visible" : true,
			"disabled" : false
		},
		"loadExternalImage" : {
			"visible" : true,
			"disabled" : false
		},
		"loadExternalHTML" : {
			"visible" : true,
			"disabled" : false
		}
	},
	"sharing": {
		"startShare" : {
			"visible" : true,
			"disabled" : false
		},
		"stopShare" : {
			"visible" : true,
			"disabled" : true
		},
		"shareOptions" : {
			"visible" : true,
			"disabled" : true
		},
		"copyUrl": {
			"visible" : true,
			"disabled" : true
		},
		"watch" : {
			"visible" : true,
			"disabled" : false
		}
	},
	"lineWidth" : {
		"defaultWidth" : {
			"visible" : true,
			"values" : [1, 2, 5, 10, 20]
		}
	},
	"brushes" : {
		"defaultBrushes" : {
			"visible" : true,
			"values" : ["brush1.png", "brush2.png", "brush3.png"]
		}
	}
}