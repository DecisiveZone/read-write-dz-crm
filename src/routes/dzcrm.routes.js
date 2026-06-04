const express = require("express");

const router = express.Router();

const {
    processRequest
} = require("../controllers/dzcrm.controller");

router.post("/", processRequest);

module.exports = router;