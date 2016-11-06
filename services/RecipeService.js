var recipestore = require('../datastore/recipe.json');

module.exports.getProcedure = function (recipe) {
  if(recipe in recipestore){
      return recipestore[recipe]
  }else {
    return 'undefined';
  }

}
