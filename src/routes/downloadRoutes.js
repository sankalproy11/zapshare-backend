// downloadRoutes.js
const express = require("express");
const router = express.Router();
const { downloadFile } = require("../controllers/downloadController");

router.post("/download", downloadFile);

module.exports = router;
