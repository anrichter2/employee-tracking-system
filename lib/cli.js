const inquirer = require('inquirer');
const pool = require('../connections/db.js');
require('dotenv').config();

// Question used for prompt of adding a department
const addDepartmentQuestions = [
    {
        type: "input",
        message: "What is the name of the department",
        name: "departmentName"
    }
];

// Questions arrow function used for prompt of adding a role
const addRoleQuestions = (rows) => {
    return [
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
            choices: rows,
            name: "roleDepartment"
        }
    ];
};

// Questions arrow function used for prompt of adding an employee
const addEmployeeQuestions = (employeeRows, roleRows) => {
    return [
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
        choices: roleRows,
        name: "employeeRole"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: [...employeeRows, { value: null, name: "No Manager" }],
        name: "manager"
    }
]};

// Questions arrow function used for prompt of updating an employee
const updateEmployeeQuestions = (employeeRows, roleRows) => {
    return [
    {
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: employeeRows, 
        name: "employeeName"
    },
    {
        type: "list",
        message: "What role do you want to assign the selected employee?",
        choices: roleRows, 
        name: "roleChange"
    }
]};

// Class for storing the initial run function and other functions that will be exported to the server.js file
class CLI {
    constructor() {}

    // Initial function to fun the application
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
            // If statement for deciding what to do next
            .then((response) => {
                if (response.initialQuestion === "View All Departments") {
                    this.viewDepartments();
                } else if (response.initialQuestion === "View All Roles") {
                    this.viewRoles();
                } else if (response.initialQuestion === "View All Employees") {
                    this.viewEmployees();
                } else if (response.initialQuestion === "Add a Department") {
                    this.addDepartment();
                } else if (response.initialQuestion === "Add a Role") {
                    this.addRole();
                } else if (response.initialQuestion === "Add an Employee") {
                    this.addEmployee();
                } else if (response.initialQuestion === "Update an Employee Role") {
                    this.updateEmployee();
                }else if (response.initialQuestion === "Quit") {
                    this.quit();
                }

            })
            .catch((error) => {
                console.log('Error caught', error)
            });
    }

    // View departments function
    viewDepartments() {
        // Selecting that I want all rows of department table
        pool.query(`SELECT * FROM department`, (err, {rows}) => {
            if (err) {
                console.log(err);
            }
            // Console.table used to display table in console
            console.table(rows);
            // Telling the function to rerun the initial run function to start over
            this.run();
        });
    }

    // View roles function
    viewRoles() {
        pool.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department = department.id`, (err, {rows}) => {
            if (err) {
                console.log(err);
            }
            console.table(rows);
            this.run();
        });
    }

    // View employees function
    viewEmployees() {
        pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department = department.id`, (err, {rows}) => {
            if (err) {
                console.log(err);
            }
            console.table(rows);
            this.run();
        });
    }

    // Add department function
    addDepartment() {
        return inquirer
            .prompt(addDepartmentQuestions)
            .then(response => {
                // Inserting the question prompt data into the department table
                pool.query(`INSERT INTO department (name)
                    VALUES ($1)`, [response.departmentName], (err) => {
                        if (err) {
                            throw new Error(err);
                        }
                        console.log(`Added ${response.departmentName} to the database`);
                        this.run();
                    });

            });
    };

    // Add role function
    addRole() {
        // Selecting the id as value and department names as name in the returned rows to be used in the later prompt questions
        pool.query('SELECT id AS value, department.name AS name FROM department', (err, {rows}) => {
            return inquirer
                .prompt(addRoleQuestions(rows))
                .then(response => {
                    pool.query(`INSERT INTO role (title, salary, department)
                        VALUES ($1, $2, $3)`, [response.roleName, response.salary, response.roleDepartment])
                        .then(() => {
                            console.log(`Added ${response.roleName} to the Database`);
                            this.run();
                        })
                })
        })
    }

    // Add employee function
    addEmployee() {
        // Selecting the id's and concatinating the first and last name into a single name for the prompt questions
        pool.query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, { rows: employeeRows }) => {
            pool.query('SELECT id AS value, role.title AS name FROM role', (err, { rows: roleRows }) => {
                return inquirer
                    .prompt(addEmployeeQuestions(employeeRows, roleRows))
                    .then(response => {
                        pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES ($1, $2, $3, $4)`, [response.firstName, response.lastName, response.employeeRole, response.manager])
                            .then(() => {
                                console.log(`Added ${response.firstName} ${response.lastName} to the Database`);
                                this.run()
                            })
                    })
            })
        })
    }

    // Updating employee information function
    updateEmployee() {
        pool.query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, { rows: employeeRows }) => {
            pool.query('SELECT id AS value, role.title AS name FROM role', (err, { rows: roleRows }) => {
                return inquirer
                    .prompt(updateEmployeeQuestions(employeeRows, roleRows))
                    .then(response => {
                        pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2 `, [response.roleChange, response.employeeName])
                        .then(() => {
                            console.log(`Updated employee's role`);
                            this.run();
                        })
                    })
            })
        })
    }

    // function for ending the application with process.exit
    quit() {
        console.log('Goodbye for now');
        process.exit();
    }
}

module.exports = new CLI;