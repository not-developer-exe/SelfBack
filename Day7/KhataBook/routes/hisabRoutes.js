const express = require("express");
const router = express.Router();
const hisabController = require("../controllers/hisabController");

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect("/login");
};

router.get("/", isAuthenticated, hisabController.getHisabs);
router.get("/create", isAuthenticated, (req, res) => res.render("create", { error: null }));
router.post("/createhisab", isAuthenticated, hisabController.createHisab);
router.get("/hisab/:filename", isAuthenticated, hisabController.viewHisab);
router.post("/decrypt/:filename", isAuthenticated, hisabController.decryptHisab);
router.post("/delete/:filename", isAuthenticated, hisabController.deleteHisab);

module.exports = router;