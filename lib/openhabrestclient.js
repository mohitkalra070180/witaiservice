'use strict';

// open hab rest client 

var Client = require('node-rest-client').Client;

function OpenHabRestClient() 
{
	
  if (!(this instanceof OpenHabRestClient)) {
    return new OpenHabRestClient();
  }
	var client = new Client();

	// registering remote methods 
	client.registerMethod("postMethod", "http://remote.site/rest/json/method", "POST");
	 
	 var args = {
		data: { test: "hello" }, // data passed to REST method (only useful in POST, PUT or PATCH methods) 
		path: { "id": 120 }, // path substitution var 
		parameters: { arg1: "hello", arg2: "world" }, // query parameter substitution vars 
		headers: { "test-header": "client-api" } // request headers 
	};
	client.methods.postMethod(args, function (data, response) {
		// parsed response body as js object 
		console.log(data);
		// raw response 
		console.log(response);
	});
	
	this.Put_Status=client.methods.postMethod;
};

module.exports = OpenHabRestClient;