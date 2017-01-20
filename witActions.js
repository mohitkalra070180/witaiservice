'use strict';
const log = require('./lib/log');

function WitActions(opts) 
{
  if (!(this instanceof WitActions)) {
	  
    return new WitActions(opts);
	
  }
	const firstEntityValue = (entities, entity) => 
			{

				const val = entities && entities[entity] &&
				
				Array.isArray(entities[entity]) &&
				
				entities[entity].length > 0 &&

				entities[entity][0].value
				;
			  if (!val) {
				return null;
			  }
			  
			  return typeof val === 'object' ? val.value : val;
			  
			};

	
	const serviceActions = 
	{
	  send(request, response) {
		
		const {sessionId, context, entities} = request;
		const {text, quickreplies} = response;
		
	  },
	  getForcast({context, entities}) {
		
		var location = firstEntityValue(entities, 'location');
		
		if (location) {
		  context.forecast = 'sunny in ' + location; // we should call a weather API here
		  context.intent='WeatherInfo';
		  delete context.missingLocation;
		} else {
		  context.missingLocation = true;
		  delete context.forecast;
		}
		return context;
	  },
	  
	  
	  changeDeviceStatus({context, entities}) {
		
		var devicetype = firstEntityValue(entities, 'devicetype');
		var on_off = firstEntityValue(entities, 'on_off');
		if(devicetype){
			context.intent='DeviceAction';
			context.devicetype=devicetype;
			context.on_off=on_off;
		} else {
			context.missingDevicetype=true;
			delete context.devicetype;
		}
		return context;
	  },
	  
	  getJokeOfTheDay({context, entities}) {
	   
		const fetch = require('node-fetch');
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var newdata;
		
		// direct way
		return fetch("http://tambal.azurewebsites.net/joke/random", {
			method: 'GET'
		}).then (resp=>resp.json()).then(json=> {delete context.missingLocation; return json});
		
	  },
	  
	  setReminder({context, entities}) {
		context.intent='SetReminder';
		const reminderDatetime =  firstEntityValue(entities, 'datetime');
		var message_subject =  firstEntityValue(entities, 'message_body');
		if(!message_subject)
			message_subject =  firstEntityValue(entities, 'message_subject');
		
		if (reminderDatetime) {
			context.datetime = reminderDatetime + ' with agenda of ' + message_subject
		}
		else {
		  context.missingDateTime = true;
		  delete context.datetime;
		}
		return context;
	  },
	}

	this.ServiceActions=serviceActions;
};

module.exports = WitActions;
