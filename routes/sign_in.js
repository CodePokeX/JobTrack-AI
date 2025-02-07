const express = require('express');
const router = express.Router();

// Get route for sign-in page
router.get('/', (req, res) => {
    res.render('accounts/sign_in');  // Render the sign_in.ejs from accounts folder
});

// Post route to handle form submission from the sign-in form
router.post('/', (req, res) => {
    const { username, email, password, gender, country } = req.body;

    // Here, you can handle the form data (validation, storing in database, etc.)
    console.log('Received Sign-In Data:', { username, email, password, gender, country });

    // For now, just redirect to a confirmation or dashboard page
    res.send('Sign-In data received successfully!');
});

module.exports = router;
