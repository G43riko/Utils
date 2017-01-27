var g = require("../index");
var jsdom = require('jsdom').jsdom;
//var expect = require("chai").expect;
var tester = require("gtester");

document = jsdom('<html><head><script></script></head><body></body></html>');
window = document.defaultView;
navigator = window.navigator = {};
navigator.userAgent = 'NodeJs JsDom';
navigator.appVersion = '';

var G = g.G;

//g.Tests(G);
/*
describe("basic test", function(){
	it("prejde ak je všetko v poriadku ", function(){
		expect(3).to.be.equal(0);
		expect(1).to.be.equal(1);
	})
})
*/