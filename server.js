require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies-data-small.json')

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req,res,next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    console.log('validating Bearer Token middlware')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next();
})

app.get('/movie', function handleMovieSelection(req,res) {
    let response = MOVIES;
    //sort based on genre
    if(req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()));
    }
    //sort based on country
    if(req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase()));
    }
    //sort based on average vote
    if(req.query.avg_vote) {
        response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avg_vote));
    }
    res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on http//:localhost:${PORT}`)
})