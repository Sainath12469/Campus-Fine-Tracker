const express = require("express");
const routes = express.Router();

const {
    getFines,
    paidFines
} = require("../controller/student.controller");

routes.post("/getFines", getFines);
routes.post("/paidFines", paidFines);

module.exports = routes;