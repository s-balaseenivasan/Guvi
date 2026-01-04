const mongoose = require("mongoose");
const URL = process.env.MONGO_URI || "mongodb://localhost:27017/recipe";

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("MongoDB Connected",URL);
    }
    catch (error) {
        console.log(error);

    }
}

module.exports = connectDB;