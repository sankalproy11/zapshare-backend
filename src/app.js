const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);

const downloadRoutes = require("./routes/downloadRoutes");
app.use("/api", downloadRoutes);

module.exports = app;
