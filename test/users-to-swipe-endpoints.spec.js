const knex = require('knex')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const app = require('../src/app')
const testHelpers = require('./test-helpers.js')

describe('Users To Swipe Endpoints', function() {
    let db

    const { testUsers, testUsersToSwipe } = testHelpers.makeFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => testHelpers.cleanTables(db))

    afterEach('cleanup', () => testHelpers.cleanTables(db))

    describe(`GET /api/users-to-swipe/:userId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
                .then(() => {
                    return db('climbr_users_to_swipe').insert(testUsersToSwipe)
                })
        })
        
        it('responds with 200 and array of users to swipe', () => {
            const userId = 1

            return supertest(app)
                .get(`/api/users-to-swipe/${userId}`)
                .expect(200)
                .expect(res => {
                    expect(res.body[0].userToSwipeId).to.eql(2)
                })
        })
    })

    describe(`POST /api/users-to-swipe/:userId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
        })

        it(`responds with 201 and the user to swipe`, () => {
            const userId = 1

            const userToSwipe = {
                user_id: userId,
                user_to_swipe_id: 3
            }

            return supertest(app)
                .post(`/api/users-to-swipe/${userId}`)
                .send(userToSwipe)
                .expect(201)
                .expect(res => {
                    expect(res.body.userToSwipeId).to.eql(userToSwipe.user_to_swipe_id)
                })
        })
    })

    describe(`DELETE api/users-to-swipe/:userId/:userToSwipeId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
                .then(() => {
                    return db('climbr_users_to_swipe').insert(testUsersToSwipe)
                })
        })

        it(`responds with 200 and deletes requested resource`, () => {
            const userId = 2, userToSwipeId = 3

            const expected = {
                id: testUsersToSwipe[1].id,
                userToSwipeId: testUsersToSwipe[1].user_to_swipe_id
            }

            return supertest(app)
                .delete(`/api/users-to-swipe/${userId}/${userToSwipeId}`)
                .expect(204)
                .then(() => {
                    return supertest(app)
                        .get(`/api/users-to-swipe/${userId}`)
                        .expect(200)
                        .expect(res => {
                            expect(res.body[0]).to.eql(expected)
                        })
                })
        })
    })
})