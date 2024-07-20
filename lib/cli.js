const inquirer = require('inquirer');

class CLI {
    constructor() {}
    run() {
        return inquirer
            .prompt([
                {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Departments", "View All Roles", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"],
                name: "InitialQuestion"
                }
            ])
            .then((response) => {
                console.log(response)
                return "hit"
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
        });
    }
    viewRoles() {
        pool.query(`SELECT * FROM role`, function (err, {rows}) {
            if (err) {
                console.log(err);
            }
            console.log(rows);
        });
    }
    addDepartment() {}
    addRole() {}
    addEmployee() {}
    updateEmployee() {}
    quit() {}
}

module.exports = CLI;