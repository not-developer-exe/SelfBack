const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/signup", (req, res) => res.render("signup", { error: null }));
router.post("/signup", authController.signup);
router.get("/login", (req, res) => res.render("login", { error: null }));
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;