const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const testHelpers = require('./test-helpers.js')

describe('Auth Endpoints', function() {
    let db

    const { testUsers } = testHelpers.makeFixtures()
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

    describe(`POST /api/auth/login`, () => {
        beforeEach('insert users', () => {
            return db('climbr_users').insert(testUsers)
        })

        afterEach('clear users', () => {
            testHelpers.removeUsers(db)
        })

        const requiredFields = ['username', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUser.username,
                password: testUser.password
            }

            it(`responds with 400 and required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post(`/api/auth/login`)
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })
        })

        it(`responds with 400 and 'invalid login credentials' when username invalid`, () => {
            const invalidUser = { username: 'dne', password: 'password' }
            return supertest(app)
                .post(`/api/auth/login`)
                .send(invalidUser)
                .expect(400, {
                    error: `Invalid login credentials`
                })
        })

        it(`responds with 400 and 'invalid login credentials' when password invalid`, () => {
            const invalidUser = { username: 'user1', password: 'dne' }
            return supertest(app)
                .post(`/api/auth/login`)
                .send(invalidUser)
                .expect(400, {
                    error: `Invalid login credentials`
                })
        })

        it(`responds with 200 and JWT when credentials valid`, () => {
            const validUser = { username: 'user1', password: 'password' }
            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.username,
                    algorithm: 'HS256'
                }
            )

            return supertest(app)
                .post(`/api/auth/login`)
                .send(validUser)
                .expect(200, {
                    authToken: expectedToken
                })
        })
    })
})