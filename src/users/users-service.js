const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getAllUsers(db) {
        return db('climbr_users').select('*')
    },
    hasUserWithUsername(db, username) {
        return db('climbr_users')
            .where({ username })
            .first()
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('climbr_users')
            .returning('*')
            .then(([user]) => user)
    },
    updateUser(db, id, name, bio) {
        return db('climbr_users')
            .update({ name, bio })
            .where({ id })
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be greater than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password cannot start or end with spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lowercase, number, and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            name: xss(user.name),
            bio: xss(user.bio),
            username: xss(user.username)
        }
    }
}

module.exports = UsersService