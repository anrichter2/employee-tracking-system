const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool(
    {
        id: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE
    }
);

pool.connect();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});