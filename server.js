const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();
const inquirer = require('inquirer');

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
    console.log('Connected to comapny database')
);

pool.connect();

inquirer
    .prompt([
        {
            type: "list",
            name: "Initial question",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Roles", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"]
        }
    ])
    .then()
    .catch()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});