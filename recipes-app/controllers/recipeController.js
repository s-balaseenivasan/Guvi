const { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../services/recipeService');

const recipeRouter = require('express').Router();

recipeRouter.post('/createRecipe', createRecipe);
recipeRouter.get('/getAllRecipes',getAllRecipes);
recipeRouter.get('/getRecipeById/:id',getRecipeById);
recipeRouter.put('/updateRecipe/:id',updateRecipe);
recipeRouter.delete('/deleteRecipe/:id',deleteRecipe);

module.exports=recipeRouter;