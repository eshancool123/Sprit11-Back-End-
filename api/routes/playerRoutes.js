const express = require("express");
const router = express.Router();
const playerControllers = require("../controllers/playerControllers");



router.get('/', playerControllers.getallPlayers );
router.post('/', playerControllers.addPlayer);
router.put('/:id', playerControllers.updatePlayer);
router.delete('/:id', playerControllers.deletePlayer);





module.exports= router;