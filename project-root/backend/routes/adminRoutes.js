const express = require("express");
const router = express.Router();
const { addAdmin } = require("../controllers/adminController");

router.post("/add", addAdmin);

module.exports = router;
