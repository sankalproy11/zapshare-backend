const express = require("express");
const app = express();
app.use(express.json());

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);

module.exports = app;
