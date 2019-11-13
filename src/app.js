require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const usersToSwipeRouter = require('./users-to-swipe/users-to-swipe-router');
const usersLikedRouter = require('./users-liked/users-liked-router.js');
const usersMatchedRouter = require('./users-matched/users-matched-router.js');

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(formData.parse())

app.use(`/api/auth`, authRouter);
app.use('/api/users', usersRouter);
app.use('/api/users-liked', usersLikedRouter);
app.use('/api/users-matched', usersMatchedRouter);
app.use('/api/users-to-swipe', usersToSwipeRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// upload image to cloudinary
app.post('/api/image-upload', (req, res) => {
    console.log('post image route')
    const values = Object.values(req.files)
    console.log(values)
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    console.log(promises)

    Promise
        .all(promises)
        .then(results => {
            console.log(results)
            return res.json(results)
        })
        .catch((err) => res.status(400).json(err))
})

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
});

module.exports = app;