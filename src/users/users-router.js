const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                const serializedUsers = users.map(user => UsersService.serializeUser(user))
                res.json(serializedUsers)
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body
        
        for (const field of ['username', 'password'])
        if (!req.body[field])
        return res.status(400).json({
            error: `Missing '${field}' in request body`
        })
        
        const passwordError = UsersService.validatePassword(password)
        
        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        UsersService.hasUserWithUsername(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUsername => {
                if (hasUserWithUsername) {
                    return res.status(400).json({
                        error: 'Username already taken'
                    })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            username,
                            password: hashedPassword,
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

usersRouter
    .route('/:userId')
    .put(jsonBodyParser, (req, res, next) => {
        UsersService.updateUser(
            req.app.get('db'),
            req.params.userId,
            req.body.name,
            req.body.bio,
            req.body.image
        )
            .then(updatedUser => {
                res.json(updatedUser)
            })
            .catch(next)
    })

usersRouter
    .route('/:username')
    .get((req, res, next) => {
        UsersService.hasUserWithUsername(
            req.app.get('db'),
            req.params.username
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({ 
                        error: { 
                            message: 'User not found' 
                        }
                    })
                }
                res.json({user})
            })
            .catch(next)
    })

module.exports = usersRouter