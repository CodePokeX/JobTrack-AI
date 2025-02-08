const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/accounts/Users"); // Import User model
const { check, validationResult } = require("express-validator"); // For validation
const router = express.Router();

// 🔹 GET route for the registration page
router.get("/", (req, res) => {
    res.render("accounts/sign_in", { title: 'Sign In' }); // No need to pass flash messages manually
});

// 🔹 POST route to handle user registration
router.post(
    "/",
    [
        check("firstname", "First name is required").notEmpty(),
        check("lastname", "Last name is required").notEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
        check("confirmPassword", "Passwords do not match").custom((value, { req }) => value === req.body.password)
    ],
    async (req, res) => {
        const { firstname, lastname, email, password } = req.body;
        const errors = validationResult(req);

        // 🔹 If there are validation errors, return them as an array
        if (!errors.isEmpty()) {
            req.flash("error_msg", errors.array().map(err => err.msg));
            return res.redirect("/sign-in");
        }

        try {
            // 🔹 Check if the email is already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash("error_msg", ["Email already registered! Please log in."]);
                return res.redirect("/sign-in");
            }

            // 🔹 Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            // console.log("Hashed Password Before Saving:", hashedPassword);

            // 🔹 Create and save the new user
            const newUser = new User({ firstname, lastname, email, password: hashedPassword });
            await newUser.save();

            // 🔹 Redirect to login page with success message
            req.flash("success_msg", ["Registration successful! You can now log in."]);
            return res.redirect("/login");
        } catch (error) {
            console.error("❌ Registration Error:", error);
            req.flash("error_msg", ["Something went wrong. Please try again."]);
            return res.redirect("/sign-in");
        }
    }
);

module.exports = router;
