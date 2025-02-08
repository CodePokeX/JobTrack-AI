const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/accounts/Users");

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
            try {
                console.log(`Looking for user: ${email}`);
                const user = await User.findOne({ email });
    
                if (!user) {
                    console.log("User not found");
                    return done(null, false, { message: "User not found" });
                }
    
                console.log("User found:", user); // Check user data
    
                const isMatch = await bcrypt.compare(password, user.password);

                // console.log("Entered Password:", password);
                // console.log("Stored Hashed Password:", user.password);
                // console.log("Password Match:", isMatch);
                
                if (!isMatch) {
                    console.log("Password does not match");
                    return done(null, false, { message: "Incorrect password" });
                }
    
                console.log("User authenticated successfully");
                return done(null, user);
            } catch (err) {
                console.error("Error in authentication:", err);
                return done(err);
            }
        })
    );
    

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
