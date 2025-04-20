const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile Fields
  about: { type: String },
  education: [
    {
      degree: String,
      institution: String,
      year: String,
    }
  ],
  skills: [String], // Store array of selected skills
  projects: [
    {
      title: String,
      description: String,
      link: String,
    }
  ],
  linkedin: { type: String },
  profilePhoto: { type: String }, // Store path to uploaded photo
  cv: { type: String } // Store path to uploaded CV
});

// Virtual property to combine firstname and lastname into username
UserSchema.virtual("username").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
