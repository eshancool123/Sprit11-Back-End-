const express = require("express");
const router = express.Router();
const playerControllers = require("../controllers/teamControllers");



router.get('/', playerControllers.getNonePlyers);


module.exports= router;