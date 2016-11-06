var request =  require('request-promise');
var datastore = require('../datastore/messages.json');


module.exports.getLaunchMessage = function() {
  return datastore.LAUNCH_MESSAGE;
}

module.exports.getRepromptMessage = function() {
  return datastore.REPROMPT_MESSAGE;
}

module.exports.getUtterances = function (eventname) {
  return datastore[eventname]
}

module.exports.getErrorMessage = function(){
  return datastore.NO_RECIEPE;
}
