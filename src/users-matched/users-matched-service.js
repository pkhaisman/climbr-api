const UsersMatchedService = {
    getUsersMatched(db, user_id) {
        return db('climbr_users_matched')
            .select('id', 'user_matched_id')
            .where({ user_id })
    },
    insertUserMatched(db, newUserMatched) {
        return db('climbr_users_matched')
            .insert(newUserMatched)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    serializeUserMatched(user) {
        return {
            id: user.id,
            userMatchedId: user.user_matched_id,
        }
    },
}

module.exports = UsersMatchedService