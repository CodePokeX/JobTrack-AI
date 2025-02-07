const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables
const bodyParser = require('body-parser'); // Middleware to parse form data

const app = express();
const PORT = process.env.PORT || 3500;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '/static')));

app.use('/', require('./routes/root.js'));

// Use the sign_in route
app.use('/sign-in', require('./routes/sign_in'));

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
