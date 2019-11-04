/// Load libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const request = require('request');
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
    'Select book_id, title, authors, rating from book2018 where title like ? or authors like ? limit ? offset ?';
const COUNT_BOOKS_SEARCH_BY_NAME_OR_TITLE =
    'Select count(*) as book_count from book2018 where title like ? or authors like ?';
const GET_BOOK_BY_ID =
    'Select * from book2018 where book_id = ?';

const searchBooksByNameOrTitle = mkQuery(SEARCH_BOOK_BY_NAME_OR_TITLE, pool);
const countBooksByNameOrTitle = mkQuery(COUNT_BOOKS_SEARCH_BY_NAME_OR_TITLE, pool);
const getBookById = mkQuery(GET_BOOK_BY_ID, pool);

/// Define routes
app.get('/api/search', (req, res) => {
    const terms = req.query.terms
    const searchTerm = `%${terms || ''}%`;
    const limit = parseInt(req.query.size) || 10;
    const offset = parseInt(req.query.start) || 0;

    const p0 = searchBooksByNameOrTitle([searchTerm, searchTerm, limit, offset]);
    const p1 = countBooksByNameOrTitle([searchTerm, searchTerm]);

    Promise.all([p0, p1])
        .then(results => {
            const data = results[0];
            const countBooks = results[1];

            const books = data.map(v => {
                const authorsArray = String(v['authors']).split('|');
                const book = {
                    book_id: v['book_id'],
                    title: v['title'],
                    authors: authorsArray,
                    rating: v['rating']
                }
                return book;
            })

            const bookResponse = {
                data: books,
                terms: terms,
                timestamp: new Date().getTime(),
                total: countBooks[0]['book_count'],
                limit: limit,
                offset: offset
            }

            console.log('searchBookByNameOrTitle Result: ', bookResponse);

            res.status(200)
            res.format({
                'default': () => {
                    res.type('application/json')
                        .json(bookResponse)
                }
            })
        })
        .catch(error => {
            const errorResponse = {
                status: 500,
                message: error,
                timestamp: new Date().getTime()
            }

            res.statusCode(500).type('application/json')
                .json(errorResponse);
        })
})

app.get('/api/book/:id', (req, res) => {
    const book_id = req.params.id;
    console.log('BookID: ', book_id);
    getBookById([book_id])
        .then(result => {
            const book = result[0];
            book.authors = String(result[0].authors).split('|')
            book.genres = String(result[0].genres).split('|')
            console.log('Book: ', book);

            res.status(200).type('application/json')
                .json({
                    data: book,
                    timestamp: new Date().getTime()
                });
        })
        .catch(error => {
            const errorResponse = {
                status: 500,
                message: error,
                timestamp: new Date().getTime()
            }
            res.statusCode(500).type('application/json')
                .json(errorResponse);
        })
})

app.get('/api/book/:id/review', (req, res) => {
    const book_id = req.params.id;

    getBookById([book_id])
        .then(result => {
            const book = result[0];
            book.authors = String(result[0].authors).split('|')
            console.log('Book: ', book);

            // NYT Request Option
            const options = {
                url: process.env.API_URL,
                qs: {
                    'title': book.title,
                    'api-key': process.env.API_KEY
                }
            };
            console.log('Options:', options);

            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const results = JSON.parse(body)['results'];
                    const reviews = results.map(v => {
                        const review = {
                            book_id: book.book_id,
                            title: book.title,
                            authors: book.authors,
                            byline: v.byline,
                            summary: v.summary,
                            url: v.url
                        };
                        return review;
                    });

                    res.status(200).type('application/json')
                        .json({
                            data: reviews,
                            timestamp: new Date().getTime()
                        });
                } else {
                    const errorResponse = {
                        status: 500,
                        message: error,
                        timestamp: new Date().getTime()
                    }
                    res.statusCode(500).type('application/json')
                        .json(errorResponse);
                }
            })
        })
        .catch(error => {
            const errorResponse = {
                status: 500,
                message: error,
                timestamp: new Date().getTime()
            }
            res.statusCode(500).type('application/json')
                .json(errorResponse);
        })
})

/// Start application
app.listen(PORT, () => {
    console.log(`Application started listening on ${PORT} at ${new Date()}`);
})


