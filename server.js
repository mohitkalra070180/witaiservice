// server.js

// BASE SETUP
// =============================================================================
//
module.exports = {
  log: require('./lib/log'),
  Wit: require('./lib/wit'),
  WitActions:require('./witactions') 
};
const {DEFAULT_MAX_STEPS} = require('./lib/config');

const uuid = require('uuid');
const steps = DEFAULT_MAX_STEPS;

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');

// Access token for wit
const accessToken=  '5CSDFXFFQBHOLJNV2WDDHEKDPFBATEDP'

let Wit = null;
let WitActions = null;
try 
{
	// Setting up Wit client and actions
		
	var fs = require('fs');
	Wit = require('./').Wit;
	WitActions = require('./').WitActions;
	
	const actions=new WitActions({});
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
		let context = typeof initContext === 'object' ? initContext : {};
		const sessionId = uuid.v1();
		
		
		witClient.runActions(sessionId, q, context, steps)
			.then((ctx) => {
			  context = ctx;
			  res.json(context);	
			  return;
			});
    });

	// more routes for our API will happen here

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);

	// START THE SERVER
	// =============================================================================
	app.listen(port);
	console.log('Magic happens on port ' + port);
}
catch (e) 
{
	throw e;
} 
