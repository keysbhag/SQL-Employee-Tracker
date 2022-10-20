-- Do Not Use File

SELECT a.id, 
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
ORDER BY a.id; 


SELECT a.id,
  concat(a.first_name, ' ', a.last_name) AS 'name',
  concat(b.first_name,' ', b.last_name) AS 'ManName'
  FROM employee AS a
  JOIN employee AS b ON a.manager_id = b.id;