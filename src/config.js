module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'change-me',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://pkhaisman@localhost/climbr',
}