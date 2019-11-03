const knex = require('knex')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const app = require('../src/app')
const testHelpers = require('./test-helpers.js')

describe.only('Users Endpoints', function() {
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

    describe(`POST /api/users`, () => {
        context('User Validation', () => {
            beforeEach('insert users', () => {
                return db.into('climbr_users').insert(testUsers)
            })

            afterEach('clear users', () => {
                testHelpers.removeUsers(db)
            })

            const requiredFields = ['username', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    username: 'user3',
                    password: 'password3'
                }

                it(`responds with 400 and required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                })
            })

            it(`responds with 400 and 'Password must be greater than 8 characters' when short passowrd`, () => {
                const userShortPassword = {
                    username: 'user3',
                    password: '123',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, {
                        error: `Password must be greater than 8 characters`
                    })
            })

            it(`responds with 400 and 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    username: 'user3',
                    password: '*'.repeat(73),
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, {
                        error: `Password must be less than 72 characters`
                    })
            })

            it(`responds with 400 and error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    username: 'user3',
                    password: ' 12345678',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password cannot start or end with spaces` })
            })
            
            it(`responds with 400 and error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    username: 'user3',
                    password: '12345678 ',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password cannot start or end with spaces` })
            })

            it(`responds with 400 and error when password is simple`, () => {
                userSimplePassword = {
                    username: 'user3',
                    password: '11AAaa11'
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userSimplePassword)
                    .expect(400, {
                        error: 'Password must contain 1 upper case, lowercase, number, and special character'
                    })
            })

            it(`responds with 400 and 'Username already taken' when username exists`, () => {
                const duplicateUser = {
                    username: testUser.username,
                    password: '11AAaa!!'
                }

                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, {
                        error: 'Username already taken'
                    })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    username: 'test username',
                    password: '11AAaa!!',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res =>
                        db
                            .from('climbr_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(newUser.username)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})