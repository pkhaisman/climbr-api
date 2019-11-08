const UsersToSwipeService = {
    getAllUsersToSwipeOfUser(db, user_id) {
        return db('climbr_users_to_swipe')
            .select('id', 'user_to_swipe_id')
            .where({ user_id })
    },
    insertUserToSwipe(db, newUserToSwipe) {
        return db('climbr_users_to_swipe')
            .insert(newUserToSwipe)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUserToSwipe(db, user_id, user_to_swipe_id) {
        return db('climbr_users_to_swipe')
            .where(function() {
                this.where({ user_id })
                .andWhere({ user_to_swipe_id })
            })
            .delete()
    },
    serializeUserToSwipe(user) {
        return {
            id: user.id,
            userToSwipeId: user.user_to_swipe_id,
        }
    }
}

module.exports = UsersToSwipeService