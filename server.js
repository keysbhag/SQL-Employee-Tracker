// const express = require('express');
const mysql = require('mysql2');


// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'classlist_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );
  
  // does a query for all the data withing the students table, logs result

  
  db.query('SELECT * FROM students', function (err, results) {
    console.log(results);
  });



  
//   // return a 404 error
//   app.use((req, res) => {
//     res.status(404).end();
//   });
  
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });