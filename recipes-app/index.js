const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const recipeController = require("./controllers/recipeController")

const app = express();

const PORT = process.env.PORT || 8000;
connectDB();
app.use(express.json());
app.use("/recipe", recipeController);
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe App</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin: 8px 0;
        }
        a {
            text-decoration: none;
            color: #007bff;
        }
    </style>
</head>

<body>
    <h1>🍲 Recipe App Started</h1>

    <ul>
        <li><a href="/recipe/getAllRecipes">Get All Recipes (GET)</a></li>
        <li>Create Recipe (POST)</li>
        <li> Get Recipe By ID (GET)</li>
        <li>Update Recipe (PUT)</li>
        <li>Delete Recipe (DELETE)</li>
    </ul>
</body>
</html>

  `);
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

