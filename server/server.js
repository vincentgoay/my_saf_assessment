/// Load libraries
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql');
const mkQuery = require('./dbutil');

/// Configuration
const app = express();
const PORT = process.env.APP_PORT || 3000;

// Setup Stanard Middlewares
app.use(cors());
app.use(morgan('tiny'));

// Setup MySQL
const pool = mysql.createPool(require('./config'));

// Query

/// Define routes

/// Start application
app.listen(PORT, () => {
    console.log(`Application started listening on ${PORT} at ${new Date()}`);
})


