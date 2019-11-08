const express = require('express')
// const path = require('path')
const UsersMatchedService = require('./users-matched-service')

const usersMatchedRouter = express.Router()
const jsonBodyParser = express.json()

usersMatchedRouter
    .route('/:userId')
    .get((req, res, next) => {
        UsersMatchedService.getUsersMatched(
            req.app.get('db'),
            req.params.userId
        )
            .then(usersMatched => {
                const serializedUsersMatched = usersMatched.map(userMatched => UsersMatchedService.serializeUserMatched(userMatched))
                res.json(serializedUsersMatched)
            })
            .catch(next) 
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { user_id, user_matched_id } = req.body
        const newUserMatched = { user_id, user_matched_id } 
        
        UsersMatchedService.insertUserMatched(
            req.app.get('db'),
            newUserMatched
        )
            .then(userMatched => {
                const serializeUserMatched = UsersMatchedService.serializeUserMatched(userMatched)
                res.json(serializeUserMatched)
            })
            .catch(next)
    })

module.exports = usersMatchedRouter