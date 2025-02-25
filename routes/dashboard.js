const express = require("express");
const router = express.Router();

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// 🔹 GET route for Dashboard (only accessible to logged-in users)
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user, title: "Dashboard" });
});

module.exports = router;
