const mongoose = require("mongoose");
const URL =
  process.env.NODE_ENV !== "development"
    ? `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@guvi.d3gzfts.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    : "mongodb://localhost:27017/recipe";

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB Connected",URL);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
