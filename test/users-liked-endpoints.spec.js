const knex = require('knex')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const app = require('../src/app')
const testHelpers = require('./test-helpers.js')

describe('Users Liked Endpoints', function() {
    let db

    const { testUsers, testUsersLiked } = testHelpers.makeFixtures()
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

    describe(`GET /api/users-liked/:userId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
                .then(() => {
                    return db('climbr_users_liked').insert(testUsersLiked)
                })
        })
        
        // QUESTION is this test good enough? should i write expect statements to test the contents of res.body?
        it('responds with 200 and array of liked users', () => {
            const userId = 1

            return supertest(app)
                .get(`/api/users-liked/${userId}`)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.length(3)
                })
        })
    })

    describe(`POST /api/users-liked/:userId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
        })

        it(`responds with 201 and the user to swipe`, () => {
            const userId = 3

            const userToLike = {
                user_id: userId,
                user_liked_id: 1
            }

            return supertest(app)
                .post(`/api/users-liked/${userId}`)
                .send(userToLike)
                .expect(201)
                .expect(res => {
                    expect(res.body.userLikedId).to.eql(userToLike.user_liked_id)
                })
        })
    })
})