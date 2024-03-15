require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `MongoDB Successfully Connected: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDB connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
