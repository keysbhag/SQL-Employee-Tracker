const mysql = require('mysql2');
const cTable = require('console.table');

// Creates a connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'workplace_db'
    },
);

// Views all departments and department ID's
function viewAllDepartments () { 
    db.promise().query(`SELECT * FROM department`)
    .then(([rows,fields]) => {
    console.log(cTable.getTable(rows));
    })
    .catch(console.log)
}

// Views all Roles with salaries and departments
function viewAllRoles () {
  db.promise().query(`SELECT a.id,
    a.role_name AS 'title',
    b.depart_name AS 'department',
    a.salary AS 'salary'
    FROM emp_role AS a 
    JOIN department AS b ON a.department_id = b.id`)
    .then(([rows,fields]) => {
    console.log(cTable.getTable(rows));
    })
    .catch(console.log)
}

// Views employee table with id, full name, role, department name, salary, and manager full name 
function viewAllEmployees () {
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
      })
      .catch(console.log)
  }

module.exports = { 
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees
}