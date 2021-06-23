-- Drops the tracker_db if it exists currently --
DROP DATABASE IF EXISTS tracker_db;
-- Creates the "tracker_db" database --
CREATE DATABASE tracker_db;

-- Makes it so all of the following code will affect tracker_db --
USE tracker_db;

-- Creates the table "tracker_employee" within tracker_db --
CREATE TABLE tracker_employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT FOREIGN KEY (tracker_role.id),
  manager_id INT FOREIGN KEY (tracker_role.title)
);

CREATE TABLE tracker_role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT FOREIGN KEY (tracker_department.id)
);

CREATE TABLE tracker_department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);
