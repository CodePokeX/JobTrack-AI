const express = require("express");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const User = require("../../models/accounts/Users"); // Import User model

const router = express.Router();

// GET route for the login page
router.get("/", (req, res) => {
    res.render("accounts/login", { title: "Log In", email: "", error_msg: "" });
});

// POST route to handle login
router.post(
    "/",
    [
        // Validation Middleware
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password is required").notEmpty(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        // If validation fails, render login page with errors
        if (!errors.isEmpty()) {
            return res.render("accounts/login", {
                title: "Log In",
                email: req.body.email || "",
                error_msg: errors.array().map((err) => err.msg).join(", "),
            });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists in the database
            const user = await User.findOne({ email });
            if (!user) {
                return res.render("accounts/login", {
                    title: "Log In",
                    email,
                    error_msg: "Invalid email or password.",
                });
            }

            // Authenticate using Passport.js
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.render("accounts/login", {
                        title: "Log In",
                        email,
                        error_msg: info.message || "Invalid email or password.",
                    });
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect("/dashboard"); // Redirect to dashboard on success
                });
            })(req, res, next);
        } catch (error) {
            console.error("Login Error:", error);
            return res.status(500).render("accounts/login", {
                title: "Log In",
                email,
                error_msg: "An unexpected error occurred. Please try again later.",
            });
        }
    }
);

// Logout Route
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
