"use strict"

function initContextMenu(query){
	var taskItemClassName = 'task';
	var items = document.querySelectorAll(query);
	var menuState = 0;
	var menu = document.querySelector("#context-menu");
	var contextMenuListener = function(el){
		el.addEventListener("contextmenu", function(e) {
			console.log(e.target);
			e.preventDefault();
			togleMenu(e);
			return false;
		});
	};

	var togleMenu = function(e){
		menu.classList.add("active");
		menu.style.top = e.clientY + "px";
		menu.style.left = e.clientX + "px";
	}
	var toggleMenuOff = function(){
		if (menuState !== 0){
			menuState = 0;
			menu.classList.remove(activeClassName);
		}
	}
	for(var i=0 ; i<items.length; i++){
		contextMenuListener(items[i]);
	}
};


