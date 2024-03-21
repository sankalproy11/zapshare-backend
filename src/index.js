require("dotenv").config();
const connectDB = require("./config/mongo");
const app = require("./app");
const serverless = require("serverless-http");

connectDB()
  // .then(() => {

  //   server.listen(process.env.PORT || 8000, () => {
  //     console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
  //   });
  // })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

module.exports.handler = serverless(app);
