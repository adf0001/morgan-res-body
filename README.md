# morgan-res-body
A simple morgan plugin for response body

# Install
```
npm install morgan-res-body
```

# Usage & Api
```javascript

var express = require('express');
var morgan = require('morgan');
var morgan_res_body = require('morgan-res-body');

var app = express();

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
morgan.token("res-body",morgan_res_body.tokenFunction);		//register the token
//morgan.token("res-body",(req, res)=>{...});		//or self-defined token function

var morgan_logger = morgan( '... :req-body :res-body ...', ... );	//use the token
app.use(morgan_logger);		//add morgan middleware

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
app.use(morgan_res_body.createMiddleware());	//add middleware for res-body


/*
More, how about the request body, the ":req-body"?

just copy the following code and change it as you like.
*/
morgan.token("req-body", (req, res) => {
	if (req.body && res.statusCode < 400) {
		return "\nReq-body: " + JSON.stringify(req.body);
	}
});

```
