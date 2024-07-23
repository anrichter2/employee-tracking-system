const { Pool } = require('pg');
require('dotenv').config();

// Connecting to postgres database
const pool = new Pool(
    {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_COMPANY
    },
    console.log('Connected to company database')
);

pool.connect();

module.exports = pool