const testHelpers = {
    makeUsersArray() {
        return [
            {
                id: 1,
                name: 'user1',
                bio: 'I am user1',
                image: '',
                username: 'user1',
                password: '$2a$12$TRBjyrxjnBbtatzraXH0ae5W9QqwjuBQx3JnBqowpnIAzVpbQajs2'
            },
            {
                id: 2,
                name: 'user2',
                bio: 'I am user2',
                image: '',
                username: 'user2',
                password: 'password2'
            },
            {
                id: 3,
                name: 'user3',
                bio: 'I am user3',
                image: '',
                username: 'user3',
                password: 'password3'
            }
        ]
    },
    makeUsersToSwipeArray() {
        return [
            {
                id: 1,
                user_id: 1,
                user_to_swipe_id: 2
            },
            {
                id: 2,
                user_id: 2,
                user_to_swipe_id: 1
            },
            {
                id: 3,
                user_id: 2,
                user_to_swipe_id: 3
            }
        ]
    },
    makeUsersLikedArray() {
        return [
            {
                id: 1,
                user_id: 1,
                user_liked_id: 2 
            },
            {
                id: 2,
                user_id: 1,
                user_liked_id: 3 
            },
            {
                id: 3,
                user_id: 2,
                user_liked_id: 1 
            },
            {
                id: 4,
                user_id: 3,
                user_liked_id: 2 
            },
            {
                id: 5,
                user_id: 2,
                user_liked_id: 3 
            },
        ]
    },
    makeUsersMatchedArray() {
        return [
            {
                id: 1,
                user_id: 1,
                user_matched_id: 2
            },
            {
                id: 2,
                user_id: 1,
                user_matched_id: 3
            },
        ]
    },
    makeFixtures() {
        const testUsers = testHelpers.makeUsersArray()
        const testUsersToSwipe = testHelpers.makeUsersToSwipeArray()
        const testUsersLiked = testHelpers.makeUsersLikedArray()
        const testUsersMatched = testHelpers.makeUsersMatchedArray()

        return { testUsers, testUsersToSwipe, testUsersLiked, testUsersMatched }
    },
    cleanTables(db) {
        return db.transaction(trx =>
            trx.raw(
                `TRUNCATE
                    climbr_users_matched,
                    climbr_users_liked,
                    climbr_users_to_swipe,
                    climbr_users
                `
            )    
            .then(() => 
                Promise.all([
                    trx.raw(`ALTER SEQUENCE climbr_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('climbr_users_id_seq', 0)`),
                    trx.raw(`ALTER SEQUENCE climbr_users_liked_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('climbr_users_liked_id_seq', 0)`),
                    trx.raw(`ALTER SEQUENCE climbr_users_to_swipe_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('climbr_users_to_swipe_id_seq', 0)`),
                    trx.raw(`ALTER SEQUENCE climbr_users_matched_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('climbr_users_matched_id_seq', 0)`),
                ])
            )
        )
    },
    removeUsers(db) {
        return db.raw('TRUNCATE climbr_users RESTART IDENTITY CASCADE')
    }
    // QUESTION why does this not work?
    // seedUsers(db, users) {
    //     return db.into('climbr_users').insert(users)
    // },
}

module.exports = testHelpers