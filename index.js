
// Import Alexa's node package
var alexa = require('alexa-app'),
	weatherService = require('./weather-service.js');

var messageProvider = require('./services/MessageProvider.js');


var	RecipeService = require('./services/RecipeService.js');

// Add DB Helper
var DatabaseHelper = require('./helpers/DBhelper.js');

var databaseHelper = new DatabaseHelper();

var SESSION_KEY = 'MASTERCHEF_SESSION';

var CakeBakerHelper = require('./helpers/cakebaker_helper.js');
var Servant = require('./helpers/servant.js');

// Create a new Alexa app for our project
var app = new alexa.app("masterchef");


app.pre = function(request, response, type) {
  databaseHelper.createCakeBakerTable();
};

var getCakeBakerHelper = function(cakeBakerHelperData) {
  if (cakeBakerHelperData === undefined) {
    cakeBakerHelperData = {};
  }
  return new CakeBakerHelper(cakeBakerHelperData);
};

var getCakeBakerHelperFromRequest = function(request) {
  var cakeBakerHelperData = request.session(SESSION_KEY);
  return getCakeBakerHelper(cakeBakerHelperData);
};

var cakeBakerIntentFunction = function(cakeBakerHelper, request, response) {
  console.log(cakeBakerHelper);
  if (cakeBakerHelper.completed()) {
    response.say('Congratulations! Your cake is complete!');
    response.shouldEndSession(true);
  } else {
    response.say(cakeBakerHelper.getPrompt());
    response.reprompt("I didnt hear you. " + cakeBakerHelper.getPrompt());
    response.shouldEndSession(false);
  }
  response.session(SESSION_KEY, cakeBakerHelper);
  response.send();
};

app.intent('advanceStepIntent', {
    'utterances': ['{next|advance|continue}']
  },
  function(request, response) {
		try {
			var cakeBakerHelper = getCakeBakerHelperFromRequest(request);
			cakeBakerHelper.currentStep++;
			saveCake(cakeBakerHelper, request);
			cakeBakerIntentFunction(cakeBakerHelper, request, response);
		} catch (e) {
			console.log(e);
		} finally {
			console.log('in finally');
		}

  }
);


var saveCake = function(cakeBakerHelper, request) {
  var userId = request.userId;
  databaseHelper.storeCakeBakerData(userId, JSON.stringify(
      cakeBakerHelper))
    .then(function(result) {
      return result;
    }).catch(function(error) {
      console.log(error);
    });
};

app.intent('repeatStepIntent', {
    'utterances': ['{repeat}']
  },
  function(request, response) {
    var cakeBakerHelper = getCakeBakerHelperFromRequest(request);
    cakeBakerIntentFunction(cakeBakerHelper, request, response);
  }
);

app.intent('cakeBakeIntent', {
    'utterances': ['{new|start|create|begin|build} {|a|the} cake']
  },
  function(request, response) {
    var cakeBakerHelper = new CakeBakerHelper({});
    cakeBakerIntentFunction(cakeBakerHelper, request, response);
  }
);

app.intent('loadCakeIntent', {
    'utterances': ['{load|resume} {|a|the} {|last} cake']
  },
  function(request, response) {
    var userId = request.userId;
    databaseHelper.readCakeBakerData(userId).then(function(result) {
      return (result === undefined ? {} : JSON.parse(result['data']));
    }).then(function(loadedCakeBakerData) {
      var cakeBakerHelper = new CakeBakerHelper(loadedCakeBakerData);
      return cakeBakerIntentFunction(cakeBakerHelper, request, response);
    });
    return false;
  }
);

app.intent('saveCakeIntent', {
    'utterances': ['{save} {|a|the|my} cake']
  },
  function(request, response) {
    var cakeBakerHelper = getCakeBakerHelperFromRequest(request);
    saveCake(cakeBakerHelper, request);
    response.say('Your cake progress has been saved!');
    response.shouldEndSession(true).send();
    return false;
  }
);


/*
	This is what runs when starting your app in Alexa
*/
app.launch(function(req, res) {
	var prompt = messageProvider.getLaunchMessage();
	var reprompt = messageProvider.getRepromptMessage();

	res .say(prompt) 			 		// Make Alexa say something
		.reprompt(prompt)				/* If user takes too long to respond...
											keep asking until user gives a response */
		.shouldEndSession(false)		// Do not end the app yet.
})


/*
	Defining an available intent
	This one takes 1 input from the user: the slot "CITY", which uses a custom slot type called "LIST_OF_CITIES"

	The custom slot type is defined when creating the Alexa Skill

	The possible phrases an user can call this intent (the utterances) are:
		"Weather     {CITY}"
		"Weather for {CITY}"
		"Weather at  {CITY}"
		"Weather in  {CITY}"
*/


// Keep static between all request response
recipe_utterance = messageProvider.getUtterances('GETRECIPE');
// Slots are stored on server itself so just point key

app.intent('GetRecipe',{
		slots: {RECIPE: "LIST_OF_ALL_RECIPE"},
		utterances: ['{ How| What} { takes |to|tell me | prepare} {RECIPE}']
},function (req,res) {

	var recipe_name = req.slot("RECIPE");
	var procedure = RecipeService.getProcedure(recipe_name);
	try {
		if(procedure == "undefined") {
			procedure = messageProvider.getErrorMessage();
		}
	} catch (e) {
			// think what goes here!
	} finally{
		res.say(procedure).send();
	}

})



// Keep static between all request response

// Slots are stored on server itself so just point key

app.intent('GetIngredients',{
		slots: {RECIPE: "LIST_OF_ALL_RECIPE"},
		utterances: ["{What|What's} {ingredients|ingredient} {RECIPE} "]
},function (req,res) {

	try {
	var recipe_name = req.slot("RECIPE");
	var procedure = RecipeService.getIngredients(recipe_name);
		if(procedure == "undefined") {
			procedure = messageProvider.getErrorMessage();
		}
	} catch (e) {
			// think what goes here!
			console.log(e);
	} finally{
		res.say(procedure).send();
	}

})



module.exports = app
