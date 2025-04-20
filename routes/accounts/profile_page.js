const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../../models/accounts/Users");

// Update existing file paths on startup
async function migrateExistingFilePaths() {
  try {
    console.log("Checking for users with old file paths...");
    const users = await User.find({
      $or: [
        { profilePhoto: { $regex: /^\/uploads\// } },
        { cv: { $regex: /^\/uploads\// } }
      ]
    });

    if (users.length === 0) {
      console.log("No users with old file paths found.");
      return;
    }

    console.log(`Found ${users.length} users with old file paths. Migrating...`);
    
    for (const user of users) {
      if (user.profilePhoto && user.profilePhoto.startsWith('/uploads/')) {
        const filename = path.basename(user.profilePhoto);
        user.profilePhoto = `/media/profiles/${filename}`;
        console.log(`Updated profile photo path for user ${user.firstname}: ${user.profilePhoto}`);
      }
      
      if (user.cv && user.cv.startsWith('/uploads/cv/')) {
        const filename = path.basename(user.cv);
        user.cv = `/media/cv/${filename}`;
        console.log(`Updated CV path for user ${user.firstname}: ${user.cv}`);
      }
      
      await user.save();
    }
    
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Error migrating file paths:", err);
  }
}

// Run the migration - will execute when the server starts
migrateExistingFilePaths();

// Helper function to delete a file if it exists
function deleteFileIfExists(filePath) {
  const fullPath = path.join(__dirname, '../../static', filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Deleted old file: ${fullPath}`);
      return true;
    } catch (err) {
      console.error(`Error deleting file ${fullPath}:`, err);
      return false;
    }
  }
  return false;
}

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please log in to view this page");
  return res.redirect("/login");
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = file.fieldname === "cv" ? "static/media/cv" : "static/media/profiles";
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Adding user ID to filename to avoid conflicts
    const userId = req.user._id.toString().slice(-6); // Last 6 chars of user ID
    cb(null, `${file.fieldname}-${userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "profilePhoto") {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
    } else if (file.fieldname === "cv") {
      // Accept PDF only
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error("Only PDF files are allowed!"), false);
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Multiple file upload configuration
const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

// Redirect "/profile" to "/profile/{username}"
router.get("/", ensureAuthenticated, (req, res) => {
  if (!req.user || !req.user.firstname) {
    req.flash("error_msg", "User session expired. Please log in again.");
    return res.redirect("/login");
  }
  res.redirect(`/profile/${req.user.firstname}`);
});

// GET Profile Page
router.get("/:firstname", ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user || req.user.firstname !== req.params.firstname) {
      req.flash("error_msg", "Unauthorized access");
      return res.redirect(`/profile/${req.user.firstname}`);
    }

    res.render("accounts/profile_page", {
      user: req.user,
      title: req.user.firstname,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/");
  }
});

// Utility function to check if request is an AJAX request
function isAjaxRequest(req) {
  return (
    req.xhr || 
    req.headers.accept.includes('json') || 
    req.headers.accept.includes('application/json') ||
    req.headers['x-requested-with'] === 'XMLHttpRequest'
  );
}

// POST Update Profile (with file upload)
router.post("/update", ensureAuthenticated, function(req, res, next) {
  // Check if this is an AJAX request
  const isAjax = isAjaxRequest(req);
  
  // Set appropriate headers for AJAX requests
  if (isAjax) {
    res.setHeader('Content-Type', 'application/json');
  }
  
  uploadFields(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (isAjax) {
        return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
      } else {
        req.flash("error_msg", `File upload error: ${err.message}`);
        return res.redirect(`/profile/${req.user.firstname}`);
      }
    } else if (err) {
      console.error("Unknown error:", err);
      if (isAjax) {
        return res.status(500).json({ success: false, message: `Unknown error: ${err.message}` });
      } else {
        req.flash("error_msg", `Unknown error: ${err.message}`);
        return res.redirect(`/profile/${req.user.firstname}`);
      }
    }
    next();
  });
}, async (req, res) => {
  try {
    // Check if this is an AJAX request
    const isAjax = isAjaxRequest(req);
    
    const user = await User.findById(req.user._id);

    if (!user) {
      console.error("User not found for ID:", req.user._id);
      if (isAjax) {
        return res.status(404).json({ success: false, message: "User not found" });
      } else {
        req.flash("error_msg", "User not found");
        return res.redirect("/profile");
      }
    }

    console.log("Processing profile update for:", user.firstname);
    console.log("Received files:", req.files ? Object.keys(req.files) : "No files received");
    
    // Update basic fields
    user.about = req.body.about || "";
    user.linkedin = req.body.linkedin || "";
    
    // Parse education data (comes as JSON string)
    if (req.body.education) {
      try {
        user.education = JSON.parse(req.body.education);
        console.log("Education updated successfully with", user.education.length, "entries");
      } catch (e) {
        console.error("Error parsing education data:", e);
        if (isAjax) {
          return res.status(400).json({ success: false, message: "Invalid education data format" });
        } else {
          req.flash("error_msg", "Invalid education data format");
          return res.redirect(`/profile/${req.user.firstname}`);
        }
      }
    }

    // Parse projects data (comes as JSON string)
    if (req.body.projects) {
      try {
        user.projects = JSON.parse(req.body.projects);
        console.log("Projects updated successfully with", user.projects.length, "entries");
      } catch (e) {
        console.error("Error parsing projects data:", e);
        if (isAjax) {
          return res.status(400).json({ success: false, message: "Invalid projects data format" });
        } else {
          req.flash("error_msg", "Invalid projects data format");
          return res.redirect(`/profile/${req.user.firstname}`);
        }
      }
    }

    // Handle skills (checkboxes come as array or single value)
    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills) ? req.body.skills : [req.body.skills];
      console.log("Skills updated successfully with", user.skills.length, "skills");
    } else {
      user.skills = [];
      console.log("No skills selected");
    }

    // Handle profile photo if uploaded
    if (req.files && req.files.profilePhoto && req.files.profilePhoto.length > 0) {
      // Delete old profile photo if exists
      if (user.profilePhoto) {
        deleteFileIfExists(user.profilePhoto);
      }
      
      const profilePhotoPath = `/media/profiles/${req.files.profilePhoto[0].filename}`;
      user.profilePhoto = profilePhotoPath;
      console.log("Profile photo saved at:", profilePhotoPath);
      console.log("Full path:", path.join(__dirname, '../../static', profilePhotoPath));
    }

    // Handle CV if uploaded
    if (req.files && req.files.cv && req.files.cv.length > 0) {
      // Delete old CV if exists
      if (user.cv) {
        deleteFileIfExists(user.cv);
      }
      
      const cvPath = `/media/cv/${req.files.cv[0].filename}`;
      user.cv = cvPath;
      console.log("CV saved at:", cvPath);
      console.log("Full path:", path.join(__dirname, '../../static', cvPath));
    }

    await user.save();
    console.log("User profile saved successfully");
    
    if (isAjax) {
      // If it's an AJAX request, return JSON
      return res.json({ success: true, message: "Profile updated successfully" });
    } else {
      // For regular form submission
      req.flash("success_msg", "Profile updated successfully");
      return res.redirect(`/profile/${user.firstname}`);
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    
    // Check if this is an AJAX request
    const isAjax = isAjaxRequest(req);
    
    if (isAjax) {
      // If it's an AJAX request, return error as JSON
      return res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
    } else {
      // For regular form submission
      req.flash("error_msg", "Failed to update profile: " + err.message);
      return res.redirect(`/profile/${req.user.firstname}`);
    }
  }
});

module.exports = router;
