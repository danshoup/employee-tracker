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
  console.log(`App is listening`);  
  runStart();
});

const runStart = () => {
  inquirer
    .prompt({
      name: 'employees',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees by Manager',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'EXIT'
      ],
    })
    .then((answers) => {
      switch (answers.employees) {
        case 'View All Employees':
          runEmployees();
          break;
        case 'View All Employees By Department':
          runByDepartment();
          break;
        case 'View All Employees by Manager':
          runByManager();
          break;
        case 'Add Employee':
          runAddEmployee();
          break;
        case 'Remove Employee':
          runRemoveEmployee();
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

const runEmployees = () => {
  console.log('runEmployees()');
  runStart();
};

const runByDepartment = () => {
  console.log('runByDepartment()');
  runStart();
};

const runByManager = () => {
  console.log('runByManager()');
  runStart();
};

const runAddEmployee = () => {
  console.log('runAddEmployee()');
  runStart();
};

const runRemoveEmployee = () => {
  console.log('runRemoveEmployee()');
  runStart();
};

const runUpdateRole = () => {
  console.log('runUpdateRole()');
  runStart();
};

const runUpdateManager = () => {
  console.log('runUpdateManager()');
  runStart();
};
