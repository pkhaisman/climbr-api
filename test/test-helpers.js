const testHelpers = {
    makeUsersArray() {
        return [
            {
                id: 1,
                username: 'user1',
                password: '$2a$12$TRBjyrxjnBbtatzraXH0ae5W9QqwjuBQx3JnBqowpnIAzVpbQajs2'
            },
            {
                id: 2,
                username: 'user2',
                password: 'password2'
            }
        ]
    },
    makeFixtures() {
        const testUsers = testHelpers.makeUsersArray()
        return { testUsers }
    },
    cleanTables(db) {
        return db.transaction(trx =>
            trx.raw(
                `TRUNCATE
                    climbr_users
                `
            )    
            .then(() => 
                Promise.all([
                    trx.raw(`ALTER SEQUENCE climbr_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('climbr_users_id_seq', 0)`),
                ])
            )
        )
    },
    // QUESTION broken. why?
    // seedUsers(db, users) {
    //     return db.into('climbr_users').insert(users)
    // },
    removeUsers(db) {
        return db.raw('TRUNCATE climbr_users RESTART IDENTITY CASCADE')
    }
}

module.exports = testHelpers