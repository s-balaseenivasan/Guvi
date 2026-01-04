const express=require("express");
const connectDB=require("./config/db");
const recipeController=require("./controllers/recipeController")
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8000;


const app=express();
connectDB();
app.use(express.json());
app.use("/recipe",recipeController);
app.get("/",(req,res)=>{
    res.send("Recipe App Start")
})


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

