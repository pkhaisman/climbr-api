const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body
        const userCredentials = { username, password }

        for (const [key, value] of Object.entries(userCredentials))
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }

        // check if username exists in db
        AuthService.getUserWithUsername(
            req.app.get('db'),
            userCredentials.username
        )
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(400).json({
                        error: `Invalid login credentials`
                    })
                }

                return AuthService.comparePasswords(userCredentials.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch) {
                            return res.status(400).json({
                                error: `Invalid login credentials`
                            })
                        }

                        const sub = dbUser.username
                        const payload = {user_id: dbUser.id }
                        res.send({
                            authToken: AuthService.createJwt(sub, payload)
                        })
                    })
            })
            .catch(next)
    })

module.exports = authRouter