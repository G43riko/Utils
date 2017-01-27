var expect = require("chai").expect;
var Tester = require("../index");


describe("basic test", function(){
	

	Tester.Tests(new Tester.Tester());

	
	var tester = new Tester.Tester();
	it("prejde ak je všetko v poriadku ", function(){
		expect(tester.getTestNumber()).to.be.equal(0);
		var result, actualTest;
		tester.addTest("testuj pocet", a => a, this);
		expect(tester.getTestNumber()).to.be.equal(1);

		actualTest = "testuj eq";
		tester.addTest(actualTest, a => a, this);
		var result = tester.runSubtest(actualTest, [1]);
		expect(result).to.have.all.keys(['res', 'time']);
		expect(result.res).to.be.equal(1);
	})
})