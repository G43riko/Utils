let colors = require('colors');

exports.Tester = function(){
	this._tests = {};
	this._testCounter = 0;

    /**
	 * Funkcia vráti počet testov
     * @returns {number}
     */
	this.getTestNumber = function(){
		return this._testCounter;
	};

    /**
	 * Pridá argumenty do už exisujúceho testu
	 *
     * @param title
     * @param args
     * @param targetRes
     * @param type
     * @private
     */
	this._addArgs = function(title, args, targetRes, type){
		if(!type){
			type = "eq";
		}
		let test = this._tests[title];
		if(!test){
			alert("test " + title + " ešte neexistuje");
			return;
		}
		if(!Array.isArray(args)){// ak nieje argument pole tak vytvorí z neho pole
			args = [args]
		}
		test.subtests.push({
			targetRes: targetRes,
			args: args, 
			type: type,
			results: []
		});

		return this._compareResults(targetRes, test.func.apply(test.thisArg, args), type);
	};

    /**
	 * Funkcia porovná výsledky s požadovanými výsledkamy na názáklade typu
	 *
     * @param targetRes
     * @param result
     * @param type
     * @returns {boolean}
     * @private
     */
	this._compareResults = function(targetRes, result, type){
		switch(type){
			case "eq"://otestovane
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
				return !!result;
			case "true":
				return targetRes === result;
			case "false":
				return targetRes === result;
			case "undefined":
				return targetRes === result;
			case "null":
				return targetRes === result;
			case "NaN":
				return isNaN(result);
			case "empty"://{}, [], ""
				return targetRes === result;
			case "between"://otestovane
				return result > targetRes[0] && result < targetRes[1];
			case "exist":
				return result != targetRes;
			case "property":
				return result[targetRes[0]] === targetRes[1];
			case "length":
				return result.length === targetRes;
			case "instanceof":
				return result instanceof targetRes;
			case "finite":
				return isFinite(result);
			case "members":
				for(let i in result){
					if(result.hasOwnProperty(i) && typeof targetRes[i] === "undefined"){
						return false;
					}
				}
				return true;
			default:
				return targetRes === result;
		}
	};

    /**
	 * Funckia vráti objekt ktorým je možné určiť typ porovnania
	 *
     * @param title
     * @param args
     * @returns {{eq: (function(*=)), gt: (function(*=)), ge: (function(*=)), lt: (function(*=)), le: (function(*=)), ok: (function()), true: (function()), false: (function()), undefined: (function()), null: (function()), NaN: (function()), empty: (function()), arguments: (function()), between: (function(*, *)), property: (function(*, *)), instanceof: (function(*=)), length: (function(*=)), members: (function(*=)), exist: (function()), finite: (function())}}
     */
	this.addArg = function(title, args){
		return {
			//lubovolne argumenty
			eq: (targetRes) => this._addArgs(title, args, targetRes, "eq"),
			//cisslo alebo string
			gt: (targetRes) => this._addArgs(title, args, targetRes, "gt"),
			ge: (targetRes) => this._addArgs(title, args, targetRes, "ge"),
			lt: (targetRes) => this._addArgs(title, args, targetRes, "lt"),
			le: (targetRes) => this._addArgs(title, args, targetRes, "le"),
			//lubovolne argumenty
			ok: () => this._addArgs(title, args, "", "ok"),
			//bool
			true: () => this._addArgs(title, args, true, "true"),
			false: () => this._addArgs(title, args, false, "false"),
			//lubovolne argumenty
			undefined: () => this._addArgs(title, args, undefined, "undefined"),
			null: () => this._addArgs(title, args, null, "null"),
			NaN: () => this._addArgs(title, args, NaN, "NaN"),
			//string, pole, objekt
			empty: () => this._addArgs(title, args, "", "empty"),
			//lubovolne argumenty
			arguments: () => this._addArgs(title, args, "", "arguments"),
			//cislo alebo string
			between: (start, end) => this._addArgs(title, args, [start, end], "between"),
			//lubovolne argumenty
			property: (key, val) => this._addArgs(title, args, [key, val], "property"),
			//lubovolne argumenty
			instanceof: (targetRes) => this._addArgs(title, args, targetRes, "instanceof"),
			//string, pole, objekt
			length: (targetRes) => this._addArgs(title, args, targetRes, "length"),
			//pole, objekt
			members: (targetRes) => this._addArgs(title, args, targetRes, "members"),
			//lubovolne argumenty
			exist: () => this._addArgs(title, args, null, "exist"),
			//lubovolne argumenty
			finite: () => this._addArgs(title, args, "", "finite")
		}
	};

    /**
	 * Funkcia pridá nový test
	 *
     * @param title
     * @param func
     * @param thisArg
     */
	this.addTest = function(title, func, thisArg){
		if(typeof thisArg === "undefined"){
			thisArg = typeof window !== "undefined" ? window : this;
		}
		if(this._tests[title]){
			alert("test " + title + " uz existuje");
			return;
		}
		this._tests[title] = {
			func: func,
			thisArg: thisArg || window,
			subtests: []
		};
		this._testCounter++;
	};

    /**
	 * Funkcia pridá nový test a rovno aj jeho argumenty
	 *
     * @param title
     * @param func
     * @param thisArg
     * @param args
     * @param targetRes
     */
	this.addTestAndArgs = function(title, func, thisArg, args, targetRes){
		this.addTest(title, func);
		this._addArgs(title, args, targetRes);
	};

    /**
	 * Funkcia pre podrobný výpis pri neúspešnom teste
     * @param title
     * @param targetRes
     * @param args
     * @param res
     * @param time
     * @param type
     * @private
     */
	this._reportFailedTest = function(title, targetRes, args, res, time, type){
		let report = "test " + title + "(" + args + "): " + res + " => ";

		report += targetRes + "[" + (typeof targetRes) + "] !== " + res + "[" + (typeof res) + "]";
		console.log(report.red);
	};

    /**
	 * Funkcia pre Informatívny výpis po ukončený všetkých testov
     * @param time
     * @param testCounter
     * @param failedTestCounter
     * @private
     */
	this._finishOverview = function(time, testCounter, failedTestCounter){
		console.log("testovalo sa " + time + "ms");
		console.log("neuspesnych bolo " + failedTestCounter + " z " + testCounter + " testov");
	};

    /**
	 *
     * @param testName
     * @param subtestArgs
     * @returns {*}
     */
	this.runSubtest = function(testName, subtestArgs){
		if(typeof this._tests[testName] === "undefined"){
			return null;
		}

        let test = this._tests[testName];
        let startTime = Date.now();
		return {
			res: test.func.apply(test.thisArg, subtestArgs),
			time: Date.now() - startTime
		}
	};

    /**
	 * Funkcia spustí všetky testy
     */
	this.runTests = function(){
        let testCounter = 0;
        let failedTestCounter = 0;
        let startTotalTime = Date.now();
		for(let i in this._tests){
			if(this._tests.hasOwnProperty(i)){
                let test = this._tests[i];
				for(let j in test.subtests){
					if(test.subtests.hasOwnProperty(j)){
						testCounter++;
                        let subtest = test.subtests[j];
                        let result = this.runSubtest(i, subtest.args);
						subtest.results.push(result);
						if(!this._compareResults(subtest.targetRes, result.res, subtest.type)){
							failedTestCounter++;
							this._reportFailedTest(i, subtest.targetRes, subtest.args, result.res, result.time, subtest.type);
						}
					}
				}
			}
		}
		this._finishOverview(Date.now() - startTotalTime, testCounter, failedTestCounter);
	};
};

