const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware.js");

const {
    fineCategories
} = require("../controller/fineCategories.controller");

// Protect all routes in this file
router.use(verifyToken);

router.get("/getFineCategories", fineCategories);

module.exports = router;