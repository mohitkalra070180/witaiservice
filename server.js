// server.js

// BASE SETUP
// =============================================================================
//
module.exports = {
  log: require('./lib/log'),
  Wit: require('./lib/wit'),
  OpenHabClient: require('./lib/openhabclient'),
  WitActions:require('./witActions') ,
  
};
const {DEFAULT_MAX_STEPS} = require('./lib/config');

const uuid = require('uuid');
const steps = DEFAULT_MAX_STEPS;

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


const fs = require('fs')


// Access token for wit
const accessToken=  '5CSDFXFFQBHOLJNV2WDDHEKDPFBATEDP'

let Wit = null;
let WitActions = null;
let OpenHabClient = null;
try 
{
	// Setting up Wit client and actions
		
	
	Wit = require('./').Wit;
	WitActions = require('./').WitActions;
	OpenHabClient = require('./').OpenHabClient;
	const openhabclient=new OpenHabClient({});
	
	const actions=new WitActions({OpenHabClient:openhabclient});
	
	const serviceActions=actions.ServiceActions;
	const witClient = new Wit({accessToken,actions:serviceActions});


	// Setting up the server 
	// configure app to use bodyParser()
	// this will let us get the data from a POST
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	var port = process.env.PORT || 3000;        // set our port

	// ROUTES FOR OUR API
	// =============================================================================
	var router = express.Router();              // get an instance of the express Router

	// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
	router.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });   
	});



router.route('/witai')

    // create a bear (accessed at POST http://localhost:3000/api/witai)
    .post(function(req, res) {
        
        
        
    })

    // get all the bears (accessed at GET http://localhost:3000/api/witai)
    .get(function(req, res) {
		
		var q = req.query.q;	
		var i=0;
		
		
		var array = q.split('and ');
		
		
		
		
		
		for(i=0;i<array.length;i++)
		{
		  let context = typeof initContext === 'object' ? initContext : {};
		  const sessionId = uuid.v1();
		  console.log(array[i]);
		  witClient.runActions(sessionId, array[i], context, steps)
			.then((ctx) => {
			  context = ctx;
			  res.json(context);	
			
			});
		}
    });

	// more routes for our API will happen here

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);

	// START THE SERVER
	// =============================================================================
	
	app.listen(port);
	console.log('WitAI Rest Services Listening on port ' + port);
}
catch (e) 
{
	throw e;
} 
