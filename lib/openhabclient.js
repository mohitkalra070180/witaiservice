'use strict';
// open hab rest client 

var Client = require('node-rest-client').Client;
//var Base64 = require('base64').Base64;

function OpenHabClient(opts) 
{
  if (!(this instanceof OpenHabClient)) {
	return new OpenHabClient(opts);
  }
	this._username='openhab';
    this._password='openhab';
	this._openhab_protocol='http://';
    this._openhab_host='192.168.1.9';
    this._openhab_port='8080';
	this._openhab_baseURL=this._openhab_protocol+this._openhab_host+':'+this._openhab_port+'/rest/items/';
	
	// configure basic http auth for every request 
	var options_auth = { user: this._username, 
						password: this._password 
						/*,
							proxy: {
								host: "127.0.0.1", // proxy host 
								port: 8888}*/
	};
	 
	var client = new Client(options_auth);
	
	
	this.Put_Status=(item,value,fn)=>{ 
		
		var args = {
					data: value,
					headers: { "Content-Type": "text/plain" }
				};
				
		// registering remote methods
		client.post(this._openhab_baseURL+item,args,fn);
	
	 };
	 
};

module.exports = OpenHabClient;
