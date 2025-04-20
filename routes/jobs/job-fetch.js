// routes/jobs.js
const express = require('express');
const router = express.Router();
const { searchJobs } = require('../../config/jobSearch');

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// GET /jobs -> Renders the job search page with default or searched jobs
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const { query, location } = req.query;

    // Default search
    const searchQuery = query || 'developer';
    const searchLocation = location || 'Remote';

    // Fetch jobs
    const jobs = await searchJobs(searchQuery, searchLocation);

    // Render the EJS view and pass jobs to it
    res.render('jobs/job-fetch', { jobs, title: "Jobs" });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.render('jobs', { jobs: [] });
  }
});

module.exports = router;
