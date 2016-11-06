var recipestore = require('../datastore/recipe.json');

module.exports.getProcedure = function (recipe) {
  // Do normalize because alexa sends Sentence case
  var recipe = recipe.toUpperCase().replace(/ /g,"_");
  if(recipe in recipestore){
      return recipestore[recipe]
  }else {
    return 'undefined';
  }

}
