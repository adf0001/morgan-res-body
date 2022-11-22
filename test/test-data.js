
//global variable, for html page, refer tpsvr @ npm.
morgan_res_body = require("../morgan-res-body.js");

module.exports = {

	"morgan_res_body": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var mimicRes = {
			write: (str) => { },
			end: (str) => { },
			statusCode: 200,
		}

		var middleware = morgan_res_body.createMiddleware();

		middleware(null, mimicRes, () => { });

		mimicRes.write("writing, ");
		mimicRes.end("ending");

		var rsl = morgan_res_body.tokenFunction(null, mimicRes);
		console.log(rsl);

		done(!(
			rsl === "\nRes-body: writing, ending"
		));
	},

	"check exports": function (done) {
		var m = morgan_res_body;
		for (var i in m) {
			if (typeof m[i] === "undefined") { done("undefined: " + i); return; }
		}
		done(false);

		console.log(m);
		var list = "export list: " + Object.keys(m).join(", ");
		console.log(list);
		return list;
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('morgan_res_body', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
