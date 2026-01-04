const express=require("express");
const connectDB=require("./config/db");
const recipeController=require("./controllers/recipeController")

const PORT = 3000;


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

