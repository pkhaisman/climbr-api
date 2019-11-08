const express = require('express')
// const path = require('path')
const UsersLikedService = require('./users-liked-service')

const usersLikedRouter = express.Router()
const jsonBodyParser = express.json()

usersLikedRouter
    .route('/:userId')
    .get((req, res, next) => {
        UsersLikedService.getAllUsersLikedOfUser(
            req.app.get('db'),
            req.params.userId
        )
            .then(usersLiked => {
                const serializedUsersLiked = usersLiked.map(userLiked => UsersLikedService.serializeUserLiked(userLiked))
                res.json(serializedUsersLiked)
            })
            .catch(next) 
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { user_id, user_liked_id } = req.body
        const newUserLiked = { user_id, user_liked_id } 
        
        UsersLikedService.insertUserLiked(
            req.app.get('db'),
            newUserLiked
        )
            .then(userLiked => {
                const serializeUserLiked = UsersLikedService.serializeUserLiked(userLiked)
                res.json(serializeUserLiked)
            })
            .catch(next)
    })


module.exports = usersLikedRouter