const express = require("express");
const router = express.Router();
const playerControllers = require("../controllers/teamControllers");





router.get('/:id', playerControllers.getTeamDetailsById);
router.get('/', playerControllers.getNonePlyers);
router.put('/', playerControllers.addTeamMembers);
router.post('/', playerControllers.addTeam);
router.delete('/:id', playerControllers.removeTeamPlayer);




module.exports= router;