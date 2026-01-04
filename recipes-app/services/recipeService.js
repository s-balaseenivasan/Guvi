const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

// Create Recipe
async function createRecipe(req, res) {
    try {
        const { ingredients,title } = req.body;
        if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }
        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({
                message: "Ingredients cannot be empty"
            });
        }
        let recipe = await Recipe.findOne({ title });
        if (recipe) {
        return res.status(200).json({
            message: "Recipe already exists. Updated the existing recipe.",
            recipe
        });
    } else {
        recipe = await Recipe.create(req.body);
        return res.status(201).json(recipe);
    }
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Failed to create recipe",
            error: err.message
        });
    }
}

// Get All Recipes
async function getAllRecipes(req, res) {
    try {
        const recipes = await Recipe.find();

        if (recipes.length === 0) {
            return res.status(200).json({
                message: "No recipes found",
                recipes: []
            });
        }

        return res.status(200).json({
            message: "Get all recipes successful",
            recipes
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch recipes",
            error: err.message
        });
    }
}

// Get Recipe By ID
async function getRecipeById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Recipe ID is not valid"
            });
        }

        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        return res.status(200).json({
            message: "Recipe found",
            recipe
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch recipe",
            error: err.message
        });
    }
}

// Update Recipe
async function updateRecipe(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Recipe ID is not valid"
            });
        }

        const recipe = await Recipe.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        return res.status(200).json({
            message: "Recipe updated successfully",
            recipe
        });

    } catch (err) {
        return res.status(400).json({
            message: "Failed to update recipe",
            error: err.message
        });
    }
}

// Delete Recipe
async function deleteRecipe(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Recipe ID is not valid"
            });
        }
        const recipe = await Recipe.findByIdAndDelete(id);
        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }
        return res.status(200).json({
            message: "Recipe deleted successfully",
            recipe
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete recipe",
            error: err.message
        });
    }
}

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe
};
