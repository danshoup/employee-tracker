-- Makes it so all of the following code will affect tracker_db --
USE tracker_db;


INSERT INTO tracker_employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', {tracker_role.id[1]}, {this.id[3].first_name} {this.id[3].last_name}),
    ('Mike', 'Chan', {tracker_role.id[2]}, {this.id[1].first_name} {this.id[1].last_name}),
    ('Ashley Rodriquez', {tracker_role.id[3]}, null),
    ('Kevin', 'Tupik', {tracker_role.id[4]}, {this.id[3].first_name} {this.id[3].last_name}),
    ('Malia', 'Brown', {tracker_role.id[5]}, null),
    ('Sarah', 'Lourd', {tracker_role.id[6]},, null),
    ('Tom', 'Allen', {tracker_role.id[7]}, {this.id[6].first_name} {this.id[6].last_name}),
    ('Christian', 'Eckenrode', {tracker_role.id[8]}, {this.id[2].first_name} {this.id[2].last_name});

INSERT INTO tracker_role (title, salary, department_id)
VALUES ('Sales Lead', '100000', {tracker_department.id[1]}),
    ('Salesperson', '80000', {tracker_department.id[1]}),
    ('Lead Engineer', '150000', {tracker_department.id[2]}),
    ('Software Engineer', '120000', {tracker_department.id[2]}),
    ('Acountant', '125000', {tracker_department.id[3]}),
    ('Legal Team Lead', '250000', {tracker_department.id[4]}),
    ('Lawer', '190000', {tracker_department.id[4]}),
    ('Lead Engineer', '150000', {tracker_department.id[2]});

INSERT INTO tracker_department (name)
VALUES ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');


