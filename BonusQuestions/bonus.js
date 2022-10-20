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

async function viewByManager () {
    const db = init();

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
    .then( () => db.end());


    inquirer
    .prompt([
      {
        type: 'list',
        name: 'chooseManager',
        message: 'What is the name of the new department',
        choices: [...manager]
      }
    ])
    .then((answers) => {
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
      WHERE a.manager_id = ?`, manager_id[manager.indexOf(answers.chooseManager)])
        .then(([rows,fields]) => {
            console.log(cTable.getTable(rows))
          main();
        })
        .catch(console.log)
        .then( () => db.end());

    })
}

function ViewEmployeeByDept () {
    const db = init();

    db.promise().query(`SELECT * FROM department`)
      .then(([rows,fields]) => {
        console.log(cTable.getTable(rows));
        main();
      })
      .catch(console.log)
      .then( () => db.end());
}

