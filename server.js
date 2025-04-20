require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const path = require("path");
const connectDB = require("./config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { JobServiceClient } = require("@google-cloud/talent");

// // ✅ Set Google Cloud Credentials Path at the Start
// process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "config/jobtrack-ai-25962c2a08cc.json");

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "/static")));
app.use("/", express.static(path.join(__dirname, "/public")));

// Connect to MongoDB
connectDB();

// Configure Passport
require("./config/passport")(passport);
app.use(
  session({
    secret: process.env.SECRET_KEY || "secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "base");

// Flash messages and login status
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.loggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
  // res.locals.formData = req.session.formData || {}; // Make form data available in views
  delete req.session.formData; // Clear it after using
  next();
});

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ API Route for AI-generated response
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available";
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // ✅ Google Cloud Talent API Setup
// const client = new JobServiceClient();
// const projectId = "jobtrack-ai"; // Replace with your project ID

// app.get("/fetch-jobs", async (req, res) => {
//   try {
//       const { JobServiceClient } = require('@google-cloud/talent');
//       const client = new JobServiceClient();

//       const formattedParent = `projects/${projectId}/tenants/default`; // or your tenant.
//       const request = {
//           parent: formattedParent,
//           requestMetadata: {
//               userId: 'anonymous',
//               sessionId: 'anonymous',
//               domain: 'example.com',
//           },
//           searchMode: 1, //JOB_SEARCH
//           query: 'Software Engineer' // or 'software', or whatever keyword you want.
//       };

//       const [response] = await client.searchJobs(request);

//       if (response.matchingJobs && response.matchingJobs.length > 0) {
//           const jobTitles = response.matchingJobs.map(matchingJob => matchingJob.job.title);
//           res.json(jobTitles); // Sending only job titles for simplicity
//       } else {
//           res.json([]); // Send empty array if no jobs found
//       }
//   } catch (error) {
//       console.error("Error fetching jobs:", error);
//       res.status(500).send("Error fetching jobs");
//   }
// });

// Routes
app.use("/", require("./routes/root.js"));
app.use("/sign-in", require("./routes/accounts/sign_in.js"));
app.use("/login", require("./routes/accounts/login.js"));
app.use("/dashboard", require("./routes/dashboard.js"));
app.use("/profile", require("./routes/accounts/profile_page.js"));
app.use('/jobs', require("./routes/jobs/job-fetch.js"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on Port : ${PORT}`);
});
