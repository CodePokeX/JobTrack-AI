const express = require("express");
const router = express.Router();

router.get("^/$|index(.html)?", (req, res) => {
  res.render("index", { title: "Home Page" });
});

// 🔹 Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.redirect("/dashboard"); // If error, keep user logged in
      }
      res.clearCookie("connect.sid"); // Optional: Clear session cookie
      res.redirect("/");
    });
  });
});

module.exports = router;