exports.Tests = function(tester){
    let sucet = (a, b) => a + b;
    let sucin = (a, b) => a * b;
    let result = "";
	/*
	tester.addTestAndArgs("sucet", sucet, window, [1, 2], 3);
	tester._addArgs("sucet", [3, 4], 7)
	tester._addArgs("sucet", [4, 4], 8);

	tester.addTest("sucin", sucin);
	tester.addArg("sucin", [1, 2]).le(2);
	tester.addArg("sucin", [2, 2]).ge(4);
	tester.addArg("sucin", [3, 2]).lt(7);
	*/

	//TODO napísať chybu v počte parametrov
	
	tester.addTest("test compara", a => a);
	//true
	tester.addArg("test compara", true).eq(true) || (result +="true == true\n");
	tester.addArg("test compara", false).eq(false) || (result +="false == false\n");
	tester.addArg("test compara", "").eq("") || (result +="\"\" == \"\"\n");
	tester.addArg("test compara", []).eq([]) || (result +="[] == []\n");
	tester.addArg("test compara", {}).eq({}) || (result +="{} == {}\n");
	tester.addArg("test compara", 2).eq(2) || (result +="2 == 2\n");
	tester.addArg("test compara", null).eq(null) || (result +="null == null\n");
	tester.addArg("test compara", NaN).eq(NaN) || (result +="NaN == NaN\n");
	tester.addArg("test compara", undefined).eq(undefined) || (result +="undefined == undefined\n");
	tester.addArg("test compara", "macka").eq("macka") || (result +="\"macka\" == \"macka\"\n");
	//false
	tester.addArg("test compara", [2]).eq(2);//TODO je zle lebo by to malo byť false
	tester.addArg("test compara", [2]).eq([2]);
	tester.addArg("test compara", 2).eq("2") && (result +="2 == \"2\"\n");
	tester.addArg("test compara", []).eq(null)&& (result +="[] == null");
	tester.addArg("test compara", undefined).eq(null) && (result +="undefined == null\n");
	tester.addArg("test compara", []).eq("") && (result +="[] == \"\"\n");
	tester.addArg("test compara", []).eq({}) && (result +="[] == {}\n");
	tester.addArg("test compara", 0).eq(false) && (result +="0 == false\n");
	tester.addArg("test compara", true).eq(false) && (result +="true == false\n");
	tester.addArg("test compara", {a: "b"}).eq({a: "a"})  && (result +="{a : \"b\"} == {a: \"a\"}\n");
	tester.addArg("test compara", "false").eq(false) && (result +="\"false\" == false\n");
	tester.addArg("test compara", {}).eq(false) && (result +="{} == false\n");
	tester.addArg("test compara", "").eq(false) && (result +="\"\" == false\n");


	tester.addTest("test between", sucet);
	tester.addArg("test between", [3, 2]).between(4, 6) || (result +="4 < 5 < 6\n");
	tester.addArg("test between", [3, 2]).between(5, 6) && (result +="5 < 5 < 6\n");
	tester.addArg("test between", [3, 2]).between(4, 5) && (result +="4 < 5 < 5\n");
	tester.addArg("test between", [3, 2]).between(5, 5) && (result +="4 < 5 < 6\n");
	tester.addArg("test between", [3, 2]).between(true, true) && (result +="true < 5 < true\n");
	tester.addArg("test between", [3, 2]).between(true, false) && (result +="false < 5 < false\n");
	tester.addArg("test between", [3, 2]).between("1", "9") && (result +="\"1\" < 5 < \"9\"\n");
	tester.addArg("test between", [3, 2]).between({}, {}) && (result +="{} < 5 < {}\n");
	tester.addArg("test between", [3, 2]).between([], []) && (result +="[] < 5 < []\n");
	tester.addArg("test between", [3, 2]).between("a", "z") && (result +="\"a\" < 5 < \"z\"\n");

	tester.addTest("test NaN", a => a);
	tester.addArg("test NaN", 2).NaN() || (result +="2 je NaN\n");
	tester.addArg("test NaN", "2").NaN() && (result +="\"2\" nieje NaN\n");
	tester.addArg("test NaN", "g2g").NaN() && (result +="\"g2g\" nieje NaN\n");
	tester.addArg("test NaN", {}).NaN() && (result +="{} nieje NaN\n");
	tester.addArg("test NaN", []).NaN() && (result +="[] nieje NaN\n");
	tester.addArg("test NaN", "").NaN() && (result +="\"\" nieje NaN\n");
	tester.addArg("test NaN", NaN).NaN() && (result +="NaN nieje NaN\n");
	tester.addArg("test NaN", undefined).NaN() && (result +="undefined nieje NaN\n");
	tester.addArg("test NaN", null).NaN() && (result +="null nieje NaN\n");

	tester.runTests();
	if(result){
		console.log("__________________________\nerrors:\n ", result);
	}
};