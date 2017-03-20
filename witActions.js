'use strict';
const log = require('./lib/log');
const JSONStream = require('JSONStream')
const chalk = require('chalk')
const request = require('request')
const tc = require('term-cluster')

const ops = {
  indexPath: 'tvIndexes',
  logLevel: 'error'
}
const fs = require('fs')


var index


function WitActions(opts) 
{
	
	const indexData = function(err, newIndex) {
	
  if (!err) {
    index = newIndex
    fs.createReadStream('SearchIndex.txt')
      .pipe(JSONStream.parse())
      .pipe(index.defaultPipeline())
      .pipe(index.add())
      .on('data', function(data) {})
    
  }
}
  this.OpenHabRestClient=opts.OpenHabClient;
  require('search-index')(ops, indexData);
  
  
  const OpenHabRestClient=opts.OpenHabClient;
  
  if (!(this instanceof WitActions)) {
	  
    return new WitActions(opts);
	
  }
  const sort=function (a) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length -1; i++) {
		
            if (a[i].length > a[i + 1].length) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
	
	return a;
}

  const printResults = function (data) {
		console.log('here');
		  console.log('\n' + chalk.blue(data.document.id) + ' : ' + chalk.red(data.document.title))
		  const terms = Object.keys(data.scoringCriteria[0].df).map(function(item) {
			return item.substring(2)
		  })  
		  for (var key in data.document) {
			if (data.document[key]) {
			  var teaser = tc(data.document[key], terms)
			  if (teaser) console.log(teaser)
			}
		  }
		  console.log()
		};
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
	  
	   changeChannel({context, entities}) {
		
		var channelname = firstEntityValue(entities, 'channelname');
		if(channelname==null)
		{
			console.log(JSON.stringify(entities));
			channelname = firstEntityValue(entities, 'message_subject');
		}
		
		if(channelname==null)
		{
			channelname = firstEntityValue(entities, 'message_body');
		}
		
		if(channelname==null)
		{
			channelname = firstEntityValue(entities, 'contact');
		}

		//console.log(channelname);
		
		var channelNumbers=[]; 	
		var handler=function (data, response) {
					return context;
				};
		if(channelname){
			context.intent='channel';
			
		  index.search(channelname.toString().toLowerCase().replace( /\r?\n|\r/g, '' ))
		  
			.on('data', function (data) {channelNumbers.push(data.document.id+':'+data.document.title)})
			.on('end' , function(){ console.log(JSON.stringify(channelNumbers));
									var sortedChannelNumbers=sort(channelNumbers);
									OpenHabRestClient.Put_Status('Channel_Unknown', (sortedChannelNumbers[0].split(':'))[0],handler);
									context.number=(sortedChannelNumbers[0].split(':'))[0]);
									});
		

		
				
			}
		
	   },
	   
	  changeDeviceStatus({context, entities}) {
		
		var devicetype = firstEntityValue(entities, 'devicetype');
		var on_off = firstEntityValue(entities, 'on_off');
		
		if(devicetype){
			context.intent='DeviceAction';
			context.devicetype=devicetype;
			context.on_off=on_off;
		
		var handler=function (data, response) {
				    
					return context;
				}
		var item=devicetype;
		var state=on_off;
		if(item=='tv' && state=='on')
		 {
		   OpenHabRestClient.Put_Status('TV_FF_BedRoom',on_off.toUpperCase(),handler);
		 }
		 if(item=='tv' && state=='off')
		 {
		   OpenHabRestClient.Put_Status('TV_FF_BedRoom',on_off.toUpperCase(),handler);
		 }
		 if((item.toLowerCase()=='light' || item.toLowerCase()=='lights') && state=='on')
		 {
		   OpenHabRestClient.Put_Status("Light_FF_BED_YellowLight","ON",handler)
		 }
		 if((item.toLowerCase()=='light' || item.toLowerCase()=='lights') && state=='off')
		 {
		   OpenHabRestClient.Put_Status("Light_FF_BED_YellowLight","OFF",handler)
		 }

			context.missingDevicetype=true;
			delete context.devicetype;
			
			return context;
			
			
		} else {
			context.missingDevicetype=true;
			delete context.devicetype;
		}
		//return context;
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
	
	const makeActionResponseHandler = (logger, endpoint) => {
  return rsp => {
    const error = err => {
      logger.error('[' + endpoint + '] Error: ' + err);
      throw err;
    };

    if (rsp instanceof Error) {
      return error(rsp);
    }

    const [json, status] = rsp;

    if (json instanceof Error) {
      return error(json);
    }

    const err = json.error || status !== 200 && json.body + ' (' + status + ')';

    if (err) {
      return error(err);
    }

    logger.debug('[' + endpoint + '] Response: ' + JSON.stringify(json));
    return json;
  }
};
};

module.exports = WitActions;
