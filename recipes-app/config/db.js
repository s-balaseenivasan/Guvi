const mongoose = require("mongoose");
const URL = "mongodb+srv://balaseenivasan_db_user:kS709zIYmrQSadS7@guvi.d3gzfts.mongodb.net/?appName=Guvi";

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.log(error);

    }
}

module.exports = connectDB;