const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

// Create connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) throw err;
  runStart();
});

const runStart = () => {
  inquirer.prompt({
      name: 'employees',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'View All Employees By Department',
        'View All Employees by Manager',
        'Add a new Department',
        'Add a new Employee Role',
        'Add a new Employee',
        'Remove Employee',
        'Remove Employee Role',
        'Remove a Department',
        'Update Employee Role',
        'Update Employee Manager',
        'EXIT'
      ],
    })
    .then((answers) => {
      switch (answers.employees) {
        case 'View All Departments':
          runDepartments();
          break;
        case 'View All Roles':
          runRoles();
          break;
        case 'View All Employees':
          runEmployees();
          break;
        case 'View All Employees By Department':
          runByDepartment();
          break;
        case 'View All Employees by Manager':
          runByManager();
          break;
        case 'Add a new Department':
          runAddDepartment();
          break;
        case 'Add a new Employee Role':
          runAddRole();
          break;
        case 'Add a new Employee':
          runAddEmployee();
          break;
        case 'Remove Employee':
          runRemoveEmployee();
          break;
        case 'Remove Employee Role':
          runRemoveRole();
          break;
        case 'Remove a Department':
          runRemoveDept();
          break;
        case 'Update Employee Role':
          runUpdateRole();
          break;
        case 'Update Employee Manager':
          runUpdateManager();
          break;
        case 'EXIT':
          connection.end();
          
          
        default:
          console.log(`Invalid action: ${answers.employees}`);
          break;
      }
    });
};



const runDepartments = () => {
  const allDepartments = `SELECT 
	id AS "Department ID", 
    name AS "Department Name" 
		FROM department;`;

  connection.query(allDepartments, (err, res) => {
    if (err) throw err;
    console.table(res);
    runStart();
  })
};

const runRoles = () => {
  const allRoles = `SELECT 
	id AS "Role ID",
    title AS "Employee Role",
    salary AS "Starting Salary"
		FROM role;`;

  connection.query(allRoles, (err, res) => {
    if (err) throw err;
    console.table(res);
    runStart();
  })
};

const runEmployees = () => {
  const allEmployees = `SELECT 
	  employee.id AS "Employee ID", 
    employee.first_name AS "First Name", 
    employee.last_name AS "Last Name", 
    role.title AS "Title", 
    department.name AS "Department", 
    role.salary AS "Starting Salary", 
    CONCAT(manager.first_name, " ", manager.last_name) AS "Employee's Manager"
		FROM employee
		LEFT JOIN role
			ON role.id = employee.role_id
		LEFT JOIN department
			ON department.id = role.department_id
		LEFT JOIN employee AS manager
			ON manager.id = employee.manager_id`;

  connection.query(allEmployees, (err, res) => {
    if (err) throw err;
    console.table(res);
    runStart();
  })
};

const runByDepartment = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      message: 'Choose a department to see its employees:',
      choices: () => {
        let deptArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT name, id FROM department`,
          (err, res) => {
            if (err) throw err;
            res.forEach((department) => {
              deptArray.push({
                name: department.name, 
                value: department.id
              });
            });
            resolve(deptArray);
          });
        });
      }
    },

  ]).then((answer) => {
    const byDepartment = `SELECT 
    employee.id AS "Employee ID", 
      employee.first_name AS "First Name", 
      employee.last_name AS "Last Name", 
      role.title AS "Title", 
      department.name AS "Department", 
      role.salary AS "Starting Salary", 
      CONCAT(manager.first_name, " ", manager.last_name) AS "Employee's Manager"
      FROM employee
      LEFT JOIN role
        ON role.id = employee.role_id
      LEFT JOIN department
        ON department.id = role.department_id
      LEFT JOIN employee AS manager
        ON manager.id = employee.manager_id
        WHERE department.id = ${answer.department};`;

    connection.query(byDepartment, (err, res) => {
      if (err) throw err;
      if (res.length == 0) {
        console.log('This department does not have any employees.\n')
      } else {
        console.table(res);
      }
      runStart();
    });
  });
}

const runByManager = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: 'Choose a manager to see his or her employees:',
      choices: () => {
        let employeeArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee`,
          (err, res) => {
            if (err) throw err;
            res.forEach((manager) => {
              employeeArray.push({
                name: manager.name, 
                value: manager.id
              });
            });
            resolve(employeeArray);
          });
        });
      }
    },

  ]).then((answer) => {
    const byManager = `SELECT 
    employee.id AS "Employee ID", 
      employee.first_name AS "First Name", 
      employee.last_name AS "Last Name", 
      role.title AS "Title", 
      department.name AS "Department", 
      role.salary AS "Starting Salary", 
      CONCAT(manager.first_name, " ", manager.last_name) AS "Employee's Manager"
      FROM employee
      LEFT JOIN role
        ON role.id = employee.role_id
      LEFT JOIN department
        ON department.id = role.department_id
      LEFT JOIN employee AS manager
        ON manager.id = employee.manager_id
        WHERE employee.manager_id = ${answer.manager};`;

    connection.query(byManager, (err, res) => {
      if (err) throw err;
      if (res.length == 0) {
        console.log('This employee does not have managment duties.\n')
      } else {
        console.table(res);
      }
      runStart();
    });
  });
}

const runAddDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'dept',
      message: 'Enter name of the department you want to add:'
    },
  ]).then((answer) => {
    connection.query(`INSERT INTO department (name) VALUES ('${answer.dept}');`,
      (err, res) => {
        if (err) throw err;
        runStart();
      }
    );  
  });
};

const runAddRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the name of the employee role you would like to add:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter starting salary of this role:'
    },
    {
      type: 'list', 
      name: 'dept',
      message: 'Select the department this role reports to:',
      choices: () => {
        let deptArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT name, id FROM department`,
          (err, res) => {
            if (err) throw err;
            res.forEach((department) => {
              deptArray.push({
                name: department.name, 
                value: department.id
              });
            });
            resolve(deptArray);
          });
        });
      }
    }

  ]).then((answer) => {
    connection.query(`INSERT INTO role (title, salary, department_id) 
      VALUES ('${answer.title}', '${answer.salary}', ${answer.dept});`,
      (err, res) => {
        if (err) throw err;
        runStart();
      }
    );
  });
};

const runAddEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Add new employee first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Add new employee last name:'
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the role for the new employee:',
      choices: () => {
        let roleArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT title, id FROM role`, 
          (err, res) => {
            if (err) throw err;
            res.forEach((role) => {
              roleArray.push({name: role.title, value: role.id});
            });
            resolve(roleArray);
          });
        });
      }
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who is the manager for the new employee?',
      choices: () => {
        let managerArray = [{name: '', value: null}];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee`,
          (err, res) => {
            if (err) throw err;
            res.forEach((manager) => {
              managerArray.push({
                name: manager.name, 
                value: manager.id
              });
            });
            resolve(managerArray);
          });
        });
      }
    },

  ]).then((answers) => {
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES ('${answers.firstName}', '${answers.lastName}', ${answers.role}, ${answers.manager});`,
        (err, res) => {
          if (err) throw err;
          runStart();
        }
      );
  });

};

const runRemoveEmployee = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'empRemove',
      message: 'Select an employee to remove them from the employee list:',
      choices: () => {
        let listArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employee;`,
            (err, res) => {
              if (err) throw err;
              res.forEach((employee) => {
                listArray.push({
                  name: employee.name, 
                  value: employee.id 
                });
              });
              resolve(listArray);
            });
        });
      }
    },
  ]).then((answer) => {
    connection.query(`DELETE FROM employee WHERE id = ${answer.empRemove}`,
      (err, res) => {
        if (err) throw err;
        console.log('Selected employee file was deleted from the system.\n');
        runStart();
    });
  });
}

const runRemoveRole = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'removeRole',
      message: 'Select an employee role to delete from the database:',
      choices: () => {
        let roleArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT title, id FROM role;`,
            (err, res) => {
              if (err) throw err;
              res.forEach((role) => {
                roleArray.push({
                  name: role.title, 
                  value: role.id 
                });
              });
              resolve(roleArray);
            });
        });
      }
    },
  ]).then((answer) => {
    connection.query(`DELETE FROM role WHERE id = ${answer.removeRole}`,
      (err, res) => {
        if (err) throw err;
        console.log('Selected employee role was deleted from the system.\n');
        runStart();
    });
  });
}

const runRemoveDept = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'deptRemove',
      message: 'Select an department to remove it from the database:',
      choices: () => {
        let deptArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT name, id FROM department;`,
            (err, res) => {
              if (err) throw err;
              res.forEach((dept) => {
                deptArray.push({
                  name: dept.name, 
                  value: dept.id 
                });
              });
              resolve(deptArray);
            });
        });
      }
    },
  ]).then((answer) => {
    connection.query(`DELETE FROM department WHERE id = ${answer.deptRemove}`,
      (err, res) => {
        if (err) throw err;
        console.log('Selected department was deleted from the system.\n');
        runStart();
    });
  });
}





const runUpdateRole = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'emp',
      message: 'Select employee to update thier role:',
      choices: () => {
        let listArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employee;`,
            (err, res) => {
              if (err) throw err;
              res.forEach((employee) => {
                listArray.push({
                  name: employee.name, 
                  value: employee.id 
                });
              });
              resolve(listArray);
            });
        });
      }
    },
    {
      type: 'list',
      name: 'empRole',
      message: 'Select new role for this employee:',
      choices: () => {
        let empRoleArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT title, id FROM role;`,
          (err, res) => {
            if (err) throw err;
            res.forEach((role) => {
              empRoleArray.push({
                name: role.title, 
                value: role.id
              });
            });
            resolve(empRoleArray);
          });
        });
      }
    }
  ]).then((answer) => {
    connection.query(`UPDATE employee SET role_id = ${answer.empRole} WHERE id = ${answer.emp};`,
      (err, res) => {
        if (err) throw err;
        console.log('New role for chosen employee has been updated.\n');
        runStart();
      });
  });
};

const runUpdateManager = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'emp3',
      message: 'Select employee to update who they report to:',
      choices: () => {
        let listArray = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employee;`,
            (err, res) => {
              if (err) throw err;
              res.forEach((employee) => {
                listArray.push({
                  name: employee.name, 
                  value: employee.id 
                });
              });
              resolve(listArray);
            });
        });
      }
    },
    {
      type: 'list',
      name: 'newManager',
      message: 'Select who the new manager for this employee should be:',
      choices: () => {
        let newManArray = [{name: '', value: null}];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employee;`,
          (err, res) => {
            if (err) throw err;
            res.forEach((newManager) => {
              newManArray.push({
                name: newManager.name, 
                value: newManager.id
              });
            });
            resolve(newManArray);
          });
        });
      }
    }
  ]).then((answer) => {
    connection.query(`UPDATE employee SET manager_id = ${answer.newManager} WHERE id = ${answer.emp3};`,
      (err, res) => {
        if (err) throw err;
        console.log('New manager for chosen employee has been updated.\n');
        runStart();
      });
  });
};
