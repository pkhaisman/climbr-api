const knex = require('knex')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const app = require('../src/app')
const testHelpers = require('./test-helpers.js')

describe('Users Matched Endpoints', function() {
    let db

    const { testUsers, testUsersMatched } = testHelpers.makeFixtures()

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

    describe(`GET /api/users-matched/:userId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
                .then(() => {
                    return db('climbr_users_matched').insert(testUsersMatched)
                })
        })
        
        // QUESTION is this test good enough? should i write expect statements to test the contents of res.body?
        it('responds with 200 and array of matched users', () => {
            const userId = 1

            return supertest(app)
                .get(`/api/users-matched/${userId}`)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.length(2)
                    expect(res.body[0].userMatchedId).to.eql(testUsersMatched[0].user_matched_id)
                })
        })
    })

    describe(`POST /api/users-matched/:userId`, () => {
        beforeEach(`insert data`, () => {
            return db('climbr_users').insert(testUsers)
        })

        it(`responds with 201 and the matched user`, () => {
            const userId = 3

            const userMatched = {
                user_id: userId,
                user_matched_id: 1
            }

            return supertest(app)
                .post(`/api/users-matched/${userId}`)
                .send(userMatched)
                .expect(201)
                .expect(res => {
                    expect(res.body.userMatchedId).to.eql(userMatched.user_matched_id)
                })
        })
    })
})