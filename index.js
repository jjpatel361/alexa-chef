
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
app.intent('AskWeatherInCity', {
		slots: { CITY: "LIST_OF_CITIES" },
		utterances: ["{Weather} {|for|at|in} {CITY}"]
	},

	function(req, res) {							/* This is the body of the intent,
													   what will happen when the user calls it */

		var city = req.slot("CITY")					// Get the value in the slot "CITY"

		weatherService.getWeatherForCity(city) 		// Use our app's weather service
		.then(function(result) {
			var response = `Weather at City ${city} with min ${result.min} and max ${result.max}`

			res.say(response).send()				// Say the response we created

			res.shouldEndSession(true);				// End the app
		})
		.catch(function	(err) {

			res.say(`Sorry, weather is not available`).send() 	// Also have a nice error message

		})
		return false
	}
)


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

module.exports = app
