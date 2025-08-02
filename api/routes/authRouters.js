const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const { protect } = require("../middleware/auth");

// Public routes
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);

// Protected routes
router.get('/team', protect, authControllers.getTeam);

module.exports = router;