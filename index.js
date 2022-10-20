const mysql = require('mysql2');
const inquirer =  require('inquirer');
const cTable = require('console.table');
const { viewAllDepartments, viewAllRoles, viewAllEmployees } = require('./helpers/viewFunctions')

// Initialize the db to create connection to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'workplace_db'
    },
    console.log(`Connected to the workplace_db database.`)
  );

// main function to invoke inquirer, prompts user to chose among the main menu, whatever they choose, executes the respective function 
const main = () => {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'execute',
      message: "What Would You Like to do?",
      choices: ["View All Employee's","Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "View By Manager", "View Employee by Department", "Quit"]
    }
  ])
  .then((answers) => {
    console.log(answers.execute);
    if(answers.execute === "View All Employee's") {
      console.log(`\n`);
      callViewAllEmployees();
    }
    if(answers.execute === "View All Roles") {
      console.log(`\n`);
      callViewAllRoles();
    }
    if(answers.execute === "View All Departments") {
      console.log(`\n`);
      callViewAllDepartments();
    }
    if(answers.execute === "Add Employee") {
      console.log(`\n`);
      AddEmployee();
    }
    if(answers.execute === "Add Role") {
      console.log(`\n`);
      AddRole();
    }
    if(answers.execute === "Add Department") {
      console.log(`\n`);
      AddDepartment();
    }
    if(answers.execute === "Update Employee Role") {
      console.log(`\n`);
      UpdateEmployee();
    }
    if(answers.execute === "View By Manager") {
      console.log(`\n`);
      viewByManager();
    }
    if(answers.execute === "View Employee by Department") {
      console.log(`\n`);
      viewEmployeeByDept();
    }
    if(answers.execute === "Quit") {
      console.log(`\n`);
      console.log(`GOODBYE! 😃`)
      db.end(); 
    }
  });
}

// Kick off the program
main();

function callViewAllEmployees () {
  viewAllEmployees();
  setTimeout(main,50);
}

function callViewAllRoles () {
  viewAllRoles();
  setTimeout(main,50);
}

function callViewAllDepartments () {
  viewAllDepartments();
  setTimeout(main,50);
}

// Add's employee's to the employee table, prompts user for full name, role, and manager if applicable
async function AddEmployee () {
  let roles = [];
  let manager = [];
  let manager_id = [];

  await db.promise().query(`SELECT * FROM emp_role`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      roles.push(row.role_name);
    }
  })
  .catch(console.log)

  await db.promise().query(`SELECT id,
  concat(first_name,' ',last_name) AS 'ManName'
  FROM employee WHERE manager_id IS NULL`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      manager.push(row.ManName);
      manager_id.push(row.id);
    }
  })
  .catch(console.log)

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addFirst',
        message: 'What is the first name of employee?',
        validate: (answer) => {
          if (!answer) {
              return 'Please enter a valid input'
          }
          return true
        }      
      },
      {
        type: 'input',
        name: 'addLast',
        message: 'What is the last name of employee?',
        validate: (answer) => {
          if (!answer) {
              return 'Please enter a valid input'
          }
          return true
        }      
      },
      {
        type: 'list',
        name: 'addRole',
        message: 'What is the employees role?',
        choices: [...roles]
      },
      {
        type: 'list',
        name: 'addManager',
        message: 'Who is the employees manager?',
        choices: ['None', ...manager]
      }
    ])    
    .then((answers) => {
      let managerVal;
      if (answers.addManager === 'None') {
        managerVal = null
      } else {
        managerVal = manager_id[manager.indexOf(answers.addManager)]
      }
      db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?, ?, ?, ?)`, [answers.addFirst, answers.addLast, (roles.indexOf(answers.addRole) + 1), managerVal])
        .then(([rows,fields]) => {
          console.log(`\n`);
          console.log(`Successfully Added ${answers.addFirst} ${answers.addLast} to employees!`);
          console.log('\n');
          main();
        })
        .catch(console.log)

    })
}

// Add's Roles to role list, prompting user for role, department, and salary
async function AddRole () {
  let departments = [];
  let department_id = [];
  await db.promise().query(`SELECT * FROM department`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      departments.push(row.depart_name);
      department_id.push(row.id);
    }
  })
  .catch(console.log)

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addRole',
        message: 'What is the name of the role?',
        validate: (answer) => {
          if (!answer) {
              return 'Please enter a valid input'
          }
          return true
        }      
      },
      {
        type: 'input',
        name: 'addSalary',
        message: 'What is the salary of this role?',
        validate: (answer) => {
          if (isNaN(answer) || !answer) {
              return 'Please enter a valid input'
          }
          return true
        }      
      },
      {
        type: 'list',
        name: 'addDept',
        message: 'What department does this role belong to?',
        choices: [...departments]
      }
    ])    
    .then((answers) => {
      db.promise().query(`INSERT INTO emp_role (role_name, salary, department_id)
      VALUES (?, ?, ?)`, [answers.addRole, answers.addSalary, (department_id[departments.indexOf(answers.addDept)]) ])
        .then(([rows,fields]) => {
          console.log('\n');
          console.log(`Successfully Added ${answers.addRole} to Roles!`);
          console.log('\n');
          main();
        })
        .catch(console.log)
    })
}

// Add's departments to department table prompting user to give a department name
function AddDepartment () {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addDept',
        message: 'What is the name of the new department',
        validate: (answer) => {
          if (!answer) {
              return 'Please enter a valid input'
          }
          return true
        }        
      }
    ])
    .then((answers) => {
      db.promise().query(`INSERT INTO department (depart_name)
      VALUES (?)`, [answers.addDept])
        .then(([rows,fields]) => {
          console.log('\n');
          console.log(`Successfully Added ${answers.addDept} to departments`);
          console.log('\n');
          main();
        })
        .catch(console.log)
    })

}

// Updates employee roles, prompting for the employee name and new role update
async function UpdateEmployee () {
  let roles = [];
  let role_id = [];
  let employee = [];
  let employee_id = [];

  await db.promise().query(`SELECT id, role_name FROM emp_role`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      roles.push(row.role_name);
      role_id.push(row.id);
    }
  })
  .catch(console.log)

  await db.promise().query(`SELECT id, concat(first_name, ' ', last_name) AS 'fullName' FROM employee`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      employee.push(row.fullName);
      employee_id.push(row.id);
    }
  })
  .catch(console.log)

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'chooseEmp',
        message: 'What is the name of the employee you want to update?',
        choices: [...employee]   
      },
      {
        type: 'list',
        name: 'chooseRole',
        message: 'What is the new role to be given?',
        choices: [...roles]
      }
    ])
    .then((answers) => {
      db.promise().query(`UPDATE employee SET role_id = (?) WHERE id = (?)`, [ (role_id[roles.indexOf(answers.chooseRole)]), (employee_id[employee.indexOf(answers.chooseEmp)]) ])
        .then(([rows,fields]) => {
          console.log('\n');
          console.log(`Successfully Updated ${answers.employee}'s Role!`);
          console.log('\n');
          main();
        })
        .catch(console.log)
    })
}

