const router = require("express").Router();
const userControllers = require("../controllers/userControllers");

// Create user
router.post("/create", userControllers.createUser);

// Login user
router.post("/login", userControllers.loginUser);

module.exports = router;
