const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10);
    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
