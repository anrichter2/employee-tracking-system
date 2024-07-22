const { Pool } = require('pg');
require('dotenv').config();
const CLI = require('./lib/cli.js');

const pool = new Pool(
    {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE
    },
    console.log('Connected to company database')
);

pool.connect();

const cli = new CLI();

cli.run();