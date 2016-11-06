
// Import Alexa's node package
var alexa = require('alexa-app'),
	weatherService = require('./weather-service.js');

var messageProvider = require('./services/MessageProvider.js');

var	RecipeService = require('./services/RecipeService.js');


// Create a new Alexa app for our project
var app = new alexa.app("masterchef");


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
		utterances: recipe_utterance
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
