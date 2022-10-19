const mysql = require('mysql2');
const inquirer =  require('inquirer');
const cTable = require('console.table');
const util = require('util');

function init () {
  const mysql = require('mysql2');
  const db = mysql.createConnection(
      {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'workplace_db'
      },
      console.log(`Connected to the workplace_db database.`)
    );

    return db;
}

const main = () => {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'execute',
      message: "What Would You Like to do?",
      choices: ["View All Employee's","Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
  ])
  .then((answers) => {
    console.log(answers.execute);
    if(answers.execute === "View All Employee's") {
      console.log(`\n`);
      viewAllEmployees();
    }
    if(answers.execute === "View All Roles") {
      console.log(`\n`);
      viewAllRoles();
    }
    if(answers.execute === "View All Departments") {
      console.log(`\n`);
      viewAllDepartments();
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
  });
}
  
main();

function viewAllEmployees () {
  const db = init();

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
    ORDER BY a.id`)
    .then(([rows,fields]) => {
      console.log(cTable.getTable(rows));
      main();
    })
    .catch(console.log)
    .then( () => db.end());
}

function viewAllRoles () {
  const db = init();

  db.promise().query(`SELECT a.id,
   a.role_name AS 'title',
   b.depart_name AS 'department',
   a.salary AS 'salary'
   FROM emp_role AS a 
   JOIN department AS b ON a.department_id = b.id`)
    .then(([rows,fields]) => {
      console.log(cTable.getTable(rows));
      main();
    })
    .catch(console.log)
    .then( () => db.end());
}

function viewAllDepartments () {
  const db = init();

  db.promise().query(`SELECT * FROM department`)
    .then(([rows,fields]) => {
      console.log(cTable.getTable(rows));
      main();
    })
    .catch(console.log)
    .then( () => db.end());
}

async function AddEmployee () {
  const db = init();

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
  .then( () => db.end());

  // console.log(roles);
  // console.log(manager);
  // console.log(manager_id);

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
        managerVal = NULL
      } else {
        managerVal = manager_id[manager.indexOf(answers.addManager)]
      }
      const db = init();
      db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?, ?, ?, ?)`, [answers.addFirst, answers.addLast, (roles.indexOf(answers.addRole) + 1), managerVal])
        .then(([rows,fields]) => {
          console.log(`Successfully Added ${answers.addFirst} ${answers.addLast} to employees!`);
          main();
        })
        .catch(console.log)
        .then( () => db.end());

    })
}

async function AddRole () {
  const db = init();

  let departments = [];

  await db.promise().query(`SELECT * FROM department`)
  .then(([rows,fields]) => {
    for (let row of rows) {
      departments.push(row.depart_name);
    }
  })
  .catch(console.log)
  .then( () => db.end());

  console.log(departments);

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
      const db = init();
      db.promise().query(`INSERT INTO emp_role (role_name, salary, department_id)
      VALUES (?, ?, ?)`, [answers.addRole, answers.addSalary, (departments.indexOf(answers.addDept) + 1) ])
        .then(([rows,fields]) => {
          console.log(`Successfully Added ${answers.addRole} to Roles!`);
          main();
        })
        .catch(console.log)
        .then( () => db.end());

    })
}

function AddDepartment () {
  const db = init();

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
          console.log(`Successfully Added ${answers.addDept} to departments`);
          main();
        })
        .catch(console.log)
        .then( () => db.end());

    })

}