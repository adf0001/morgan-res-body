
// morgan-res-body @ npm, a simple morgan plugin for response body.

//refer https://thewebdev.info/2022/03/06/how-to-log-the-response-body-with-express/

/*
.createMiddleware(options)

create a middleware function for express
	options
		skip
			a function like (req, res)=>{...},
			return true to indicate to skip the request.

		bufferName
			a property name for saving body buffer in res, default "bodyBuffer".

*/
function createMiddleware(options) {
	var skip = options?.skip;
	var bufferName = options?.bufferName || "bodyBuffer";

	return (req, res, next) => {
		if (!skip?.(req, res)) {
			const oldWrite = res.write
			const oldEnd = res.end;

			res.write = function () {
				if (arguments[0]?.length > 0) {
					if (!res[bufferName]) res[bufferName] = [];
					res[bufferName].push(Buffer.from(arguments[0]));
				}
				return oldWrite.apply(res, arguments);
			};

			res.end = function () {
				if (arguments[0]?.length > 0) {
					if (!res[bufferName]) res[bufferName] = [];
					res[bufferName].push(Buffer.from(arguments[0]));
				}
				return oldEnd.apply(res, arguments);
			};
		}

		next();
	}
}

/*
.tokenFunction

A default token function in following condition,
	* response body buffer named "bodyBuffer"
	* normal statusCode less than 400
	* convert to text
	* prifixed with line-break and "Res-body: "
	* utf8

In any other condition, re-write your own token function. 
*/
function tokenFunction(req, res) {
	if (res.bodyBuffer && res.statusCode < 400) {
		return "\nRes-body: " + Buffer.concat(res.bodyBuffer).toString('utf8');
	}
}


//module exports
module.exports = {
	createMiddleware,

	tokenFunction,
};
