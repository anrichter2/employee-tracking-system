INSERT INTO department (name)
    VALUES
        ('Sales'),
        ('Engineering'),
        ('Legal'),
        ('Finance');

INSERT INTO role (title, salary, department)
    VALUES
        ('Lead Salesperson', 110000, 1),
        ('Salesperson', 90000, 1),
        ('Lead Engineer', 150000, 2),
        ('Biomedical Engineer', 130000, 2),
        ('Legal Team Head', 200000, 3),
        ('Lawyer', 170000, 3),
        ('Account Manager', 170000, 4),
        ('Accountant', 135000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
        ('Sam', 'Smith', 1, NULL),
        ('Mary', 'Sue', 2, 1),
        ('Reagen', 'Ridley', 3, NULL),
        ('Brett', 'Hand', 4, 3),
        ('Laios', 'Touden', 5, NULL),
        ('Marcille', 'Donato', 6, 5),
        ('Joseph', 'Joestar', 7, NULL),
        ('Dio', 'Brando', 8, 7);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;