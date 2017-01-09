var chai = require("chai");
var expect = require("chai").expect;
var G = require("./index");

describe("nieco", function(){
	it("nieco robí", function(){
		expect("gabo").to.equal("gabo");
		expect("gabo2").to.equal("gabo2");
	});
	it("nieco zasa robí", function(){
		expect("gaboo").to.equal("gaboo");
		expect("gaboo").to.contain("oo");
	});
});