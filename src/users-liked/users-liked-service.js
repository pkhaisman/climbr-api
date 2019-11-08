const UsersLikedService = {
    getAllUsersLikedOfUser(db, user_id) {
        return db('climbr_users_liked')
            .where(function() {
                this.where({ user_id })
                .orWhere('user_liked_id', user_id)
            })
    },
    insertUserLiked(db, newUserLiked) {
        return db('climbr_users_liked')
            .insert(newUserLiked)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    serializeUserLiked(user) {
        return {
            id: user.id,
            userId: user.user_id,
            userLikedId: user.user_liked_id,
        }
    },
}

module.exports = UsersLikedService