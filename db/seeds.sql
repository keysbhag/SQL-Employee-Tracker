INSERT INTO department (depart_name)
VALUES ("Sales"),
       ("Marketing"),
       ("Finance"),
       ("Engineer"); 

INSERT INTO emp_role (role_name, salary, department_id)
VALUES ("Sales Lead",100000,1),
       ("Salesperson",80000,1),
       ("Marketing Manager", 110000, 2),
       ("Marketing person", 90000, 2),
       ("Account Manager",120000,3),
       ("Accountant",105000,3),
       ("Lead Engineer",250000,4),
       ("Software Engineer",200000,4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Keyshawn", "Bhagwandin", 7),
       ("Deebo", "Samuel", 5),
       ("Breece", "Hall", 3 ),
       ("Travis", "Kelce", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 6, 2),
       ("Russel", "Wilson", 4, 3),
       ("Sauce", "Gardner", 2, 4),
       ("Austin", "Ekeler", 8, 1);  