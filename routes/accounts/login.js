const express = require("express");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// 🔹 GET route for the login page
router.get("/", (req, res) => {
  res.render("accounts/login", { title: "Log In" });
});

// 🔹 POST route to handle login
router.post(
  "/",
  [
    // Validation Middleware
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // req.flash("error_msg", errors.array().map(err => err.msg).join(" "));
      errors.array().forEach((err) => req.flash("error_msg", err.msg)); // Store each error separately
      // console.log("Flash Messages Before Redirect:", req.flash("error_msg"));
      return res.redirect("/login");
    }

    passport.authenticate("local", {
      successRedirect: "/dashboard", // Redirect to dashboard after successful login
      failureRedirect: "/login",
      failureFlash: "Invalid email or password", // Ensure this sends a flash message
    })(req, res, next);
  },
);

// 🔹 Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.redirect("/dashboard"); // If error, keep user logged in
      }
      res.clearCookie("connect.sid"); // Optional: Clear session cookie
      res.redirect("/login");
    });
  });
});

module.exports = router;
