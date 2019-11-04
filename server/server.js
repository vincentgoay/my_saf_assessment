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

// Queries
const SEARCH_BOOK_BY_NAME_OR_TITLE =
    'Select title, authors from book2018 where title like ? or authors like ? limit ? offset ?';
const COUNT_BOOKS_SEARCH_BY_NAME_OR_TITLE =
    'Select count(*) as book_count from book2018 where title like ? or authors like ?';
const searchBooksByNameOrTitle = mkQuery(SEARCH_BOOK_BY_NAME_OR_TITLE, pool);


const countBooksByNameOrTitle = mkQuery(COUNT_BOOKS_SEARCH_BY_NAME_OR_TITLE, pool);

/// Define routes
app.get('/api/search', (req, res) => {
    const searchTerm = `%${req.query.terms || ''}%`;
    const limit = req.query.size || 10;
    const offset = req.query.start || 0;

    const p0 = searchBooksByNameOrTitle([searchTerm, searchTerm, limit, offset]);
    const p1 = countBooksByNameOrTitle([searchTerm, searchTerm]);

    Promise.all([p0, p1])
        .then(results => {
            const data = results[0];
            const count = results[1];

            const bookResponse = {
                data: data,
                terms: searchTerm,
                timestamp: new Date().getTime(),
                total: count,
                limit: limit,
                offset: offset
            }

            console.log('searchBookByNameOrTitle Result: ', bookResponse);
            console.log('CountBook Result: ', count);
        })
        .catch(error => {
            const errorResponse = {
                status: 400,
                message: error,
                timestamp: new Date().getTime()
            }
            console.log('ErrorResponse: ', errorResponse);
        })
})

/// Start application
app.listen(PORT, () => {
    console.log(`Application started listening on ${PORT} at ${new Date()}`);
})


