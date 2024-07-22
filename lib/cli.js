const inquirer = require('inquirer');
const { Pool } = require('pg');
require('dotenv').config();

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

const addDepartmentQuestions = [
    {
        type: "input",
        message: "What is the name of the department",
        name: "departmentName"
    }
];

const addRoleQuestions = [
    {
        type: "input",
        message: "What is the name of the role?",
        name: "roleName"
    },
    {
        type: "input",
        message: "What is the salary of the role?",
        name: "salary"
    },
    {
        type: "list",
        message: "Which department does the role belong to?",
        choices: ['choices'], //updated dynamically use for loop to push values from rows into new array?
        name: "roleDepartment"
    }
];

const addEmployeeQuestions = [
    {
        type: "input",
        message: "What is employees first name",
        name: "firstName"
    },
    {
        type: "input",
        message: "What is the employees last name?",
        name: "lastName"
    },
    {
        type: "list",
        message: "What is the employees role?",
        choices: ['choices again'], // CHOICES here
        name: "employeeRole"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: ["None", 'choices third time'], // CHOICES here
        name: "manager"
    }
];

const updateEmployeeQuestions = [
    {
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: ['choices here'], // CHOICES here
        name: "employeeName"
    },
    {
        type: "list",
        message: "What role do you want to assign the selected employee?",
        choices: ['so many choices'], // CHOICES here
        name: "roleChange"
    }
];

class CLI {
    constructor() {

    }

    run() {
        return inquirer
            .prompt([
                {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"],
                name: "initialQuestion"
                }
            ])
            .then((response) => {
                console.log(response)
                console.log('hit')
                if (response.initialQuestion === "View All Departments") {
                    this.viewDepartments();
                } else if (response.initialQuestion === "View All Roles") {
                    CLI.viewRoles();
                } else if (response.initialQuestion === "View All Employees") {
                    CLI.viewEmployees();
                } else if (response.initialQuestion === "Add a Department") {
                    this.addDepartment();
                } else if (response.initialQuestion === "Add a Role") {
                    CLI.addRole();
                } else if (response.initialQuestion === "Add an Employee") {
                    CLI.addEmployee();
                } else if (response.initialQuestion === "Update an Employee Role") {
                    CLI.updateEmployee();
                }else if (response.initialQuestion === "Quit") {
                    this.quit();
                }
            })
            .catch((error) => {
                console.log('Error caught', error)
            });
    }

    viewDepartments() {
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

        pool.query(`SELECT * FROM department`, function (err, {rows}) {
            if (err) {
                console.log(err);
            }
            console.table(rows);
            this.run();
        });

    }

    viewRoles() {
        pool.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department = department.id`, function (err, {rows}) {
            if (err) {
                console.log(err);
            }
            console.log(rows);
            CLI.run();
        });
    }

    // How to get managers to show properly?
    viewEmployees() {
        pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department = department.id`, function (err, {rows}) {
            if (err) {
                console.log(err);
            }
            console.log(rows);
            CLI.run();
        });
    }

    addDepartment() {
        return inquirer
            .prompt(addDepartmentQuestions)
            .then(response => {
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
                pool.query(`INSERT INTO department (name)
                    VALUES (${response.departmentName})`);

                console.log(`Added ${response.departmentName} to the database`);
                this.run();
            })
    }

    addRole() {
        pool.query('SELECT department.name FROM department', function (err, {rows}) {
            return rows
        })
        const departments = rows
        return inquirer
            .prompt(addRoleQuestions)
            .then(response => {
                pool.query(`INSERT INTO role (title, salary, department)
                    VALUES (${response.roleName}, ${response.salary}, ${response.roleDepartment})`);
                console.log(`Added ${response.roleName} to the Database`);
                CLI.run();
            })
    }

    addEmployee() {
        return inquirer
            .prompt(addEmployeeQuestions)
            .then(response => {
                console.log(`Added ${response.firstName} ${response.lastName} to the Database`);
                CLI.run()
            })
    }

    updateEmployee() {
        return inquirer
            .prompt(updateEmployeeQuestions)
            .then(response => {
                const employeeNameArray = response.employeeName.split('')
                pool.query(`UPDATE employee SET role_id = ${response.roleChange} WHERE first_name = ${employeeNameArray[0]} AND last_name = ${employeeNameArray[1]}`)
                console.log(`Updated ${response.employeeName}'s role`);
                CLI.run();
            })
    }

    quit() {
        console.log('Goodbye for now')
    }
}

module.exports = CLI;