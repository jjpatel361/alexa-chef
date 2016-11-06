var request =  require('request-promise')

// REMEMBER TO GET AN API_KEY from https://openweathermap.org/api TO USE THIS EXAMPLE
var API_KEY = require('./weatherAPIKey.json').API_KEY


module.exports.getWeatherForCity = function(city) {

	return new Promise(function(resolve, reject) {
		
		requestWeatherFromAPI(city)
		.then(function(result) {
			resolve({
				min: Math.floor(toFarenheit(result.main.temp_min)), 
				max: Math.floor(toFarenheit(result.main.temp_max))
			})
		})
		.catch(function(err) {
			reject(err)
		})

	})

}



function requestWeatherFromAPI(city) {

	var options = {
	    uri: 'http://api.openweathermap.org/data/2.5/weather',
	    qs: {
	        q: city,
	        APPID: API_KEY
	    },
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true
	};

	return request(options)
}

function toFarenheit(kelvin) {
	return kelvin * (9/5) - 459.67
}