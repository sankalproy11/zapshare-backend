require("dotenv").config();
const http = require("http");
const connectDB = require("./config/mongo");
const app = require("./app");
const setupWebSocket = require("./sockets/websocket");

connectDB()
  .then(() => {
    const server = http.createServer(app);
    setupWebSocket(server);

    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
