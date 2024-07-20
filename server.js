const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();
const CLI = require('./lib/cli.js');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool(
    {
        id: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE
    },
    console.log('Connected to company database')
);

pool.connect();

const cli = new CLI();

cli.run();

app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});