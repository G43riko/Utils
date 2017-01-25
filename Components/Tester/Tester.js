"use strict"

var Tester = function(){
	this._tests = {};

	/**
	 * Pridá argumenty do už exisujúceho testu
	 *
	 */
	this.addArgs = function(title, args, targetRes, type){
		if(!type){
			type = "eq";
		}
		if(!this._tests[title]){
			alert("test " + title + " ešte neexistuje");
			return;
		}
		this._tests[title].subtests.push({
			targetRes: targetRes,
			args: args,
			type: type,
			results: []
		});
	};

	/**
	 * Porovná výsledky s požadovanými výsledkamy na názlklade typu
	 *
	 */
	this._compareResults = function(targetRes, result, type){
		switch(type){
			case "eq":
				return targetRes === result;
			case "gt":
				return targetRes < result;
			case "ge":
				return targetRes <= result;
			case "lt":
				return targetRes > result;
			case "le":
				return targetRes >= result;
			case "ok":
				return result ? true : false;
			case "true":
				return targetRes === result;
			case "false":
				return targetRes === result;
			case "undefined":
				return targetRes === result;
			case "null":
				return targetRes === result;
			case "NaN":
				return targetRes === result;
			case "empty"://{}, [], ""
				return targetRes === result;
			case "between":
				return result > targetRes[0] && result < targetRes[1];
			case "property":
				return result[targetRes[0]] === targetRes[1];
			case "length":
				return result.length === targetRes;
			case "instanceof":
				return result instanceof targetRes;
			case "members":
				for(var i in result){
					if(result.hasOwnProperty(i) && typeof targetRes[i] === "undefined"){
						return false;
					}
				}
				return true;
			default:
				return targetRes === result;
		};
	};

	/**
	 * Funckia vráti objekt ktorým je možné určiť typ porovnania
	 *
	 */
	this.addArg = function(title, args){
		return {
			eq: (targetRes) => this.addArgs(title, args, targetRes, "eq"),
			gt: (targetRes) => this.addArgs(title, args, targetRes, "gt"),
			ge: (targetRes) => this.addArgs(title, args, targetRes, "ge"),
			lt: (targetRes) => this.addArgs(title, args, targetRes, "lt"),
			le: (targetRes) => this.addArgs(title, args, targetRes, "le"),
			ok: () => this.addArgs(title, args, "", "ok"),
			true: () => this.addArgs(title, args, true, "true"),
			false: () => this.addArgs(title, args, false, "false"),
			undefined: () => this.addArgs(title, args, undefined, "undefined"),
			null: () => this.addArgs(title, args, null, "null"),
			NaN: () => this.addArgs(title, args, NaN, "NaN"),
			exist: () => this.addArgs(title, args, "", "exist"),
			empty: () => this.addArgs(title, args, "", "empty"),
			arguments: () => this.addArgs(title, args, "", "arguments"),
			between: (start, end) => this.addArgs(title, args, [start, end], "between"),
			property: (key, val) => this.addArgs(title, args, [key, val], "property"),
			instanceof: (targetRes) => this.addArgs(title, args, targetRes, "instanceof"),
			length: (targetRes) => this.addArgs(title, args, targetRes, "length"),
			members: (targetRes) => this.addArgs(title, args, targetRes, "members")
		}
	}

	/**
	 * Pridá nový test
	 *
	 */
	this.addTest = function(title, func, thisArg = window){
		if(this._tests[title]){
			alert("test " + title + " uz existuje");
			return;
		}
		this._tests[title] = {
			func: func,
			thisArg: thisArg || window,
			subtests: []
		};
	};

	/**
	 * Pridá nový test a rovno aj jeho argumenty
	 *
	 */
	this.addTestAndArgs = function(title, func, thisArg, args, targetRes){
		this.addTest(title, func);
		this.addArgs(title, args, targetRes);
	};

	/**
	 * Podrobný výpis pri neúspešnom teste
	 *
	 */
	this._reportFailedTest = function(title, targetRes, args, res, time, type){
		var report = "test " + title + "(" + args + "): " + res + " => ";

		report += targetRes + "[" + (typeof targetRes) + "] !== " + res + "[" + (typeof res) + "]";
		console.log(report);
	};

	/**
	 * Informatívny výpis po ukončený všetkých testov
	 *
	 */
	this._finishOverview = function(time, testCounter, failedTestCounter){
		console.log("testovalo sa " + time + "ms")
		console.log("neuspesnych bolo " + failedTestCounter + " z " + testCounter + " testov");
	};

	/**
	 * Spustí všetky testy
	 *
	 */
	this.runTests = function(){
		var testCounter = 0;
		var failedTestCounter = 0;
		var startTotalTime = Date.now();
		for(var i in this._tests){
			if(this._tests.hasOwnProperty(i)){
				var test = this._tests[i];
				for(var j in test.subtests){
					if(test.subtests.hasOwnProperty(j)){
						testCounter++;
						var subtest = test.subtests[j];
						var startTime = Date.now();
						var result = test.func.apply(test.thisArg, subtest.args);
						var time = Date.now() - startTime;
						subtest.results.push({
							time: time,
							res: result
						});
						if(!this._compareResults(subtest.targetRes, result, subtest.type)){
							failedTestCounter++;
							this._reportFailedTest(i, subtest.targetRes, subtest.args, result, time, subtest.type);
						};
					}
				}
			}
		}
		this._finishOverview(Date.now() - startTotalTime, testCounter, failedTestCounter);
	};
}


function testTest(){
	var sucet = (a, b) => a + b;
	var sucin = (a, b) => a * b;
	var tester = new Tester();
	tester.addTestAndArgs("sucet", sucet, window, [1, 2], 3);
	tester.addArgs("sucet", [3, 4], 7)
	tester.addArgs("sucet", [4, 4], 8);

	tester.addTest("sucin", sucin);
	tester.addArg("sucin", [1, 2]).le(2);
	tester.addArg("sucin", [2, 2]).ge(4);
	tester.addArg("sucin", [3, 2]).lt(7);
	tester.runTests();
}