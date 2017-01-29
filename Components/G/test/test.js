var g = require("../index");
var jsdom = require('jsdom').jsdom;
var expect = require("chai").expect;

document = jsdom('<html><head><script></script></head><body></body></html>');
window = document.defaultView;
navigator = window.navigator = {};
navigator.userAgent = 'NodeJs JsDom';
navigator.appVersion = '';

var G = g.G;

//var tester = new Tester.Tester();
//Tester.Tests(new Tester.Tester());
var gBody = new G(document.body);

describe("Testuj empty, append, length, createElement", function(){
	it("by malo všetko fungovať", function(){
		gBody.empty();
		console.log(gBody.first());
		expect(gBody.length()).to.be.equal(0);

		gBody.append("<div id='idecko'>jupilajda</div>");
		gBody.append(new G("div", {
			attr : {
				class: "clasa"},
			cont: "toto je classsa"
		}));
		var elementP = document.createElement("p");
		elementP.appendChild(document.createTextNode("juhuuu toto je paragraf"));
		gBody.append(elementP);


		expect(gBody.children()).to.have.length.equal(3);
	});
});

var idecko = new G("#idecko");
var clasa = new G(".clasa");
var par = new G("p");