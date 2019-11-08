const express = require('express')
// const path = require('path')
const UsersToSwipeService = require('./users-to-swipe-service')

const usersToSwipeRouter = express.Router()
const jsonBodyParser = express.json()

usersToSwipeRouter
    .route('/:userId')
    .get((req, res, next) => {
        UsersToSwipeService.getAllUsersToSwipeOfUser(
            req.app.get('db'),
            req.params.userId
        )
            .then(usersToSwipe => {
                const serializedUsersToSwipe = usersToSwipe.map(userToSwipe => UsersToSwipeService.serializeUserToSwipe(userToSwipe))
                res.json(serializedUsersToSwipe)
            })
            .catch(next) 
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { user_id, user_to_swipe_id } = req.body
        const newUserToSwipe = { user_id, user_to_swipe_id } 
        
        UsersToSwipeService.insertUserToSwipe(
            req.app.get('db'),
            newUserToSwipe
        )
            .then(UserToSwipe => {
                const serializeUserToSwipe = UsersToSwipeService.serializeUserToSwipe(UserToSwipe)
                res.json(serializeUserToSwipe)
            })
            .catch(next)
    })

usersToSwipeRouter
    .route('/:userId/:userToSwipeId')
    .delete((req, res, next) => {
        UsersToSwipeService.deleteUserToSwipe(
            req.app.get('db'),
            req.params.userId,
            req.params.userToSwipeId
        )
            .then((userToSwipe) => {
                // if (!userToSwipe) {
                //     return res.status(404).json({
                //         error: {
                //             message: 'User not found'
                //         }
                //     })
                // }

                return res.status(204).end()
            })
    })

module.exports = usersToSwipeRouter