const express = require('express');
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const path = require('path');// Middleware to parse form data
const connectDB = require('./config/db'); // Import DB connection
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Parse JSON data

// Connect to MongoDB
connectDB();

// Configure Passport
require("./config/passport")(passport);

app.use('/', express.static(path.join(__dirname, '/static')));

// Express session middleware
app.use(
    session({
        secret: process.env.SECRET_KEY || "secret", // Use .env for security
        resave: false,
        saveUninitialized: false,
    })
);

// Flash Middleware (Must be after session)
app.use(flash());


// Passport Middleware (if used)
app.use(passport.initialize());
app.use(passport.session());

// Global variables for flash messages (this should come AFTER flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

// app.use((req, res, next) => {
//     console.log("Session Data:", req.session);
//     next();
// });

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Use express-ejs-layouts
app.use(expressLayouts);

// Set the default layout file
app.set("layout", "base");

// Middleware to set `loggedIn` globally in views
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
    next();
});


app.use('/', require('./routes/root.js'));

// Use the sign_in route
app.use('/sign-in', require('./routes/accounts/sign_in.js'));

// Use the login route
app.use('/login', require('./routes/accounts/login.js'));

// Use the dashboard route
app.use("/dashboard", require('./routes/dashboard.js'));

app.all('*', (req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views/404.html'));
    }
    else if(req.accepted('json')){
        res.json({message: '404 Not Found'});
    }
    else{
        res.type('txt').send('404 Not Found');
    }
})

app.listen(PORT, ()=>{console.log(`Server running on Port : ${PORT}`)});
