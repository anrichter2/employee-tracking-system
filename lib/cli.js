const inquirer = require('inquirer');

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
        choices: ['choices again'],
        name: "employeeRole"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: ["None", 'choices third time'],
        name: "manager"
    }
];

const updateEmployeeQuestions = [
    {
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: ['choices here'],
        name: "employeeName"
    },
    {
        type: "list",
        message: "What role do you want to assign the selected employee?",
        choices: ['so many choices'],
        name: "roleChange"
    }
]

class CLI {
    constructor() {}
    run() {
        return inquirer
            .prompt([
                {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"],
                name: "InitialQuestion"
                }
            ])
            .then((response) => {
                console.log(response)
                console.log('hit')
            })
            .catch((error) => {
                console.log('Error caught', error)
            });
    }
    viewDepartments() {
        pool.query(`SELECT * FROM department`, function (err, {rows}) {
            if (err) {
                console.log(err);
            }
            console.log(rows);
            CLI.run();
        });
    }

    viewRoles() {
        pool.query(`SELECT * FROM role JOIN department WHERE role.department = department.id`, function (err, {rows}) {
            if (err) {
                console.log(err);
            }
            console.log(rows);
            CLI.run();
        });
    }

    viewEmployees() {
        pool.query(`SELECT * FROM employee JOIN `, function (err, {rows}) {
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
                pool.query(`INSERT INTO department (name)
                    VALUES (${response.departmentName})`);

                console.log(`Added ${response.departmentName} to the database`);
                CLI.run();
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
                console.log(`Updated ${response.employeeName}'s role`);
                CLI.run();
            })
    }
    quit() {
        console.log('Goodbye for now')
    }
}

module.exports = CLI;