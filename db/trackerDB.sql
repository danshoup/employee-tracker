-- Drops the tracker_db if it exists currently --
DROP DATABASE IF EXISTS tracker_DB;
-- Creates the "tracker_db" database --
CREATE DATABASE tracker_DB;

-- Makes it so all of the following code will affect tracker_db --
USE tracker_DB;

-- Creates the table "employee" within tracker_db --
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (10, 2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id)
    REFERENCES department(id)
  ON DELETE CASCADE,
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  FOREIGN KEY (role_id)
    REFERENCES role(id)
  ON DELETE CASCADE
  FOREIGN KEY (manager_id)
    REFERENCES (id)
  ON DELETE CASCADE
);