// Bonus function to view employees by manager depending on the manager chosen
async function viewByManager () {
  let manager = [];
  let manager_id = [];

  await db.promise().query(`SELECT id,
  concat(first_name,' ',last_name) AS 'ManName'
  FROM employee WHERE manager_id IS NULL`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      manager.push(row.ManName);
      manager_id.push(row.id);
    }
  })
  .catch(console.log)

  inquirer
  .prompt([
    {
      type: 'list',
      name: 'chooseManager',
      message: 'What is the name of the manager you want to search by',
      choices: [...manager]
    }
  ])
  .then((answers) => {
    db.promise().query(`SELECT a.id, 
    a.first_name AS 'First Name', 
    a.last_name AS 'Last Name', 
    c.role_name AS 'Title', 
    d.depart_name AS 'Department', 
    c.salary AS 'Salary',
    concat(b.first_name, " ", b.last_name) AS "Manager"
    FROM employee as a
    LEFT JOIN employee as b ON a.manager_id = b.id
    JOIN emp_role AS c ON a.role_id = c.id
    JOIN department AS d ON c.department_id = d.id
    WHERE a.manager_id = ?`, manager_id[manager.indexOf(answers.chooseManager)])
      .then(([rows,fields]) => {
          console.log(cTable.getTable(rows))
        main();
      })
      .catch(console.log)
  })
}

// Bonus function to view employees by department depending on the department chosen
async function viewEmployeeByDept () {
  let departments = [];
  await db.promise().query(`SELECT * FROM department`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      departments.push(row.depart_name);
    }
  })
  .catch(console.log)

  inquirer
  .prompt([
    {
      type: 'list',
      name: 'chooseDepartments',
      message: 'What is the name of department you want to search by',
      choices: [...departments]
    }
  ])
  .then((answers) => {
    db.promise().query(`SELECT a.id, 
    a.first_name AS 'First Name', 
    a.last_name AS 'Last Name', 
    c.role_name AS 'Title', 
    d.depart_name AS 'Department', 
    c.salary AS 'Salary',
    concat(b.first_name, " ", b.last_name) AS "Manager"
    FROM employee as a
    LEFT JOIN employee as b ON a.manager_id = b.id
    JOIN emp_role AS c ON a.role_id = c.id
    JOIN department AS d ON c.department_id = d.id
    WHERE d.depart_name = ?`, answers.chooseDepartments)
      .then(([rows,fields]) => {
          console.log(cTable.getTable(rows))
        main();
      })
      .catch(console.log)
  })
}
